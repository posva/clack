/**
 * Agent-mode demo.
 *
 * Interactive:  `node examples/basic/agent-mode.ts`
 * Agent mode:   auto-detected under Claude Code / Cursor / Aider / Codex etc.
 *               Force with `CLACK_AGENT=1`.
 *
 * Under an agent, each prompt serializes as a TOON document on stdout and
 * exits with code 2. The agent writes answers to `./.clack-session.json`
 * (override via `CLACK_AGENT_FILE`) and re-runs until exit 0. On a clean exit
 * (code 0) the session file is deleted — set `CLACK_AGENT_KEEP_FILE=1` to
 * preserve it for debugging.
 *
 * This example demonstrates:
 *
 *   1. `batch()` — emits several independent questions in one
 *      `clack: questions` payload so the agent answers them in one round-trip.
 *
 *   2. A plain dependent prompt (`select`) — stays sequential because its
 *      message references a prior answer.
 */
import * as p from '@clack/prompts';
import { resolve } from 'node:path';

async function main() {
	p.intro('create-app (agent-mode demo)');

	// === 1. Independent questions — batched in agent mode ===
	// None of these depend on the others, so they can all be asked at once.
	const basics = await p.batch({
		path: p.batch.text({
			id: 'path',
			message: 'Where should we create your project?',
			placeholder: './my-app',
			required: true,
			validate: (v) => {
				console.log('validating path', { v });
				const p = v?.trim()
				if (!p) return 'Please enter a path.';
				try {
					resolve(p);
				} catch {
					return 'Invalid path.';
				}
			},
		}),
		install: p.batch.confirm({
			id: 'install',
			message: 'Install dependencies?',
			initialValue: true,
		}),
		telemetry: p.batch.confirm({
			id: 'telemetry',
			message: 'Send anonymous telemetry?',
			initialValue: false,
		}),
	});

	if (p.isCancel(basics.path)) {
		throw new Error('Cancelled at path question');
	}

	// === 2. Dependent question — sequential ===
	// This prompt's message uses `basics.path`, so it can only be asked *after*
	// path is known. Use a plain `select()` rather than putting it in the batch.
	const type = await p.select({
		id: 'type',
		message: `Pick a project type for "${basics.path}"`,
		initialValue: 'ts',
		options: [
			{ value: 'ts', label: 'TypeScript' },
			{ value: 'js', label: 'JavaScript' },
		],
	});

	p.outro(
		`done — path=${JSON.stringify(basics.path)} type=${JSON.stringify(
			type
		)} install=${basics.install} telemetry=${basics.telemetry}`
	);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
