import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, resolve } from 'node:path';
import { stdout } from 'node:process';
import type { Writable } from 'node:stream';
import { stripVTControlCharacters } from 'node:util';
import { env, isAgent as stdIsAgent, isTest as stdIsTest } from 'std-env';

export interface AgentAnswerEntry {
	value?: unknown;
	cancelled?: boolean;
}

export interface AgentSessionFile {
	version: 1;
	answers: Record<string, AgentAnswerEntry>;
	pending?: AgentQuestion[];
}

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

export interface AgentQuestion {
	id: string;
	kind: AgentQuestionKind;
	message?: string;
	required?: boolean;
	[extra: string]: unknown;
}

const DEFAULT_SESSION_FILE = '.clack-session.json';

let _counter = 0;

export function nextAutoId(): string {
	const n = _counter++;
	return `auto:${n}`;
}

export function resetAutoIdCounter(): void {
	_counter = 0;
}

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
 *     invoked by an agent harness. Tests that want to exercise agent mode should
 *     call `setAgentMode(true)`.
 *
 * Can be forced on/off programmatically via `setAgentMode()` (used by tests).
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

/** Force agent mode on or off. Pass `undefined` to reset to auto-detection. */
export function setAgentMode(value: boolean | undefined): void {
	_agentModeOverride = value;
	_agentModeCache = undefined;
}

function emptySession(): AgentSessionFile {
	return { version: 1, answers: {} };
}

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

export function writeSession(session: AgentSessionFile, path: string = getSessionFilePath()): void {
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, `${JSON.stringify(prune(session), null, 2)}\n`, 'utf8');
}

export function getAnswer(id: string, path?: string): AgentAnswerEntry | undefined {
	const s = readSession(path);
	return s.answers[id];
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

interface EmitContext {
	output?: Writable;
	sessionFile?: string;
}

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

export function emitError(id: string, message: string, ctx: EmitContext = {}): void {
	writeBlock(ctx.output, `Invalid answer for "${id}": ${message}`);
}

export function emitLog(
	level: 'info' | 'success' | 'warn' | 'error' | 'step' | 'message',
	message: string,
	ctx: EmitContext = {}
): void {
	writeBlock(ctx.output, `[${level}] ${message}`);
}

export function emitTask(
	phase: 'start' | 'stop' | 'error',
	message: string | undefined,
	ctx: EmitContext = {}
): void {
	const suffix = message ? ` ${message}` : '';
	writeBlock(ctx.output, `[task:${phase}]${suffix}`);
}

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
 */
export function markAnswerConsumed(): void {
	_consumedAnswer = true;
	registerCleanupHook();
}

/** Opt out of (or back into) session-file deletion on exit. Defaults to `true`. */
export function setCleanupOnExit(value: boolean): void {
	_cleanupOnExit = value;
}

/** Reset all cleanup-tracking state. Used by tests. */
export function resetCleanupState(): void {
	_consumedAnswer = false;
	_cleanupOnExit = true;
}

/**
 * Run cleanup logic (invoked by the `process.on('exit')` hook, but also callable
 * directly for tests). Deletes the session file iff all gating conditions hold.
 * Returns true if the file was removed.
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

/** Exit the process. Extracted so tests can replace it via `setExit`. */
let _exit: (code: number) => never = ((code: number): never => {
	process.exit(code);
}) as (code: number) => never;

export function exit(code: number): never {
	return _exit(code);
}

export function setExit(fn: (code: number) => never): void {
	_exit = fn;
}
