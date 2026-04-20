---
"@posva/clack-core": minor
"@posva/clack-prompts": minor
---

Add agent mode — a resumable protocol for when a clack-powered CLI is driven by an AI agent instead of a human.

Agent mode auto-activates via `std-env`'s `isAgent` (detects Claude Code, Cursor, Aider, and similar tools) — no env var required. Opt in manually with `CLACK_AGENT=1` or `CLACK_AGENT_FILE=<path>`, or disable with `CLACK_AGENT=0`. Test environments (`std-env`'s `isTest`) are auto-excluded so test suites stay interactive even when the runner is invoked by an agent.

When agent mode is active, prompts no longer block on `readline`. Instead they:

- print a short plain-English block on stdout with the `sessionFile` path, an embedded JSON payload for each question, and instructions on the answer shape,
- stash the pending question in the local session file (JSON),
- exit with code `2`.

Each emission is a self-contained text block separated by a blank line. Blocks start with a human-readable lead-in (e.g. `Clack needs 3 answers.`); structured payloads (questions with their `id`, `kind`, `message`, `options`, …) sit on their own lines as single-line JSON objects so an agent can pick them out with a simple `line.startsWith('{')` filter. Non-prompt events use tag-style markers: `[info] …`, `[success] …`, `[task:start] …`, `[task:stop] …`.

The agent writes an answer into the session file and re-runs the CLI. On the next run, answered prompts resolve from the file without blocking; unanswered ones emit their question and exit `2` again. Validation failures exit `3` with a re-emitted question.

New API:

- `@posva/clack-core`: `isAgentMode`, `setAgentMode`, `readSession`, `writeSession`, `getAnswer`, `getSessionFilePath`, `emitQuestion`, `emitQuestions`, `emitError`, `emitLog`, `emitTask`, `exit`, `setExit`, `resetAutoIdCounter`; `id?` + `agent?` options on every prompt.
- `@posva/clack-prompts`: `batch({ key: batch.text({...}) })` for independent questions that should be emitted together.

`group()` keeps its sequential / dependent-answer semantics — unchanged, but now replays answers from the session file in agent mode.

Non-prompt UI (`intro`, `outro`, `note`, `log`, `spinner`, `tasks`) suppresses human output in agent mode and emits `{"clack":"log"|"task",...}` NDJSON instead.

The session file is automatically deleted on clean exit (`code === 0`) once at least one answer has been consumed — so a subsequent run starts fresh. Partial runs (`exit 2` / `exit 3`) preserve the file so the agent's next invocation sees the same pending state. Opt out with `CLACK_AGENT_KEEP_FILE=1` (env) or `setCleanupOnExit(false)` (programmatic).
