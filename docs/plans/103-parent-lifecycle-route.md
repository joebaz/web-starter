# Parent Issue Lifecycle route: Implementation Plan

Issue: [#103](https://github.com/joebaz/web-starter/issues/103)

## Requirements and status

- Approved contract: #103 body, SHA-256
  `a491feb773170535cf8cee818533ee89fa0349148dafaa2a6414eb7443ffa068`.
- [Approved ADR](https://github.com/joebaz/web-starter/issues/103#issuecomment-6872369663),
  SHA-256 `1e92b17411e940d3118ad96f48ec9b5f0e519f188c33e818c203d5d64364a059`.
  Use the ADR's D1–D6 references rather than copy requirements.
- #103 is one documentation outcome on the ordinary route.
- Plan approval: on 14 November 2026 the Maintainer waived personal plan
  approval and authorized execution of revision
  `dbdddf8e75f37131aae15546d44a28aeb2c7b8a8`, including AR5 and AR14. The
  Coordinator holds the exact record. Independent review still applies.
- Amendment: on 15 November 2026 the Maintainer approved the Parent Issue,
  Atomic Issue, Sub-Issue and Implementation Plan terms and definitions, the
  revised Coordination Plan definition, the Architect remit wording, the plans
  guide's scope, plain `parent-` prefix wording, issue-only Coordinator starts
  and the retained `#choose-a-route` anchor. It replaces the original wording of
  the ADR, glossary entries and AGENTS qualifier; their decisions are unchanged.
- Amendment: on 16 November 2026 the Maintainer removed the Architect's
  assessment of Coordination Plans; the Reviewer reviews them. Parent
  validation became two passes on the same combined revision: the Reviewer's
  contract check, then the Architect's integration check.

## Operations

### 1. Record the approved decision and terms

- **Owner:** Coder, assigned as the only editor.
- **Files/actions:** create `docs/adr/0001-spec-only-parent-lifecycle.md` from
  the approved ADR, keeping its status, D1–D6, evidence and source links in the
  amended terminology. Add the approved definitions to `GLOSSARY.md`.
- **Prerequisites:** approved final plan and authorized Implement cycle. The
  Coder sends the document-outline handoff before expansion: cite the approved
  ADR structure/full text and approval evidence, under the AR14 treatment
  below. Obtain outlines for the substantially revised Lifecycle and
  Coordinator/Planner methods; evaluate other substantial changes at briefing.
- **Handoff:** decision/term diff and outline evidence to the Coordinator;
  continue the same editing assignment through operations 2–3.
- **Check:** compare the ADR's decisions and evidence, and the glossary
  definitions, with their approved sources.
  Retain #45's historical limitations; create no duplicate repository spec.

### 2. Add parent branches without changing the ordinary route

- **Owner:** Coder.
- **Files/actions:** `docs/lifecycle.yaml`, implementing D1–D6, including D3's
  Sub-Issue creation/launch authority. The Lifecycle alone owns route selection,
  threshold, order, conditions and completion gates.
- **Prerequisites:** operation 1 and required outline approval.
- **Handoff:** integrated YAML diff and branch inventory to operation 3.
- **Check:** parse with the installed `yaml` package, report unique keys and
  all explicit/implicit successors, then perform operation 4's graph comparison.

#### Enter, return and complete each branch

The Coordinator records the Maintainer's route choice and evidence. Neither a
label nor an agent finding selects the parent route. Add explicit ordinary
bypasses at shared junctions; inserting parent steps must not create ordinary
listed-order fall-through.

Qualify Lifecycle `scenarios.about`/`method` and rename the Planner heading
`Choose a route` to `Choose an interview approach`, keeping the
`#choose-a-route` anchor: requirements-interview approaches and entry skills are
optional; the selected ordinary or parent route still governs. Keep other
headings/anchors and use the approved glossary terms.

- **Define:** existing `readiness-check` uses the recorded route. An unresolved
  choice follows `planner-handoff` / `requirements-interview` until the
  Maintainer decides. A parent enters its first unsatisfied gate:
  `parent-spec-draft` → `parent-spec-review` → `parent-spec-sign-off` →
  `parent-spec-assessment` → `parent-spec-decisions` →
  `readiness-confirmation`. The Maintainer's route choice at
  `requirements-review` sends parent requirements to this branch instead of
  ordinary approval. Reuse matching completed gate evidence;
  a requirements approval alone cannot skip a missing parent review/assessment.
  Readiness status updates are idempotent when already In progress.
- **Plan:** existing `planner-briefing` sends a new/materially changed parent
  plan through `parent-coordination-plan` → `parent-plan-review` →
  `parent-plan-sign-off` → `plan-close`. An unaffected plan with matching
  review and sign-off goes directly to `plan-close`.
  A singleton correction records its no-new-parent-plan disposition and also
  bypasses these artifact gates. Parent `plan-close` enters
  `parent-publication-check`; ordinary `plan-close` still enters Implement.
- **A split discovered in ordinary Plan:** a split proposed in
  `implementation-plan` or by the Architect reaches existing `scope-decision`
  through `recommendations-review`. A Maintainer decision to adopt a parent
  route returns to `parent-spec-draft` in Define. Declining the split resumes
  ordinary planning; unresolved direction waits. Keep the old plan/history and cycle count.
- **Publish:** parent entry requires its owning-stage gates, not Implement.
  `parent-publication-check` selects outstanding repository steps beginning
  at `remote-push`, or `parent-tracker-publication`. Both return to this
  check after verified completion. Mixed packages must finish both paths.
  Only then does the pending destination allow singleton scope approval,
  Sub-Issue creation, resumed waiting, or validation; do not republish unchanged artifacts.
- **Create Sub-Issues:** `parent-child-issues` is a Coordinator step separate
  from `parent-child-launch`. It creates initial/corrective issues from the
  approved Planner proposal before workspace/session launch. Reuse recorded
  existing issues and sessions. Then `parent-children-wait` returns to launch
  when another dependency is met, or to `parent-contract-check` when all finish.
- **Validation:** the Reviewer's `parent-contract-check`, then the Architect's
  `parent-validation`, on the same combined revision. Running/incomplete checks
  wait; execution errors stay failed pending direction. Completed related gaps
  from either lead to `parent-gap-triage`; reruns restart at the contract check.
  Changed acceptance criteria return to Define. Otherwise unresolved direction
  waits. Passing evidence reaches `parent-outcome-acceptance`, whose
  nonacceptance branches use those same three dispositions. Required gaps block
  completion. Only Maintainer acceptance closes parent Publish; common Retro
  follows, with parent closure/Done at `retro-close`.
- **Corrective batches:** after read-only triage, two or more proposed Sub-Issues
  return through existing `planner-briefing` to `parent-coordination-plan`
  for a new linked plan, subject to cycle authorization.
  One goes to `parent-child-scope-approval`, then creation and
  launch without new parent plan gates. Requirements changes take Define first;
  coordination changes take Plan. All corrective Sub-Issues finishing returns to
  full validation, not just checks of the fixes.

The Coordinator records the resume destination as a checkpoint obligation,
with the affected artifacts.
Pause affected Sub-Issue work under the existing changed-requirements protocol.
Valid unchanged plan evidence can survive a spec return; changed plans cannot.
Preserve recovery history so a return neither duplicates launches nor loses an
unfinished publication.

#### Qualify shared assumptions explicitly

Inventory these shared YAML provisions, not just new parent steps:

| Existing provision                                                      | Required qualification                                                                                                                                                                                   |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reading` stage/step order; tracking on returns                         | Selected-route branches override listed order; reset only rerun steps, preserving approvals/counts.                                                                                                      |
| `rules.approvals`; Plan completion                                      | Ordinary Architect-before-approval remains; parent spec sign-off/assessment order, plan sign-off without assessment, and unchanged-plan/singleton exits are explicit.                                    |
| `rules.cycles`, return counters and `review_exception` references       | Apply existing authorization/caps/eligible waivers to parent artifact stages, without calling a waiver a review pass.                                                                                    |
| Implement entry; Publish entry/exit/completion                          | Ordinary entry and merge exit remain; parent skips Implement, waits after publications and exits only on outcome acceptance.                                                                             |
| `remote-push`, `maintainer-merge`, `ci-diagnosis`, `merge-confirmation` | Parent artifact evidence qualifies implemented-commit assumptions. CI changes return to the owning artifact stage. Parent merge confirmation returns to publication checking instead of closing Publish. |

Keep exact revision, passing CI, feedback resolution and Maintainer Git authority.
The first parent artifact round uses Coordinator-start/go-ahead evidence under
current cycles. **Every later artifact edit/review round**, including the first
coordination plan and new batch plans, needs explicit Maintainer authorization;
it can be recorded at an earlier handoff, never inferred from stage entry.
Parent Issue and Sub-Issue Coordinators own separate cumulative counts. Separate parent
spec/plan rounds already consume two of the five allowed rounds; a sixth needs
an explicit extension. Validation without artifact edits creates no new editing
round and resets nothing.

### 3. Align methods and document ownership

- **Owner:** Coder.
- **Files/actions:** the focused changes below; guides point to Lifecycle
  authority rather than repeat the route or threshold.
- **Prerequisites:** operation 2 and substantial-method outline approvals;
  the AGENTS change follows the AR5 decision below.
- **Handoff:** integrated documentation diff and acceptance trace.
- **Check:** an agent can find its actor, inputs, permission, completion evidence
  and return destination without a competing sequence.

| File                                              | Focus                                                                                                                                                                        |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/agents/roles/coordinator.md`                | Route choice; approved issue creation separately from workspace launch; previews/publication, recovery, Sub-Issue handbacks and parent close-out methods.                    |
| `docs/agents/roles/planner.md`                    | Parent-owned edits, proposal revisions and draft validation via CONTRIBUTING; qualify optional interview approaches; link to authoritative threshold and Lifecycle paths.    |
| `docs/agents/roles/reviewer.md`                   | Applicable artifact reviews and the parent contract check; findings go to the assigned owner; fix nothing. Retain ordinary duties and current skill requirement pending #84. |
| `docs/agents/roles/architect.md`                  | Review proposed plan, spec or commit changes against the codebase and relevant outstanding issues; run the parent integration check; no Coordination Plan assessment.        |
| `docs/agents/issue-tracker.md`                    | Contract/proposal-comment links, parent links and active/prior plan links; reference existing evidence rules.                                                                |
| `docs/plans/README.md`                            | When to use Implementation or Coordination Plans, location, template and linking; batch filenames/history. No general no-plan policy.                                        |
| `docs/agents/triage-labels.md`, `CONTRIBUTING.md` | Category independence, parent publication/closure pointers; preserve labels, validation and Git authority.                                                                   |
| `AGENTS.md`                                       | The role-default and same-issue/Sub-Issue qualifier below.                                                                                                                   |

**Sub-Issue creation and return:** the Planner supplies exact proposed issue
content and its snapshot/digest, linked from the approved coordination proposal
or singleton decision. The Coordinator records whether the Maintainer also
explicitly approved complete Sub-Issue requirements; use `rules.requirements` to
reuse that approval, not repeat it. Unsettled Sub-Issue requirements still need
its Define gates. `to-tickets` remains optional and Maintainer-started.

On discovering a proposed parent spec change, the Sub-Issue's Coordinator
immediately notifies the Parent Issue's Coordinator and pauses its own affected work under the
existing change protocol. The parent obtains the Maintainer's decision and
returns through Define when requirements change; unaffected work may continue.

Each Sub-Issue records its final handback obligation: requirement revision,
merges/checks, Lifecycle completion, deviations/obligations and remaining open
parent-spec proposals. This is not the first notification of a proposal.
Use the existing `retro-close` final handback: prepare evidence before closure,
report actual completion in that handoff, and record delivery. A completed Retro
is not a prerequisite to entering `retro-close`; a failed handback leaves its
obligation open. Parent waits resume from events. Sub-Issues never edit the parent
spec from their assignment/workspace.

**Tracker proposal and publication:** the parent Planner places exact next-spec
text in a clearly marked proposal comment on the Parent Issue, preserving the
approved live contract body. Record its comment snapshot/digest, original live
baseline and approval evidence. Preserve reviewed text; revised proposals get
new comments rather than overwrite the reviewed snapshot. A proposal is not a
second requirements contract.

Ignored local previews may be convenience copies, never the sole signed-off
recovery source. Recover lost copies from preserved exact source text and verify
its digest; a digest alone cannot reconstruct it. If no exact approved text
survives, rerun affected gates rather than guess. After owning-stage gates,
the Coordinator copies the approved spec snapshot to the canonical body and
verifies its live digest; keep approval metadata separate. Mixed publication
still waits for both tracker readback and repository merge/revision evidence
before new Sub-Issue creation/launch.

For another repository publication after squash/head deletion, the Maintainer
chooses/prepares the appropriate current baseline and branch. The Coordinator
records them and opens the next PR after the normal checks. Agents do not reset,
rebase, commit or push; the parent's Lifecycle/counts continue.

**Existing checkpoint fields for future Parent Issues:**

- `evidence.requirements`: spec revision, approval and linked gate evidence.
- `evidence.plan`: active and prior plan revisions/sign-offs/gate evidence;
  `evidence.assessment`: current artifact assessment.
- `obligations`: each Sub-Issue's outstanding final hand back and any resume
  obligation (the step to resume after publication).
- `evidence.review`: latest contract check; preserve artifact review references
  with their package evidence. `evidence.assessment` also holds the latest
  integration check.
- `next`: the next action; `waits/errors`: actual blocked state;
  `cycles`: parent authorization/count history.
- Parent `sign_off` stays `null`: it is Implement-specific; parent artifact
  sign-offs are above. #103 itself retains the ordinary Implement use.

The existing checkpoint format remains unchanged. #103's AC5 handoff,
ADR-format Retro note and retained #84 evidence already remain local obligations.

### 4. Verify routes and hand back

- **Owner:** Coder, then separate Reviewer; Coordinator owns later handoffs.
- **Files/actions:** no extra repository deliverable; reports in chat tied to
  the final diff revision.
- **Prerequisites:** operations 1–3 complete.
- **Handoff:** command results, route/requirement trace, scope and limitations
  to the Coordinator. #103's ordinary reviews/sign-off/assessment still apply.
- **Check:** independently repeat documentation checks and these walkthroughs.

For one-off, **uncommitted** verification, parse the baseline Lifecycle from
`ab3ba0a45dcb51c72d056624f793e02f9d817dbf` and the changed YAML. Report every
explicit successor AND possible listed-order fall-through, including stage
boundaries and gate waits. A human evaluates prose conditions against each
scenario's route, approvals and evidence; the report does not execute English.
For atomic cases, select ordinary guards and compare the possible successor
graph with baseline, including implicit edges. Every ordinary successor must
remain, and parent insertion must add none. Check unique keys, resolved targets
and reachable stage exits/Retro for both routes under successful conditions;
also trace waits and corrective loops. Keep this report/script temporary, not
a checker, engine, CI change or new testing policy.

Walkthrough coverage (actors, keys, revisions, evidence and next action):

1. Atomic Feature, and ordinary Plan discovering a split: recorded route decision,
   no automatic Feature fork, ordinary graph preserved. Declining an interview
   approach/skill never permits skipping the selected Lifecycle path.
2. Docs Parent Issue with mixed-category Sub-Issues: stage-specific gates, issue
   creation before launch, exact Sub-Issue proposals and already-approved
   Sub-Issue requirements.
3. Sub-Issue feedback changes the spec: immediate parent notification and
   affected-work pause, not deferred until final handback; the Sub-Issue cannot
   edit it;
   Define return, valid-plan fast path or changed-plan gates, correct publication.
4. Full integration yields multiple corrective Sub-Issues: authorized separate
   linked plan via `planner-briefing` → `parent-coordination-plan`, preserved
   counts/history, all Sub-Issues finish, full retest.
5. One corrective Sub-Issue, including changed parent criteria: scope approval,
   no new parent plan, its own gates, Define return where needed, full retest.
6. Tracker-only and mixed publication: preserved exact proposal comment, unchanged
   approved body until publication, digest readback and both paths complete.
   Lost local copy recovers from exact source; digest-only recovery reruns gates.
7. Second repository publication after merge/squash/head deletion: Maintainer's
   chosen branch/baseline, renewed matching evidence, no reset or agent Git work.
8. Recovery, failed/partial validation and nonacceptance: related gaps to triage,
   changed criteria to Define, other unresolved direction waits; required gaps block.
9. Success: combined-revision evidence, parent acceptance, final Retro and
   handbacks/obligations, closure/Done without an artificial final PR.

Run `npm run format:check`, `git diff --check`, `git diff` and
`git status --short --untracked-files=all`. Inspect untracked deliverables with
`git diff --no-index -- /dev/null <path>`, check links/plain language, and map
all approved requirements to the finished text. Paper walkthroughs are not a
live trial. Existing CI can run full checks for Lifecycle YAML; keep its
classifier unchanged. Planner draft validation links to
[CONTRIBUTING](../../CONTRIBUTING.md#validate-your-change).

## Maintainer decisions: AR5 and AR14

**AR5 — AGENTS qualifier.** Approved D3 Sub-Issue workspaces and issue-only
Coordinator starts need `AGENTS.md` in scope. Its role bullets read:

```markdown
- If your first message names a role, you are that role. Otherwise, including when the maintainer opens a workspace with only an issue, you are the Coordinator.
- When you start another role agent for the same issue, start it in your checkout without a new worktree. Its first message names its role and SOP, plus the issue, for example: "You are the Coder. Follow `docs/agents/roles/coder.md`." Create Sub-Issue workspaces and start their Coordinators only as the [Lifecycle](docs/lifecycle.yaml) authorizes.
```

**AR14 — ADR outline treatment.** The approved ADR full text and D1–D6
structure serve as its document outline. The Coder sends an outline handoff
citing them before writing it, and keeps its approved decisions and evidence. Other new or
substantially revised documents still need outline approval.

## Scope, later handoffs and recommendation decisions

Implementation files: `docs/lifecycle.yaml`,
`docs/adr/0001-spec-only-parent-lifecycle.md`, `GLOSSARY.md`, `AGENTS.md`,
`CONTRIBUTING.md`, four role SOPs, and the three other guides listed above.
Task Artifact: this plan only. Local record: Coordinator-owned
`.agent-state/103.yaml`, confirmed ignored with `git check-ignore`.
Explain unexpected paths. Keep historical specs/#15, #45, QA, issue forms, CI,
website facts, bootstrap and #84/#101/#81/#82/#72 policy work unchanged.

After merge, Coordinator sends #15 approved ADR/Lifecycle revisions, review/merge
evidence, deviations and remaining decisions (AC5). Retain ADR-format and #84
evidence for Maintainer-directed follow-up; this assignment makes no external
writes. N1's Template ADR/bootstrap source-link suggestion stays separate,
unfiled and unimplemented.

## Architect recommendations

- AR1–AR4, AR6–AR13, AR15, AR16, AR6a, AR7a and O1: accepted, as reflected in
  the operations above.
- AR5 and AR14: decided as recorded above.
