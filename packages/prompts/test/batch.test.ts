import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
	readSession,
	resetAutoIdCounter,
	resetCleanupState,
	setAgentMode,
	setExit,
	writeSession,
} from '@clack/core';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

function extractJsonLines(doc: string): Array<Record<string, unknown>> {
	return doc
		.trimEnd()
		.split('\n')
		.filter((ln) => ln.startsWith('{'))
		.map((ln) => JSON.parse(ln));
}
import { batch } from '../src/batch.js';
import { MockReadable, MockWritable } from './test-utils.js';

describe('batch() agent mode', () => {
	let tmp: string;
	let sessionFile: string;
	let output: MockWritable;
	let input: MockReadable;
	let exitCalls: number[];

	beforeEach(() => {
		tmp = mkdtempSync(join(tmpdir(), 'clack-batch-'));
		sessionFile = join(tmp, 'session.json');
		process.env.CLACK_AGENT_FILE = sessionFile;
		setAgentMode(true);
		resetAutoIdCounter();
		resetCleanupState();
		output = new MockWritable();
		input = new MockReadable();
		exitCalls = [];
		setExit(((code: number) => {
			exitCalls.push(code);
			throw new Error(`__exit:${code}`);
		}) as () => never);
	});

	afterEach(() => {
		delete process.env.CLACK_AGENT_FILE;
		setAgentMode(undefined);
		setExit(((code: number) => process.exit(code)) as () => never);
		rmSync(tmp, { recursive: true, force: true });
	});

	test('emits all unanswered questions in a single payload and exits 2', async () => {
		// stdout capture — batch writes to the real stdout by default. We stub it.
		const original = process.stdout.write.bind(process.stdout);
		const lines: string[] = [];
		process.stdout.write = ((chunk: string) => {
			lines.push(chunk);
			return true;
		}) as typeof process.stdout.write;

		try {
			await expect(
				batch({
					name: batch.text({ id: 'name', message: 'Name?', input, output }),
					size: batch.select({
						id: 'size',
						message: 'Size?',
						options: [
							{ value: 'S', label: 'Small' },
							{ value: 'M', label: 'Medium' },
						],
						input,
						output,
					}),
				})
			).rejects.toThrow(/__exit:2/);
		} finally {
			process.stdout.write = original;
		}

		expect(exitCalls).toEqual([2]);
		expect(lines).toHaveLength(1);
		expect(lines[0]).toContain('Clack needs 2 answers');
		const jsonLines = extractJsonLines(lines[0]);
		expect(jsonLines).toHaveLength(2);
		expect(jsonLines.map((q) => q.id)).toEqual(['name', 'size']);
		const sizeOptions = jsonLines[1].options as Array<Record<string, unknown>>;
		expect(sizeOptions).toHaveLength(2);
		expect(sizeOptions[0].value).toBe('S');
		expect(sizeOptions[1].label).toBe('Medium');

		// Session file has pending
		const session = readSession(sessionFile);
		expect(session.pending?.map((q) => q.id)).toEqual(['name', 'size']);
	});

	test('returns answers when all are present, no emission', async () => {
		writeSession(
			{
				version: 1,
				answers: {
					name: { value: 'Eduardo' },
					size: { value: 'M' },
				},
			},
			sessionFile
		);

		const result = await batch({
			name: batch.text({ id: 'name', message: 'Name?', input, output }),
			size: batch.select<string>({
				id: 'size',
				message: 'Size?',
				options: [
					{ value: 'S', label: 'Small' },
					{ value: 'M', label: 'Medium' },
				],
				input,
				output,
			}),
		});

		expect(result).toEqual({ name: 'Eduardo', size: 'M' });
		expect(exitCalls).toEqual([]);
	});

	test('partial answers: emits only the unanswered ones', async () => {
		writeSession(
			{ version: 1, answers: { name: { value: 'Eduardo' } } },
			sessionFile
		);

		const original = process.stdout.write.bind(process.stdout);
		const lines: string[] = [];
		process.stdout.write = ((chunk: string) => {
			lines.push(chunk);
			return true;
		}) as typeof process.stdout.write;

		try {
			await expect(
				batch({
					name: batch.text({ id: 'name', message: 'Name?', input, output }),
					size: batch.text({ id: 'size', message: 'Size?', input, output }),
				})
			).rejects.toThrow(/__exit:2/);
		} finally {
			process.stdout.write = original;
		}

		const jsonLines = extractJsonLines(lines[0]);
		expect(jsonLines).toHaveLength(1);
		expect(jsonLines[0].id).toBe('size');
	});
});
