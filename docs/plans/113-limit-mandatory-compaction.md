# Limit mandatory compaction to delegated work boundaries: Implementation Plan

Issue: #113

## Requirements

- Approved requirements: [#113's body](https://github.com/joebaz/web-starter/issues/113), revision `sha256:6ee4edc02fc36bb6cb22a2c2b2ac21fdbfcf26a1335dd723d22b4c6fe8a8fba6`, approved by the Maintainer as one Atomic Issue (Q1=A) in the Coordinator chat. The pointer is in `.agent-state/113.yaml`. Baseline: `be455f8`.
- Acceptance criteria: the body's "What does success look like?" and "What must stay the same?" lists.
- Readings recorded at `readiness-confirmation`:
  - "Implementation-cycle" boundaries mean every cycle end under `rules.cycles`, including the parent spec-review and plan-review cycles. All of them stay.
  - A delegate's transaction that is still owed when Publish or Retro starts stays owed. It runs on that delegate's verified hand back, even during Publish or Retro. Closing Publish or Retro never triggers one.
  - Stopped and usage-limited agents stay excluded under the existing rules. An excluded delegate resumed after Implement closes has no eligible boundary left, so its obligation closes when it is archived with the exclusion recorded.

## Operations

### 1. Narrow the Lifecycle policy

- Owner: Coder.
- Files and actions: `docs/lifecycle.yaml`:
  - `compaction.boundary`: a boundary is the close of Define, Plan or Implement, or a cycle's end under `rules.cycles`. Closing Publish or Retro, including a skipped Retro, isn't a boundary.
  - `compaction.participants`: state that the Coordinator isn't a participant and that provider auto-mode manages its context. Delete the helper item.
  - `compaction.order`: delete the item about the Coordinator's own transaction and the helper.
  - `compaction.transaction`: drop the helper's agent ID from the evidence item.
  - `compaction.failure`: drop "the Coordinator's last" and "and the Coordinator", so that remaining transactions resume in order and the step completes when every eligible delegate is verified, deferred or excluded.
  - Delete the compaction pointer from `merge-confirmation`, `parent-outcome-acceptance` and `retro-close`.
  - Leave every other pointer, stage, step, transition, approval and `compaction` item as it is, including deferral, exclusion, coincident boundaries, failure and fallback.
- Do not start before: plan approval.
- Output and handoff: the edited file, which operation 2 builds on.
- Check: `grep -n -i "compaction" docs/lifecycle.yaml`, expecting pointers only at the two stage closes for Define and Plan, the Implement close (`implementation-evidence`) and the four cycle-end points (`parent-spec-review`, plan review, waiver, independent review), and no `helper` or "Coordinator's" in `compaction`.

### 2. Align the Coordinator method and checkpoint guidance

- Owner: Coder.
- Files and actions:
  - `docs/agents/roles/coordinator.md`:
    - Delete "Compact yourself through a helper".
    - In "Compact agent context", state that the method applies to delegated agents, and keep "Check before sending", "Compact" and "Verify" otherwise unchanged.
  - `docs/execution-checkpoint.md`: limit the compaction paragraph to required delegate transactions. Normal checkpoint updates, and recovery after any compaction (including provider auto-compaction under `AGENTS.md`), stay as they are.
- Do not start before: operation 1.
- Output and handoff: the edited files, which go to operation 3.
- Check: `grep -rn -i "helper\|Coordinator's own\|Coordinator's last\|compact yourself" docs/lifecycle.yaml docs/agents docs/execution-checkpoint.md AGENTS.md`, expecting no compaction hits; `git diff --exit-code be455f8 -- AGENTS.md docs/plans/109-compact-agent-context.md`, expecting no output.

### 3. Walk through the paths

- Owner: Coder, recording results for the Reviewer.
- Files and actions: none. Read the edited policy and method, and record the following for each path: the step, the rule that applies, and the result.
  - **Publish close:** both `merge-confirmation` (Atomic) and `parent-outcome-acceptance` (Parent) close with no transaction and no helper.
  - **Retro close:** completed or skipped, `retro-close` runs no transaction.
  - **Delegate boundaries:** at the Define, Plan and Implement closes and at every `rules.cycles` end (parent spec review, plan review, waiver, independent review), each eligible delegate gets a transaction, oldest-started first, and the Coordinator gets none.
  - **Coincident boundaries:** an Implement cycle end and the Implement close share one transaction only under the existing same-revision rule.
  - **Interim and deferral:** an interim hand back triggers nothing. A delegate deferred at the Implement close gets its owed transaction on a hand back during Publish or Retro, and `retro-close` waits on that open obligation.
  - **Exclusion:** stopped or usage-limited delegates get no prompt, resumes stay with the Maintainer, and the obligation closes as recorded in the Requirements readings.
  - **Failure:** after a failed delegate transaction is recovered, the remaining delegate transactions resume in order. The step completes with no Coordinator-last dependency.
  - **Native evidence:** the verified Define transaction for Planner `03222a2c-f142-46d3-9be4-fd1a0d5e85a2` in `.agent-state/113.yaml` and `.agent-state/113-define-planner-native.json` shows a live delegate transaction under the unchanged method. No merge, Retro run or disposable helper is needed.
- Do not start before: operation 2.
- Output and handoff: a walkthrough record in the hand back to the Coordinator.
- Check: every path above is recorded, and each result matches the approved requirements.

## Parallel read-only work

- None.

## Final validation and hand back

- Scope: implementation files `docs/lifecycle.yaml`, `docs/agents/roles/coordinator.md`, `docs/execution-checkpoint.md`; Task Artifacts `docs/plans/113-limit-mandatory-compaction.md`; local records `.agent-state/113.yaml`, `.agent-state/113-define-planner-native.json`, confirmed with `git check-ignore`. No dependency changes.
- Checks:
  - `npm run format:check`, `npm run lint`, `npm run check`, `npm test` and `npm run build`, as CONTRIBUTING requires for a `fix`, each passing.
  - `git diff --check`, `git diff` and `git status --short --untracked-files=all`, showing only the scope above.
  - `git diff --no-index -- /dev/null docs/plans/113-limit-mandatory-compaction.md` for the plan file.
  - Operations 2 and 3 replace the website UI checks: the documentation changes no page.
- Hand back: the Coder sends the diff, the check output and the walkthrough record to the Coordinator for independent review.

## Maintainer feedback and decisions

- Q1=A, Coordinator chat, 2026-11-17: #113 as written, one Atomic Issue; affects all operations.

## Review findings

- None yet.
