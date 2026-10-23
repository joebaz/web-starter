# Docs lifecycle spec (draft)

> **Status:** Draft for Maintainer review. [#15] tracks requirements, decisions, and status. Everything here is agreed direction except sections and items labeled **Proposed** and the [Open decisions](#open-decisions). The current role SOPs govern all work until an approved implementation changes them. Step and decision numbers are stable review references and may skip.

## Problem

No single definition says which stages an issue passes through, where each one starts and ends, or what evidence completes it. As a result:

- **Review boundaries blur.** In [#38], the Coordinator treated the Reviewer's acceptance as the last review and closed its task plan before the Maintainer's final acceptance and the final Architect assessment. The Architect SOP's "after the change's last review" doesn't say which review.
- **Requirements have no route to approval.** [coding-standards.md](../../coding-standards.md#scope-and-project-choices) asks agents to flag missing decisions and scope changes, but nothing turns those discussions into approved requirements.
- **Oversight is implicit.** Nothing asks the Coordinator to check ongoing work against the approved requirements and plan.

## Goal and scope

Define, implement, and test the lifecycle for Docs work as one thin vertical slice, so any role can tell where an issue stands, what comes next, and what evidence completes each step.

[#15] covers this spec, the implementation (the lifecycle definition and the [affected documents](#affected-documents-proposed)), and a trial. The order is: finish this spec; implement the lifecycle and merge it into `main`; then a fresh agent runs [#63] through the merged lifecycle, and the trial's observations and Retro feed later improvements.

Out of scope:

- Content, Fix, and Feature variations. Propose them as separate issues only when trial evidence shows a need.
- New skills, GitHub Actions, hooks, schema validators, workflow engines, or other enforcement automation. Open enforcement issues only for needs a trial or Retro shows, and only when the Maintainer decides. [#65], a display test the Maintainer requested and blocked by #15, is the one exception.
- A central project-reference catalogue, or turning Wiki checklist items into agent workflows automatically.
- The decisions for [#35] (reporting), [#48] (enforcement), and [#63] (classification).

## Lifecycle rules

- **Definition:** one YAML definition holds the stage order, conditional transitions, stable stage and step IDs, entry, exit, and completion conditions, roles, and evidence references. Its format and location are open (O1).
- **Document responsibilities:** role SOPs keep each role's responsibilities, authority, methods, constraints, inputs, outputs, and references. [CONTRIBUTING.md](../../CONTRIBUTING.md) keeps contribution mechanics and checks; the coding standards and the [QA reference](../qa.md) keep their subjects.
- **Runtime state:** each issue's execution state stays separate from the reusable definition. See [Execution checkpoint](#execution-checkpoint-proposed).
- **Task tracking:** native task tools (`update_plan` in Codex; `TaskCreate` and `TaskUpdate` in Claude Code) show the active stage's applicable steps, and the lifecycle stays open until 6.3 (O9).
- **Artifacts:** create task artifacts, such as this spec, only when the work needs them. Agent-facing instructions and project-owned references stay in the repository; the Wiki stays the human checklist.
- **Changed requirements:** follow [When approved requirements change](../agents/roles/coordinator.md#when-approved-requirements-change) and the matching rule in AGENTS.md.

## Stages

Stages run in order: Define, Plan, Implement, Review, Publish, Retro. Each stage's last step closes it and opens the next stage; closing Retro (6.3) completes the lifecycle.

### 1. Define

Entry (**Proposed**): the Maintainer starts a Coordinator on an issue.

1. **1.1** The Coordinator runs the [Start](../agents/roles/coordinator.md#start) checks and [Check that the issue is ready](../agents/roles/coordinator.md#check-that-the-issue-is-ready).
2. **1.2** The Coordinator sends a `needs-triage` or otherwise unready issue to the Planner, naming the gaps.
3. **1.3** The Planner interviews the Maintainer and records the agreed requirements in the issue, following the [Planner SOP](../agents/roles/planner.md) and the [triage labels](../agents/triage-labels.md).
4. **1.4** The Maintainer reviews the requirements. Changes needed: go to 1.3. Accepted: go to 1.5.
5. **1.5** The Coordinator confirms the issue is ready and closes the stage.

An issue that is already approved and ready goes from 1.1 to 1.5. Moving to Plan needs no further approval.

### 2. Plan

Steps 2.1–2.3 are **Proposed**.

1. **2.1** The Coordinator briefs the Planner on the approved requirements, artifacts, and constraints.
2. **2.2** The Planner builds the implementation plan: affected files, sequence, role assignments, dependencies, handoffs, and validation evidence. Where it is recorded is open (O4).
3. **2.3** The Coordinator asks an Architect to assess the plan.
4. **2.4** The Planner reviews the Architect's recommendations. In scope: the Planner revises the plan. Out of scope: the Planner refers them to the Coordinator, who brings them to the Maintainer.
5. **2.5** When out-of-scope recommendations are pending, the Maintainer decides each one. Approved: the Planner revises the plan as in 2.4, and the changed-requirements protocol applies. Rejected: no change. Each decision is recorded so it isn't asked again.
6. **2.6** The Coordinator closes the stage.

### 3. Implement

1. **3.1** The Coordinator briefs the Coder on the requirements, plan, references, and assignment.
2. **3.3** The Coder implements the Maintainer's change and validates it as the plan and the repository's [validation requirements](../../CONTRIBUTING.md#validate-your-change) require.
3. **3.5** The Coordinator closes the stage.

The Coder's self-validation doesn't replace the Reviewer's independent review.

### 4. Review

1. **4.1** The Coordinator dispatches an independent Reviewer.
2. **4.2** The Reviewer checks the change, runs the applicable checks, and reports findings and a recommendation.
3. **4.3** Findings: return to 3.1 through the [reentry gate](#reentry-gate). No findings: go to 4.4.
4. **4.4** The Maintainer reviews the file diffs.
   - Changes needed: the Maintainer submits inline feedback and asks the Coordinator to hold edits while they commit. The Coordinator acknowledges and keeps editing agents paused. The Maintainer commits and explicitly tells the Coordinator to continue. The Coordinator reconciles the feedback with the commit and returns to 3.1 through the reentry gate to brief any remaining edits. The next independent review (4.1) covers everything the commit and those edits change.
   - No changes: the Maintainer commits and gives final sign-off; go to 4.5.
5. **4.5** The Coordinator dispatches an Architect to assess the signed-off commit and takes the recommendations to the Maintainer. Authorized changes: return to 3.1 through the reentry gate. None: go to 4.6.
6. **4.6** The Coordinator confirms that the review, sign-off, and evidence match the current revision, and closes the stage.

The Reviewer's acceptance never completes this stage.

### Reentry gate

Every return to 3.1 passes this gate. The current [Run the work](../agents/roles/coordinator.md#run-the-work) rules apply: each review cycle needs the Maintainer's approval, an issue runs at most five cycles, and more need the Maintainer's approval. No fix is authorized automatically.

**Proposed** representation:

- **G1** A cycle is one round of changes followed by one independent review.
- **G2** A Maintainer's request for changes, or their authorization of a recommendation (4.5) or fix (F2), authorizes its ordinary cycle. While a 4.4 hold is active, edits also wait for the Maintainer's commit and explicit continue; inline comments alone start no edits.
- **G3** Reviewer findings (4.3) return to 3.1 only after the Maintainer's go-ahead.
- **G4** A sixth or later cycle needs an explicit extension from the Maintainer.
- **G5** Returning to an earlier stage doesn't reset the cycle count.

### 5. Publish

1. **5.1** The Maintainer pushes to the remote.
2. **5.2** The Coordinator creates the PR, following [Open a pull request](../../CONTRIBUTING.md#open-a-pull-request).
3. **5.3** GitHub runs CI. Passes: go to 5.4. Fails: follow the [CI failure path](#ci-failure-path-proposed).
4. **5.4** The Maintainer merges into `main`.
5. **5.5** GitHub deletes the remote branch.
6. **5.6** The Maintainer confirms the merge, and the Coordinator closes the stage.

#### CI failure path (Proposed)

- **F1** The Coordinator diagnoses the failure.
- **F2** A file change is needed: return to 3.1 through the reentry gate, then repeat Review in full (4.1–4.6). The Maintainer pushes the new revision, the Coordinator reuses the same PR, and CI runs again.
- **F3** A transient failure with no file change: CI runs again on the same commit, and the issue stays in Publish.

Other Publish failures and the evidence for each step are open (O7).

### 6. Retro

Purpose: analyze what worked and what didn't, and identify improvements, including chances for mechanical enforcement the trial actually showed. Findings alone authorize no changes.

1. **6.1** The Coordinator runs the retro skill (`/retro`). The skill binding is open (O8).
2. **6.2** The Maintainer reviews the recommendations. For each approved one, the Coordinator drafts a GitHub issue, and creates it after the Maintainer approves the exact draft.
3. **6.3** The Coordinator closes the stage and tells the Maintainer the worktree is ready to archive. The Coordinator doesn't clean up or wait for the archive.

#### Worktree cleanup (Proposed)

The Maintainer archives the worktree after the merge, once the results, follow-ups, evidence, and any uncommitted or local-only work still needed are preserved outside it. Merged files survive cleanup; anything kept only in the worktree doesn't.

- In Paseo, archiving the last workspace runs its teardown and removes the managed worktree ([Paseo worktrees](https://paseo.sh/docs/worktrees)). Whether it protects a dirty worktree or deletes the local branch isn't confirmed.
- GitHub's automatic deletion removes only the remote head branch ([GitHub docs](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-the-automatic-deletion-of-branches)). Git removes a worktree with `git worktree remove` and clears records of deleted ones with `git worktree prune` ([git-worktree](https://git-scm.com/docs/git-worktree)).
- Inspect the local branch separately, afterward. After a squash merge, `git branch -d` may refuse because the branch's commits aren't in `main`; `-D` deletes it regardless ([git-branch](https://git-scm.com/docs/git-branch)). Neither is required.

## Coordinator oversight

Throughout the issue, the Coordinator:

- compares the work with the lifecycle, the approved requirements, and the plan, and checks readiness and plan adherence before closing each stage
- resolves omissions, deviations, and conflicts between requirements, plans, code, and reviews directly with the agents when the approved materials already answer them
- pauses the affected work and brings the Maintainer anything that needs a new approach, scope, acceptance criterion, or recorded decision; the Planner revises the plan if needed
- sends every affected agent the change, through the changed-requirements protocol

Oversight doesn't repeat the Reviewer's correctness review and adds no approval gate.

## Execution checkpoint (Proposed)

The YAML definition can't hold runtime state, so each issue gets a durable record of where it stands. It is a record, not a workflow engine, and it never counts as approval.

- **Contents:** the current stage and next step; completed stages and active waits; requirement and plan references with their revisions; the assessed revision and its evidence; the cycle count and recorded approvals; outstanding decisions.
- **Updates:** at each stage close and each key Maintainer decision.
- **Recovery:** a fresh or compacted Coordinator loads it and reconciles it with the current repository and issue before advancing.

Its location and format are open (O2).

## Affected documents (Proposed)

Each entry names the file, the existing heading, and the edit. In the proposed text, "the lifecycle" links to the definition (O1). An edit tagged "if O…" applies only if that open decision goes the proposed way.

### `docs/agents/roles/coordinator.md`

- **Introduction:** replace both sentences with: "The Coordinator runs a GitHub issue through the lifecycle, from readiness to the Retro. It hands each stage's work to the right role, oversees it against the approved requirements and plan, and keeps the maintainer informed."
- **Start:** replace step 2 with: "If the issue has the `needs-triage` label, hand it to a Planner as an issue that isn't ready. Otherwise, skip this step." Append to step 4: "Show the active stage's steps, and keep the lifecycle open until the Retro closes it." Add step 5 (if O2 adopts the checkpoint): "Load the issue's execution checkpoint, if there is one, and reconcile it with the repository and issue before advancing."
- **Check that the issue is ready:** replace "Hand an issue that isn't ready to a Planner, saying what's missing." with "Hand an issue that isn't ready to a Planner, saying what's missing, and wait for the maintainer to accept the requirements."
- **Plan the work:** move the first bullet unchanged to the Planner SOP, and put in its place: "A Planner builds the implementation plan. Check it against the approved requirements before Implement starts."
- **Run the work:**
  - Replace the first bullet with: "For every issue, ask an Architect to assess the plan before coding and, after the maintainer's final sign-off, the signed-off commit."
  - Append to the review-cycle bullet: "When the maintainer sends inline feedback and asks you to hold, acknowledge it and keep editing agents paused until they commit and explicitly tell you to continue. Then reconcile the feedback with the commit, and brief any remaining edits. The next independent review covers everything the commit and those edits change." Add G1–G5 if adopted.
  - Replace the conflict-settling bullet with the list in [Coordinator oversight](#coordinator-oversight).
- **Hand back:** replace the section with: "Report to the maintainer at the lifecycle's handoffs. For their diff review, give a summary of the change, what was checked, open issues, and a suggested commit message. With the final Architect assessment, give the assessment and any suggested new issues. Open each pull request using the pull request template." The pull request's issue link follows O10.

### `docs/agents/roles/planner.md`

- **Introduction:** replace with: "The Planner gets GitHub issues ready for a Coder and plans their implementation."
- **Work:** after the first bullet, add:
  - "When the Coordinator briefs you on a ready issue, build the implementation plan: affected files, sequence, role assignments, dependencies, handoffs, and validation evidence."
  - The bullet moved from the Coordinator's Plan the work, unchanged.
  - "Review the Architect's plan assessment. Revise the plan for in-scope recommendations. Refer out-of-scope ones to the Coordinator for the maintainer, and record each decision."
- **Hand back:** replace "Stop when the issue is ready for a Coder, and report:" with "Stop when the maintainer accepts the requirements, or when the plan is complete, and report:". Add the item "the implementation plan, with each Architect recommendation and its decision".

### `docs/agents/roles/architect.md`

- **Work:** replace "After the change's last review: compare the codebase before and after the change." with "After the maintainer's final sign-off: assess the signed-off commit, comparing the codebase before and after the change." Replace "Anything outside the current issue becomes a suggested new issue for the Planner and the maintainer, never extra work in the current change." with "Anything outside the current issue goes to the maintainer as a suggested new issue. It becomes current work only when the maintainer approves a change to the requirements."

### `docs/agents/roles/coder.md` and `docs/agents/roles/reviewer.md`

- **Read:** add "The lifecycle: Implement" to the Coder SOP and "The lifecycle: Review" to the Reviewer SOP.

### `CONTRIBUTING.md`

- **Open a pull request** (if O10 adopts `Refs`): replace "Link the pull request to the relevant GitHub Issue or Sub-Issue with `Closes #<number>`." with "Link the pull request to the relevant GitHub Issue or Sub-Issue with `Closes #<number>`, or with `Refs #<number>` when the issue stays open after the merge."

### `.github/pull_request_template.md`

- **First line** (if O10 adopts `Refs`): replace `Closes #<issue-or-sub-issue-number>` with `Closes #<issue-or-sub-issue-number> <!-- or Refs #<number> when the issue stays open after the merge -->`.

### `docs/agents/issue-tracker.md`

- **Introduction** (if O3 adopts spec files): after "Issues and specs live in this code repository's GitHub Issues, not in its wiki.", add: "When the maintainer asks for a spec as a repository file for diff review, keep it at the path O3 sets and link it from the issue. The issue still tracks status." Replace "the path O3 sets" with the adopted path.

### `docs/agents/domain.md`

- **Scope and entry format** (if O3 adopts spec files): replace "Keep unresolved questions in the issue." with "Keep unresolved questions in the issue, or in the spec file the issue links to."
- **Add or revise an entry** (if O3 adopts spec files): in step 3, replace "retain agreed wording in the issue" with "retain agreed wording in the issue or its linked spec file".

### `GLOSSARY.md`

- **Roles:** replace three definitions, subject to the Maintainer's approval under [Add or revise an entry](../agents/domain.md#add-or-revise-an-entry):
  - Coordinator: "The agent role that runs a GitHub issue through its lifecycle, from readiness to the Retro, handing each stage's work to the right role."
  - Planner: "The agent role that gets GitHub issues ready through triage and maintainer interviews, and plans their implementation."
  - Architect: "The read-only agent role that assesses every issue for code health: the plan before coding, and the signed-off change before publishing."

### `AGENTS.md` (`CLAUDE.md` is a symlink to it)

- **Agent skills, Issue tracker** (if O3 adopts spec files): replace "Issues and specs live in this code repository's GitHub Issues, not its wiki." with "Issues live in this code repository's GitHub Issues, not its wiki. For issues and specs, see `docs/agents/issue-tracker.md`."

### New: the lifecycle definition

Holds Stages 1–6, the reentry gate, and the CI failure path in the YAML form that [Lifecycle rules](#lifecycle-rules) describes. Its format and path are O1.

## Acceptance criteria (Proposed)

- **AC1** One canonical YAML definition covers the Docs lifecycle: the six stages in order, stable IDs, entry, exit, and completion conditions, roles, transitions, and evidence references.
- **AC2** Each affected document carries its listed edit.
- **AC3** The sequence appears only in the definition; other documents point to it.
- **AC4** Native task lists show the active stage's applicable steps and keep the lifecycle open until 6.3.
- **AC5** The Review stage can't complete on the Reviewer's acceptance alone; it needs the Maintainer's final sign-off and the Architect's assessment of the signed-off commit.
- **AC6** A trial issue runs through Publish and Retro, with observations recorded for each stage, and the Maintainer decides the follow-ups.
- **AC7** Nothing listed as out of scope is added.
- **AC8** The checks in [Validate your change](../../CONTRIBUTING.md#validate-your-change) pass for the changed files. A file outside CI's documentation path list, such as a `.yml` file, runs the full checks.
- **AC9** A fresh Coordinator resumes a trial issue from its execution checkpoint, reconciles it with the repository and issue, and continues at the right step without repeating or skipping an approval.

## Test approach (Proposed)

- The implementation is documentation, so red-green-refactor doesn't apply; run the checks in AC8.
- After the merge, run the trial on #63. It still has the `needs-triage` label, so it enters at Define. For each stage, record the entry and exit, handoffs, oversight interventions, review loops, waits, and the commit each piece of evidence covers. Include one resume from the execution checkpoint (AC9).
- Negative checks, if adopted: a missing final Architect assessment is caught before Publish, and an attempt to advance a stage without approval is caught and paused.

## Open decisions

- **O1** The lifecycle definition's format and path.
- **O2** The execution checkpoint's location and format.
- **O3** Spec files. Proposed: allow them at `docs/specs/<issue>-<slug>.md`, with the conditional issue-tracker, domain, and AGENTS.md edits above; this file would move there once the revisions settle.
- **O4** Where the plan is recorded, and whether the Planner may write repository files.
- **O7** Publish failures other than CI, such as PR review asking for changes or a pushed revision that differs from the signed-off commit, and the evidence for each step. Matching-revision evidence means the affected checks, reviews, and sign-off cover any changed content.
- **O8** Which retro skill to use, how the Coordinator SOP references it without adopting conflicting tool instructions, and how findings are shared.
- **O9** How task tools show waits, reopened work, and evidence that a revision has invalidated.
- **O10** PR closure. Proposed: the implementation PR uses `Refs #15`, with the conditional CONTRIBUTING.md and template edits above, and the Maintainer closes #15 after deciding the #63 Retro's follow-ups.

## Sources

Issues: [#15], [#35], [#38], [#48], [#63], and [#65]. Repository documents and cleanup sources are linked where they're used.

[#15]: https://github.com/joebaz/web-starter/issues/15
[#35]: https://github.com/joebaz/web-starter/issues/35
[#38]: https://github.com/joebaz/web-starter/issues/38
[#48]: https://github.com/joebaz/web-starter/issues/48
[#63]: https://github.com/joebaz/web-starter/issues/63
[#65]: https://github.com/joebaz/web-starter/issues/65
