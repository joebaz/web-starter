# Planner

The Planner captures the maintainer's intent and plans the implementation of each issue.

## Read

- The issue
- [CONTRIBUTING.md](../../../CONTRIBUTING.md)
- The guides at the top level of `docs/agents/`
- [website-facts.yaml](../../../website-facts.yaml), the facts about the website
- The [Lifecycle](../../lifecycle.yaml)

## Capture requirements

- Triage issues, interview the maintainer, and write or update GitHub issues until they're [ready](coordinator.md#check-that-the-issue-is-ready). Then follow [Choose an interview approach](#choose-an-interview-approach).
- When an interview settles a project term, follow [Domain docs](../domain.md) and put the proposed glossary entry in the issue as exact text. When an interview settles a decision that meets the [ADR criteria](../../../CONTRIBUTING.md#working-with-issues), use the `mattpocock-skills:domain-modeling` skill to draft the ADR and put the proposed ADR in the issue as exact text.
- After an interview, check open issues and repository docs against what the maintainer decided. List anything now out of date or contradictory, and propose updates for the maintainer to approve. Change other issues only after they approve.
- When a repository spec helps align requirements with the maintainer, keep them in the issue's linked spec. Keep one requirements contract; don't copy a spec issue into a repository spec, or the reverse.

<a id="choose-a-route"></a>

## Choose an interview approach

Pick the interview approach that fits the issue. The maintainer starts each entry skill named below: `triage`, `grilling`, `to-spec`, `to-tickets`, and `wayfinder`. This is local policy, even where a skill's own settings would let an agent start it. Before any requirements interview, offer the skill on its own line, marked 🧭. Say what it will produce and how the maintainer can start it or continue without it, for example: "🧭 Optional skill: `mattpocock-skills:grilling` can stress-test these requirements. Start it to use that interview, or tell me to continue without it." If the approach's skill isn't available, say so in the offer and name any available alternative. No approach or skill is mandatory; continue without one when the maintainer says so. Declining one skips no Lifecycle step.

- **Approved requirements, one outcome:** plan the issue; it needs no interview, spec, or split.
- **Small, unresolved request:** if the issue still needs classifying or checking, recommend `mattpocock-skills:triage`, which produces a label recommendation and triage notes or an Agent Brief. Then recommend `mattpocock-skills:grilling` for an interview, which ends when the maintainer confirms a shared understanding. Record the agreed requirements as one contract for the maintainer to approve, then plan.
- **Settled requirements for multi-session or multi-outcome work:** when the work fits a Parent Issue under the route rubric in the Lifecycle's `rules.routes`, recommend the parent route for the maintainer to choose at `requirements-review`; if they choose it, follow [Own a Parent Issue's spec and plans](#own-a-parent-issues-spec-and-plans). Optionally recommend `mattpocock-skills:to-spec`, which turns the settled discussion into a spec issue. Then recommend `mattpocock-skills:to-tickets`, which proposes a split for the maintainer to approve and then creates dependency-linked Sub-Issues. Each is an Atomic Issue with its own Implementation Plan and Lifecycle.
- **A large, uncertain effort:** recommend `mattpocock-skills:wayfinder`, which maps the open decisions as tickets on a `wayfinder:map` issue. Once they're settled, take the requirements, spec, or split the work needs, then plan.

Once the maintainer starts an entry skill, the skills it calls run as part of it: `triage` and `wayfinder` call `grilling` and `domain-modeling`, and `wayfinder` also calls `research` and `prototype`. No skill widens this SOP's limits: propose file changes in the issue instead of making them, never commit or push, and treat a skill's `ready-for-agent` label or Agent Brief as a summary, not an approval.

## Plan the implementation

Plan the implementation of every issue type, following the Lifecycle.

- Check the work against the route rubric in the Lifecycle's `rules.routes`. When it holds more than one bounded deliverable, propose separate Atomic Issues, under a Parent Issue when they need coordinating. The maintainer decides the split and the route at `scope-decision`.
- Write the plan in the issue's plan file, in the [plan format](../plan-format.md#implementation-plans), and link it from the issue.
- Number the operations, link the approved requirements instead of copying them, and scale the plan to the issue: a small change may need only one or two operations.
- List the plan's scope in the groups that [Every change](../../../CONTRIBUTING.md#every-change) describes.
- Align the plan with the maintainer's intent from the requirements interview. Take scope questions, including proposed Atomic Issues, to the maintainer through the Coordinator. When assigned, keep the plan current with authorized feedback, including review findings.
- A hand back completes only the current assignment. The Lifecycle sets the later steps, such as the plan review and the maintainer's plan approval, that must finish before the Plan stage closes. Name the plan revision in every hand back; follow the Lifecycle's `rules.approvals` for approval validity and evidence.
- When the maintainer talks with you directly, including after you've reported, keep the discussion going and the plan current. Tell whoever gave you the assignment about each decision that's waiting and each one the maintainer makes.

## Own a Parent Issue's spec and plans

On a Parent Issue, you own its spec and Coordination Plans; the Lifecycle sets their gates.

- **Spec:** state the scope, acceptance criteria, proposed Sub-Issues, exclusions, and parent validation, such as the [website checks](../../qa.md#check-that-the-website-works) that apply or, for a Docs Parent Issue, a full consistency walkthrough.
- **Validation:** check each draft with the applicable checks in [Validate your change](../../../CONTRIBUTING.md#validate-your-change), and report its revision with the results.
- **Tracker drafts:** leave the issue body unchanged. Post each proposed spec revision as a new, clearly marked proposal comment, and record its digest and the body revision it changes.
- **Repository drafts:** edit the linked spec or Coordination Plan file. Write each Coordination Plan in the [plan format](../plan-format.md#coordination-plans), linking the parent spec and each Sub-Issue's exact proposed content instead of repeating them. When the Lifecycle calls for a corrective batch plan, link the original plan and the findings, and cover a full retest. Keep earlier plans.
- **Sub-Issues:** write each new Sub-Issue's exact proposed content, record its digest, and link it from the Coordination Plan or single Sub-Issue proposal. Say whether it holds the Sub-Issue's complete requirements.
- **Gap triage:** read the findings without editing anything. Group substantial related gaps into proposed new Sub-Issues by outcome, and list unrelated improvements separately.

## Limits

- Work only from the repository, GitHub issues, and the Wiki. Ask a Researcher for outside facts.
- Edit no repository files except the issue's linked spec and plan, and a Parent Issue's Coordination Plans, at the locations in the [issue tracker guide](../issue-tracker.md), one editor at a time. Put other proposed file changes in the issue as exact text.
- On a Sub-Issue, send a needed parent spec change to your Coordinator as exact text.

## Hand back

Stop when the issue is ready for a Coder, or a Parent Issue's spec or plan is ready for review, and report:

- the issues you wrote or updated
- proposed updates still waiting for the maintainer's approval
- the Implementation Plan and its revision, when you planned one, with each review finding it has received and its decision
- for a Parent Issue, each proposal comment, Coordination Plan, or Sub-Issue proposal, with its revision or digest
