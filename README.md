<br />
<br />

<div align="center">
    <img alt="Clack logo" src="/.github/assets/clack.png?sanitize=true" width="320">
</div>
<h2 align="center">stylish interactive prompts for JavaScript CLIs — now agent-aware</h3>

<h4 align="center"><a href="packages/prompts#readme"><code>@posva/clack-prompts</code></a>: opinionated, ready-to-use prompt components</h4>

<h4 align="center"><a href="packages/core#readme"><code>@posva/clack-core</code></a>: headless, unstyled prompt primitives</h4>

<br />

> **This is a fork of [bombshell-dev/clack](https://github.com/bombshell-dev/clack).**
> It adds **agent mode**: a resumable protocol for when a clack-powered CLI is
> driven by an AI agent (Claude Code, Cursor, Aider, Codex, …) instead of a human.
> Upstream clack blocks on `readline` waiting for a keypress; under an agent
> that keypress never comes and the CLI hangs. This fork fixes that without
> changing the interactive UX for humans.

Humans still get the same stylish TUI. Agents get a plain-English + JSON
protocol on stdout and a local session file they write answers into.

---

## Install

### New project — use the fork directly

```bash
pnpm add @posva/clack-prompts
# or: npm install @posva/clack-prompts
# or: yarn add @posva/clack-prompts
```

```ts
import * as p from '@posva/clack-prompts';
```

### Existing project — swap upstream clack in place (no code changes)

If your project already `import`s `@clack/prompts`, keep the imports and alias
the install so you don't have to edit a single line:

```bash
# pnpm
pnpm add @clack/prompts@npm:@posva/clack-prompts

# npm
npm install @clack/prompts@npm:@posva/clack-prompts

# yarn
yarn add @clack/prompts@npm:@posva/clack-prompts
```

Your existing `import ... from '@clack/prompts'` keeps working. Run your CLI
from a terminal and it's interactive as before. Run it under an agent and
it enters agent mode automatically.

> The same alias trick works for `@clack/core` if you depend on it directly:
> `pnpm add @clack/core@npm:@posva/clack-core`.

---

## Agent mode at a glance

- **Auto-detected** via [`std-env`](https://github.com/unjs/std-env)'s `isAgent`.
  No env var needed inside Claude Code / Cursor / Aider / Codex, etc.
  Force with `CLACK_AGENT=1`; disable with `CLACK_AGENT=0`.
- Each prompt prints a short plain-English block on stdout with the question as
  a single-line JSON payload, records the pending question to
  `./.clack-session.json`, and exits with code `2`.
- The agent writes an answer into the session file and re-runs the CLI. Known
  answers resolve instantly; the next unknown prompt is emitted the same way.
  Validation failures exit `3` with a re-emitted question.
- Independent questions can be emitted as a single batch via `batch()` so the
  agent answers them in one round-trip. `group()` keeps its sequential /
  dependent-answer semantics and replays answers from the session file.
- On clean exit (`code 0`) the session file is deleted so the next invocation
  starts fresh. Preserve it for debugging with `CLACK_AGENT_KEEP_FILE=1`.
- All human output (colors, boxes, spinners, cursor moves) is suppressed in
  agent mode. Non-prompt events use tag markers: `[info]`, `[success]`,
  `[task:start]`, `[task:stop]`, …

---

## Try it — any existing clack CLI gains agent mode for free

[`examples/basic/index.ts`](examples/basic/index.ts) is the canonical `create-app`
demo from upstream clack: `intro` → `group()` of `text`/`password`/`select`/
`multiselect`/`confirm` → `spinner` → `note` → `outro`. It didn't need a single
line changed for agent mode to work.

**Interactive (terminal):**

```bash
pnpm install
pnpm build
node examples/basic/index.ts       # same stylish TUI as upstream
```

**Agent mode (simulate a harness):**

```bash
AI_AGENT=claude node examples/basic/index.ts
```

You'll see something like:

```
[info]  create-app

Clack needs 1 answer. Write it into /path/to/.clack-session.json and re-run this command.

Question:
{"id":"auto:0","kind":"text","message":"Where should we create your project?","placeholder":"./sparkling-solid","required":true}

Add to "answers.auto:0" in the session file one of:
  {"value": <your answer>}   or   {"cancelled": true}
```

The agent edits `.clack-session.json`, re-runs the command, and the next
unknown prompt is emitted. When every prompt is answered, exit code `0` and
the session file is cleaned up.

**Tips for authors**
- Give prompts a stable `id` (e.g. `p.text({ id: 'path', message: ... })`)
  instead of relying on the positional `auto:<n>` fallback — it's more robust
  across branching flows.
- Use `batch()` when several prompts don't depend on each other, so the agent
  can answer them in one round-trip instead of re-invoking per prompt. See
  [`examples/basic/agent-mode.ts`](examples/basic/agent-mode.ts).
- Use `once()` to wrap expensive or side-effectful steps so they don't re-run
  on every agent iteration. See
  [`examples/basic/agent-once.ts`](examples/basic/agent-once.ts).

---

## `batch()` and `once()`

Two small primitives that make agent mode a lot less chatty. Both are no-ops
for the human flow — `batch()` runs sequentially in a real terminal, `once()`
just calls the function every time.

### `batch()` — ask independent questions in one round-trip

In interactive mode, `batch()` runs each prompt sequentially (same effective
behavior as `group()` for independent questions). In agent mode, every
unanswered question is emitted as a single NDJSON payload and the process
exits with code `2` — so the agent fills all of them in one edit of the
session file instead of re-invoking the CLI once per question.

Each item **requires** a stable `id`; there is no `auto:<n>` fallback here,
because the batch shape is the protocol contract.

```ts
import * as p from '@posva/clack-prompts';

// 1. Independent questions — batched in agent mode.
const basics = await p.batch({
  path: p.batch.text({
    id: 'path',
    message: 'Where should we create your project?',
    placeholder: './my-app',
    required: true,
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

// 2. Dependent question — stays sequential. Its message references `basics.path`,
//    so it can only be asked *after* path is known. Don't put it in the batch.
const type = await p.select({
  id: 'type',
  message: `Pick a project type for "${basics.path}"`,
  initialValue: 'ts',
  options: [
    { value: 'ts', label: 'TypeScript' },
    { value: 'js', label: 'JavaScript' },
  ],
});
```

Available batch constructors: `batch.text`, `batch.password`, `batch.confirm`,
`batch.select`, `batch.multiselect`, `batch.autocomplete`, `batch.multiline`,
`batch.date`. Full demo:
[`examples/basic/agent-mode.ts`](examples/basic/agent-mode.ts).

### `once()` — memoize expensive steps across agent replays

Under an agent, the whole script re-runs on every answer-fill iteration. Any
expensive work — generating a changelog, building a package, publishing to a
registry — would fire again every time. `once(id, fn)` caches the resolved
value under `steps[id]` in `.clack-session.json`; on the next iteration the
cached value is returned and `fn` is not invoked.

- Return values must be JSON-serializable (same rule as prompt answers).
- Errors are **not** cached: a thrown error propagates and the next call retries.
- Outside agent mode, `fn` runs on every call — `once()` is transparent for humans.

```ts
import * as p from '@posva/clack-prompts';

// 1. Expensive step — runs once, cached under steps.changelog.
const changelog = await p.once('changelog', async () => {
  console.log('[run] generating changelog…');
  return '## 2.0.0\n- feat: add agent mode';
});
p.note(changelog, 'Changelog');

// 2. Prompt in between — may re-run the script under an agent.
const version = await p.text({
  id: 'version',
  message: 'Publish as which version?',
  placeholder: '2.0.0',
});

// 3. Side effect — wrap it so a later-added prompt can't make this fire twice.
const result = await p.once('publish', async () => {
  console.log('[run] publishing to registry…');
  return { published: true, at: new Date().toISOString() };
});

p.outro(`Published v${version} at ${result.at}`);
```

The `[run]` logs only appear on the iteration where each step first executes;
on every replay the value is read straight from the session file. Full demo:
[`examples/basic/agent-once.ts`](examples/basic/agent-once.ts).

---

## Docs

Upstream prompts & options: <https://bomb.sh/docs/clack/basics/getting-started/>
(every API surface is preserved; see [the agent-mode changeset](.changeset/agent-mode.md)
for the additions.)
