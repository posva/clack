import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, resolve } from 'node:path';
import { stdout } from 'node:process';
import type { Writable } from 'node:stream';
import { stripVTControlCharacters } from 'node:util';
import { env, isAgent as stdIsAgent, isTest as stdIsTest } from 'std-env';

/**
 * One entry in `AgentSessionFile.answers`. The agent writes either:
 *
 *   - `{ value: <answer> }` — to answer the prompt with a JSON-serializable value.
 *   - `{ cancelled: true }` — to cancel the prompt (resolves to the cancel symbol).
 *
 * Both fields are absent when the entry is newly created; at least one must be
 * set for the CLI to treat the prompt as answered.
 */
export interface AgentAnswerEntry {
	/**
	 * The agent's answer. Must be JSON-serializable and match the prompt's
	 * expected value type (string for text, boolean for confirm, etc.).
	 */
	value?: unknown;
	/**
	 * Set to `true` to cancel the prompt. Resolves to the cancel symbol so
	 * `isCancel()` returns true on the CLI side.
	 */
	cancelled?: boolean;
}

/**
 * On-disk shape of `.clack-session.json` (path overridable via the
 * `CLACK_AGENT_FILE` env var). The file is created lazily on the first emit
 * and deleted on a clean exit (`code === 0`) unless
 * `CLACK_AGENT_KEEP_FILE=1`.
 */
export interface AgentSessionFile {
	/**
	 * Schema version. Currently always `1`; bump if the shape changes so older
	 * session files can be detected and migrated or rejected.
	 */
	version: 1;
	/**
	 * One entry per prompt `id`. The agent fills these in between re-runs; the
	 * CLI reads them on startup to resolve already-answered prompts instantly.
	 */
	answers: Record<string, AgentAnswerEntry>;
	/**
	 * Cache for `once(id, fn)` return values. Survives across iterations so
	 * expensive work isn't re-executed every time the agent re-runs the CLI.
	 */
	steps?: Record<string, unknown>;
	/**
	 * The questions emitted on the most recent exit. Purely informational —
	 * the CLI does not consult this on re-run, it re-derives pending state
	 * from prompt invocations.
	 */
	pending?: AgentQuestion[];
}

/**
 * Every prompt kind the agent protocol understands. Each corresponds to a
 * `batch.*` helper or a bare prompt function.
 */
export type AgentQuestionKind =
	| 'text'
	| 'password'
	| 'confirm'
	| 'select'
	| 'multiselect'
	| 'group-multiselect'
	| 'select-key'
	| 'autocomplete'
	| 'date'
	| 'multi-line'
	| 'path';

/**
 * Wire-protocol payload emitted to the agent as single-line JSON.
 *
 * `id`, `kind`, and `message` are universal; prompt-specific fields (e.g.
 * `options`, `placeholder`, `initialValue`) live on the open index signature
 * because the set varies per `kind`. See the `describe()` implementations in
 * `@posva/clack-prompts/src/batch.ts` for each kind's concrete payload shape.
 */
export interface AgentQuestion {
	/** Stable prompt id — the key under which the answer is written to the session file. */
	id: string;
	/** Which prompt variant this is. Drives the accepted shape of `value`. */
	kind: AgentQuestionKind;
	/** Human-readable question text, identical to what a terminal user would see. */
	message?: string;
	/** `true` when the prompt has a validator; the agent should provide a non-empty value. */
	required?: boolean;
	/** Prompt-specific fields (e.g. `options`, `placeholder`, `initialValue`). */
	[extra: string]: unknown;
}

const DEFAULT_SESSION_FILE = '.clack-session.json';

let _counter = 0;

/**
 * Allocate the next positional id (`auto:0`, `auto:1`, ...) for a prompt that
 * wasn't given an explicit `id`.
 *
 * Prefer passing a stable `id` in production: branching flows can shift the
 * positional counter, which silently invalidates previously cached answers.
 *
 * @internal
 */
export function nextAutoId(): string {
	const n = _counter++;
	return `auto:${n}`;
}

/**
 * Reset the positional id counter back to zero. Used by tests between runs
 * and by the runtime at process start.
 *
 * @internal
 */
export function resetAutoIdCounter(): void {
	_counter = 0;
}

/**
 * Absolute path to the session file used by agent mode.
 *
 * Resolution order:
 *
 *   1. `$CLACK_AGENT_FILE` if set and non-empty.
 *   2. `./.clack-session.json` otherwise.
 *
 * Relative paths are resolved against `process.cwd()` so the same CLI
 * invocation from different working directories stays deterministic.
 *
 * @internal
 */
export function getSessionFilePath(): string {
	const p = env.CLACK_AGENT_FILE;
	const abs = p && p.length > 0 ? p : DEFAULT_SESSION_FILE;
	return isAbsolute(abs) ? abs : resolve(process.cwd(), abs);
}

let _agentModeCache: boolean | undefined;
let _agentModeOverride: boolean | undefined;

/**
 * Agent mode is active when any of:
 *   - `std-env`'s `isAgent` is true (detects Claude Code, Cursor, Aider, and friends
 *     via the environment variables those tools set — no config needed).
 *   - `CLACK_AGENT_FILE` env var is set.
 *   - `CLACK_AGENT=1` (or `true`) env var is set.
 *
 * Agent mode is suppressed when:
 *   - `CLACK_AGENT=0` (or `false`) — explicit opt-out.
 *   - `std-env`'s `isTest` is true (vitest/jest/etc.) and no explicit opt-in is set —
 *     prevents test suites from entering agent mode just because the runner is
 *     invoked by an agent harness.
 */
export function isAgentMode(): boolean {
	if (_agentModeOverride !== undefined) return _agentModeOverride;
	if (_agentModeCache !== undefined) return _agentModeCache;

	const explicitOff = env.CLACK_AGENT === '0' || env.CLACK_AGENT === 'false';
	if (explicitOff) {
		_agentModeCache = false;
		return _agentModeCache;
	}

	const explicitOn = env.CLACK_AGENT === '1' || env.CLACK_AGENT === 'true';
	const hasFile = typeof env.CLACK_AGENT_FILE === 'string' && env.CLACK_AGENT_FILE.length > 0;

	if (explicitOn || hasFile) {
		_agentModeCache = true;
		return _agentModeCache;
	}

	if (stdIsTest) {
		_agentModeCache = false;
		return _agentModeCache;
	}

	_agentModeCache = Boolean(stdIsAgent);
	return _agentModeCache;
}

/**
 * Force agent mode on or off programmatically. Used by tests to toggle
 * behavior deterministically without touching environment variables.
 *
 * Pass `undefined` to clear the override and fall back to auto-detection as
 * documented on {@link isAgentMode}.
 *
 * @internal
 */
export function setAgentMode(value: boolean | undefined): void {
	_agentModeOverride = value;
	_agentModeCache = undefined;
}

function emptySession(): AgentSessionFile {
	return { version: 1, answers: {} };
}

/**
 * Read the session file from `path` (or the default location).
 *
 * Tolerant by design: a missing, empty, or malformed file returns an empty
 * session rather than throwing, because agent mode is expected to bootstrap
 * from a clean slate on the first invocation.
 *
 * @param path - Override the session-file path. Defaults to {@link getSessionFilePath}.
 * @returns The parsed session, or a fresh empty one if nothing valid was on disk.
 *
 * @internal
 */
export function readSession(path: string = getSessionFilePath()): AgentSessionFile {
	if (!existsSync(path)) return emptySession();
	try {
		const raw = readFileSync(path, 'utf8');
		if (!raw.trim()) return emptySession();
		const parsed = JSON.parse(raw) as AgentSessionFile;
		if (!parsed || typeof parsed !== 'object' || !parsed.answers) {
			return emptySession();
		}
		return parsed;
	} catch {
		return emptySession();
	}
}

/**
 * Persist the given session to disk.
 *
 * Before writing, `null`/`undefined` fields are pruned and any ANSI escape
 * sequences are stripped from string values so the file stays plain-text
 * readable even when callers pass styled prompt messages. Parent directories
 * are created as needed.
 *
 * @internal
 */
export function writeSession(session: AgentSessionFile, path: string = getSessionFilePath()): void {
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, `${JSON.stringify(prune(session), null, 2)}\n`, 'utf8');
}

/**
 * Look up a single answer by prompt id.
 *
 * @param id - The prompt id to look up in `answers`.
 * @param path - Optional override for the session-file path.
 * @returns The answer entry if present, otherwise `undefined`.
 *
 * @internal
 */
export function getAnswer(id: string, path?: string): AgentAnswerEntry | undefined {
	const s = readSession(path);
	return s.answers[id];
}

/**
 * Options accepted by {@link once}.
 */
export interface OnceOptions {
	/**
	 * Override the session-file path used to cache the step's return value.
	 * Defaults to {@link getSessionFilePath}.
	 */
	sessionFile?: string;
}

/**
 * Run `fn` once across all agent-mode iterations of the script.
 *
 * Under an agent, the whole script re-runs on every answer-fill round-trip.
 * Expensive work — generating a changelog, building a package, publishing to
 * a registry — would otherwise fire on every iteration. `once()` caches the
 * resolved value in the session file under `steps[id]`; on the next iteration
 * the cached value is returned and `fn` is not invoked.
 *
 * Outside agent mode, `fn` runs on every call — `once()` is transparent for
 * humans.
 *
 * Caveats:
 *
 *   - The return value must be JSON-serializable. Callers are responsible for
 *     that, same as with prompt answers.
 *   - Errors are NOT cached: a thrown error propagates and the next call
 *     retries `fn` from scratch.
 *   - Cached values survive until the session file is deleted (on clean exit,
 *     unless `CLACK_AGENT_KEEP_FILE=1`).
 *
 * @example
 * ```ts
 * const changelog = await once('changelog', async () => {
 *   return await generateChangelog();
 * });
 * ```
 *
 * @typeParam T - Return type of `fn`. Must be JSON-serializable.
 * @param id - Unique identifier for this step. Different `id`s cache separately.
 * @param fn - The function to run. Can be sync or async.
 * @param opts - Optional overrides; see {@link OnceOptions}.
 * @returns The cached or freshly computed value of `fn`.
 */
export async function once<T>(
	id: string,
	fn: () => Promise<T>,
	opts?: OnceOptions
): Promise<T>
export function once<T>(
	id: string,
	fn: () => T,
	opts?: OnceOptions
): T
export async function once<T>(
	id: string,
	fn: () => T | Promise<T>,
	opts: OnceOptions = {}
): Promise<T> {
	if (!isAgentMode()) return fn();

	const path = opts.sessionFile ?? getSessionFilePath();
	const session = readSession(path);

	// already ran previously, return cached value
	if (session.steps && id in session.steps) {
		return session.steps[id] as T;
	}

	// only await if needed
	const promiseOrValue = fn();
	const value = promiseOrValue instanceof Promise ? await promiseOrValue : promiseOrValue;

	writeSession({
		...session,
		steps: {
			...session.steps,
			[id]: value
		},
	}, path);

	return value;
}

/**
 * Recursively drop `null`/`undefined` fields so they don't appear in TOON output,
 * and strip ANSI escape codes from any string so the session file stays plain
 * readable text even when callers pass styled prompt messages.
 */
function prune(value: unknown): unknown {
	if (typeof value === 'string') return stripVTControlCharacters(value);
	if (Array.isArray(value)) return value.map(prune);
	if (value && typeof value === 'object') {
		const out: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
			if (v === null || v === undefined) continue;
			out[k] = prune(v);
		}
		return out;
	}
	return value;
}

/**
 * Emit one message on stdout, followed by a blank line so consecutive emissions
 * stay visually separated. Messages are plain English paragraphs; structured
 * payloads (questions, options) are embedded as single-line JSON that the agent
 * can spot and parse directly.
 */
function writeBlock(target: Writable | undefined, text: string): void {
	const out = target ?? stdout;
	out.write(`${text}\n\n`);
}

/**
 * Shared options for the `emit*` family of functions. Both fields default to
 * the process-global stdout / session-file path when omitted.
 */
interface EmitContext {
	/**
	 * Destination stream for the emitted block. Defaults to `process.stdout`.
	 * Tests pass a mock writable to capture output.
	 */
	output?: Writable;
	/**
	 * Session-file path advertised to the agent in the emitted instructions.
	 * Defaults to {@link getSessionFilePath}.
	 */
	sessionFile?: string;
}

/**
 * Emit a single pending question on stdout in agent-mode format.
 *
 * The emitted block contains a human-readable instruction, the question as a
 * single line of JSON (so the agent can parse it directly), and a hint about
 * the expected answer shape. Paired with `process.exit(2)` by the caller.
 *
 * @internal
 */
export function emitQuestion(question: AgentQuestion, ctx: EmitContext = {}): void {
	const sessionFile = ctx.sessionFile ?? getSessionFilePath();
	const block = [
		`Clack needs 1 answer. Write it into ${sessionFile} and re-run this command.`,
		'',
		'Question:',
		JSON.stringify(prune(question)),
		'',
		`Add to "answers.${question.id}" in the session file one of:`,
		`  {"value": <your answer>}   or   {"cancelled": true}`,
	].join('\n');
	writeBlock(ctx.output, block);
}

/**
 * Emit several pending questions on stdout as a single NDJSON-style block —
 * one JSON object per line — so the agent can answer them all in one edit of
 * the session file. Used by `batch()` to collapse `n` round-trips into one.
 *
 * @internal
 */
export function emitQuestions(questions: AgentQuestion[], ctx: EmitContext = {}): void {
	const sessionFile = ctx.sessionFile ?? getSessionFilePath();
	const n = questions.length;
	const block = [
		`Clack needs ${n} ${n === 1 ? 'answer' : 'answers'}. Write them into ${sessionFile} and re-run this command.`,
		'',
		'Questions (one JSON object per line):',
		...questions.map((q) => JSON.stringify(prune(q))),
		'',
		'For each question, add to "answers.<id>" in the session file one of:',
		`  {"value": <your answer>}   or   {"cancelled": true}`,
	].join('\n');
	writeBlock(ctx.output, block);
}

/**
 * Emit a validation-error block to stdout. Paired with `process.exit(3)` on
 * the caller side so the agent can distinguish "bad answer, try again" from
 * "new question, come back later" (exit 2).
 *
 * @internal
 */
export function emitError(id: string, message: string, ctx: EmitContext = {}): void {
	writeBlock(ctx.output, `Invalid answer for "${id}": ${message}`);
}

/**
 * Emit a tagged log line — the agent-mode counterpart to the `log.*` helpers
 * (`log.info`, `log.success`, ...). Each line is prefixed with `[<level>]` so
 * the agent can classify output without parsing ANSI.
 *
 * @internal
 */
export function emitLog(
	level: 'info' | 'success' | 'warn' | 'error' | 'step' | 'message',
	message: string,
	ctx: EmitContext = {}
): void {
	writeBlock(ctx.output, `[${level}] ${message}`);
}

/**
 * Emit a `[task:start]` / `[task:stop]` / `[task:error]` marker for
 * spinner/progress tasks. Agents use the matched start/stop pair to track
 * long-running operations without rendering animation frames.
 *
 * @internal
 */
export function emitTask(
	phase: 'start' | 'stop' | 'error',
	message: string | undefined,
	ctx: EmitContext = {}
): void {
	const suffix = message ? ` ${message}` : '';
	writeBlock(ctx.output, `[task:${phase}]${suffix}`);
}

/**
 * Persist the given questions to `session.pending`. Purely informational —
 * it records what was last emitted so humans / tooling can inspect the
 * session file, but the CLI does not consume it on re-run.
 *
 * @internal
 */
export function stashPending(questions: AgentQuestion[], path: string = getSessionFilePath()): void {
	const session = readSession(path);
	session.pending = questions;
	writeSession(session, path);
}

// -------------------------------------------------------------------------
// Cleanup on successful exit
// -------------------------------------------------------------------------

let _consumedAnswer = false;
let _cleanupOnExit = true;
let _cleanupHookRegistered = false;

/**
 * Record that a prompt in this process successfully consumed an answer from the
 * session file. Lazily registers the `process.on('exit', ...)` cleanup hook so
 * the file is deleted on a clean exit (see `registerCleanupHook`).
 *
 * @internal
 */
export function markAnswerConsumed(): void {
	_consumedAnswer = true;
	registerCleanupHook();
}

/**
 * Opt out of (or back into) session-file deletion on exit.
 *
 * Defaults to `true`. Tests flip this off when they want to inspect the
 * session file after a simulated run.
 *
 * @internal
 */
export function setCleanupOnExit(value: boolean): void {
	_cleanupOnExit = value;
}

/**
 * Reset all cleanup-tracking module state to its defaults.
 *
 * Intended for test isolation only — production code should not need this.
 *
 * @internal
 */
export function resetCleanupState(): void {
	_consumedAnswer = false;
	_cleanupOnExit = true;
}

/**
 * Run cleanup logic (invoked by the `process.on('exit')` hook, but also callable
 * directly for tests). Deletes the session file iff all gating conditions hold.
 * Returns true if the file was removed.
 *
 * @internal
 */
export function runCleanup(code: number): boolean {
	if (code !== 0) return false;
	if (!_consumedAnswer) return false;
	if (!_cleanupOnExit) return false;
	if (!isAgentMode()) return false;
	if (env.CLACK_AGENT_KEEP_FILE === '1' || env.CLACK_AGENT_KEEP_FILE === 'true') return false;
	try {
		unlinkSync(getSessionFilePath());
		return true;
	} catch {
		// File may have been removed or moved; nothing useful to do on exit.
		return false;
	}
}

function registerCleanupHook(): void {
	if (_cleanupHookRegistered) return;
	_cleanupHookRegistered = true;
	process.on('exit', (code) => {
		runCleanup(code);
	});
}

/**
 * Process-exit implementation. Extracted behind a mutable binding so tests
 * can replace `process.exit` with a throwing stub via {@link setExit}.
 */
let _exit: (code: number) => never = ((code: number): never => {
	process.exit(code);
}) as (code: number) => never;

/**
 * Terminate the process with the given code.
 *
 * Always prefer this over `process.exit()` inside agent-mode code paths — it
 * goes through the replaceable indirection so tests can intercept exits
 * without the test runner itself being killed.
 *
 * @internal
 */
export function exit(code: number): never {
	return _exit(code);
}

/**
 * Replace the underlying exit implementation. Tests pass a stub that throws,
 * so "assertions on the exit code" become "assertions on the thrown error"
 * — letting vitest observe the behavior instead of terminating the suite.
 *
 * @internal
 */
export function setExit(fn: (code: number) => never): void {
	_exit = fn;
}
