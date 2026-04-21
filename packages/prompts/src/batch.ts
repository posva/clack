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

/**
 * One entry inside a `batch({ ... })` call.
 *
 * Produced by the `batch.text` / `batch.select` / ... helpers — do not construct
 * manually. Each item carries two lanes: `run()` for the interactive fallback
 * (executed sequentially) and `describe()` for the agent-mode payload
 * (collected and emitted together in a single block).
 *
 * @typeParam T - The value type returned when the prompt resolves. Threaded
 *   through `BatchResult<T>` so the map returned by `batch()` stays typed per key.
 */
export interface BatchItem<T> {
	/**
	 * Stable id used both as the session-file key and the wire-protocol id.
	 * Required — there is no auto-counter fallback here.
	 */
	id: string;
	/**
	 * Interactive fallback. Invoked once per item, in declaration order, when
	 * agent mode is off.
	 */
	run: () => Promise<unknown>;
	/**
	 * Agent-mode payload builder. Called when the item is unanswered so its
	 * question can be emitted alongside the others in a single block.
	 */
	describe: () => AgentQuestion;
	/**
	 * Phantom for type inference of the answer's shape. Never set at runtime.
	 */
	_valueType?: T;
}

/**
 * Wrap a `text()` prompt as a batch item.
 *
 * Accepts the full `TextOptions` surface; only `id` becomes mandatory because
 * the batch protocol needs a stable key to map answers back onto the result.
 *
 * @see {@link batch} for how batch items are executed.
 */
export function batchText(opts: TextOptions & { id: string }): BatchItem<string> {
	return {
		id: opts.id,
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
	};
}

/**
 * Wrap a `password()` prompt as a batch item. Options mirror `password()`;
 * `id` is required.
 *
 * The agent payload intentionally omits `placeholder`/default values to avoid
 * inadvertently leaking hints about secret shape.
 */
export function batchPassword(opts: PasswordOptions & { id: string }): BatchItem<string> {
	return {
		id: opts.id,
		run: () => password(opts),
		describe: () => ({
			id: opts.id,
			kind: 'password',
			message: opts.message,
			required: opts.validate !== undefined,
		}),
	};
}

/**
 * Wrap a `confirm()` prompt as a batch item. Options mirror `confirm()`;
 * `id` is required.
 *
 * `active`/`inactive` default to `"Yes"`/`"No"` and `initialValue` defaults to
 * `true` — these defaults are baked into the agent payload so the agent sees
 * the same wording a human would.
 */
export function batchConfirm(opts: ConfirmOptions & { id: string }): BatchItem<boolean> {
	return {
		id: opts.id,
		run: () => confirm(opts),
		describe: () => ({
			id: opts.id,
			kind: 'confirm',
			message: opts.message,
			active: opts.active ?? 'Yes',
			inactive: opts.inactive ?? 'No',
			initialValue: opts.initialValue ?? true,
		}),
	};
}

/**
 * Wrap a `select()` prompt as a batch item. Options mirror `select()`;
 * `id` is required.
 *
 * `options` are serialized to `{ value, label, hint }` triples so the agent
 * sees the same choices a human would — it then picks by `value`.
 *
 * @typeParam V - Value type of each option, inferred from `opts.options`.
 */
export function batchSelect<V>(opts: SelectOptions<V> & { id: string }): BatchItem<V> {
	return {
		id: opts.id,
		run: () => select(opts),
		describe: () => ({
			id: opts.id,
			kind: 'select',
			message: opts.message,
			options: serializeOptions(opts.options as Option<V>[]),
			initialValue: opts.initialValue,
		}),
	};
}

/**
 * Wrap a `multiselect()` prompt as a batch item. Options mirror `multiselect()`;
 * `id` is required.
 *
 * `required` defaults to `true` (matches interactive behavior). The answer is
 * an array of `value`s — the agent picks zero or more of the serialized
 * options.
 *
 * @typeParam V - Value type of each option, inferred from `opts.options`.
 */
export function batchMultiselect<V>(opts: MultiSelectOptions<V> & { id: string }): BatchItem<V[]> {
	return {
		id: opts.id,
		run: () => multiselect(opts),
		describe: () => ({
			id: opts.id,
			kind: 'multiselect',
			message: opts.message,
			options: serializeOptions(opts.options as Option<V>[]),
			initialValues: opts.initialValues,
			required: opts.required ?? true,
		}),
	};
}

/**
 * Wrap an `autocomplete()` prompt as a batch item. Options mirror
 * `autocomplete()`; `id` is required.
 *
 * When `opts.options` is a function (dynamic options), the agent payload sets
 * `dynamicOptions: true` and omits the option list — the agent is expected to
 * provide a free-form `value`, which the CLI validates on re-run.
 *
 * @typeParam V - Value type of each option, inferred from `opts.options`.
 */
export function batchAutocomplete<V>(opts: AutocompleteOptions<V> & { id: string }): BatchItem<V> {
	return {
		id: opts.id,
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
	};
}

/**
 * Wrap a `multiline()` prompt as a batch item. Options mirror `multiline()`;
 * `id` is required.
 *
 * The agent-mode payload's `kind` is `"multi-line"` (hyphenated) to match the
 * protocol; the wrapper function keeps the concatenated `multiline` spelling
 * for ergonomic imports.
 */
export function batchMultiline(opts: MultiLineOptions & { id: string }): BatchItem<string> {
	return {
		id: opts.id,
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
	};
}

/**
 * Wrap a `date()` prompt as a batch item. Options mirror `date()`; `id` is
 * required.
 *
 * `Date` values are serialized to ISO 8601 strings in the agent payload and
 * the accepted answer format (`YYYY-MM-DD` or a full ISO timestamp) is
 * advertised via `valueFormat`, so the agent knows what to write back.
 */
export function batchDate(opts: DateOptions & { id: string }): BatchItem<Date> {
	return {
		id: opts.id,
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
	};
}

/**
 * Type-level mapper from the shape passed to `batch({ ... })` to the shape of
 * its resolved result. Each value becomes the answer type of the corresponding
 * prompt, or `symbol` when the user cancels.
 */
type BatchResult<T extends Record<string, BatchItem<unknown>>> = {
	[K in keyof T]: T[K] extends BatchItem<infer V> ? V | symbol : never;
};

/**
 * Run several prompts whose answers DO NOT depend on each other.
 *
 * Interactive mode: prompts run sequentially, one after the other — the same
 * effective behavior as `group()` for independent questions.
 *
 * Agent mode: every unanswered question is emitted as a single block on stdout
 * (one JSON object per line), then the process exits with code `2`. The agent
 * edits `.clack-session.json` to provide answers and re-runs the CLI; already
 * answered items resolve instantly on the next invocation.
 *
 * Each batch item REQUIRES an `id` — there is no `auto:<n>` fallback here,
 * because the batch shape is the protocol contract and stable ids are
 * essential for mapping answers back onto the right key.
 *
 * @example
 * ```ts
 * const basics = await batch({
 *   path: batch.text({ id: 'path', message: 'Where?' }),
 *   install: batch.confirm({ id: 'install', message: 'Install deps?' }),
 * });
 * // basics: { path: string | symbol; install: boolean | symbol }
 * ```
 *
 * @typeParam T - Map of keys to batch items; keys are preserved in the result.
 * @param items - Object whose values are built by `batch.text`, `batch.select`, etc.
 * @returns Promise resolving to a map of `{ key: value }` for each answered prompt.
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
}

batch.text = batchText;
batch.password = batchPassword;
batch.confirm = batchConfirm;
batch.select = batchSelect;
batch.multiselect = batchMultiselect;
batch.autocomplete = batchAutocomplete;
batch.multiline = batchMultiline;
batch.date = batchDate;
