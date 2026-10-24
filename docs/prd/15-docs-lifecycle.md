# Docs lifecycle spec (draft)

> **Status:** Draft for Maintainer review. [#15] tracks requirements, decisions, and status. Everything here is agreed direction except sections and items labeled **Proposed** and the [Open decisions](#open-decisions). The current role SOPs govern all work until an approved implementation changes them.

## Problem

No single definition says how agents should sequence work or collaborate on an issue, where each stage starts and ends, or what evidence completes it. As a result:

- **Review boundaries blur.** In [#38], the Coordinator treated the Reviewer's acceptance as the last review and closed its task plan before the Maintainer's final acceptance and the final Architect assessment. The Architect SOP's "after the change's last review" doesn't say which review.
- **Requirements have no route to approval.** [coding-standards.md](../../coding-standards.md#scope-and-project-choices) asks agents to flag missing decisions and scope changes, but nothing turns those discussions into approved requirements.
- **Oversight is implicit.** Nothing asks the Coordinator to check ongoing work against the approved requirements and plan.

## Goal and scope

Define, implement, and test the lifecycle for Docs work as one thin vertical slice, so any role can tell where an issue stands, what comes next, and what evidence completes each step.

This spec defines the lifecycle in [#15]; once it's approved, [#66] implements it and merges it into `main`, and a fresh agent then [trials it on #63](#test-approach-proposed), with the observations returning to #15.

Out of scope:

- Content, Fix, and Feature variations.
- New skills.
- GitHub Actions, hooks, schema validators, workflow engines, or other enforcement automation.
- Enforcement issues, unless a trial or Retro shows the need and the Maintainer decides. [#65], a display test the Maintainer requested and blocked by #15, is separate.
- A separate audit record.
- A central project-reference catalogue, or turning Wiki checklist items into agent workflows automatically.
- The decisions for [#35] (reporting), [#48] (enforcement), and [#63] (classification).

## Lifecycle rules

- **Definition:** one YAML file holds the lifecycle, the shared workflow every issue follows. See [Lifecycle definition](#lifecycle-definition).
- **When versus how:** the lifecycle owns when work happens: sequence, handoffs, approval gates, and loops. Role SOPs own how each role works: responsibilities, authority, methods, inputs, outputs, quality, and references. [CONTRIBUTING.md](../../CONTRIBUTING.md) keeps contribution mechanics and checks; the coding standards and the [QA reference](../qa.md) keep their subjects.
- **Evidence:** PR and CI evidence stays in GitHub. Detailed reports go in chat, following the [QA reference](../qa.md).
- **Issue state:** each issue's current stage, next action, and waits are kept apart from the shared definition, in its [execution checkpoint](#execution-checkpoint-proposed). YAML could hold either; the split keeps one issue's progress out of the workflow every issue shares.
- **Task tracking:** native task tools (`update_plan` in Codex; `TaskCreate` and `TaskUpdate` in Claude Code) show the active stage's applicable steps, and the lifecycle stays open until the Coordinator closes Retro (5.3). How they show waits and reopened work is open (O6).
- **Artifacts:** create task artifacts, such as this spec, only when the work needs them. Agent-facing instructions and project-owned references stay in the repository; the Wiki stays the Maintainer's checklist.
- **Changed requirements:** follow [When approved requirements change](../agents/roles/coordinator.md#when-approved-requirements-change) and the matching rule in AGENTS.md.

## Stages

Stages run in order: Define, Plan, Implement, Publish, Retro. Each stage's last step closes it and opens the next stage; closing Retro (5.3) completes the lifecycle.

### 1. Define

Entry (**Proposed**): the Maintainer starts a Coordinator on an issue.

1. **1.1** The Coordinator runs the [Start](../agents/roles/coordinator.md#start) checks and [Check that the issue is ready](../agents/roles/coordinator.md#check-that-the-issue-is-ready).
2. **1.2** The Coordinator sends a `needs-triage` or otherwise unready issue to the Planner, naming the gaps.
3. **1.3** The Planner interviews the Maintainer and records the agreed requirements in the issue, following the [Planner SOP](../agents/roles/planner.md) and the [triage labels](../agents/triage-labels.md).
4. **1.4** The Maintainer reviews the requirements. Changes needed: back to the interview (1.3). Accepted: go to the readiness confirmation (1.5).
5. **1.5** The Coordinator confirms the issue is ready, moves it from "To do" to "In progress", and closes the stage.

An issue that is already approved and ready goes from the Start checks (1.1) straight to the readiness confirmation (1.5). Moving to Plan needs no further approval.

### 2. Plan

Steps 2.1–2.3 are **Proposed**.

1. **2.1** The Coordinator briefs the Planner on the approved requirements, artifacts, and constraints.
2. **2.2** The Planner builds the implementation plan. Recording location: TBD (O4).
3. **2.3** The Coordinator asks the Architect to assess the plan.
4. **2.4** The Planner reviews the Architect's recommendations. In scope: the Planner revises the plan. Out of scope: the Planner refers them to the Coordinator, who brings them to the Maintainer.
5. **2.5** The Maintainer decides each pending out-of-scope recommendation once. The Planner revises the plan for approved ones, and the changed-requirements protocol applies.
6. **2.6** The Coordinator closes the stage.

### 3. Implement

1. **3.1** The Coordinator briefs the Coder on the requirements, plan, references, and assignment.
2. **3.2** The Coder implements the Maintainer's change and validates it as the plan and the repository's [validation requirements](../../CONTRIBUTING.md#validate-your-change) require.
3. **3.3** The Coordinator dispatches the Reviewer.
4. **3.4** The Reviewer checks the change, runs the applicable checks, and reports findings and a recommendation.
5. **3.5** Findings: return to the Coder briefing (3.1) under the [review-cycle rules](#review-cycle-rules). No findings: go to the Maintainer's review (3.6).
6. **3.6** The Maintainer reviews the file diffs, comments, and commits. Changes needed: the Coordinator reconciles the feedback with the commit and returns to briefing the remaining changes (3.1) under the review-cycle rules; the next review (3.3) covers the whole changed revision. No changes: the Maintainer gives final sign-off; go to the Architect's assessment (3.7).
7. **3.7** The Coordinator dispatches the Architect to assess the signed-off commit and takes the recommendations to the Maintainer. Authorized changes: return to the Coder briefing (3.1) under the review-cycle rules. None: go to the evidence check (3.8).
8. **3.8** The Coordinator confirms that the review, sign-off, and evidence match the current revision, and closes the stage.

The Coder's self-validation doesn't replace the independent review, and the Reviewer's acceptance doesn't complete the stage; only the evidence check (3.8) closes it.

### Review-cycle rules

Every return to the Coder briefing (3.1) follows these rules. No fix is authorized automatically.

- **G1** A cycle is one round of changes followed by one independent review.
- **G2** Each cycle needs the Maintainer's authorization. Starting the Coordinator on the issue authorizes the first, after the go-ahead for a `needs-triage` issue. A Maintainer's request for changes (3.6), or their authorization of an Architect recommendation (3.7) or a CI fix (F2), authorizes its cycle.
- **G3** Reviewer findings (3.5) return to the Coder briefing only after the Maintainer's go-ahead.
- **G4** An issue runs at most five cycles; a sixth or later needs an explicit extension from the Maintainer.
- **G5** Returning to the Coder briefing, from within Implement or from Publish, doesn't reset the cycle count.

### 4. Publish

1. **4.1** The Maintainer pushes to the remote.
2. **4.2** The Coordinator creates the PR, following [Open a pull request](../../CONTRIBUTING.md#open-a-pull-request).
3. **4.3** GitHub runs CI. Passes: go to the merge (4.4). Fails: follow the [CI failure path](#ci-failure-path).
4. **4.4** The Maintainer merges into `main`.
5. **4.5** GitHub deletes the remote branch.
6. **4.6** The Maintainer confirms the merge, and the Coordinator closes the stage.

#### CI failure path

- **F1** The Coordinator diagnoses the failure.
- **F2** A file change is needed: return to the Coder briefing (3.1) under the review-cycle rules and complete every step through the evidence check (3.8). Then the Maintainer pushes the new revision, the Coordinator reuses the same PR, and CI runs again.
- **F3** A transient failure with no file change: CI runs again on the same commit, and the issue stays in Publish.

Other Publish failures are open (O5).

### 5. Retro

Purpose: analyze what worked and what didn't, and identify improvements, including chances for mechanical enforcement the trial actually showed. Findings alone authorize no changes.

1. **5.1** The Coordinator runs `/retro`, the `mattpocock-skills:retro` skill.
2. **5.2** The Maintainer reviews the recommendations. For each approved one, the Coordinator drafts a GitHub issue, and creates it after the Maintainer approves the exact draft.
3. **5.3** The Coordinator closes the stage and tells the Maintainer the worktree is ready to archive. The Coordinator doesn't clean up or wait for the archive.

## Lifecycle definition

One YAML file holds the lifecycle. Its path and exact schema are open (O1).

Required content:

- **Stage order:** the sequence, Define through Retro.
- **Transitions:** the conditional jumps, such as "Reviewer findings: return to the Coder briefing (3.1)". Otherwise the next listed step follows.
- **IDs:** fixed stage and step references, such as `3.7` for the Architect's assessment.
- **Entry:** what must happen before a stage starts.
- **Exit:** the step that ends a stage.
- **Completion:** what must be true before that exit is allowed.
- **Roles:** who performs each step.
- **Evidence references:** where each step's proof lives: GitHub, chat, or the issue.

The file is documentation only. No schema validator, hook, or workflow engine reads or enforces it.

**Proposed** direction:

- **Readers:** agents and the Maintainer read it for the allowed steps, their order, and what completes each stage. An issue's actual progress is in its execution checkpoint.
- **Shape:** the five stages in order, each listing its steps, with the review-cycle rules and the CI failure path as separate entries.
- **IDs:** the stage and step numbers this spec uses, so review references carry over.
- **Steps:** each names its role, its action, any conditional next step, and where its evidence lives, following the evidence rule.
- **Status:** each item carries the same agreed or proposed status as this spec.
- **Pointers, not copies:** steps link to the role SOPs, CONTRIBUTING.md, and the QA reference for methods and checks, without restating them.

## Execution checkpoint (Proposed)

Each issue's progress is kept in a durable record of where it stands, separate from the shared lifecycle definition. It is a record, not a workflow engine, and it never counts as approval.

- **Contents:** the current stage and next step; completed stages and active waits; requirement and plan references with their revisions; the assessed revision and its evidence; the cycle count and recorded approvals; outstanding decisions.
- **Updates:** at each stage close and each key Maintainer decision.
- **Recovery:** a fresh or compacted Coordinator loads it and reconciles it with the current repository and issue before advancing.

Its location and format are open (O2).

## Affected documents (Proposed)

Each affected file and the direction of its change. [Appendix: Suggested edits](#appendix-suggested-edits) suggests exact wording. An entry tagged "if O…" applies only if that open decision goes the proposed way.

- **`docs/agents/roles/coordinator.md`:** describe the role as orchestrating work on an issue between the Maintainer and a team of agents. Keep its methods: workspace preparation and its stop-if-dirty safety, the readiness criteria, task tracking, one editor at a time, a separate Reviewer, agent check-ins, milestone updates, and the changed-requirements protocol. Leave timing to the lifecycle: the readiness handoff, the status change, the Architect's assessments, and the review-cycle policy. Add the oversight duties, the `/retro` skill, reporting at the lifecycle's handoffs, and, if O2 adopts the execution checkpoint, reconciling it at start.
- **`docs/agents/roles/planner.md`:** describe the role as capturing the Maintainer's intent and planning the implementation. Group its work into capturing requirements, planning the implementation, and limits. The plan's contents and the slicing guidance from the Coordinator SOP live here, and the Planner keeps the plan current with authorized feedback, taking scope questions to the Maintainer. Drop trigger and stop timing. The rule against editing repository files stays, pending O4.
- **`docs/agents/roles/architect.md`:** add the System Design as a whole to its remit. It assesses what the Coordinator sends, a plan or a commit, and the lifecycle sets the timing. It stays read-only and advisory; out-of-scope recommendations become suggested issues unless the Maintainer approves a change to the requirements.
- **`docs/agents/roles/coder.md` and `docs/agents/roles/reviewer.md`:** point to their steps in Implement. Their methods and checks stay.
- **`docs/agents/issue-tracker.md`** (if O3 adopts spec files): allow a spec file linked from its issue, and distinguish the issue's status, the shared workflow, and the issue's checkpoint.
- **`docs/agents/domain.md`** (if O3 adopts spec files): allow unresolved questions and agreed wording in the issue's linked spec file.
- **`GLOSSARY.md`:** the Coordinator, Planner, and Architect definitions state meaning, not procedure. The Maintainer approves the exact wording.
- **`AGENTS.md`** (if O3 adopts spec files): point its issues-and-specs sentence to the issue-tracker guide.
- **New lifecycle definition:** a YAML file at the path O1 sets, holding the [lifecycle definition](#lifecycle-definition).

## Acceptance criteria (Proposed)

- **AC1** The lifecycle definition exists and holds its [required content](#lifecycle-definition) for the five stages.
- **AC2** Each affected document follows its direction in [Affected documents](#affected-documents-proposed).
- **AC3** The sequence appears only in the definition; role SOPs and other documents point to it.
- **AC4** Native task lists show the active stage's applicable steps and keep the lifecycle open until the Coordinator closes Retro (5.3).
- **AC5** Implement can't complete on the Reviewer's acceptance alone; it needs the Maintainer's final sign-off and the Architect's assessment of the signed-off commit.
- **AC6** A trial issue runs through Publish and Retro, and the Maintainer decides the follow-ups.
- **AC7** The checks in [Validate your change](../../CONTRIBUTING.md#validate-your-change) pass for the changed files.

## Test approach (Proposed)

- **Implementation ([#66]):** the Coder runs the checks in [Validate your change](../../CONTRIBUTING.md#validate-your-change) for the changed files. A YAML file is outside CI's documentation path list, so CI runs its full checks. The Reviewer checks the definition against its [required content](#lifecycle-definition) and each affected document against its direction in [Affected documents](#affected-documents-proposed). No schema validator is added.
- **Trial ([#63]):** after #66 merges, a fresh agent runs #63 through the lifecycle in its own workspace. #63 still has the `needs-triage` label, so it enters at Define. The Maintainer relays the trial's observations to this #15 session and keeps the #15 branch and worktree open until the trial completes, so #15's archive notice, when Retro closes (5.3), comes after the trial.

## Open decisions

- **O1** The lifecycle definition's path and exact schema.
- **O2** The execution checkpoint's location and format. Proposed: a per-issue YAML file under `/tmp/issues/`, attached to the GitHub issue once the Retro's follow-up issues (5.2) are finished. Files under `/tmp` can disappear, so the checkpoint is durable only once attached. Whether "finished" means filed or implemented is open; Retro doesn't wait for it.
- **O3** Spec files. Proposed: allow them at `docs/specs/<issue>-<slug>.md`, with the conditional issue-tracker, domain, and AGENTS.md changes in [Affected documents](#affected-documents-proposed); this file would move there once the revisions settle.
- **O4** Where the plan is recorded, and whether the Planner may write repository files.
- **O5** Publish failures other than CI, such as PR review asking for changes or a pushed revision that differs from the signed-off commit. Changed content needs the affected checks, reviews, and sign-off again.
- **O6** How task tools show waits, reopened work, and evidence that a revision has invalidated.
- **O7** Whether #15's own spec PR closes #15 or leaves it open for the trial's observations. [#66]'s PR closes #66 as usual.

## Sources

Issues: [#15], [#35], [#38], [#48], [#63], [#65], and [#66]. Repository documents are linked where they're used.

## Appendix: Suggested edits

These are suggestions for the [#66] implementation agent, not verbatim acceptance requirements. Reconcile them with this spec's direction and the repository as it stands then. Where a suggestion conflicts with [Affected documents](#affected-documents-proposed), the direction there governs.

Each entry names the file, the section, and the From, To, or Add text. In the suggested text, "the lifecycle" links to the definition (O1), and existing links stay as they are. Headings in To text are proposals; no repository links point to the headings they replace. An edit tagged "if O…" applies only if that open decision goes the proposed way.

### `docs/agents/roles/coordinator.md`

- **Introduction**
  - From: "The Coordinator takes a GitHub issue from approval to a reviewed change. It plans the work, hands each part to the right role, and keeps the maintainer informed."
  - To: "The Coordinator orchestrates work on a GitHub issue between the maintainer and a team of agents. It runs the issue through the lifecycle, oversees the work against the approved requirements and plan, and keeps the maintainer informed."
- **Read**
  - Add after "The guides at the top level of `docs/agents/`": "The lifecycle"
- **Start**, kept for workspace preparation
  - Remove step 2, "If the issue has the `needs-triage` label, review it with the `mattpocock-skills:grilling` skill, asking the maintainer your questions one at a time, and wait for the go-ahead. Otherwise, skip this step." Define hands unready issues to the Planner (1.2).
  - Remove step 3, "Change the status of the selected issue from "To do" to "In progress". Confirm the status change or describe the error encountered." Define makes the status change (1.5); Orchestrate the work keeps the confirmation method.
  - Step 4, now step 2: add at the end: "Show the active stage's steps, and keep the lifecycle open until it completes."
  - New step 3 (if the execution checkpoint is adopted): "Load the issue's execution checkpoint, if there is one, and reconcile it with the repository and issue before advancing."
- **Check that the issue is ready**
  - Remove "Hand an issue that isn't ready to a Planner, saying what's missing." The criteria stay; Define makes the handoff (1.2).
- **Plan the work and Run the work**
  - From: both sections in full, headings included.
  - To, two sections. The oversight duties are agreed; this wording is proposed.
    - "## Orchestrate the work"
      - "Brief each role at the step the lifecycle gives it, with the inputs that role needs."
      - "When the lifecycle changes the issue's status, make the change and confirm it, or describe the error encountered."
      - The existing "Hand the implementation to a Coder and the review to a separate Reviewer …" bullet, unchanged.
      - The existing "Let one agent edit files at a time …" and "Track which agent owns what …" bullets, unchanged.
      - "Run review cycles under the lifecycle's review-cycle rules."
      - "Run the Retro with `/retro`, the `mattpocock-skills:retro` skill."
      - The existing "Check on the agents you started every 15 minutes …" bullet, unchanged.
    - "## Oversee the work"
      - "Compare the work with the lifecycle, the approved requirements, and the plan throughout the issue. Check readiness and plan adherence before closing each stage."
      - "Resolve omissions, deviations, and conflicts between requirements, plans, code, and reviews directly with the agents when the approved materials already answer them."
      - "Pause the affected work, and take anything that needs a new approach, or would change the scope, an acceptance criterion, or a recorded decision, to the maintainer. Send every affected agent the resulting change, as When approved requirements change describes."
      - "Leave correctness review to the Reviewer. Oversight adds no approval gate."
      - The existing "Update the maintainer at each design and implementation milestone …" bullet, unchanged.
  - The "Look for work that can run in parallel …" bullet moves to the Planner SOP. The Architect timing and the review-cycle policy move to the lifecycle: Plan (2.3), Implement (3.7), and the review-cycle rules.
- **Hand back**
  - From: the entire section body, including "Stop and give the maintainer:", its list, and the final paragraph. Retain the heading.
  - To: "Report to the maintainer at the lifecycle's handoffs. For their diff review, give a summary of the change, what was checked, open issues, and a suggested commit message. With the final Architect assessment, give the assessment and any suggested new issues. Open each pull request using the pull request template." Keep the template link.

### `docs/agents/roles/planner.md`

- **Introduction**
  - From: "The Planner gets GitHub issues ready for a Coder."
  - To: "The Planner captures the maintainer's intent and plans the implementation of the issue."
- **Work**
  - From: the entire section, heading included.
  - To, three sections:
    - "## Capture requirements": the existing "Triage issues, interview the maintainer …", "When an interview settles a project term …", and "After an interview, check open issues …" bullets, unchanged.
    - "## Plan the implementation"
      - "Build the implementation plan: affected files, sequence, role assignments, dependencies, handoffs, and validation evidence."
      - The Coordinator's "Look for work that can run in parallel …" bullet, unchanged.
      - "Keep the plan current with authorized feedback, such as the Architect's recommendations. Take scope questions to the maintainer through the Coordinator."
    - "## Limits": the existing "The `mattpocock-skills:triage` …", "Work only from the repository …", and "Never edit repository files …" bullets, unchanged. The last depends on O4.
- **Hand back**
  - From: "Stop when the issue is ready for a Coder, and report:"
  - To: "Report:"
  - Add after "proposed updates still waiting for the maintainer's approval": "the implementation plan, with each Architect recommendation and its decision"

### `docs/agents/roles/architect.md`

- **Introduction**
  - From: "The Architect looks after the overall health of the codebase. It assesses every issue, and is read-only."
  - To: "The Architect looks after the overall health of the codebase and the System Design as a whole. It assesses every issue, and is read-only."
- **Work**
  - From: "The Coordinator asks you to assess each issue twice:" and its two bullets, "Before coding: assess the plan." and "After the change's last review: compare the codebase before and after the change."
  - To: "Assess what the Coordinator sends you:" with the bullets "A plan: assess the plan." and "A commit: compare the codebase before and after the change."
  - From: "Anything outside the current issue becomes a suggested new issue for the Planner and the maintainer, never extra work in the current change."
  - To: "Anything outside the current issue goes to the maintainer as a suggested new issue. It becomes current work only when the maintainer approves a change to the requirements."

### `docs/agents/roles/coder.md`

- **Read**
  - Add after "The QA reference": "The lifecycle's Implement stage"

### `docs/agents/roles/reviewer.md`

- **Read**
  - Add after "The QA reference": "The lifecycle's review steps in Implement"

### `docs/agents/issue-tracker.md`

- **Introduction** (if O3 adopts spec files)
  - Add after "Issues and specs live in this code repository's GitHub Issues, not in its wiki.": "When the maintainer asks for a spec as a repository file for diff review, keep it at `docs/specs/<issue>-<slug>.md` and link it from the issue. The GitHub issue tracks its status, the lifecycle definition holds the shared workflow, and the execution checkpoint, if adopted, holds the issue's progress."

### `docs/agents/domain.md`

- **Scope and entry format** (if O3 adopts spec files)
  - From: "Keep unresolved questions in the issue."
  - To: "Keep unresolved questions in the issue, or in the spec file the issue links to."
- **Add or revise an entry, step 3** (if O3 adopts spec files)
  - From: "During an interview, retain agreed wording in the issue until repository implementation is authorized."
  - To: "During an interview, retain agreed wording in the issue or its linked spec file until repository implementation is authorized."

### `GLOSSARY.md`

- **Roles**, subject to the Maintainer's approval under [Add or revise an entry](../agents/domain.md#add-or-revise-an-entry)
  - Coordinator, from: "The agent role that takes a GitHub issue from approval to a reviewed change, handing each part to the right role."
  - Coordinator, to: "The agent role that orchestrates work on a GitHub issue between the Maintainer and a team of agents."
  - Planner, from: "The agent role that gets GitHub issues ready for a Coder through triage, maintainer interviews, and issue writing."
  - Planner, to: "The agent role that captures the Maintainer's intent and plans the implementation of a GitHub issue."
  - Architect, from: "The read-only agent role that assesses every issue for code health: the plan before coding, and the change after its last review."
  - Architect, to: "The agent role responsible for the overall health of the codebase and the System Design as a whole."

### `AGENTS.md` (`CLAUDE.md` is a symlink to it)

- **Agent skills, Issue tracker** (if O3 adopts spec files)
  - From: "Issues and specs live in this code repository's GitHub Issues, not its wiki."
  - To: "Issues live in this code repository's GitHub Issues, not its wiki. For issues and specs, see `docs/agents/issue-tracker.md`."

### New: the lifecycle definition

- Add: a file at the path O1 sets, holding the [lifecycle definition](#lifecycle-definition).

[#15]: https://github.com/joebaz/web-starter/issues/15
[#35]: https://github.com/joebaz/web-starter/issues/35
[#38]: https://github.com/joebaz/web-starter/issues/38
[#48]: https://github.com/joebaz/web-starter/issues/48
[#63]: https://github.com/joebaz/web-starter/issues/63
[#65]: https://github.com/joebaz/web-starter/issues/65
[#66]: https://github.com/joebaz/web-starter/issues/66
