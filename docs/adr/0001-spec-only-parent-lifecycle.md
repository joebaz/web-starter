# Give Parent Issues a route through the Lifecycle

Proposed for [#103](https://github.com/joebaz/web-starter/issues/103).
Discussion: 12 November 2026; revised 14–16 November 2026.

The Parent Issue defines the shared outcome; its Atomic Issues implement it.
These six decisions compare the rules before #103 with the proposed parent
route. Their numbers provide reference points. `docs/lifecycle.yaml` remains
the operational authority.

## D1. Skip Implement for Parent Issues

**Before:** The shared Lifecycle defines Define → Plan → Implement → Publish →
Retro, without a parent route.

**Decision:** A Parent Issue follows Define → Plan → Publish → Retro, with
Sub-Issue delivery and parent validation before Retro. Atomic Issues keep the
ordinary route. Several independently deliverable outcomes can justify a Parent
Issue in any category; no category label, Feature included, requires a spec or
a split.

**Why:** The Parent Issue coordinates implementation without pretending to
implement its Atomic Issues' work itself.

## D2. Review each document in its owning stage

**Before:** Define approves requirements. Plan assesses architecture before
approval. Independent review, final sign-off and the signed-off Architect
assessment sit in Implement.

**Decision:** Review parent specs in Define: draft and validation → independent
review → Maintainer sign-off → Architect assessment → Maintainer decisions on
recommendations. Review Coordination Plans in Plan: draft and validation →
independent review → Maintainer sign-off. Sign-off is the spec's requirements
approval or the plan's approval; Publish adds no approval.
Authorized changes repeat applicable checks. Keep existing cycle authorizations,
cumulative counts, limits and eligible exceptions, including across new plans
and stage returns. The ordinary route is unchanged.

**Why:** Skipping Implement must retain quality checks where the document is
decided, rather than postpone them to Publish. On the parent route, the
Architect assesses the spec and the combined code, not Coordination Plans.

## D3. Keep the parent spec under Parent Issue ownership

**Before:** Planner editing limits refer to an issue's linked spec without
spelling out the parent spec boundary or Sub-Issue launch authority.

**Decision:** The Parent Issue's Planner owns its spec and Coordination Plans.
Sub-Issues link shared requirements and propose parent spec changes through its
Coordinator; they cannot edit that contract. After Plan's gates finish, the
approved plan authorizes the Parent Issue's Coordinator to create Sub-Issue
workspaces and launch their Coordinators in dependency order. D5 covers a single
corrective Sub-Issue.

**Why:** One shared contract prevents competing versions. Atomic Issues retain
their own requirements, Implementation Plans and full Lifecycle gates.

## D4. Verify the combined outcome before closure

**Before:** Publish ends after merge confirmation. Parent waiting and combined
acceptance checks are not defined.

**Decision:** Keep the Parent Issue open in Publish. After all Sub-Issues
complete, its independent Reviewer checks their combined delivered revision
against the parent contract. The Architect then runs or reproduces full
integration validation of that revision against the existing codebase. The spec
defines criteria; the Coordination Plan names checks and evidence. Use
integration tests when needed, or a complete documentation walkthrough. The
Maintainer accepts the result before the Parent Issue's final Retro, closure and
verified Done status.

**Why:** Closed Sub-Issues do not prove a complete parent outcome, and a
contract check alone does not show how the outcome fits the codebase. Required gaps
block acceptance until resolved or explicitly changed in approved requirements.
A follow-up issue alone is insufficient. Atomic Issues retain their own Retros.

## D5. Give corrective work a plan that fits its size

**Before:** Plans describe operations within one issue. No parent integration-gap
loop is defined.

**Decision:** The Planner triages substantial related gaps into new Sub-Issues:

- **Two or more:** write a separate repository Coordination Plan linked to the
  original plan and findings. Preserve earlier plans and identify the active
  one. Finish Plan's gates before creating or launching the batch.
- **One:** no new parent plan or parent plan-review gates. Maintainer approval
  of its scope and acceptance criteria authorizes creation and launch. Its own
  Implementation Plan and Lifecycle still apply.

Count new Sub-Issues, not findings or completed Sub-Issues. After all corrective
Sub-Issues finish, repeat full integration, not just checks of their fixes.
Repeat the loop for new related gaps. Requirements changes return through Define;
Coordination Plan changes through Plan. Pause affected work under the existing
changed-requirements protocol.

**Why:** Several Sub-Issues need coordination; one next Sub-Issue does not need
a second plan above its own. Linked plans preserve the original delivery's history.

## D6. Publish approved intent with matching evidence

**Before:** Revision rules cover files and tracker contracts, but Publish assumes
a signed-off implemented commit and returns file changes through Implement.

**Decision:** Publish matching validation, review and sign-off evidence for the
spec/plan revisions, plus Architect evidence for the spec: commits/blobs for
files, snapshots or approved-content digests for tracker contracts. Keep
applicable CI; the Maintainer still commits,
pushes and merges. Parent Issue PRs use `Refs`; tracker-only changes need no empty PR or
invented CI. Artifact changes return to their owning stage; transient CI failures
retry the same revision.

**Why:** Publishing a spec establishes approved intent, not completed
implementation. Existing revision checks can support both.

## Evidence and trade-offs

[#45](https://github.com/joebaz/web-starter/issues/45) published its spec in
[PR #88](https://github.com/joebaz/web-starter/pull/88), merged 4 November 2026,
then reconciled it after #85–#87 in
[PR #100](https://github.com/joebaz/web-starter/pull/100), merged 9 November.
The [#87 handoff](https://github.com/joebaz/web-starter/issues/87#issuecomment-6730068673)
left a form-label test and retained trial resources for #45 to resolve; it did.
Late facts-readout and Done refinements had documentation review, not a fresh
full trial. #45 had no parent plan and did not trial this route.

We rejected forcing Parent Issues through Implement, closing them at spec
publication, placing artifact reviews in Publish and appending every corrective
batch to the original plan. The chosen route adds explicit coordination and full
retesting while avoiding a new parent plan for one corrective Sub-Issue.

The comparison uses the
[Lifecycle](https://github.com/joebaz/web-starter/blob/ab3ba0a45dcb51c72d056624f793e02f9d817dbf/docs/lifecycle.yaml),
[plan guide](https://github.com/joebaz/web-starter/blob/ab3ba0a45dcb51c72d056624f793e02f9d817dbf/docs/plans/README.md)
and [Planner SOP](https://github.com/joebaz/web-starter/blob/ab3ba0a45dcb51c72d056624f793e02f9d817dbf/docs/agents/roles/planner.md)
before #103. This does not adopt #84's general plan policy, change bootstrap
exceptions, or authorize the parent route before #103 is approved and merged.
