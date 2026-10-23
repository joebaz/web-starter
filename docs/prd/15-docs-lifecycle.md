# Docs lifecycle spec (draft)

> **Draft for inline Maintainer review. Not approved.** This spec, a Design Doc in glossary terms, pulls together the [#15] interview so far. It does not make the issue ready for an agent, and it authorizes no implementation. [#15] remains the tracking authority for requirements, decisions, and status.
>
> AGREED items describe the future direction of the lifecycle. They don't replace the current role SOPs, which govern all work, including this issue's, until an approved implementation changes them.
>
> This file is an exception the Maintainer requested, so the draft can be iterated through file diffs. The [issue tracker](../agents/issue-tracker.md) and [Domain docs](../agents/domain.md) guides currently keep specs and unresolved questions in GitHub Issues; aligning this file with them is an open item. The Coordinator chose its location provisionally, and the repository has no artifact policy. The path keeps `prd` until the revisions settle ([O3](#open-decisions)).

## How to read this draft

Each decision has one of three statuses:

- **AGREED:** the Maintainer approved it in the [#15] issue body or interview.
- **PROPOSED:** drafted for review. It may include elements the Maintainer requested, but it is not approved as written.
- **OPEN:** undecided. See [Open decisions](#open-decisions).

An AGREED stage can still contain PROPOSED details; those details are tagged where they appear. To comment, cite the reference: agreed decisions `A1`–`A12`, stage steps such as `4.3`, reentry rules `G1`–`G5`, CI failure steps `F1`–`F3`, acceptance criteria `AC1`–`AC9`, and open decisions `O1`–`O11`. Retired references (`2.7`, `3.2`, `3.4`, `O5`, and `O6`) aren't reused, so earlier comments keep their meaning. These labels are for review only. The ID format for the lifecycle definition is open ([O1](#open-decisions)).

## Problem

The [Coordinator SOP](../agents/roles/coordinator.md) covers startup, readiness, and review cycles. No single definition says which stages an issue passes through, where each one starts and ends, or what evidence completes it. That leaves three gaps:

1. **Completion was mistaken in [#38].** Architect assessments did happen in #38, including one after independent review. The failure was timing. The Coordinator treated the Reviewer's acceptance as the last review and marked the task plan complete without a separate final Maintainer acceptance. It then began the commit and PR handoff, so the Maintainer had to request the Architect assessment after accepting the change. The session plan had combined validation, independent review, and final assessment into one item. The [Architect SOP](../agents/roles/architect.md)'s phrase "after the change's last review" doesn't distinguish the independent review from the Maintainer's. The [#38 retrospective][#15-retro] records the details.
2. **Requirements have no defined route to approval.** [coding-standards.md](../../coding-standards.md#scope-and-project-choices) tells agents to flag missing decisions and scope changes, but nothing defines how those discussions become approved task requirements.
3. **Oversight is implicit.** The Coordinator SOP asks the Coordinator to settle conflicts and report milestones. It never asks the Coordinator to check ongoing work against the approved requirements and plan, so omissions surface only when the Maintainer notices them.

## Goal

Define, implement, and test the lifecycle for Docs work as one thin vertical slice. The result is a canonical sequence of stages that tells any role where an issue stands, what comes next, and what evidence completes each step. Trial it end to end on a real Docs issue. Add workflow variations only where the trial shows a need.

[#15] covers all three parts: this spec, the operational YAML and SOP implementation, and the trial. No separate implementation issue is proposed. The agreed direction is to finish this spec, implement the workflow and merge it into `main`, then have a fresh agent run [#63] against the merged references. The trial's observations and its Retro feed later improvements. How #15 stays open across the implementation PR, given the `Closes #N` rule in [Open a pull request](../../CONTRIBUTING.md#open-a-pull-request), is open ([O10](#open-decisions)).

## Agreed decisions

- **A1 Scope:** Limit this work to the Docs workflow. Propose separate issues for Content, Fix, or Feature variations only when trial evidence shows a concrete need.
- **A2 Stages:** Define, Plan, Implement, Review, Publish, and Retro, in that order. Publish completes when the Maintainer confirms the merge and the Coordinator closes Stage 5 (5.6). Retro completes the lifecycle (6.3).
- **A3 Canonical definition:** A YAML definition holds the stage order, conditional transitions, stable stage and step IDs, explicit entry, exit, and completion conditions, roles, and evidence references. Its representation, location, and schema are open ([O1](#open-decisions)). No schema validator, hook, or workflow engine is approved.
- **A4 Where things live:** Role Markdown keeps each role's responsibilities, authority, methods, constraints, inputs, outputs, and references. [CONTRIBUTING.md](../../CONTRIBUTING.md) keeps contribution mechanics and checks. The coding standards and the [QA reference](../qa.md) keep their own subjects.
- **A5 Runtime state:** Each issue's execution state stays logically separate from the reusable definition. The [execution checkpoint](#execution-checkpoint-and-recovery-proposed) proposes a form for it; where it is stored is open ([O2](#open-decisions)).
- **A6 Planner and Coordinator split:** The Planner runs both the requirements interviews and the implementation plan. The Coordinator handles startup and readiness, the handoff to the Planner, stage transitions, dispatch, and [oversight](#coordinator-oversight). This changes the current Coordinator steps for grilling `needs-triage` issues and for [planning the work](../agents/roles/coordinator.md#plan-the-work).
- **A7 Oversight:** The Coordinator provides continuous second-pair-of-eyes oversight across all issue work, as described in [Coordinator oversight](#coordinator-oversight).
- **A8 Task tracking:** Native task tools (`update_plan` in Codex; `TaskCreate` and `TaskUpdate` in Claude Code) show the applicable steps of the active stage. The lifecycle is tracked separately enough that a session can't mark it finished early. The exact representation is open ([O9](#open-decisions)).
- **A9 Artifacts:** Create task artifacts, such as this spec, only when the work needs them. There is no central project-reference catalogue. Agent-facing instructions and project-owned references stay in the repository, and the Wiki stays the human checklist.
- **A10 Changed requirements:** Reuse the existing protocol from #17 in [When approved requirements change](../agents/roles/coordinator.md#when-approved-requirements-change) and in AGENTS.md. Don't add a new skill.
- **A11 Related issues:** [#35] (reporting), [#48] (enforcement), and [#63] (classification) stay separate. #17 and #18 are closed. Where #18's historical proposals conflict with current rules (a human-only PR rather than a PR opened by the Coordinator, or parallel edits rather than one writer), the current rules apply.
- **A12 Automation:** Don't open speculative automation issues. Open enforcement follow-ups only for needs observed in the trial or the retro, and only when the Maintainer decides to. [#65] is an exception the Maintainer explicitly requested: a display test, not enforcement, and blocked by #15.

## Lifecycle stages

| Stage        | Completes when                              | Status                                                        |
| ------------ | ------------------------------------------- | ------------------------------------------------------------- |
| 1. Define    | The Coordinator closes Stage 1 (1.5)        | AGREED                                                        |
| 2. Plan      | The Coordinator closes Stage 2 (2.6)        | Role split and 2.4–2.6 AGREED; 2.1–2.3 PROPOSED               |
| 3. Implement | The Coordinator closes Stage 3 (3.5)        | AGREED                                                        |
| 4. Review    | Evidence matches the current revision (4.6) | Steps AGREED; reentry gate PROPOSED                           |
| 5. Publish   | The Maintainer confirms the merge (5.6)     | Happy path AGREED; CI failure path PROPOSED; other paths OPEN |
| 6. Retro     | The Coordinator closes Stage 6 (6.3)        | Steps AGREED; skill and cleanup details OPEN                  |

### Stage 1: Define (AGREED)

Entry (PROPOSED): the Maintainer starts a Coordinator on an issue.

1. **1.1** The Coordinator checks startup conditions and readiness. This keeps the existing [Start](../agents/roles/coordinator.md#start) steps: fetch `origin/main` and bring an unstarted branch up to date, stop if the branch has uncommitted changes or commits of its own, move the issue to "In progress", and start task tracking. It also keeps [Check that the issue is ready](../agents/roles/coordinator.md#check-that-the-issue-is-ready).
2. **1.2** The Coordinator sends a `needs-triage` or otherwise unready issue to the Planner and names the gaps.
3. **1.3** The Planner interviews the Maintainer and records the agreed requirements in the issue. This includes exact glossary and ADR proposals and the contradiction scan from the [Planner SOP](../agents/roles/planner.md). [Triage label](../agents/triage-labels.md) rules still apply.
4. **1.4** The Maintainer reviews the requirements. Changes needed: go to 1.3. Accepted: go to 1.5.
5. **1.5** The Coordinator confirms the issue is ready, closes Stage 1, and opens Stage 2.

An issue that is already approved and ready skips 1.2–1.4, with no repeat interview or permission. Moving to Plan relies on the existing authorization; it needs no separate approval.

### Stage 2: Plan (role split and 2.4–2.6 AGREED; 2.1–2.3 PROPOSED)

Entry: 1.5 opens this stage.

1. **2.1** The Coordinator briefs the Planner on the approved requirements, artifacts, and constraints.
2. **2.2** The Planner builds the implementation plan: affected files, sequence, role assignments, dependencies, handoffs, and validation evidence.
3. **2.3** The Coordinator asks an Architect to assess the plan.
4. **2.4** The Planner reviews the Architect's recommendations. In scope: the Planner revises the plan. Out of scope: the Planner refers them to the Coordinator, who brings them to the Maintainer.
5. **2.5** Only when out-of-scope recommendations are pending, the Maintainer reviews them. Approved: the Planner revises the plan as in 2.4. Rejected: continue to 2.6. Each decision is recorded, so an approved recommendation isn't sent back for approval. When one changes approved requirements, A10 applies.
6. **2.6** The Coordinator closes Stage 2 and opens Stage 3.

Step 2.7 is retired. The Coordinator's ongoing readiness and adherence checks ([Coordinator oversight](#coordinator-oversight)) replace the earlier plan check, and 3.1 briefs the Coder, so there is no separate dispatch step. Apart from 2.5, no step adds an approval. Where the plan is recorded is open, because the Planner SOP keeps the Planner out of repository files ([O4](#open-decisions)).

### Stage 3: Implement (AGREED)

Entry: 2.6 opens this stage. 4.3, 4.4, 4.5, and F2 reopen it at 3.1 through the [reentry gate](#reentry-gate).

1. **3.1** The Coordinator briefs the Coder on the requirements, plan, references, and assignment.
2. **3.3** The Coder implements the Maintainer's change and validates it as the plan and the repository's [validation requirements](../../CONTRIBUTING.md#validate-your-change) require.
3. **3.5** The Coordinator closes Stage 3 and opens Stage 4.

Steps 3.2 (input checks) and 3.4 (routine handback) are retired. The [Coder SOP](../agents/roles/coder.md) still requires validation and a report of the results, so removing these lifecycle steps removes no evidence. The Coder's self-validation and the Reviewer's independent review are separate. Oversight runs throughout the stage; it isn't a serial review step.

### Stage 4: Review (steps AGREED; reentry gate PROPOSED)

Entry: 3.5 opens this stage.

1. **4.1** The Coordinator dispatches an independent Reviewer.
2. **4.2** The Reviewer checks the change, runs the applicable checks, and reports findings and a recommendation.
3. **4.3** The Coordinator acts on the report. Findings: reopen Stage 3 at 3.1 through the [reentry gate](#reentry-gate), which includes the five-cycle limit. No issues: go to 4.4.
4. **4.4** The Maintainer reviews the file diffs. Changes needed: the Maintainer leaves inline comments and commits a checkpoint of the current change; reopen Stage 3 at 3.1 through the reentry gate. No changes: the Maintainer makes the final commit and gives final sign-off; go to 4.5.
5. **4.5** The Coordinator dispatches an Architect to assess the signed-off commit and takes the recommendations to the Maintainer. Authorized changes: reopen Stage 3 at 3.1 through the reentry gate, as in 4.3 and 4.4. No changes: go to 4.6.
6. **4.6** The Coordinator confirms that the review, sign-off, and evidence all match the current revision, then closes Stage 4 and opens Stage 5.

AGREED constraint: the Reviewer's handoff can't complete the Review stage or the lifecycle.

### Reentry gate

Every return to 3.1, from 4.3, 4.4, 4.5, or F2, passes this gate.

Existing policy (AGREED to keep): the current [Run the work](../agents/roles/coordinator.md#run-the-work) rules stay in force. Each review cycle needs the Maintainer's approval. An issue runs at most five cycles, and more need the Maintainer's approval. No automatic authorization for fixes is approved.

How the lifecycle represents that policy (PROPOSED):

- **G1** A cycle is one round of changes followed by one independent review, as the Coordinator SOP defines it.
- **G2** A Maintainer request for changes authorizes the matching ordinary cycle. That covers 4.4, a recommendation the Maintainer authorizes in 4.5, and a fix the Maintainer authorizes in F2.
- **G3** Reviewer findings (4.3) reopen Stage 3 only after the Maintainer's go-ahead.
- **G4** A sixth or later cycle needs an explicit extension from the Maintainer.
- **G5** Reopening a stage doesn't reset the cycle count.

### Stage 5: Publish (happy path AGREED)

Entry: 4.6 opens this stage.

1. **5.1** The Maintainer pushes to the remote.
2. **5.2** The Coordinator creates the PR, following [Open a pull request](../../CONTRIBUTING.md#open-a-pull-request). On a return to Publish, the Coordinator reuses the existing PR (F2).
3. **5.3** GitHub runs CI. Passes: go to 5.4. Fails: follow the [CI failure path](#ci-failure-path-proposed).
4. **5.4** The Maintainer merges into `main`.
5. **5.5** GitHub deletes the remote branch.
6. **5.6** The Maintainer confirms the merge. The Coordinator closes Stage 5 and opens Stage 6.

#### CI failure path (PROPOSED)

This answers the Maintainer's question about failures. It isn't a chosen process, and no commands were run for this draft.

- **F1** The Coordinator diagnoses the failure.
- **F2** If a file change is needed, Stage 3 reopens at 3.1 through the [reentry gate](#reentry-gate). Review then repeats in full: independent review, the Maintainer's final acceptance, and the final Architect assessment. The Maintainer pushes the new revision to the same PR, and CI runs again.
- **F3** If the failure is transient and needs no file change, CI can run again on the same commit, and the issue stays in Publish.

Other failure paths, such as PR review asking for changes or a pushed revision that differs from the signed-off commit, remain open. So does the evidence for each step ([O7](#open-decisions)).

### Stage 6: Retro (steps AGREED; skill and cleanup details OPEN)

Entry: 5.6 opens this stage.

Purpose (AGREED): analyze what worked and what didn't, and identify improvements, including chances for mechanical enforcement that the trial actually showed.

1. **6.1** The Coordinator runs the retro skill (`/retro`).
2. **6.2** The Maintainer reviews the recommendations. For each one approved, the Coordinator drafts a GitHub issue, and creates it only after the Maintainer approves the exact draft.
3. **6.3** The Coordinator closes Stage 6 and tells the Maintainer the worktree is ready to archive. This is a notification: the Coordinator neither cleans up nor waits for the archive.

Findings alone authorize no workflow changes, and the Retro opens no speculative enforcement issues (A12). The Maintainer's existing retro skill is the candidate for 6.1, without its conflicting tool instructions. Which skill to use, how findings are shared, and the cleanup details are open ([O8](#open-decisions)). No retro runs as part of this draft.

#### Worktree cleanup (PROPOSED)

This is a recommendation, not an adopted process. No commands were run for this draft.

- **Archive after the merge.** The Maintainer archives the worktree once the results, follow-ups, and evidence are kept outside it. Before archiving, check for uncommitted or local-only work and preserve anything needed outside the worktree.
- **Archiving removes the worktree.** In Paseo, archiving the last workspace runs its teardown and removes the managed worktree ([Paseo worktrees](https://paseo.sh/docs/worktrees)). Whether it protects a dirty worktree, and whether it deletes the local branch, aren't confirmed.
- **Remote deletion isn't local cleanup.** GitHub's automatic deletion removes only the PR's remote head branch ([GitHub docs](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-the-automatic-deletion-of-branches)). Git removes a worktree with `git worktree remove` and clears records of deleted ones with `git worktree prune` ([git-worktree](https://git-scm.com/docs/git-worktree)).
- **Inspect the local branch separately, afterward.** After a squash merge, `git branch -d` may refuse because the branch's commits aren't in `main`; `-D` deletes it regardless ([git-branch](https://git-scm.com/docs/git-branch)). This spec requires neither.
- **Durability:** a committed and merged file survives cleanup. An execution checkpoint kept only in the worktree doesn't survive its deletion.

## Coordinator oversight

AGREED. Across all issue work, the Coordinator:

- compares what is happening with the lifecycle, the approved requirements, and the implementation plan
- checks readiness and adherence to the plan before each stage transition
- catches omissions and deviations, and resolves them directly with the agents involved when the approved materials already answer them
- pauses the affected work and flags the Maintainer when a new approach, scope, acceptance criterion, or recorded decision is needed; the Planner revises the plan if necessary
- makes sure every affected agent receives the change, through the protocol in A10

Oversight doesn't repeat the Reviewer's independent check of correctness, and it isn't an extra approval gate. It takes concrete form at the stage transitions: 1.5, 2.6, 3.5, 4.6, 5.6, and 6.3.

Is this in the Coordinator SOP? Not yet. This spec records the desired responsibility. The current [Coordinator SOP](../agents/roles/coordinator.md) covers oversight only partly and implicitly, and will be aligned when the lifecycle is implemented.

## Execution checkpoint and recovery (PROPOSED)

This answers the Maintainer's question about context loss. The static YAML definition can't hold an issue's runtime state, so a durable checkpoint for each issue would hold it. It is a record, not a workflow engine.

- **Contents:** the current stage and next step; completed stages and active waits; references to the requirements and plan, with their revisions; the assessed revision and its evidence; the cycle count and recorded approvals; and outstanding decisions.
- **Updates:** at each stage transition and each key Maintainer decision.
- **Recovery:** a fresh or compacted Coordinator loads the checkpoint and reconciles it with the current repository and issue state before advancing.
- **Authority:** the checkpoint records status. It never counts as approval.

Its location and format are open ([O2](#open-decisions)). The checkpoint adds no code, hook, validator, or enforcement issue.

## Affected documents (PROPOSED)

This is a candidate inventory; nothing is edited now. The wording for each change is open ([O11](#open-decisions)):

- [Coordinator SOP](../agents/roles/coordinator.md): hand interviewing and planning to the Planner, add oversight and the stage transitions, update and restore the execution checkpoint, apply the reentry gate and PR reuse, run the Retro, point to the canonical definition for the sequence, and align [Hand back](../agents/roles/coordinator.md#hand-back) with Review and Publish.
- [Planner SOP](../agents/roles/planner.md): own the implementation plan, and refer out-of-scope Architect recommendations to the Coordinator (2.4).
- [Architect SOP](../agents/roles/architect.md): time the final assessment to the signed-off commit (4.5).
- [Coder SOP](../agents/roles/coder.md) and [Reviewer SOP](../agents/roles/reviewer.md): point to their stages, and keep their validation and review methods.
- [CONTRIBUTING.md](../../CONTRIBUTING.md): the mechanics the lifecycle relies on, such as PR creation and reuse, and the issue-closing rule (O10).
- [Issue tracker](../agents/issue-tracker.md) and [Domain docs](../agents/domain.md): where task artifacts such as specs live (O3). AGENTS.md's existing issue-tracker pointer changes only if necessary.
- [GLOSSARY.md](../../GLOSSARY.md): the Coordinator, Planner, and Architect descriptions need to stay consistent with this lifecycle. Exact wording needs the Maintainer's approval under [Add or revise an entry](../agents/domain.md#add-or-revise-an-entry).

No broad rewrites of AGENTS.md or CLAUDE.md are proposed.

## Acceptance criteria (PROPOSED)

- **AC1** One canonical YAML definition covers the Docs lifecycle. It has the six stages in the agreed order, stable IDs, entry, exit, and completion conditions, roles, transitions, and evidence references.
- **AC2** Role SOPs point to the definition for the sequence instead of repeating it, and they reflect A6 and A7.
- **AC3** The lifecycle sequence appears in exactly one place. The directly affected references point to that canonical order instead of restating it.
- **AC4** Native task lists show the active stage's applicable steps and keep the lifecycle open until 6.3.
- **AC5** The Review stage can't complete on the Reviewer's acceptance alone. It requires the Maintainer's final sign-off and a final Architect assessment of the signed-off commit.
- **AC6** A trial issue runs through Publish and Retro, with observations recorded for each stage. The Maintainer decides on the follow-ups.
- **AC7** The work adds no validator, hook, workflow engine, GitHub Action, or new skill.
- **AC8** The checks that [Validate your change](../../CONTRIBUTING.md#validate-your-change) requires for the changed files pass. A YAML or `paseo.json` change falls outside CI's documentation path list, so it may trigger the full checks rather than only the formatting check.
- **AC9** A fresh Coordinator resumes a trial issue mid-lifecycle from its execution checkpoint. It reconciles the checkpoint with the repository and issue, then continues at the right step without repeating or skipping an approval.

## Test approach (PROPOSED)

- The SOP changes are documentation, so red-green-refactor doesn't apply. The Coder runs the checks in [Validate your change](../../CONTRIBUTING.md#validate-your-change) that match the changed files (AC8).
- The real test is a trial, run after the workflow is merged into `main`. #63 is the candidate. It still has the `needs-triage` label and must go through its own Define stage. A fresh agent runs it end to end against the merged references. For each stage, record the entry and exit, the handoffs, any oversight interventions, the review loops, the waits, and the commit that each piece of evidence covers. Include a resume from the execution checkpoint (AC9). Continue through Publish and Retro.
- Suggested negative checks, not yet agreed: a missing final Architect assessment is caught before Publish, and an attempt to move to the next stage without approval is caught and paused.
- How evidence is recorded and how #15 stays open across the implementation PR are open. They must avoid a circular dependency ([O10](#open-decisions)). Delivering this draft doesn't complete #15, which still needs the implementation and the trial.

## Open decisions

- **O1** The YAML representation, location, and schema, and the format of the stable IDs.
- **O2** The location and format of the execution checkpoint, which holds each issue's runtime state.
- **O3** Where specs and other task artifacts live, including how a file like this one fits the current guidance to keep specs and questions in GitHub Issues. A repository-wide artifact policy is still open. Renaming this file waits until the revisions settle.
- **O4** Plan steps 2.1–2.3, and where the plan is recorded.
- **O5** Retired: the Maintainer set the Review steps, and only 4.1 dispatches the Reviewer.
- **O6** Retired: the existing cycle policy stays; see the [reentry gate](#reentry-gate).
- **O7** Publish failure paths other than the proposed CI path, and the evidence for each step.
- **O8** Which retro skill to use, how findings are shared, and the worktree cleanup details.
- **O9** How task tools show stages, waits, reopened work, and evidence that a revision has invalidated.
- **O10** How trial evidence is recorded, and how #15 stays open across the implementation PR, given the `Closes #N` rule.
- **O11** The exact wording of the role SOP, CONTRIBUTING.md, guide, and glossary changes.

## Out of scope

- Lifecycle variations for Content, Fix, or Feature work.
- Evaluating Progress, which [#65] tracks.
- New skills, GitHub Actions, hooks, schema validators, workflow engines, or other enforcement automation.
- A central project-reference catalogue, or turning Wiki checklist items into agent workflows automatically.
- The decisions themselves for #35, #48, and #63.
- Implementing anything as part of this draft: SOP, YAML, role, glossary, and workflow files stay unchanged.
- Running a retro, cleaning up worktrees, or rerunning CI as part of this draft.

## Sources

- Issues: [#15] and its [#38 retrospective][#15-retro], [#38], [#63], [#65], [#35], [#48], and the closed #17 and #18.
- Repository: [CONTRIBUTING.md](../../CONTRIBUTING.md), [GLOSSARY.md](../../GLOSSARY.md), [Domain docs](../agents/domain.md), [Triage labels](../agents/triage-labels.md), the [QA reference](../qa.md), and the role SOPs in [`docs/agents/roles/`](../agents/roles/).
- Cleanup: the Paseo, Git, and GitHub pages linked in [Worktree cleanup](#worktree-cleanup-proposed).
- Structure: the `mattpocock-skills:to-spec` template, adapted to keep open decisions visible instead of publishing as `ready-for-agent`.
- Background, not prescribed workflows: [Spec Kit](https://github.com/github/spec-kit) and [OpenSpec](https://openspec.dev/).

[#15]: https://github.com/joebaz/web-starter/issues/15
[#15-retro]: https://github.com/joebaz/web-starter/issues/15#issuecomment-6340437814
[#35]: https://github.com/joebaz/web-starter/issues/35
[#38]: https://github.com/joebaz/web-starter/issues/38
[#48]: https://github.com/joebaz/web-starter/issues/48
[#63]: https://github.com/joebaz/web-starter/issues/63
[#65]: https://github.com/joebaz/web-starter/issues/65
