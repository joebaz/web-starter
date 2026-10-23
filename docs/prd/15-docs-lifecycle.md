# Docs lifecycle PRD (draft)

> **Draft for inline Maintainer review. Not approved.** This Design Doc pulls together the [#15] interview so far. It does not make the issue ready for an agent, and it authorizes no implementation. [#15] remains the tracking authority for requirements, decisions, and status.
>
> AGREED items describe the future direction of the lifecycle. They don't replace the current role SOPs, which govern all work, including this issue's, until an approved implementation changes them.
>
> This file is an exception the Maintainer requested, so the draft can be iterated through file diffs. The [issue tracker](../agents/issue-tracker.md) and [Domain docs](../agents/domain.md) guides currently keep specs and unresolved questions in GitHub Issues; aligning this file with them is an open item. The Coordinator chose its location provisionally, and the repository has no PRD policy ([O3](#open-decisions)).

## How to read this draft

Each decision has one of three statuses:

- **AGREED:** the Maintainer approved it in the [#15] issue body or interview.
- **PROPOSED:** drafted for review. It may include elements the Maintainer requested, but it is not approved as written.
- **OPEN:** undecided. See [Open decisions](#open-decisions).

An AGREED stage can still contain PROPOSED details; those details are tagged where they appear. To comment, cite the reference: agreed decisions `A1`–`A12`, stage steps such as `4.3`, acceptance criteria `AC1`–`AC8`, and open decisions `O1`–`O11`. These labels are for review only. The ID format for the lifecycle definition is open ([O1](#open-decisions)).

## Problem

The [Coordinator SOP](../agents/roles/coordinator.md) covers startup, readiness, and review cycles. No single definition says which stages an issue passes through, where each one starts and ends, or what evidence completes it. That leaves three gaps:

1. **Completion was mistaken in [#38].** Architect assessments did happen in #38, including one after independent review. The failure was timing. The Coordinator treated the Reviewer's acceptance as the last review and marked the task plan complete without a separate final Maintainer acceptance. It then began the commit and PR handoff, so the Maintainer had to request the Architect assessment after accepting the change. The session plan had combined validation, independent review, and final assessment into one item. The [Architect SOP](../agents/roles/architect.md)'s phrase "after the change's last review" doesn't distinguish the independent review from the Maintainer's. The [#38 retrospective][#15-retro] records the details.
2. **Requirements have no defined route to approval.** [coding-standards.md](../../coding-standards.md#scope-and-project-choices) tells agents to flag missing decisions and scope changes, but nothing defines how those discussions become approved task requirements.
3. **Oversight is implicit.** The Coordinator SOP asks the Coordinator to settle conflicts and report milestones. It never asks the Coordinator to check ongoing work against the approved requirements and plan, so omissions surface only when the Maintainer notices them.

## Goal

Define, implement, and test the lifecycle for Docs work as one thin vertical slice. The result is a canonical sequence of stages that tells any role where an issue stands, what comes next, and what evidence completes each step. Trial it end to end on a real Docs issue. Add workflow variations only where the trial shows a need.

## Agreed decisions

- **A1 Scope:** Limit this work to the Docs workflow. Propose separate issues for Content, Fix, or Feature variations only when trial evidence shows a concrete need.
- **A2 Stages:** Define, Plan, Implement, Review, Publish, and Retro, in that order. Publish completes when the Maintainer tells the Coordinator about the merge (5.6), and Retro completes the lifecycle.
- **A3 Canonical definition:** A YAML definition holds the stage order, conditional transitions, stable stage and step IDs, explicit entry, exit, and completion conditions, roles, and evidence references. Its representation, location, and schema are open ([O1](#open-decisions)). No schema validator, hook, or workflow engine is approved.
- **A4 Where things live:** Role Markdown keeps each role's responsibilities, authority, methods, constraints, inputs, outputs, and references. [CONTRIBUTING.md](../../CONTRIBUTING.md) keeps contribution mechanics and checks. The coding standards and the [QA reference](../qa.md) keep their own subjects.
- **A5 Runtime state:** Each issue's execution state stays logically separate from the reusable definition. Where that state is stored is open ([O2](#open-decisions)).
- **A6 Planner and Coordinator split:** The Planner runs both the requirements interviews and the implementation plan. The Coordinator handles startup and readiness, the handoff to the Planner, stage transitions, dispatch, and [oversight](#coordinator-oversight). This changes the current Coordinator steps for grilling `needs-triage` issues and for [planning the work](../agents/roles/coordinator.md#plan-the-work).
- **A7 Oversight:** The Coordinator provides continuous second-pair-of-eyes oversight across all issue work, as described in [Coordinator oversight](#coordinator-oversight).
- **A8 Task tracking:** Native task tools (`update_plan` in Codex; `TaskCreate` and `TaskUpdate` in Claude Code) show the applicable steps of the active stage. The lifecycle is tracked separately enough that a session can't mark it finished early. The exact representation is open ([O9](#open-decisions)).
- **A9 Artifacts:** Create task artifacts, such as this PRD, only when the work needs them. There is no central project-reference catalogue. Agent-facing instructions and project-owned references stay in the repository, and the Wiki stays the human checklist.
- **A10 Changed requirements:** Reuse the existing protocol from #17 in [When approved requirements change](../agents/roles/coordinator.md#when-approved-requirements-change) and in AGENTS.md. Don't add a new skill.
- **A11 Related issues:** [#35] (reporting), [#48] (enforcement), and [#63] (classification) stay separate. #17 and #18 are closed. Where #18's historical proposals conflict with current rules (a human-only PR rather than a PR opened by the Coordinator, or parallel edits rather than one writer), the current rules apply.
- **A12 Automation:** Don't open speculative automation issues. Open enforcement follow-ups only for needs observed in the trial or the retro, and only when the Maintainer decides to. [#65] is an exception the Maintainer explicitly requested: a display test, not enforcement, and blocked by #15.

## Lifecycle stages

| Stage        | Completes when                                    | Status                                        |
| ------------ | ------------------------------------------------- | --------------------------------------------- |
| 1. Define    | The Coordinator confirms readiness (1.5)          | AGREED                                        |
| 2. Plan      | The Coordinator starts implementation tasks (2.7) | Role split AGREED; steps PROPOSED             |
| 3. Implement | The Coordinator dispatches the Reviewer (3.5)     | AGREED                                        |
| 4. Review    | Evidence matches the current commit (4.6)         | PROPOSED; conflicts with the current SOP (O6) |
| 5. Publish   | The Maintainer reports the merge (5.6)            | Happy path AGREED; entry and failures OPEN    |
| 6. Retro     | The Maintainer decides on follow-ups              | Purpose and exit AGREED; steps OPEN           |

### Stage 1: Define (AGREED)

Entry (PROPOSED): the Maintainer starts a Coordinator on an issue.

1. **1.1** The Coordinator checks startup conditions and readiness. This keeps the existing [Start](../agents/roles/coordinator.md#start) steps: fetch `origin/main` and bring an unstarted branch up to date, stop if the branch has uncommitted changes or commits of its own, move the issue to "In progress", and start task tracking. It also keeps [Check that the issue is ready](../agents/roles/coordinator.md#check-that-the-issue-is-ready).
2. **1.2** The Coordinator sends a `needs-triage` or otherwise unready issue to the Planner and names the gaps.
3. **1.3** The Planner interviews the Maintainer and records the agreed requirements in the issue. This includes exact glossary and ADR proposals and the contradiction scan from the [Planner SOP](../agents/roles/planner.md). [Triage label](../agents/triage-labels.md) rules still apply.
4. **1.4** The Maintainer gives the go-ahead.
5. **1.5** The Coordinator confirms the issue is ready and moves it to Plan.

An issue that is already approved and ready skips 1.2–1.4, with no repeat interview or permission. Moving to Plan relies on the existing authorization; it needs no separate approval.

### Stage 2: Plan (role split AGREED; steps PROPOSED)

Entry (PROPOSED): 1.5 is complete.

1. **2.1** The Coordinator briefs the Planner on the approved requirements, artifacts, and constraints.
2. **2.2** The Planner builds the implementation plan: affected files, sequence, role assignments, dependencies, handoffs, and validation evidence.
3. **2.3** The Coordinator asks an Architect to assess the plan.
4. **2.4** The Planner makes in-scope revisions and takes scope decisions to the Maintainer.
5. **2.5** The Planner hands the plan back to the Coordinator.
6. **2.6** The Coordinator checks the plan against the approved requirements and sends each agent its part of the plan and its assignment.
7. **2.7** The Coordinator starts the implementation tasks under the existing authorization.

None of these steps adds a mandatory approval. Where the plan is recorded is open, because the Planner SOP keeps the Planner out of repository files ([O4](#open-decisions)).

### Stage 3: Implement (AGREED)

Entry (PROPOSED): 2.7 is complete, or a Review cycle that needs edits invokes this stage (4.1).

1. **3.1** The Coordinator briefs the Coder on the requirements, plan, references, and assignment.
2. **3.2** The Coder checks the inputs and flags gaps.
3. **3.3** The Coder implements and validates the change as the plan and [Validate your change](../../CONTRIBUTING.md#validate-your-change) require.
4. **3.4** The Coder hands back the change, its results, and any concerns.
5. **3.5** The Coordinator checks that the handoff is complete and dispatches an independent Reviewer.

The Coder's self-validation and the Reviewer's independent review are separate. Oversight runs throughout the stage; it isn't a serial review step. Whether 3.5 and 4.1 duplicate the Reviewer dispatch is open ([O5](#open-decisions)).

### Stage 4: Review (PROPOSED)

This sequence includes elements the Maintainer requested, but the full sequence isn't approved. The requested elements are: explicit go-to conditions; the Maintainer reviewing the diffs directly, rather than the Coordinator presenting the change; any number of review cycles; a Maintainer commit that closes each Maintainer round; and the final Architect assessment after sign-off.

1. **4.1** The Coordinator starts a review cycle. If edits are needed, it runs Stage 3, then returns here and dispatches an independent Reviewer.
2. **4.2** The Reviewer checks the change, runs the applicable checks, and reports findings and a recommendation.
3. **4.3** The Coordinator acts on the report. Issues found: go to 4.1, within the current review-cycle authorization. No issues: go to 4.4.
4. **4.4** The Maintainer reviews the file diffs. Changes needed: the Maintainer leaves inline comments, commits a checkpoint of the current change, and sends it to the Coordinator; go to 4.1. No changes: the Maintainer commits and gives final sign-off; go to 4.5.
5. **4.5** An Architect assesses the signed-off commit and reports to the Coordinator, who takes the recommendations to the Maintainer. Authorized changes: go to 4.1. No further changes for this issue: go to 4.6.
6. **4.6** The Coordinator confirms that the review, sign-off, and evidence all match the current commit, then moves the issue to Publish.

AGREED constraint: the Reviewer's handoff can't complete the Review stage or the lifecycle.

OPEN conflict ([O6](#open-decisions)): the current [Run the work](../agents/roles/coordinator.md#run-the-work) rules require Maintainer approval for each cycle, including after a Reviewer reports "changes needed", and cap an issue at five cycles. The Maintainer has asked for any number of cycles. Neither automatic authorization for fixes nor removing the cap is approved, so the current rules apply until the Maintainer decides. Under them, the "issues found" branch of 4.3 means: give the Maintainer the findings and wait.

### Stage 5: Publish (happy path AGREED)

Entry (PROPOSED): a signed-off, assessed commit is ready to push (4.6).

1. **5.1** The Maintainer pushes to the remote.
2. **5.2** The Coordinator creates the PR, following [Open a pull request](../../CONTRIBUTING.md#open-a-pull-request).
3. **5.3** GitHub runs CI, and it passes.
4. **5.4** The Maintainer merges into `main`.
5. **5.5** GitHub deletes the remote branch.
6. **5.6** The Maintainer tells the Coordinator about the merge.

The failure paths are open, such as CI failing, PR review asking for changes, or a pushed revision that differs from the signed-off commit. So is the evidence for each step ([O7](#open-decisions)).

### Stage 6: Retro (purpose and exit AGREED; steps OPEN)

Entry (PROPOSED): Publish is complete (5.6).

Purpose (AGREED): analyze what worked and what didn't, and identify improvements, including chances for mechanical enforcement that the trial actually showed.

The steps aren't drafted yet ([O8](#open-decisions)). The Maintainer's existing retro skill and the `mattpocock-skills` equivalent are candidate inputs. Neither is adopted wholesale, and no retro runs as part of this draft.

Exit (AGREED): the Maintainer reviews the findings and decides on follow-ups. Findings alone authorize no changes.

## Coordinator oversight

AGREED. Across all issue work, the Coordinator:

- compares what is happening with the lifecycle, the approved requirements, and the implementation plan
- catches omissions and deviations, and resolves them directly with the agents involved when the approved materials already answer them
- pauses the affected work and flags the Maintainer when a new approach, scope, acceptance criterion, or recorded decision is needed; the Planner revises the plan if necessary
- makes sure every affected agent receives the change, through the protocol in A10

Oversight doesn't repeat the Reviewer's independent check of correctness, and it isn't an extra approval gate. It takes concrete form in the handoff and transition checks: 1.5, 2.6, 3.5, and 4.6. The current Coordinator SOP covers oversight only partly and implicitly.

## Affected documents (PROPOSED)

The wording for each of these changes is open ([O11](#open-decisions)):

- [Coordinator SOP](../agents/roles/coordinator.md): hand interviewing and planning to the Planner, add oversight and stage transitions, point to the canonical definition for the sequence, and align [Hand back](../agents/roles/coordinator.md#hand-back) with Review and Publish.
- [Planner SOP](../agents/roles/planner.md): own the implementation plan.
- [Architect SOP](../agents/roles/architect.md): time the final assessment to the signed-off commit (4.5).
- [CONTRIBUTING.md](../../CONTRIBUTING.md): point to the lifecycle wherever contribution mechanics depend on it.

## Acceptance criteria (PROPOSED)

- **AC1** One canonical YAML definition covers the Docs lifecycle. It has the six stages in the agreed order, stable IDs, entry, exit, and completion conditions, roles, transitions, and evidence references.
- **AC2** Role SOPs point to the definition for the sequence instead of repeating it, and they reflect A6 and A7.
- **AC3** The lifecycle sequence appears in exactly one place. The directly affected references point to that canonical order instead of restating it.
- **AC4** Native task lists show the active stage's applicable steps and keep the lifecycle open until the Retro exit.
- **AC5** The Review stage can't complete on the Reviewer's acceptance alone. It requires the Maintainer's final sign-off and a final Architect assessment of the signed-off commit.
- **AC6** A trial issue runs through Publish and Retro, with observations recorded for each stage. The Maintainer decides on the follow-ups.
- **AC7** The work adds no validator, hook, workflow engine, GitHub Action, or new skill.
- **AC8** The checks that [Validate your change](../../CONTRIBUTING.md#validate-your-change) requires for the changed files pass. A YAML or `paseo.json` change falls outside CI's documentation path list, so it may trigger the full checks rather than only the formatting check.

## Test approach (PROPOSED)

- The SOP changes are documentation, so red-green-refactor doesn't apply. The Coder runs the checks in [Validate your change](../../CONTRIBUTING.md#validate-your-change) that match the changed files (AC8).
- The real test is a trial. #63 is the candidate, once it has been triaged; it still has the `needs-triage` label. Run it end to end under the new lifecycle. For each stage, record the entry and exit, the handoffs, any oversight interventions, the review loops, the waits, and the commit that each piece of evidence covers. Continue through Publish and Retro.
- Suggested negative checks, not yet agreed: a missing final Architect assessment is caught before Publish, and an attempt to move to the next stage without approval is caught and paused.
- How evidence is recorded, the order of execution, and when #15 closes relative to #63 are open. They must avoid a circular dependency ([O10](#open-decisions)). Delivering this draft doesn't complete #15, which still needs the implementation and the trial.

## Open decisions

- **O1** The YAML representation, location, and schema, and the format of the stable IDs.
- **O2** Where each issue's runtime execution state is stored.
- **O3** Where PRDs and other task artifacts live. That includes how a file like this one fits the current guidance to keep specs and questions in GitHub Issues. This file's location is provisional.
- **O4** The Plan steps (2.1–2.7), and where the plan is recorded.
- **O5** The Review sequence (4.1–4.6) as a whole, including the Reviewer dispatch shared by 3.5 and 4.1.
- **O6** Review-cycle authorization: per-cycle approval and the five-cycle cap, or any number of cycles.
- **O7** The Publish entry condition, failure paths, and evidence.
- **O8** The Retro steps, who runs them, and which parts of the retro skill to use.
- **O9** How task tools show stages, waits, reopened work, and evidence that a revision has invalidated.
- **O10** How trial evidence is recorded, the order of execution, and when #15 closes relative to #63.
- **O11** The exact wording of the role SOP and CONTRIBUTING.md changes.

## Out of scope

- Lifecycle variations for Content, Fix, or Feature work.
- Evaluating Progress, which [#65] tracks.
- New skills, GitHub Actions, hooks, schema validators, workflow engines, or other enforcement automation.
- A central project-reference catalogue, or turning Wiki checklist items into agent workflows automatically.
- The decisions themselves for #35, #48, and #63.
- Implementing anything as part of this draft: SOP, YAML, role, and workflow files stay unchanged.

## Sources

- Issues: [#15] and its [#38 retrospective][#15-retro], [#38], [#63], [#65], [#35], [#48], and the closed #17 and #18.
- Repository: [CONTRIBUTING.md](../../CONTRIBUTING.md), [GLOSSARY.md](../../GLOSSARY.md), [Domain docs](../agents/domain.md), [Triage labels](../agents/triage-labels.md), the [QA reference](../qa.md), and the role SOPs in [`docs/agents/roles/`](../agents/roles/).
- Structure: the `mattpocock-skills:to-spec` template, adapted to keep open decisions visible instead of publishing as `ready-for-agent`.
- Background, not prescribed workflows: [Spec Kit](https://github.com/github/spec-kit) and [OpenSpec](https://openspec.dev/).

[#15]: https://github.com/joebaz/web-starter/issues/15
[#15-retro]: https://github.com/joebaz/web-starter/issues/15#issuecomment-6340437814
[#35]: https://github.com/joebaz/web-starter/issues/35
[#38]: https://github.com/joebaz/web-starter/issues/38
[#48]: https://github.com/joebaz/web-starter/issues/48
[#63]: https://github.com/joebaz/web-starter/issues/63
[#65]: https://github.com/joebaz/web-starter/issues/65
