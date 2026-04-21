import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
	emitQuestion,
	emitQuestions,
	getAnswer,
	isAgentMode,
	markAnswerConsumed,
	once,
	readSession,
	resetAutoIdCounter,
	resetCleanupState,
	runCleanup,
	setAgentMode,
	setCleanupOnExit,
	setExit,
	writeSession,
} from '../src/agent.js';
import { default as ConfirmPrompt } from '../src/prompts/confirm.js';
import { default as Prompt } from '../src/prompts/prompt.js';
import { default as SelectPrompt } from '../src/prompts/select.js';
import { default as TextPrompt } from '../src/prompts/text.js';
import { isCancel } from '../src/utils/index.js';
import { MockReadable } from './mock-readable.js';
import { MockWritable } from './mock-writable.js';

describe('agent mode', () => {
	let tmp: string;
	let sessionFile: string;
	let input: MockReadable;
	let output: MockWritable;
	let exitCalls: number[];
	let exitStub: () => never;

	beforeEach(() => {
		tmp = mkdtempSync(join(tmpdir(), 'clack-agent-'));
		sessionFile = join(tmp, 'session.json');
		process.env.CLACK_AGENT_FILE = sessionFile;
		setAgentMode(true);
		resetAutoIdCounter();
		resetCleanupState();
		input = new MockReadable();
		output = new MockWritable();
		exitCalls = [];
		exitStub = ((code: number) => {
			exitCalls.push(code);
			throw new Error(`__exit:${code}`);
		}) as () => never;
		setExit(exitStub);
	});

	afterEach(() => {
		process.env.CLACK_AGENT_FILE = undefined;
		delete process.env.CLACK_AGENT_FILE;
		delete process.env.CLACK_AGENT_KEEP_FILE;
		setAgentMode(undefined);
		setExit(((code: number) => process.exit(code)) as () => never);
		resetCleanupState();
		rmSync(tmp, { recursive: true, force: true });
		vi.restoreAllMocks();
	});

	describe('detection', () => {
		test('isAgentMode honours the override', () => {
			setAgentMode(true);
			expect(isAgentMode()).toBe(true);
			setAgentMode(false);
			expect(isAgentMode()).toBe(false);
		});
	});

	describe('session file', () => {
		test('readSession returns empty session when file missing', () => {
			const s = readSession(sessionFile);
			expect(s).toEqual({ version: 1, answers: {} });
		});

		test('writeSession then readSession round-trips', () => {
			writeSession({ version: 1, answers: { a: { value: 42 } } }, sessionFile);
			expect(readSession(sessionFile)).toEqual({
				version: 1,
				answers: { a: { value: 42 } },
			});
		});

		test('getAnswer returns the stored entry', () => {
			writeSession({ version: 1, answers: { x: { value: 'hi' } } }, sessionFile);
			expect(getAnswer('x', sessionFile)).toEqual({ value: 'hi' });
		});

		test('readSession tolerates corrupt JSON', () => {
			writeFileSync(sessionFile, '{not json', 'utf8');
			expect(readSession(sessionFile)).toEqual({ version: 1, answers: {} });
		});

		test('writeSession strips ANSI escape codes from strings', () => {
			const red = '\u001B[31mhello\u001B[39m';
			writeSession(
				{
					version: 1,
					answers: { a: { value: red } },
					pending: [{ id: 'q1', kind: 'text', message: `${red} world` }],
				},
				sessionFile
			);
			const raw = readFileSync(sessionFile, 'utf8');
			expect(JSON.parse(raw)).toMatchObject({
				answers: { a: { value: 'hello' } },
				pending: [{ id: 'q1', kind: 'text', message: 'hello world' }],
			});
		});
	});

	describe('protocol emission', () => {
		/**
		 * Block format:
		 *   <prose>\n
		 *   \n
		 *   Question: | Questions (one JSON object per line):\n
		 *   <json>\n
		 *   ...\n
		 *   \n
		 *   <prose>\n
		 *   <snippet>\n
		 *   \n\n (trailing)
		 */
		function extractJsonLines(doc: string): unknown[] {
			return doc
				.trimEnd()
				.split('\n')
				.filter((ln) => ln.startsWith('{'))
				.map((ln) => JSON.parse(ln));
		}

		test('emitQuestion prose mentions sessionFile + question id, embeds JSON', () => {
			emitQuestion({ id: 'q1', kind: 'text', message: 'Name?' }, { output, sessionFile });
			expect(output.buffer).toHaveLength(1);
			const doc = output.buffer[0];
			expect(doc.endsWith('\n\n')).toBe(true);
			expect(doc).toContain('Clack needs 1 answer');
			expect(doc).toContain(sessionFile);
			expect(doc).toContain('answers.q1');
			const jsonLines = extractJsonLines(doc);
			expect(jsonLines[0]).toEqual({ id: 'q1', kind: 'text', message: 'Name?' });
		});

		test('emitQuestions lists each question on its own line', () => {
			emitQuestions(
				[
					{ id: 'a', kind: 'text', message: 'A?' },
					{ id: 'b', kind: 'confirm', message: 'B?' },
				],
				{ output, sessionFile }
			);
			const doc = output.buffer[0];
			expect(doc).toContain('Clack needs 2 answers');
			expect(doc).toContain('answers.<id>');
			const jsonLines = extractJsonLines(doc) as Array<Record<string, unknown>>;
			expect(jsonLines).toHaveLength(2);
			expect(jsonLines[0].id).toBe('a');
			expect(jsonLines[1].kind).toBe('confirm');
		});
	});

	describe('Prompt.prompt() in agent mode', () => {
		test('empty session: emits question, stashes pending, exits 2', () => {
			const p = new TextPrompt({
				input,
				output,
				id: 'name',
				agent: { message: 'Your name?' },
				render: () => '',
			});
			expect(() => p.prompt()).toThrow(/__exit:2/);
			expect(exitCalls).toEqual([2]);

			// stdout got a prose block with JSON for the question
			expect(output.buffer).toHaveLength(1);
			const doc = output.buffer[0];
			expect(doc).toContain('Clack needs 1 answer');
			const jsonLine = doc
				.split('\n')
				.find((ln) => ln.startsWith('{'));
			expect(jsonLine).toBeDefined();
			const q = JSON.parse(jsonLine as string);
			expect(q.id).toBe('name');
			expect(q.kind).toBe('text');
			expect(q.message).toBe('Your name?');

			// session file got pending
			const session = readSession(sessionFile);
			expect(session.pending).toHaveLength(1);
			expect(session.pending?.[0].id).toBe('name');
		});

		test('answer in session file: resolves immediately without blocking', async () => {
			writeSession({ version: 1, answers: { name: { value: 'Eduardo' } } }, sessionFile);
			const p = new TextPrompt({
				input,
				output,
				id: 'name',
				agent: { message: 'Your name?' },
				render: () => '',
			});
			const result = await p.prompt();
			expect(result).toBe('Eduardo');
			expect(p.state).toBe('submit');
			expect(exitCalls).toEqual([]);
			expect(output.buffer).toEqual([]);
		});

		test('cancelled answer resolves to CANCEL_SYMBOL', async () => {
			writeSession({ version: 1, answers: { q: { cancelled: true } } }, sessionFile);
			const p = new TextPrompt({
				input,
				output,
				id: 'q',
				agent: { message: 'Go?' },
				render: () => '',
			});
			const result = await p.prompt();
			expect(isCancel(result)).toBe(true);
			expect(p.state).toBe('cancel');
		});

		test('invalid answer: emits error + re-emits question + exits 3', () => {
			writeSession({ version: 1, answers: { age: { value: 'not a number' } } }, sessionFile);
			const p = new TextPrompt({
				input,
				output,
				id: 'age',
				agent: { message: 'Age?' },
				validate: (v) => (Number.isNaN(Number(v)) ? 'must be a number' : undefined),
				render: () => '',
			});
			expect(() => p.prompt()).toThrow(/__exit:3/);
			expect(exitCalls).toEqual([3]);

			// Two docs: error + re-emitted question
			expect(output.buffer).toHaveLength(2);
			expect(output.buffer[0]).toContain('Invalid answer for "age"');
			expect(output.buffer[0]).toContain('must be a number');
			expect(output.buffer[1]).toContain('Clack needs 1 answer');

			// Session should have cleared the bad answer and stashed pending
			const session = readSession(sessionFile);
			expect(session.answers.age).toBeUndefined();
			expect(session.pending?.[0].id).toBe('age');
		});

		test('auto-id: counter increments across calls', () => {
			resetAutoIdCounter();
			const a = new TextPrompt({
				input,
				output,
				agent: { message: 'A?' },
				render: () => '',
			});
			const b = new TextPrompt({
				input,
				output,
				agent: { message: 'B?' },
				render: () => '',
			});
			expect(() => a.prompt()).toThrow();
			expect(a.id).toBe('auto:0');
			// Reset exit tracking for second call
			output.buffer.length = 0;
			expect(() => b.prompt()).toThrow();
			expect(b.id).toBe('auto:1');
		});

		test('aborted signal returns CANCEL_SYMBOL without emission', async () => {
			const controller = new AbortController();
			controller.abort();
			const p = new TextPrompt({
				input,
				output,
				id: 'x',
				signal: controller.signal,
				agent: { message: 'A?' },
				render: () => '',
			});
			const result = await p.prompt();
			expect(isCancel(result)).toBe(true);
			expect(exitCalls).toEqual([]);
			expect(output.buffer).toEqual([]);
		});
	});

	describe('serialize()', () => {
		test('TextPrompt defaults to kind=text with agent overrides merged', () => {
			const p = new TextPrompt({
				input,
				output,
				id: 'name',
				agent: { message: 'Name?', placeholder: 'Jane' },
				render: () => '',
			});
			expect(p.serialize()).toEqual({
				id: 'name',
				kind: 'text',
				message: 'Name?',
				placeholder: 'Jane',
			});
		});

		test('SelectPrompt has kind=select', () => {
			const p = new SelectPrompt({
				input,
				output,
				id: 'pick',
				options: [{ value: 'a' }, { value: 'b' }],
				agent: { message: 'Pick?' },
				render: () => '',
			});
			expect(p.serialize().kind).toBe('select');
		});

		test('ConfirmPrompt has kind=confirm', () => {
			const p = new ConfirmPrompt({
				input,
				output,
				id: 'ok',
				active: 'Yes',
				inactive: 'No',
				agent: { message: 'OK?' },
				render: () => '',
			});
			expect(p.serialize().kind).toBe('confirm');
		});
	});

	describe('base Prompt uses auto-id when id not set', () => {
		test('Prompt.id falls back to auto counter', () => {
			resetAutoIdCounter();
			const p = new Prompt({ input, output, render: () => '' });
			expect(p.id).toBe('auto:0');
		});
	});

	describe('session file cleanup on exit', () => {
		test('deletes the session file on clean exit after an answer is consumed', () => {
			writeSession({ version: 1, answers: { q: { value: 'x' } } }, sessionFile);
			expect(existsSync(sessionFile)).toBe(true);
			markAnswerConsumed();
			const removed = runCleanup(0);
			expect(removed).toBe(true);
			expect(existsSync(sessionFile)).toBe(false);
		});

		test('resolving a prompt from the session file marks it consumed', async () => {
			writeSession({ version: 1, answers: { q: { value: 'hi' } } }, sessionFile);
			const p = new TextPrompt({
				input,
				output,
				id: 'q',
				agent: { message: 'A?' },
				render: () => '',
			});
			const v = await p.prompt();
			expect(v).toBe('hi');
			// Consumed -> clean exit deletes
			expect(runCleanup(0)).toBe(true);
			expect(existsSync(sessionFile)).toBe(false);
		});

		test('exit code != 0 does NOT delete', () => {
			writeSession({ version: 1, answers: { q: { value: 'x' } } }, sessionFile);
			markAnswerConsumed();
			expect(runCleanup(2)).toBe(false);
			expect(runCleanup(1)).toBe(false);
			expect(runCleanup(3)).toBe(false);
			expect(existsSync(sessionFile)).toBe(true);
		});

		test('does not delete when no answer was consumed this run', () => {
			writeSession({ version: 1, answers: { q: { value: 'x' } } }, sessionFile);
			// No markAnswerConsumed() call
			expect(runCleanup(0)).toBe(false);
			expect(existsSync(sessionFile)).toBe(true);
		});

		test('CLACK_AGENT_KEEP_FILE suppresses deletion', () => {
			writeSession({ version: 1, answers: { q: { value: 'x' } } }, sessionFile);
			markAnswerConsumed();
			process.env.CLACK_AGENT_KEEP_FILE = '1';
			try {
				expect(runCleanup(0)).toBe(false);
				expect(existsSync(sessionFile)).toBe(true);
			} finally {
				delete process.env.CLACK_AGENT_KEEP_FILE;
			}
		});

		test('setCleanupOnExit(false) suppresses deletion', () => {
			writeSession({ version: 1, answers: { q: { value: 'x' } } }, sessionFile);
			markAnswerConsumed();
			setCleanupOnExit(false);
			expect(runCleanup(0)).toBe(false);
			expect(existsSync(sessionFile)).toBe(true);
		});

		test('cancelled answer still marks consumed and allows cleanup', async () => {
			writeSession({ version: 1, answers: { q: { cancelled: true } } }, sessionFile);
			const p = new TextPrompt({
				input,
				output,
				id: 'q',
				agent: { message: 'A?' },
				render: () => '',
			});
			await p.prompt();
			expect(runCleanup(0)).toBe(true);
			expect(existsSync(sessionFile)).toBe(false);
		});

		test('not in agent mode: cleanup is a no-op', () => {
			writeSession({ version: 1, answers: { q: { value: 'x' } } }, sessionFile);
			markAnswerConsumed();
			setAgentMode(false);
			expect(runCleanup(0)).toBe(false);
			expect(existsSync(sessionFile)).toBe(true);
		});

		test('missing file is tolerated', () => {
			// Session file never created
			markAnswerConsumed();
			expect(runCleanup(0)).toBe(false); // unlinkSync throws -> caught -> false
			expect(existsSync(sessionFile)).toBe(false);
		});
	});

	describe('once()', () => {
		test('runs the fn once in agent mode and caches the result in steps', async () => {
			const fn = vi.fn(async () => 'changelog-body');
			const first = await once('changelog', fn);
			expect(first).toBe('changelog-body');
			expect(fn).toHaveBeenCalledTimes(1);

			// Second call in the same run: returns cache, no re-invocation.
			const second = await once('changelog', fn);
			expect(second).toBe('changelog-body');
			expect(fn).toHaveBeenCalledTimes(1);

			// Cached value is visible in the session file.
			const session = readSession(sessionFile);
			expect(session.steps).toEqual({ changelog: 'changelog-body' });
		});

		test('simulated re-run (fresh process) finds the cached value', async () => {
			// First "process" writes the step.
			await once('build', async () => ({ sha: 'abc', size: 42 }));

			// Simulate a fresh invocation: fn should NOT be called again.
			const fn = vi.fn(async () => ({ sha: 'xxx', size: 0 }));
			const result = await once('build', fn);
			expect(fn).not.toHaveBeenCalled();
			expect(result).toEqual({ sha: 'abc', size: 42 });
		});

		test('non-agent mode: fn runs every call, no file written', async () => {
			setAgentMode(false);
			const fn = vi.fn(async () => 'v');
			await once('k', fn);
			await once('k', fn);
			expect(fn).toHaveBeenCalledTimes(2);
			expect(existsSync(sessionFile)).toBe(false);
		});

		test('thrown errors are NOT cached: next call retries', async () => {
			let attempts = 0;
			const fn = async () => {
				attempts++;
				if (attempts === 1) throw new Error('boom');
				return 'ok';
			};

			await expect(once('flaky', fn)).rejects.toThrow('boom');
			// Session should not contain the failed step.
			expect(readSession(sessionFile).steps?.flaky).toBeUndefined();

			const result = await once('flaky', fn);
			expect(result).toBe('ok');
			expect(attempts).toBe(2);
			expect(readSession(sessionFile).steps?.flaky).toBe('ok');
		});

		test('distinct IDs do not collide', async () => {
			const a = await once('a', async () => 1);
			const b = await once('b', async () => 2);
			expect(a).toBe(1);
			expect(b).toBe(2);
			const session = readSession(sessionFile);
			expect(session.steps).toEqual({ a: 1, b: 2 });
		});

		test('synchronous fn is supported', async () => {
			const result = await once('sync', () => 'done');
			expect(result).toBe('done');
			expect(readSession(sessionFile).steps?.sync).toBe('done');
		});

		test('preserves existing answers in the session file', async () => {
			writeSession({ version: 1, answers: { name: { value: 'Eduardo' } } }, sessionFile);
			await once('step1', async () => 'v1');
			const session = readSession(sessionFile);
			expect(session.answers).toEqual({ name: { value: 'Eduardo' } });
			expect(session.steps).toEqual({ step1: 'v1' });
		});

		test('cleanup on clean exit wipes both answers and steps (via prompt consumption)', async () => {
			writeSession({ version: 1, answers: { q: { value: 'hi' } } }, sessionFile);
			await once('step1', async () => 'v1');
			// A prompt consumes the answer.
			const p = new TextPrompt({
				input,
				output,
				id: 'q',
				agent: { message: 'A?' },
				render: () => '',
			});
			await p.prompt();
			expect(runCleanup(0)).toBe(true);
			expect(existsSync(sessionFile)).toBe(false);
		});

		test('once() alone (no prompts) does not trigger cleanup on exit', async () => {
			// No prompt consumption -> no markAnswerConsumed -> file survives.
			await once('step1', async () => 'v1');
			expect(existsSync(sessionFile)).toBe(true);
			expect(runCleanup(0)).toBe(false);
			expect(existsSync(sessionFile)).toBe(true);
		});

		test('honours opts.sessionFile override', async () => {
			const custom = join(tmp, 'custom.json');
			await once('k', async () => 'v', { sessionFile: custom });
			expect(existsSync(custom)).toBe(true);
			expect(readSession(custom).steps).toEqual({ k: 'v' });
			// Default file should remain untouched.
			expect(existsSync(sessionFile)).toBe(false);
		});
	});
});
