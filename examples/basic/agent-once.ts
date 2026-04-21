/**
 * `once()` demo — memoize expensive work across agent replays.
 *
 * Interactive:  `node examples/basic/agent-once.ts`
 * Agent mode:   auto-detected under Claude Code / Cursor / Aider / Codex etc.
 *               Force with `CLACK_AGENT=1`.
 *
 * The scenario: a toy release script that
 *   1. generates a changelog (expensive)
 *   2. asks for the next version (prompt)
 *   3. builds the package (expensive)
 *   4. asks for confirmation to publish (prompt)
 *   5. publishes (side effect)
 *
 * Under an agent, the whole script re-runs on every answer-fill iteration.
 * Without `once()`, steps 1, 3, and 5 would fire on every iteration. Each
 * step here is wrapped in `once(id, fn)` so that on replay the cached result
 * is returned and the body is skipped.
 *
 * Watch for the `[run]` log lines — they only appear on the iteration where
 * the step first executes. On subsequent runs the value is read straight
 * from `./.clack-session.json` (override with `CLACK_AGENT_FILE`).
 */
import { setTimeout as sleep } from 'node:timers/promises';
import * as p from '@posva/clack-prompts';

async function main() {
	p.intro('release (once() demo)');

	// 1. Expensive: generate changelog. Should only print [run] once, ever,
	//    no matter how many times the agent re-runs the script.
	const changelog = await p.once('changelog', async () => {
		console.log('[run] generating changelog…');
		await sleep(200);
		return '## 2.0.0\n- feat: add agent mode\n- feat: add once()';
	});
	p.note(changelog, 'Changelog');

	// 2. Prompt: which version?
	const version = await p.text({
		id: 'version',
		message: 'Publish as which version?',
		placeholder: '2.0.0',
		validate: (v) => (v && /^\d+\.\d+\.\d+/.test(v) ? undefined : 'Use semver like 2.0.0'),
	});
	if (p.isCancel(version)) {
		p.cancel('Aborted.');
		process.exit(0);
	}

	// 3. Expensive: build the package. Distinct ID from step 1.
	const buildInfo = await p.once('build', async () => {
		console.log('[run] building package…');
		await sleep(200);
		return { sha: Math.random().toString(36).slice(2, 10), bytes: 12345 };
	});
	p.log.info(`built ${buildInfo.sha} (${buildInfo.bytes} bytes)`);

	// 4. Prompt: confirm publish?
	const go = await p.confirm({
		id: 'publish',
		message: `Publish v${version}?`,
		initialValue: false,
	});
	if (p.isCancel(go) || !go) {
		p.cancel('Not publishing.');
		process.exit(0);
	}

	// 5. Side effect: publish. Wrapped in once() so that if a LATER prompt
	//    is ever added after this step, the publish won't fire a second time
	//    on the next agent iteration.
	const result = await p.once('publish', async () => {
		console.log('[run] publishing to registry…');
		await sleep(200);
		return { published: true, at: new Date().toISOString() };
	});

	p.outro(`Published v${version} at ${result.at}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
