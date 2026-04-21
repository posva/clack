import {
	type AgentQuestion,
	emitQuestions,
	exit as coreExit,
	getSessionFilePath,
	markAnswerConsumed,
	readSession,
	writeSession,
} from '@posva/clack-core';
import { autocomplete, type AutocompleteOptions } from './autocomplete.js';
import { isAgent, serializeOptions } from './common.js';
import { confirm, type ConfirmOptions } from './confirm.js';
import { date, type DateOptions } from './date.js';
import { multiline, type MultiLineOptions } from './multi-line.js';
import { multiselect, type MultiSelectOptions } from './multi-select.js';
import { password, type PasswordOptions } from './password.js';
import type { Option } from './select.js';
import { select, type SelectOptions } from './select.js';
import { text, type TextOptions } from './text.js';

type BatchKind =
	| 'text'
	| 'password'
	| 'confirm'
	| 'select'
	| 'multiselect'
	| 'autocomplete'
	| 'multiline'
	| 'date';

interface BatchDescriptorBase {
	__clackBatch: true;
	kind: BatchKind;
	id: string;
	opts: Record<string, unknown>;
	/** Run the prompt interactively (fallback when not in agent mode). */
	run: () => Promise<unknown>;
	/** Build the agent-mode `AgentQuestion` payload. */
	describe: () => AgentQuestion;
}

export interface BatchItem<T> extends BatchDescriptorBase {
	_valueType?: T;
}

function asBatch<T>(descriptor: BatchDescriptorBase): BatchItem<T> {
	return descriptor as BatchItem<T>;
}

/** Text input inside a batch. Same options as `text()` — `id` is required. */
export function batchText(opts: TextOptions & { id: string }): BatchItem<string> {
	return asBatch<string>({
		__clackBatch: true,
		kind: 'text',
		id: opts.id,
		opts,
		run: () => text(opts),
		describe: () => ({
			id: opts.id,
			kind: 'text',
			message: opts.message,
			placeholder: opts.placeholder,
			defaultValue: opts.defaultValue,
			initialValue: opts.initialValue,
			required: opts.validate !== undefined,
		}),
	});
}

export function batchPassword(opts: PasswordOptions & { id: string }): BatchItem<string> {
	return asBatch<string>({
		__clackBatch: true,
		kind: 'password',
		id: opts.id,
		opts,
		run: () => password(opts),
		describe: () => ({
			id: opts.id,
			kind: 'password',
			message: opts.message,
			required: opts.validate !== undefined,
		}),
	});
}

export function batchConfirm(opts: ConfirmOptions & { id: string }): BatchItem<boolean> {
	const active = opts.active ?? 'Yes';
	const inactive = opts.inactive ?? 'No';
	return asBatch<boolean>({
		__clackBatch: true,
		kind: 'confirm',
		id: opts.id,
		opts,
		run: () => confirm(opts),
		describe: () => ({
			id: opts.id,
			kind: 'confirm',
			message: opts.message,
			active,
			inactive,
			initialValue: opts.initialValue ?? true,
		}),
	});
}

export function batchSelect<V>(opts: SelectOptions<V> & { id: string }): BatchItem<V> {
	return asBatch<V>({
		__clackBatch: true,
		kind: 'select',
		id: opts.id,
		opts,
		run: () => select(opts),
		describe: () => ({
			id: opts.id,
			kind: 'select',
			message: opts.message,
			options: serializeOptions(opts.options as Option<V>[]),
			initialValue: opts.initialValue,
		}),
	});
}

export function batchMultiselect<V>(opts: MultiSelectOptions<V> & { id: string }): BatchItem<V[]> {
	const required = opts.required ?? true;
	return asBatch<V[]>({
		__clackBatch: true,
		kind: 'multiselect',
		id: opts.id,
		opts,
		run: () => multiselect(opts),
		describe: () => ({
			id: opts.id,
			kind: 'multiselect',
			message: opts.message,
			options: serializeOptions(opts.options as Option<V>[]),
			initialValues: opts.initialValues,
			required,
		}),
	});
}

export function batchAutocomplete<V>(opts: AutocompleteOptions<V> & { id: string }): BatchItem<V> {
	return asBatch<V>({
		__clackBatch: true,
		kind: 'autocomplete',
		id: opts.id,
		opts,
		run: () => autocomplete(opts),
		describe: () => ({
			id: opts.id,
			kind: 'autocomplete',
			message: opts.message,
			placeholder: opts.placeholder,
			options:
				typeof opts.options === 'function'
					? undefined
					: serializeOptions(opts.options as Option<V>[]),
			dynamicOptions: typeof opts.options === 'function' || undefined,
			initialValue: opts.initialValue,
			required: opts.validate !== undefined,
		}),
	});
}

export function batchMultiline(opts: MultiLineOptions & { id: string }): BatchItem<string> {
	return asBatch<string>({
		__clackBatch: true,
		kind: 'multiline',
		id: opts.id,
		opts,
		run: () => multiline(opts),
		describe: () => ({
			id: opts.id,
			kind: 'multi-line',
			message: opts.message,
			placeholder: opts.placeholder,
			defaultValue: opts.defaultValue,
			initialValue: opts.initialValue,
			showSubmit: opts.showSubmit,
			required: opts.validate !== undefined,
		}),
	});
}

export function batchDate(opts: DateOptions & { id: string }): BatchItem<Date> {
	return asBatch<Date>({
		__clackBatch: true,
		kind: 'date',
		id: opts.id,
		opts,
		run: () => date(opts),
		describe: () => ({
			id: opts.id,
			kind: 'date',
			message: opts.message,
			format: opts.format,
			locale: opts.locale,
			defaultValue: opts.defaultValue?.toISOString(),
			initialValue: opts.initialValue?.toISOString(),
			minDate: opts.minDate?.toISOString(),
			maxDate: opts.maxDate?.toISOString(),
			valueFormat: 'ISO 8601 date string (YYYY-MM-DD) or full ISO timestamp',
		}),
	});
}

type BatchResult<T extends Record<string, BatchItem<unknown>>> = {
	[K in keyof T]: T[K] extends BatchItem<infer V> ? V | symbol : never;
};

/**
 * Run several prompts whose answers DO NOT depend on each other.
 *
 * In interactive mode, prompts run sequentially (same effective behavior as `group()`
 * for independent questions).
 *
 * In agent mode, all unanswered questions are emitted as a single NDJSON `questions`
 * payload on stdout, then the process exits with code 2 so the agent can fill them in
 * one round-trip.
 *
 * Each batch item REQUIRES an `id` — no auto-counter fallback here, because the batch
 * shape is the protocol contract and stable ids are essential.
 */
export async function batch<T extends Record<string, BatchItem<unknown>>>(
	items: T
): Promise<BatchResult<T>> {
	const entries = Object.entries(items) as Array<[string, BatchItem<unknown>]>;

	if (!isAgent()) {
		const result: Record<string, unknown> = {};
		for (const [key, item] of entries) {
			result[key] = await item.run();
		}
		return result as BatchResult<T>;
	}

	// Agent mode: check session file for all answers.
	const sessionPath = getSessionFilePath();
	const session = readSession(sessionPath);
	const unanswered: AgentQuestion[] = [];
	const result: Record<string, unknown> = {};
	let anyAnswered = false;

	for (const [key, item] of entries) {
		const answer = session.answers[item.id];
		if (answer === undefined) {
			unanswered.push(item.describe());
		} else {
			anyAnswered = true;
			result[key] = answer.value;
		}
	}

	if (anyAnswered) {
		markAnswerConsumed();
	}

	if (unanswered.length === 0) {
		return result as BatchResult<T>;
	}

	session.pending = unanswered;
	writeSession(session, sessionPath);
	emitQuestions(unanswered, { sessionFile: sessionPath });
	coreExit(2);
	// Unreachable; `coreExit` terminates the process.
	return {} as BatchResult<T>;
}

batch.text = batchText;
batch.password = batchPassword;
batch.confirm = batchConfirm;
batch.select = batchSelect;
batch.multiselect = batchMultiselect;
batch.autocomplete = batchAutocomplete;
batch.multiline = batchMultiline;
batch.date = batchDate;
