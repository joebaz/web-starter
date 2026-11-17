# Compact agent context at stage and implementation-cycle handoffs: Implementation Plan

Issue: #109

## Requirements

- Contract: [#109's body](https://github.com/joebaz/web-starter/issues/109), revision `sha256:999e82317f9857f3c2d0e96b1caa336aedf64894772715a623123686dbf7e8d1`. The Maintainer approved it in the Coordinator chat; the pointer is in `.agent-state/109.yaml`.
- Acceptance criteria: AC1–AC4 in that body. Route: Atomic Issue. Baseline: `240ca89`.
- Plan: blob `1f413af` was approved in the Coordinator chat. The Maintainer also authorized the supervised helper below, which compacts the Coordinator after it hands back, and running the tests without individual approvals. Evidence pointers are in `.agent-state/109.yaml`.

## Verified native method

Compaction happens in the same session. A native completion item and the same session ID prove it ran. Record the before and after usage separately: usage that doesn't drop is not, by itself, a failure or a reason to fall back.

- **Codex:** the Paseo MCP `send_agent_prompt` tool, with the exact text `/compact`.
- **Claude:** `env -u PASEO_AGENT_ID paseo send <id> /compact --behavior steer --no-wait`.
  - First check that the agent is idle and has no pending permissions.
  - This path drops the agent attribution, and a human-style send can clear pending permissions. The method states both.
- **Supervised helper:** an active agent can't meet the idle preflight for itself, so a helper compacts the Coordinator.
  - The Coordinator compacts the eligible delegates itself. Before handing back, it starts a helper with no unrelated assignment. The helper edits no files and may capture read-only evidence.
  - The helper compacts only the Coordinator. It waits until the Coordinator is idle with no pending permissions, compacts it, verifies, and sends the bounded recovery check.
  - The helper uses only native completion events: no detached jobs, timers, polling, or wake-ups.
  - The Lifecycle's `compaction` rule sets the helper's participant status and when its assignment closes. A helper may be reused, so there's no fresh agent per cycle.
  - This is native, same-session compaction, not a fresh-session fallback, and it waives no native requirement.
- **Never compact:** stopped or usage-limited agents.

## Operations

### 1. Verify Coordinator compaction through the helper

- Owner: Coordinator, on a disposable Coordinator agent with no issue work.
- Action: the disposable Coordinator arranges a supervised helper and hands back. The helper waits until it is idle with no pending permissions, compacts it by the verified method, and sends the bounded recovery check against a fictional checkpoint. If the preflight can't be met safely, report the limitation; don't bypass it.
- Do not start before: plan approval.
- Evidence: a completion item and the same session ID, the observed before and after usage, and recovery that matches the checkpoint. If any of these is missing, report the concrete limitation and apply operation 5.

### 2. Define compaction in the Lifecycle

- Owner: Coder. File: `docs/lifecycle.yaml`.
- Add one `compaction` section, the only place these rules live:
  - **Boundary:** a stage end, or a cycle end (review or waiver recorded), after the handback is verified and the checkpoint holds the recovery pointers. Interim handbacks, finished turns, and idle agents aren't boundaries.
  - **Owner and order:** the Coordinator runs one transaction per eligible delegated agent, oldest-started first. Its own transaction runs last, through the supervised helper it arranges before handing back, and is verified before continuation.
  - **Transaction:** the native compaction, its verification, one bounded recovery check against the checkpoint, and the bookkeeping that goes with it.
  - **Coincident boundaries:** a completed transaction is reused only when the closures share the same revision and recovery state, with no substantive work in between.
  - **Eligibility:**
    - An agent with an unfinished assignment is deferred. It owes this boundary's transaction, which runs as soon as its handback is verified and recorded, not at a later stage or cycle, unless it is then stopped or usage-limited. An interim handback that owes no boundary transaction triggers none.
    - A stopped or usage-limited agent is excluded and never prompted.
    - The helper's control-only assignment isn't a participant and owes no deferred transaction. It closes once the Coordinator's native completion and recovery are verified, with no further compaction obligation. The helper's agent ID and evidence are kept in the checkpoint.
    - Each case is recorded as an obligation. It closes only after the owed transaction is verified, or when the agent is archived with the exclusion recorded. For a deferred agent, that transaction runs on its recorded handback. For an excluded agent, it runs at an eligible boundary after the agent is resumed.
  - **Failure:**
    - The step that holds the boundary stays current and `failed` under `rules.state`, with the failure in `errors` and an obligation. Unrelated authorized work carries on. There's no automatic retry and no new gate.
    - Recovering one agent closes only that agent's failure. The remaining transactions then resume.
    - The step completes only when every eligible agent has evidence or a recorded exclusion.
- Add a one-line pointer to `compaction` in each stage-closing step and at each cycle-end point. Change no other stage, step, transition, or approval.
- Do not start before: operation 1.

### 3. Coordinator method and recovery pointers

- Owner: Coder.
- `docs/agents/roles/coordinator.md`:
  - Add the verified invocation per provider, the preflight checks, the CLI path's semantics, the verification checks, and how to arrange and brief the supervised helper.
  - Point to `compaction` for the rules.
  - State that a finished turn isn't a boundary.
- `AGENTS.md`: one shared line. After compaction, or when starting from recovery pointers, reload your role SOP and the pointers; don't replay the history.
- `docs/execution-checkpoint.md`: one sentence. At a boundary, the checkpoint holds the recovery pointers: revision, gate, approvals, findings, obligations, and next action. Deferred, excluded, and failed compactions go in `obligations`. No new field.
- Do not start before: operation 2.

### 4. Demonstrate

- Owner: Coordinator runs scratch agents with a fictional checkpoint. The Coder records the results.
- For each provider, record the before and after context, the completion item, the session ID, and recovery against the checkpoint (revision, gate, approvals, findings, obligations).
- Coverage:
  - **Handoffs:** a stage-end and a cycle-end handoff, compaction of the delegates, then the Coordinator last through the helper, and continuation. The helper's assignment then closes with no new obligation.
  - **Overlap:** coincident closures reuse a transaction. Intervening substantive work forces a new one.
  - **Interim vs deferred:** an interim handback that owes nothing causes no compaction. A parallel agent with unfinished work is deferred, then gets its owed transaction once its handback is recorded.
  - **Failure:** the first agent fails, is recovered, then the remaining agents and the Coordinator run, then the step closes.
  - **Exclusions:**
    - A stopped agent is never prompted.
    - Usage limit: a live case if one is available. Otherwise a labelled simulation, reported as "live usage-limit test not performed".
    - A resumed agent whose compaction fails keeps its obligation open.
- Do not start before: operation 3.
- Evidence: a results table in chat. It states observed context only, with no cost claims.

### 5. New-session fallback (conditional)

- Only for a concrete limitation that remains after operation 1 or 4, and only after the Maintainer decides it.
- The replacement agent's recovery must be verified before the original is archived. Its evidence proves only the handoff. It is never reported as native compaction, and the native-compaction criteria stay unmet unless the Maintainer explicitly changes the requirements.

## Validation and hand back

- Scope:
  - implementation files `docs/lifecycle.yaml`, `docs/agents/roles/coordinator.md`, `AGENTS.md`, and `docs/execution-checkpoint.md`;
  - Task Artifact: this plan;
  - local record: `.agent-state/109.yaml`.
- Checks:
  - `npm run format:check` and `git diff --check` pass.
  - `git status --short --untracked-files=all` shows only the files in scope.
  - `rg -n -i compact docs AGENTS.md` finds the rules only in `docs/lifecycle.yaml`, with pointers elsewhere.
- Review: an independent Reviewer traces AC1–AC4 to the diff and the operation 4 evidence.
- Hand back: the diff, the check results, and the results table go to the Coordinator.
