# Execution checkpoint

The execution checkpoint records where one issue stands in the [lifecycle](lifecycle.yaml). It records execution state, not approval. The issue and its approved artifacts still define the work, so the checkpoint points to them instead of restating them. No tool reads or validates it.

The lifecycle's `checkpoint` section sets when the checkpoint is updated. The [Coordinator SOP](agents/roles/coordinator.md#keep-the-execution-checkpoint) describes how to create, recover, publish, and remove it.

## Copies

- **Local:** `/tmp/issues/<issue>.yaml`, the working copy.
- **Durable:** one comment on the issue, updated in place. Its first line is `## Execution checkpoint`, followed by the checkpoint in a fenced `yaml` block. That heading tells it apart from requirement, review, and other comments.

## Values

- `[]` means known to be empty, such as no pending decisions.
- `null` means not established: not yet happened, or unknown. Never replace it with a guess. An unknown cycle count is not `0`, and an unknown approval is not granted.
- `evidence` is a list of places where proof lives: a URL, a file at a commit (`path@commit`), or a chat locator naming the agent or session and the time. Record only locators you can actually cite, or `null` when none exists.
- A `revision` is a commit. For uncommitted work, it is the baseline commit plus a digest or location of the patch, such as `1a2b3c4 + patch sha256:9f8e7d6c`. A flag saying the tree has uncommitted changes doesn't identify a revision.

## Fields

The checkpoint holds current state, not a log of every event; earlier detail stays in its evidence.

### Identity

- `issue`: its `number` and `url`.
- `repository`: the `remote`, `branch`, `head` commit, and `uncommitted`, true when the working tree differs from `head`.
- `lifecycle`: the lifecycle `file` and the `revision` in use.
- `updated`: when the checkpoint was last updated, with its time zone.

### Position

- `position.stage` and `position.step`: the current stage and step key.
- `position.status`: `started` (dispatched or invoked, outcome not yet observed), `waiting`, `failed`, or `completed` (its completion condition is met, with evidence).
- `position.next`: the intended next action, including after a failure.
- `completed_stages`: the stages already closed.

### Open items

- `waits`: what the step is waiting `on`, `for` what, `since` when, and the `evidence`.
- `errors`: each failure's `step`, what was `observed`, and the `evidence`.
- `partial_output`: output kept from an incomplete step, with its `step`, a `description`, and its `location`.
- `decisions`: pending Maintainer decisions.
- `handoffs`: pending handoffs, with the role they go `to`, the `agent` when known, and the `work`.

### Requirements and plan

- `requirements`: each approved requirements artifact's `kind` (`issue`, `spec-issue`, or `repo-spec`), `ref`, `revision`, and the Maintainer's `approval` evidence.
- `plan`: the plan file's `ref` and `revision`.

### Cycles and gates

- `cycles.count`: the number of cycles so far.
- `cycles.authorizations`: each `cycle` number and its authorization `evidence`.
- `cycles.extensions`: any extension for cycle six or later.
- `cycles.waivers`: each review waiver's exact `revision` and `evidence`.
- `gates`: the `plan_assessment`, the `review` with its `recommendation`, the Maintainer's `sign_off`, and the `final_assessment`, each with the `revision` it covered and its `evidence`.

## Example

An illustrative checkpoint for a fictional issue, waiting on a Reviewer in its second cycle. It is not a live checkpoint.

```yaml
issue:
  number: 123
  url: https://github.com/OWNER/REPO/issues/123
repository:
  remote: OWNER/REPO
  branch: docs/example-change
  head: 1a2b3c4
  uncommitted: true
lifecycle:
  file: docs/lifecycle.yaml
  revision: 5e6f7a8
updated: 2026-10-28T10:15:00+09:00
position:
  stage: Implement
  step: independent-review
  status: waiting
  next: Receive the Reviewer's findings, then take the matching independent-review transition
completed_stages: [Define, Plan]
waits:
  - on: Reviewer
    for: Findings and a recommendation on 1a2b3c4 + patch sha256:9f8e7d6c
    since: 2026-10-28T10:05:00+09:00
    evidence: ["chat: Reviewer agent rv-01, 2026-10-28T10:05+09:00"]
errors: []
partial_output: []
decisions: []
handoffs:
  - to: Reviewer
    agent: rv-01
    work: Review the whole issue revision, including earlier cycles
requirements:
  - kind: issue
    ref: https://github.com/OWNER/REPO/issues/123
    revision: "body edited 2026-10-27T15:40:00Z, sha256 9c8d7e6f"
    approval: ["https://github.com/OWNER/REPO/issues/123#issuecomment-111"]
plan:
  ref: docs/plans/123-example-change.md
  revision: 0f1e2d3
cycles:
  count: 2
  authorizations:
    - cycle: 1
      evidence: ["https://github.com/OWNER/REPO/issues/123#issuecomment-111"]
    - cycle: 2
      evidence: ["chat: Maintainer, 2026-10-28T09:20+09:00"]
  extensions: []
  waivers: []
gates:
  plan_assessment:
    revision: 0f1e2d3
    evidence: ["chat: Architect agent ar-01, 2026-10-27T18:00+09:00"]
  review: null
  sign_off: null
  final_assessment: null
```

When the Reviewer reports findings and the Maintainer authorizes a third cycle, only these fields change:

```yaml
updated: 2026-10-28T11:05:00+09:00
position:
  stage: Implement
  step: coder-briefing
  status: started
  next: Brief the Coder on the Reviewer's findings for cycle 3
waits: []
handoffs:
  - to: Coder
    agent: null
    work: Fix the Reviewer's findings
cycles:
  count: 3
  authorizations:
    # The entries for cycles 1 and 2 stay as they were.
    - cycle: 3
      evidence: ["chat: Maintainer, 2026-10-28T11:00+09:00"]
gates:
  review:
    revision: 1a2b3c4 + patch sha256:9f8e7d6c
    recommendation: changes needed
    evidence: ["chat: Reviewer agent rv-01, 2026-10-28T10:50+09:00"]
```
