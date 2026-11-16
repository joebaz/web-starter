# Plan format

What an Implementation Plan and a Coordination Plan contain. Plans live in `docs/plans/`, named and linked as the [issue tracker guide](issue-tracker.md) describes. The [Planner SOP](roles/planner.md#plan-the-implementation) says how to write them, and the [Lifecycle](../lifecycle.yaml) says when. A plan's scope uses the groups in [Every change](../../CONTRIBUTING.md#every-change).

## Implementation Plans

```markdown
# <Issue title>: Implementation Plan

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

- <Task>, owned by <role>, needing <dependency>

## Final validation and hand back

- Scope: implementation files <paths>; Task Artifacts <paths>; local records <paths>
- Checks: <required commands, website checks, and reviews>, expecting <evidence>
- Hand back: <what goes to whom>

## Maintainer feedback and decisions

- <Feedback or decision> (<link to the original>): <disposition>; affects <operation or requirement>

## Review findings

- <Finding>: <decision>
```

## Coordination Plans

```markdown
# <Parent Issue title>: Coordination Plan

Parent Issue: #<parent>

## Requirements

- Parent spec: <link>, revision <revision>, signed off in <evidence>.
- Corrective batch: <the original plan and the findings, or "none">

## Sub-Issues

### <Sub-Issue title>

- Proposed content: <link>, digest <digest>; complete requirements: <yes or no>
- Depends on: <Sub-Issues, or "nothing">; can run alongside: <Sub-Issues, or "none">
- Launched by: <role>
- Acceptance evidence: <what shows it is done>

## Acceptance coverage

- <Parent criterion>: delivered by <Sub-Issues>; checked by <check>

## Parent validation

- <Check>, run by <role>, expecting <evidence>

## Maintainer feedback and decisions

- <Feedback or decision> (<link to the original>): <disposition>; affects <Sub-Issue or criterion>

## Review findings

- <Finding>: <decision>
```
