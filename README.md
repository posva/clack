<br />
<br />

<div align="center">
    <img alt="Clack logo" src="/.github/assets/clack.png?sanitize=true" width="320">
</div>
<h2 align="center">stylish interactive prompts for JavaScript CLIs</h3>

<h4 align="center"><a href="packages/prompts#readme"><code>@clack/prompts</code></a>: opinionated, ready-to-use prompt components</h4>

<h4 align="center"><a href="packages/core#readme"><code>@clack/core</code></a>: headless, unstyled prompt primitives</h4>

<br />
<br />

<h3 align="center"><a href="https://bomb.sh/docs/clack/basics/getting-started/">Read the docs</a></h3>

<br />

---

## This is a fork of [bombshell-dev/clack](https://github.com/bombshell-dev/clack)

It adds **agent mode** — a resumable protocol for when a clack-powered CLI is
driven by an AI agent (Claude Code, Cursor, Aider, Codex, …) instead of a human.
Upstream clack blocks on `readline` waiting for a keypress; under an agent that
keypress never comes and the CLI hangs.

### What changes in agent mode

- Auto-detected via [`std-env`](https://github.com/unjs/std-env)'s `isAgent`.
  No env var required inside Claude Code / Cursor / Aider / Codex etc.
  Force with `CLACK_AGENT=1`, disable with `CLACK_AGENT=0`.
- Each prompt prints a short plain-English block on stdout with the question as
  a single-line JSON payload, records the pending question to
  `./.clack-session.json`, and exits with code `2`.
- The agent writes an answer into the session file and re-runs the CLI. Known
  answers resolve instantly; the next unknown prompt is emitted the same way.
- Independent questions can be emitted as a single batch via `batch()` so the
  agent answers them in one round-trip. `group()` keeps its sequential /
  dependent-answer semantics.
- On clean exit (`code 0`), the session file is deleted so the next invocation
  starts fresh. Preserve it for debugging with `CLACK_AGENT_KEEP_FILE=1`.
- All human output (colors, boxes, spinners, cursor moves) is suppressed in
  agent mode. Non-prompt events use tag markers: `[info]`, `[success]`,
  `[task:start]`, …

### Try it

```bash
pnpm install
pnpm build
AI_AGENT=claude node examples/basic/agent-mode.ts
```

See [`examples/basic/agent-mode.ts`](examples/basic/agent-mode.ts) and the
agent-mode changeset in [`.changeset/agent-mode.md`](.changeset/agent-mode.md)
for the full protocol.
