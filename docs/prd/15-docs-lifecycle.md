# Docs lifecycle spec (draft)

> **Status:** Draft for Maintainer review. [#15] tracks requirements, decisions, and status. Everything here is agreed direction except sections and items labeled **Proposed**. The current role SOPs govern all work until an approved implementation changes them.

## Problem

No single definition says how agents should sequence work or collaborate on an issue, where each stage starts and ends, or what evidence completes it. As a result:

- **Review boundaries blur.** In [#38], the Coordinator treated the Reviewer's acceptance as the last review and closed its task plan before the Maintainer's final acceptance and the final Architect assessment. The Architect SOP's "after the change's last review" doesn't say which review.
- **Requirements have no route to approval.** [coding-standards.md](../../coding-standards.md#scope-and-project-choices) asks agents to flag missing decisions and scope changes, but nothing turns those discussions into approved requirements.
- **Oversight is implicit.** Nothing asks the Coordinator to check ongoing work against the approved requirements and plan.

## Goal and scope

Define, implement, and test the lifecycle for Docs work as one thin vertical slice, so any role can tell where an issue stands, what comes next, and what evidence completes each step.

This spec defines the lifecycle in [#15]; once it's approved, [#66] implements it and merges it into `main`, a fresh agent [trials it on #63](#test-approach-proposed), and the Retros and observations from #66 and #63 return to #15 for a final spec revision before #15 closes.

Out of scope:

- Content, Fix, and Feature variations.
- New skills.
- GitHub Actions, hooks, schema validators, workflow engines, or other enforcement automation.
- Enforcement issues, unless a trial or Retro shows the need and the Maintainer decides. [#65], a display test the Maintainer requested and blocked by #15, is separate.
- A separate audit record.
- A central project-reference catalogue, or turning Wiki checklist items into agent workflows automatically.
- The decisions for [#35] (reporting), [#48] (enforcement), and [#63] (classification).

## Lifecycle rules

- **Definition:** one YAML file under `docs/` holds the lifecycle, the authoritative operational sequence for Docs issues; this spec stays its design record. Content, Fix, and Feature issues keep the current SOP and CONTRIBUTING.md sequencing until their own lifecycles are defined. See [Lifecycle definition](#lifecycle-definition).
- **When versus how:** for Docs issues, the lifecycle owns when work happens: sequence, handoffs, approval gates, and loops. Role SOPs own how each role works: responsibilities, authority, methods, inputs, outputs, quality, and references. [CONTRIBUTING.md](../../CONTRIBUTING.md) keeps contribution mechanics and checks; the coding standards and the [QA reference](../qa.md) keep their subjects.
- **Evidence:** PR and CI evidence stays in GitHub. Detailed reports go in chat, following the [QA reference](../qa.md).
- **Issue state:** each issue's current stage, next action, and waits are kept apart from the shared definition, in its [execution checkpoint](#execution-checkpoint). YAML could hold either; the split keeps one issue's progress out of the workflow every Docs issue shares.
- **Task tracking:** native task tools (`update_plan` in Codex; `TaskCreate` and `TaskUpdate` in Claude Code) show the active stage's applicable steps as descriptive tasks, and the lifecycle stays open until the Coordinator closes Retro (5.3). The Coordinator starts each response to the Maintainer with a one-line readout of the stage and its applicable steps, such as `Stage: Implement 3 of 7 done`.
- **Artifacts:** create task artifacts only when the work needs them. Specs live at `docs/specs/<issue>-<slug>.md`, linked from their issue, and plans at `docs/plans/<issue>-<slug>.md`. This spec moves to `docs/specs/` once this review settles. Agent-facing instructions and project-owned references stay in the repository; the Wiki stays the Maintainer's checklist.

## Authorization rules

These boundaries apply at every stage; each stage names its own decisions at the step where they happen.

- **Decisions:** the Maintainer approves requirements, scope, and any change to them.
- **Findings:** agent findings, recommendations, and reports authorize nothing on their own.
- **Records:** the execution checkpoint and status readouts record progress; neither counts as approval.
- **Changed requirements:** follow [When approved requirements change](../agents/roles/coordinator.md#when-approved-requirements-change) and the matching rule in AGENTS.md.

## Stages

Stages run in order: Define, Plan, Implement, Publish, Retro. Closing Define, Plan, Implement, or Publish opens the next stage. Closing Retro (5.3) completes the lifecycle, and the checkpoint upload (5.4) follows after completion.

### 1. Define

Purpose: turn the issue into approved requirements that are ready to plan.

Entry: the Maintainer starts a Coordinator on an issue.

1. **1.1** The Coordinator runs the [Start](../agents/roles/coordinator.md#start) checks and [Check that the issue is ready](../agents/roles/coordinator.md#check-that-the-issue-is-ready). Already approved and ready: go straight to the readiness confirmation (1.5), with no repeat interview or approval. Otherwise: go to the Planner handoff (1.2).
2. **1.2** The Coordinator sends the `needs-triage` or otherwise unready issue to the Planner, naming the gaps.
3. **1.3** The Planner interviews the Maintainer and records the agreed requirements in the issue, or in an issue-linked spec when that helps align them with the Maintainer, following the [Planner SOP](../agents/roles/planner.md) and the [triage labels](../agents/triage-labels.md).
4. **1.4** The Maintainer reviews the requirements. Changes needed: back to the interview (1.3). Accepted: go to the readiness confirmation (1.5).
5. **1.5** The Coordinator confirms the issue is ready, moves it from "To do" to "In progress", and closes the stage. Plan needs no further approval.

### 2. Plan

Purpose: decide how the change will be built, checked, and handed off before implementation begins.

1. **2.1** The Coordinator briefs the Planner on the approved requirements, artifacts, and constraints.
2. **2.2** The Planner builds the implementation plan in `docs/plans/`.
3. **2.3** The Coordinator asks the Architect to assess the plan.
4. **2.4** The Planner reviews the Architect's recommendations. In scope: the Planner revises the plan. Out of scope: the Planner refers them to the Coordinator, who brings them to the Maintainer.
5. **2.5** The Maintainer decides each pending out-of-scope recommendation once. The Planner revises the plan for approved ones, and the changed-requirements protocol applies.
6. **2.6** The Coordinator closes the stage.

### 3. Implement

Purpose: produce the change and carry it through independent review, the Maintainer's sign-off, and the final Architect assessment.

A review cycle is one round of changes followed by one independent review. Each cycle needs the Maintainer's authorization: starting the Coordinator on the issue authorizes the first, after the go-ahead for a `needs-triage` issue, and each later cycle starts only from a Maintainer request for changes or an authorized fix. An issue runs at most five cycles; a sixth or later needs an explicit extension from the Maintainer. Returning to the Coder briefing (3.1), from within Implement or from Publish, doesn't reset the count.

1. **3.1** The Coordinator briefs the Coder on the requirements, plan, references, and assignment.
2. **3.2** The Coder implements the Maintainer's change and validates it as the plan and the repository's [validation requirements](../../CONTRIBUTING.md#validate-your-change) require. New or substantially revised document: the Coder first sends a short outline to the Coordinator, who gets the Maintainer's approval; the Coder expands it only then.
3. **3.3** The Coordinator dispatches the Reviewer.
4. **3.4** The Reviewer checks the change, runs the applicable checks, and reports findings and a recommendation. Findings: after the Maintainer's go-ahead, return to the Coder briefing (3.1). No findings: go to the Maintainer's review (3.5).
5. **3.5** The Maintainer reviews the file diffs, comments, and commits. Changes needed: the Coordinator reconciles the feedback with the commit and returns to briefing the remaining changes (3.1); the next review (3.3) covers the whole changed revision. No changes: the Maintainer gives final sign-off; go to the Architect's assessment (3.6).
6. **3.6** The Coordinator dispatches the Architect to assess the signed-off commit and takes the recommendations to the Maintainer. Authorized changes: return to the Coder briefing (3.1). None: go to the evidence check (3.7).
7. **3.7** The Coordinator confirms that the current revision has the Maintainer's final sign-off and the final Architect assessment, and that the review and evidence match it, then closes the stage.

### 4. Publish

Purpose: get the signed-off revision through CI and merged into `main`.

1. **4.1** The Maintainer pushes to the remote.
2. **4.2** The Coordinator opens the PR, following [Open a pull request](../../CONTRIBUTING.md#open-a-pull-request), or reuses the issue's open PR for a new revision.
3. **4.3** GitHub runs CI. Passes: go to the merge (4.5). Fails: go to the diagnosis (4.4).
4. **4.4** The Coordinator diagnoses the failure. A file change is needed: with the Maintainer's authorization, return to the Coder briefing (3.1) and complete Implement through the evidence check (3.7), then push the new revision to the same PR (4.1). A transient failure with no file change: CI runs again on the same commit (4.3).
5. **4.5** The Maintainer merges into `main`. Pending PR feedback, or a pushed revision that differs from the signed-off commit, blocks the merge even when CI passes: the Coordinator reports the blocker in chat and waits for the Maintainer's direction, and any file change takes the file-change path in the diagnosis (4.4).
6. **4.6** GitHub deletes the remote branch.
7. **4.7** The Maintainer confirms the merge, and the Coordinator closes the stage.

### 5. Retro

Purpose: review the work and file approved follow-up issues.

1. **5.1** The Coordinator runs `/retro` (`mattpocock-skills:retro`) and presents candidate issue drafts.
2. **5.2** The Maintainer reviews each draft. Comments: the Coordinator revises it for another review. Approved: the Coordinator files it exactly as approved. Declined: it's dropped.
3. **5.3** With every draft filed or dropped, the Coordinator confirms all stage obligations are met and closes Retro, completing the lifecycle.
4. **5.4** The Coordinator uploads the final [execution checkpoint](#execution-checkpoint) to an issue comment. Success: the Coordinator tells the Maintainer, who archives the worktree. Failure: the Coordinator reports it and holds that notice until an upload succeeds.

## Lifecycle definition

One YAML file under `docs/` holds the lifecycle. The [#66] Coder chooses its filename, exact schema, and step names; the step numbers in this spec are for draft discussion only.

Required content:

- **Stage order:** the sequence, Define through Retro.
- **Step keys:** each step has a stable semantic name, such as `coder-briefing`, independent of its position, so a step can move within or across stages without being renamed. Keys needn't be UUIDs, and other documents needn't cite them.
- **Transitions:** the conditional jumps, each targeting a step key, such as "Reviewer findings: return to `coder-briefing`". Otherwise the next listed step follows.
- **Entry:** what must happen before a stage starts.
- **Exit:** the step that ends a stage.
- **Completion:** what must be true before that exit is allowed.
- **Roles:** who performs each step.
- **Evidence references:** where each step's proof lives: GitHub, chat, or the issue.

The file is documentation only. No schema validator, hook, or workflow engine reads or enforces it.

**Proposed** direction:

- **Readers:** agents and the Maintainer read it for the allowed steps, their order, and what completes each stage. An issue's actual progress is in its execution checkpoint.
- **Shape:** the five stages in order, each listing its steps.
- **Steps:** each names its role, its action, any conditional next step, and where its evidence lives, following the evidence rule.
- **Status:** each item carries the same agreed or proposed status as this spec.
- **Pointers, not copies:** steps link to the role SOPs, CONTRIBUTING.md, and the QA reference for methods and checks, without restating them.

## Execution checkpoint

One YAML file per issue under `/tmp/issues/` records where the issue stands, separate from the shared lifecycle definition. It's a working record, not a workflow engine.

- **Contents:** the current stage and next step; completed stages and active waits; requirement and plan references with their revisions; the assessed revision and its evidence; the cycle count and recorded approvals; outstanding decisions.
- **Updates:** at each stage close and each key Maintainer decision.
- **Recovery:** a fresh or compacted Coordinator loads it and reconciles it with the current repository and issue before advancing.
- **Durability:** files under `/tmp` can disappear; the lasting copy is the one uploaded to the GitHub issue after the lifecycle completes (5.4).

## Affected documents (Proposed)

Each affected file and the direction of its change. Role SOP changes apply to Docs issues and keep the current sequencing for other issue types, as [Lifecycle rules](#lifecycle-rules) states. [Appendix: Suggested edits](#appendix-suggested-edits) suggests exact wording.

- **`docs/agents/roles/coordinator.md`:** describe the role as orchestrating work on an issue between the Maintainer and a team of agents. Keep its methods: workspace preparation and its stop-if-dirty safety, the readiness criteria, task tracking, one editor at a time, a separate Reviewer, agent check-ins, milestone updates, and the changed-requirements protocol. For Docs issues, leave timing to the lifecycle: the readiness handoff, the status change, the Architect's assessments, and the review-cycle policy. Keep the current sequencing for other issue types in its own section. Add the oversight duties for every issue and, in a Docs-only section, the lifecycle methods: the `/retro` skill, reporting at the lifecycle's handoffs, the execution checkpoint, and the stage readout.
- **`docs/agents/roles/planner.md`:** describe the role as capturing the Maintainer's intent and, for Docs issues, planning the implementation. Group its work into capturing requirements, planning the implementation of Docs issues, and limits. The plan's contents and the slicing guidance from the Coordinator SOP live here, and the Planner keeps the plan current with authorized feedback, taking scope questions to the Maintainer. For a Docs issue, it may create and update an issue-linked spec at `docs/specs/<issue>-<slug>.md`, when that helps align requirements with the Maintainer, and its plan at `docs/plans/<issue>-<slug>.md`. These are the only repository files it edits, one editor at a time; for other issue types it edits none. Remove Docs dispatch and handoff timing from it, keeping the "Stop when the issue is ready for a Coder" stop point only for other issue types, and add no trigger on the Coordinator's briefing: the lifecycle owns dispatch and handoffs, and the Planner SOP describes the Planner's responsibilities and methods.
- **`docs/agents/roles/architect.md`:** assess plans and signed-off commits against approved goals, prior decisions, and any vision documents, then consider future adaptability. The Template aims to make website redesign, coding, and deployment fast; flag Project-specific values or examples made into Template-wide rules and dependencies that make change harder. Include codebase health and System Design. The lifecycle sets timing for Docs issues, and the Coordinator SOP for others. Keep the role read-only and advisory; out-of-scope work needs Maintainer-approved requirements.
- **`docs/agents/roles/coder.md`:** point to its Docs lifecycle steps in Implement. For Docs issues, write for the intended reader with minimal jargon, give each section a clear question or purpose, use terms consistently, and surface open questions. Its own validation doesn't replace the independent review, and it makes a fix only when assigned, since no fix is authorized automatically. Its methods and checks stay.
- **`docs/agents/roles/reviewer.md`:** point to its Docs lifecycle steps in Implement. For documentation changes, check for contradictions, unsupported assumptions, and unclear wording. Its acceptance doesn't complete the change. Its methods and checks stay.
- **`docs/agents/issue-tracker.md`:** specs live at `docs/specs/<issue>-<slug>.md`, linked from their issue. Distinguish the issue's status, the shared workflow, and the issue's checkpoint.
- **`docs/agents/domain.md`:** allow unresolved questions and agreed wording in the issue's linked spec file.
- **`GLOSSARY.md`:** the Coordinator, Planner, and Architect definitions state meaning, not procedure. The Maintainer approves the exact wording.
- **`AGENTS.md`:** point its issues-and-specs sentence to the issue-tracker guide.
- **`CONTRIBUTING.md` and `.github/pull_request_template.md`:** allow `Refs #<number>` for a PR whose issue stays open after the merge, such as #15's spec PR. Other PRs, such as #66's, keep `Closes`.
- **New lifecycle definition:** a YAML file under `docs/`, holding the [lifecycle definition](#lifecycle-definition).

## Acceptance criteria (Proposed)

- **AC1** The lifecycle definition exists and holds its [required content](#lifecycle-definition) for the five stages.
- **AC2** Each affected document follows its direction in [Affected documents](#affected-documents-proposed).
- **AC3** For Docs issues, the definition is the authoritative operational sequence: role SOPs point to it and keep their guidance for other issue types, and this spec stays the design record.
- **AC4** Native task lists show the active stage's applicable steps and keep the lifecycle open until the Coordinator closes Retro (5.3).
- **AC5** Implement can't complete on the Reviewer's acceptance alone; it needs the Maintainer's final sign-off and the Architect's assessment of the signed-off commit.
- **AC6** A trial issue runs through Publish and Retro, and the Maintainer decides the follow-ups.
- **AC7** The checks in [Validate your change](../../CONTRIBUTING.md#validate-your-change) pass for the changed files.

## Test approach (Proposed)

- **Implementation ([#66]):** the Coder runs the checks in [Validate your change](../../CONTRIBUTING.md#validate-your-change) for the changed files. A YAML file is outside CI's documentation path list, so CI runs its full checks. The Reviewer checks the definition against its [required content](#lifecycle-definition) and each affected document against its direction in [Affected documents](#affected-documents-proposed). No schema validator is added.
- **Trial ([#63]):** after #66 merges, a fresh agent runs #63 through the lifecycle in its own workspace. #63 still has the `needs-triage` label, so it enters at Define. #15's spec PR links with `Refs #15`, so #15 stays open: the Maintainer brings the #66 and #63 Retros and observations to the #15 Coordinator, the spec is revised, and #15 then closes. #15's own Retro (5.3) follows that revision.

## Sources

Issues: [#15], [#35], [#38], [#48], [#63], [#65], and [#66]. Repository documents are linked where they're used.

## Appendix: Suggested edits

These are suggestions for the [#66] implementation agent, not verbatim acceptance requirements. Reconcile them with this spec's direction and the repository as it stands then. Where a suggestion conflicts with [Affected documents](#affected-documents-proposed), the direction there governs.

Each entry names the file, the section, and the From, To, or Add text. In the suggested text, "the lifecycle" links to the definition, and existing links stay as they are. Headings in To text are proposals; no repository links point to the headings they replace.

### `docs/agents/roles/coordinator.md`

- **Introduction**
  - From: "The Coordinator takes a GitHub issue from approval to a reviewed change. It plans the work, hands each part to the right role, and keeps the maintainer informed."
  - To: "The Coordinator orchestrates work on a GitHub issue between the maintainer and a team of agents. It runs Docs issues through the lifecycle, oversees the work against the approved requirements and plan, and keeps the maintainer informed."
- **Read**
  - Add after "The guides at the top level of `docs/agents/`": "The lifecycle, for Docs issues"
- **Start**, kept for workspace preparation
  - Move step 2 to Other issue types: "If the issue has the `needs-triage` label, review it with the `mattpocock-skills:grilling` skill, asking the maintainer your questions one at a time, and wait for the go-ahead. Otherwise, skip this step." Define hands unready Docs issues to the Planner (1.2).
  - Move step 3 to Other issue types: "Change the status of the selected issue from "To do" to "In progress". Confirm the status change or describe the error encountered." For Docs issues, Define makes the status change (1.5); the Docs issues section keeps the confirmation method.
  - Step 4, now step 2: add at the end: "For a Docs issue, show the active stage's steps, and keep the lifecycle open until it completes."
  - New step 3: "For a Docs issue, load the issue's execution checkpoint from `/tmp/issues/`, if there is one, and reconcile it with the repository and issue before advancing."
- **Check that the issue is ready**
  - Move "Hand an issue that isn't ready to a Planner, saying what's missing." to Other issue types. The criteria stay; for Docs issues, Define makes the handoff (1.2).
- **Plan the work and Run the work**
  - From: both sections in full, headings included.
  - To, four sections. The oversight duties are agreed; this wording is proposed.
    - "## Orchestrate the work"
      - "Brief each role with the inputs it needs."
      - The existing "Hand the implementation to a Coder and the review to a separate Reviewer …" bullet, unchanged.
      - The existing "Let one agent edit files at a time …" and "Track which agent owns what …" bullets, unchanged.
      - The existing "Check on the agents you started every 15 minutes …" bullet, unchanged.
    - "## Oversee the work"
      - "Compare the work with the approved requirements and the plan throughout the issue."
      - "Resolve omissions, deviations, and conflicts between requirements, plans, code, and reviews directly with the agents when the approved materials already answer them."
      - "Pause the affected work, and take anything that needs a new approach, or would change the scope, an acceptance criterion, or a recorded decision, to the maintainer. Send every affected agent the resulting change, as When approved requirements change describes."
      - "Leave correctness review to the Reviewer. Oversight adds no approval gate."
      - The existing "Update the maintainer at each design and implementation milestone …" bullet, unchanged.
    - "## Docs issues"
      - "Run each Docs issue through the lifecycle: brief each role at the step the lifecycle gives it, and check readiness and plan adherence before closing each stage."
      - "When the lifecycle changes the issue's status, make the change and confirm it, or describe the error encountered."
      - "Run review cycles as the lifecycle's Implement stage sets out."
      - "Keep the issue's execution checkpoint current at each stage close and each key maintainer decision. After the lifecycle completes, upload it to a comment on the issue, and give the archive notice only once an upload succeeds."
      - "Run the Retro with `/retro`, the `mattpocock-skills:retro` skill."
      - "Start each response to the maintainer with a stage readout, such as `Stage: Implement 3 of 7 done`."
    - "## Other issue types"
      - "Until their own lifecycles are defined, Content, Fix, and Feature issues follow these steps instead of the lifecycle."
      - Start steps 2 and 3 and the "Hand an issue that isn't ready …" sentence, moved unchanged.
      - The existing "Look for work that can run in parallel …", "For every issue, ask an Architect …", and "Work in review cycles …" bullets, unchanged.
      - The existing Hand back paragraph "After the maintainer commits, pushes, and says so, open the pull request …", moved unchanged.
  - For Docs issues, the "Look for work that can run in parallel …" guidance also goes to the Planner SOP, and the Architect timing and the review-cycle policy move to the lifecycle: Plan (2.3) and Implement (its cycle rules and 3.6).
- **Hand back**
  - From: the entire section body, including "Stop and give the maintainer:", its list, and the final paragraph. Retain the heading.
  - To: "Report to the maintainer at the lifecycle's handoffs for a Docs issue, or when the change is ready for other issue types. For their diff review, give a summary of the change, what was checked, open issues, and a suggested commit message. With the final Architect assessment, give the assessment and any suggested new issues. Open each pull request using the pull request template, linking its issue as Open a pull request describes." Keep the template link.

### `docs/agents/roles/planner.md`

- **Introduction**
  - From: "The Planner gets GitHub issues ready for a Coder."
  - To: "The Planner captures the maintainer's intent and, for Docs issues, plans the implementation."
- **Work**
  - From: the entire section, heading included.
  - To, three sections:
    - "## Capture requirements": the existing "Triage issues, interview the maintainer …", "When an interview settles a project term …", and "After an interview, check open issues …" bullets, unchanged, and "For a Docs issue, when a spec helps align the requirements with the maintainer, keep them in an issue-linked spec at `docs/specs/<issue>-<slug>.md`."
    - "## Plan the implementation", for Docs issues; the Coordinator plans other issue types:
      - "Build the implementation plan in `docs/plans/<issue>-<slug>.md`: affected files, sequence, role assignments, dependencies, handoffs, and validation evidence."
      - The Coordinator's "Look for work that can run in parallel …" bullet, unchanged.
      - "Keep the plan current with authorized feedback, such as the Architect's recommendations. Take scope questions to the maintainer through the Coordinator."
    - "## Limits": the existing "The `mattpocock-skills:triage` …" and "Work only from the repository …" bullets, unchanged, and in place of "Never edit repository files. Put proposed file changes in the issue as exact text.": "Edit no repository files, except, for a Docs issue, its linked spec in `docs/specs/` and its plan in `docs/plans/`, one editor at a time. Put any other proposed file changes in the issue as exact text."
- **Hand back**
  - From: "Stop when the issue is ready for a Coder, and report:"
  - To: "For other issue types, stop when the issue is ready for a Coder. Report:"
  - Add after "proposed updates still waiting for the maintainer's approval": "the implementation plan, with each Architect recommendation and its decision"

### `docs/agents/roles/architect.md`

- **Introduction**
  - From: "The Architect looks after the overall health of the codebase. It assesses every issue, and is read-only."
  - To: "The Architect looks after the overall health of the codebase and the System Design as a whole, keeping both consistent with the approved intent of the Template or Project. It assesses every issue, and is read-only."
- **Read**
  - Add after "The issue and the code it touches": "The approved intent of the Template or Project, and any vision documents"
- **Work**
  - From: "The Coordinator asks you to assess each issue twice:" and its two bullets, "Before coding: assess the plan." and "After the change's last review: compare the codebase before and after the change."
  - To: "Assess what the Coordinator sends you:" with the bullets "A plan: assess the plan." and "A commit: compare the codebase before and after the change."
  - Add as the first criterion: "**Design intent:** whether the plan or change fits the Template's purpose of fast website redesign, coding, and deployment or the Project's approved goals, preserves prior design decisions, and keeps future changes easy. Flag Project-specific values or examples made into Template-wide rules and unnecessary dependencies."
  - From: "Anything outside the current issue becomes a suggested new issue for the Planner and the maintainer, never extra work in the current change."
  - To: "Anything outside the current issue goes to the maintainer as a suggested new issue. It becomes current work only when the maintainer approves a change to the requirements."

### `docs/agents/roles/coder.md`

- **Read**
  - Add after "The QA reference": "The lifecycle's Implement stage, for Docs issues"
- **Work**
  - Add after the "Run the required checks …" bullet: "Your own validation doesn't replace the independent review.", "Make a fix only when the Coordinator assigns it; no fix is authorized automatically.", and "For a Docs issue, write for the intended reader with minimal jargon. Give each section a clear question or purpose, use the glossary's terms consistently, and surface open questions instead of guessing."

### `docs/agents/roles/reviewer.md`

- **Read**
  - Add after "The QA reference": "The lifecycle's review steps in Implement, for Docs issues"
- **Review**
  - Add after "Fix nothing. Report each finding for the Coder to fix.": "Your acceptance informs the maintainer's decision; it doesn't complete the change."

### `docs/agents/issue-tracker.md`

- **Introduction**
  - From: "Issues and specs live in this code repository's GitHub Issues, not in its wiki."
  - To: "Issues live in this code repository's GitHub Issues, not in its wiki. Specs live in `docs/specs/<issue>-<slug>.md`, linked from their issue. The issue tracks its status, the lifecycle definition holds the shared workflow, and the issue's execution checkpoint records its progress."

### `docs/agents/domain.md`

- **Scope and entry format**
  - From: "Keep unresolved questions in the issue."
  - To: "Keep unresolved questions in the issue, or in the spec file the issue links to."
- **Add or revise an entry, step 3**
  - From: "During an interview, retain agreed wording in the issue until repository implementation is authorized."
  - To: "During an interview, retain agreed wording in the issue or its linked spec file until repository implementation is authorized."

### `GLOSSARY.md`

- **Roles**, subject to the Maintainer's approval under [Add or revise an entry](../agents/domain.md#add-or-revise-an-entry)
  - Coordinator, from: "The agent role that takes a GitHub issue from approval to a reviewed change, handing each part to the right role."
  - Coordinator, to: "The agent role that orchestrates work on a GitHub issue between the Maintainer and a team of agents."
  - Planner, from: "The agent role that gets GitHub issues ready for a Coder through triage, maintainer interviews, and issue writing."
  - Planner, to: "The agent role that captures the Maintainer's intent and plans the implementation of a GitHub issue."
  - Architect, from: "The read-only agent role that assesses every issue for code health: the plan before coding, and the change after its last review."
  - Architect, to: "The agent role responsible for the overall health of the codebase and the System Design as a whole, consistent with the approved intent of the Template or Project."

### `AGENTS.md` (`CLAUDE.md` is a symlink to it)

- **Agent skills, Issue tracker**
  - From: "Issues and specs live in this code repository's GitHub Issues, not its wiki."
  - To: "Issues live in this code repository's GitHub Issues, not its wiki. For issues and specs, see `docs/agents/issue-tracker.md`."

### `CONTRIBUTING.md`

- **Open a pull request**
  - From: "Link the pull request to the relevant GitHub Issue or Sub-Issue with `Closes #<number>`."
  - To: "Link the pull request to the relevant GitHub Issue or Sub-Issue with `Closes #<number>`, or with `Refs #<number>` when the issue stays open after the merge."

### `.github/pull_request_template.md`

- **First line**
  - From: `Closes #<issue-or-sub-issue-number>`
  - To: `Closes #<issue-or-sub-issue-number> <!-- or Refs #<number> when the issue stays open after the merge -->`

### New: the lifecycle definition

- Add: a YAML file under `docs/`, named by the #66 Coder, holding the [lifecycle definition](#lifecycle-definition).

[#15]: https://github.com/joebaz/web-starter/issues/15
[#35]: https://github.com/joebaz/web-starter/issues/35
[#38]: https://github.com/joebaz/web-starter/issues/38
[#48]: https://github.com/joebaz/web-starter/issues/48
[#63]: https://github.com/joebaz/web-starter/issues/63
[#65]: https://github.com/joebaz/web-starter/issues/65
[#66]: https://github.com/joebaz/web-starter/issues/66
