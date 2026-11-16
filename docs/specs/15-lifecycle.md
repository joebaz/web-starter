# Issue lifecycle design record

> **Status:** Close-out revision of [#15]'s design record. The Maintainer chose to close #15 with the pull request carrying this revision, and to hold #15's Retro after the merge.

This file records why the Lifecycle exists, its main design decisions, and the evidence from its trials. It doesn't restate how to operate; for that, read the [Lifecycle](../lifecycle.yaml), the role SOPs listed in [AGENTS.md](../../AGENTS.md#roles), [ADR 0001](../adr/0001-parent-issue-lifecycle.md), and [CONTRIBUTING.md](../../CONTRIBUTING.md).

## Problem

#15 addressed three gaps:

- **Review boundaries blurred.** In [#38], the Coordinator treated the Reviewer's acceptance as completion before the Maintainer's final sign-off and the Architect's assessment.
- **Requirements lacked an approval route.** Agents had to flag missing decisions and scope changes, but nothing said how those discussions became approved requirements.
- **Oversight was implicit.** The Coordinator had no defined way to compare ongoing work with the approved requirements and plan.

The goal was one Lifecycle that makes each issue's current stage, next action, approval boundaries, and completion evidence clear.

## Authority

- The [Lifecycle](../lifecycle.yaml) is the operational authority. This file is its historical design record and adds no rules.
- Each issue's own approved requirements contract defines that issue's substantive work. Examples in this record don't become another contract, and an issue can't silently override the Lifecycle; a conflict goes to the Maintainer.
- Role SOPs own each role's duties, the [issue tracker guide](../agents/issue-tracker.md) owns where specs and plans live, the [plan format](../agents/plan-format.md) owns plan contents, the [glossary](../../GLOSSARY.md) owns shared terms, and CONTRIBUTING owns contribution mechanics and validation.
- Keep this file's path: the bootstrap runbook points each bootstrapped repository's Lifecycle at this file on the Template's `main` branch.

## Design decisions

- **One Lifecycle for every issue type.** #15 began with Docs only; the Maintainer-approved cycle-6 amendment in [#66] made one common Lifecycle for all types. Category-specific variations need concrete evidence and Maintainer approval.
- **Separate decisions and independent review.** Requirements approval, plan approval, and final sign-off are separate Maintainer decisions. A Reviewer's acceptance never completes work on its own: the Maintainer signs off, and the Architect assesses the signed-off result. This closes the #38 gap.
- **One requirements contract per issue,** recorded with its revision and the Maintainer's approval.
- **Progress from evidence.** A small, Git-ignored execution checkpoint records state, and dispatching an agent or starting a step isn't completion. The Progress Readout ([#79]) and event-driven checks on delegated work ([#78]) later replaced the first designs.
- **Optional, Maintainer-started Retro drafting** until session capture ([#70]) exists.
- **Atomic and Parent Issue routes.** [#103] added a Parent Issue route and moved plan review from the Architect to a Reviewer; [ADR 0001](../adr/0001-parent-issue-lifecycle.md) records why. The Maintainer chooses the route; category labels never do.

Out of scope: new skills, validators, hooks, workflow engines, enforcement automation, and a central reference catalogue. [#48] enforcement, [#65] progress evaluation, and [#69] weekly Retro are separate.

## Acceptance criteria

These are the [original approved spec][baseline-spec]'s criteria as amended during #66. On 2026-11-16 the Maintainer amended AC6 to accept #63 and #45 as observational trials.

- **AC1:** The canonical Lifecycle defines all five stages, stable step keys, entry and completion conditions, actors, evidence, approval gates, and permitted transitions.
- **AC2:** The directly affected role SOPs, references, glossary, contributor guidance, and PR template follow the ownership boundaries under [Authority](#authority).
- **AC3:** The Lifecycle is the authoritative operational sequence for all issue types; this spec is its design record, with Docs as the first live trial.
- **AC4:** Native tasks and Progress Readouts reflect the reconciled active stage, including waits and re-entry, and stay distinct from whole-Lifecycle completion.
- **AC5:** Independent acceptance alone cannot complete Implement. Current-revision validation, review or eligible waiver, final Maintainer sign-off, and subsequent Architect assessment are required.
- **AC6:** Docs #63 and Feature #45 count as observational trials: live runs on real issues under their own approved requirements, without a pre-agreed trial evidence and completion boundary. Their observations return to #15, and [Evidence](#evidence) states the gaps in their records.
- **AC7:** The checks in [Validate your change](../../CONTRIBUTING.md#validate-your-change) pass for the changed files, alongside review for accuracy, clarity, links, and scope.

## Evidence

1. **Implementation, #66:** [PR #71] merged as `d2cbd09` with independent review, final sign-off, and Architect assessment. This is implementation evidence, not a trial.
2. **Docs trial, #63:** a live run with no pre-agreed trial boundary, merged in [PR #75] as `33cc5d0`. Its Retro observations and the Maintainer's dispositions are in [#76], delivered in [PR #77].
3. **Feature trial, #45:** a live run with no pre-agreed trial boundary. #45 coordinated three Sub-Issues, #85–#87, under one spec, like a Parent Issue, but before that route existed and without a parent plan, so it did not test the Parent Issue route. Only #45's own PRs changed its spec; the last, [PR #100], merged as `ab3ba0a` on 2026-11-09, closing #45. Its workflow observations:
   - #45's spec was edited in #85's checkout. The #85 Coordinator restored it and sent the edits to #45's agent ([#85's plan][85-plan-evidence]). The Lifecycle now gives a Parent Issue sole ownership of its spec.
   - [PR #91] and [PR #93] record the Maintainer waiving review and Architect review for spec updates, beyond the Lifecycle's narrow review exception. They are historical evidence, not a general waiver.
   - Idle timed checks while only the Maintainer could act led to [#78].
   - Repeated plan revisions for small wording changes in #87 became evidence for [#84].
4. **#45 Retro:** the only record is the #45 Coordinator's session handoff to the #15 Coordinator on 2026-11-09. It reports three findings: undefined Parent Issue handling, real client or personal names in examples, and a Project status name mismatch. No record shows that Retro's draft decisions, a skip, or `retro-close`.
5. **Parent Issue route, #103:** [PR #106] merged as `64c9cd3` on 2026-11-16. Its [handoff][103-handoff] records documentary and step-graph walkthroughs only; no Parent Issue has run the route live.

Neither trial shows compliance with a pre-agreed protocol, and Content and Fix work haven't been trialled.

## Approval lineage

The [original approved spec][baseline-spec] at `9672858` ([PR #68]) is the baseline. Later approvals are recorded in the [#66 issue body][#66], [#76], and [#103's plan][103-plan]. The Maintainer amended AC6 in the #15 Coordinator conversation on 2026-11-16. Merged files are implementation evidence, not approval by themselves.

[#15]: https://github.com/joebaz/web-starter/issues/15
[#38]: https://github.com/joebaz/web-starter/issues/38
[#48]: https://github.com/joebaz/web-starter/issues/48
[#65]: https://github.com/joebaz/web-starter/issues/65
[#66]: https://github.com/joebaz/web-starter/issues/66
[#69]: https://github.com/joebaz/web-starter/issues/69
[#70]: https://github.com/joebaz/web-starter/issues/70
[#76]: https://github.com/joebaz/web-starter/issues/76
[#78]: https://github.com/joebaz/web-starter/issues/78
[#79]: https://github.com/joebaz/web-starter/issues/79
[#84]: https://github.com/joebaz/web-starter/issues/84
[#103]: https://github.com/joebaz/web-starter/issues/103
[PR #68]: https://github.com/joebaz/web-starter/pull/68
[PR #71]: https://github.com/joebaz/web-starter/pull/71
[PR #75]: https://github.com/joebaz/web-starter/pull/75
[PR #77]: https://github.com/joebaz/web-starter/pull/77
[PR #91]: https://github.com/joebaz/web-starter/pull/91
[PR #93]: https://github.com/joebaz/web-starter/pull/93
[PR #100]: https://github.com/joebaz/web-starter/pull/100
[PR #106]: https://github.com/joebaz/web-starter/pull/106
[85-plan-evidence]: https://github.com/joebaz/web-starter/blob/ab3ba0a45dcb51c72d056624f793e02f9d817dbf/docs/plans/85-website-facts-file.md#maintainer-feedback-and-decisions
[103-handoff]: https://github.com/joebaz/web-starter/issues/15#issuecomment-6911477900
[103-plan]: https://github.com/joebaz/web-starter/blob/64c9cd3daa17accf21e35518e9a5aaedb08a5d40/docs/plans/103-parent-lifecycle-route.md#requirements-and-status
[baseline-spec]: https://github.com/joebaz/web-starter/blob/9672858452a24e50462b3f3d2ada2c4c31d0d2ee/docs/specs/15-docs-lifecycle.md
