# Implementation plans

This directory holds the implementation plan for each issue that has one, for every issue type, and each spec-only parent's [Coordination Plans](#coordination-plans). The Planner writes and updates them under the [Planner SOP](../agents/roles/planner.md#plan-the-implementation).

Name each plan `<issue>-<slug>.md`: the issue number, then a short lowercase kebab-case description, such as `123-update-contact-guide.md`. Link the plan from its issue.

An implementation plan is an ordered list of operations for one issue, which is one Vertical Slice. Operations are numbered pieces of work inside the plan; they are not Vertical Slices or Lifecycle steps. Link the approved requirements instead of copying them, and scale the plan to the issue: a small change may need only one or two operations.

Scope checks account for every path the work leaves in the checkout, in three groups:

- **Implementation files:** the files the operations change.
- **Task Artifacts:** the plan, a linked spec, or another task record the issue delivers, including any that exist before implementation starts. `git diff` omits untracked files, so list them with `git status --short --untracked-files=all` and inspect each with `git diff --no-index -- /dev/null <path>`.
- **Local records:** the execution checkpoint, which Git ignores. Confirm it with `git check-ignore`; it is not a deliverable.

Explain any other path before hand back. Don't delete a deliverable to match an expected file list.

```markdown
# <Issue title>: implementation plan

Issue: #<issue>

## Requirements

- Approved requirements: <issue, spec issue, or linked spec>, revision <revision>, approved in <evidence>.
- Acceptance criteria: <link to the criteria, or their numbers>.

## Operations

### 1. <Short name>

- Owner: <role, and the agent when known>
- Files and actions: <path>: <what changes>
- Do not start before: <an earlier operation, decision, or approval, or "nothing">
- Output and handoff: <what it produces, and who receives it>
- Check: <command or review>, expecting <evidence>

### 2. <Short name>

<The same fields.>

## Parallel read-only work

- <Task>, owned by <role>, needing <dependency>. Only the owner of the current editing operation changes files.

## Final validation and hand back

- Scope: implementation files <paths>; Task Artifacts <paths>; local records <paths>
- Checks: <required commands and reviews>, expecting <evidence>
- Hand back: <what goes to whom>

## Maintainer feedback and decisions

- <Feedback or decision> (<link to the original>): <disposition>; affects <operation or requirement>

## Architect recommendations

- <Recommendation>: <decision>
```

## Coordination Plans

A spec-only parent has Coordination Plans instead of an implementation plan. A Coordination Plan covers its children's order, dependencies, parallel work, launch responsibility, acceptance coverage, and required evidence, plus the parent validation checks and who runs them. It links the parent spec and each child's exact proposed issue content instead of repeating them.

Name the first one `<parent>-<slug>.md`. When the Lifecycle calls for a new plan for a corrective batch, name it `<parent>-<batch-slug>.md`. Link the original plan and the integration findings, and cover the batch's children, dependencies, acceptance coverage, and full retest. Keep earlier plans; the parent issue's plan links mark the active one.
