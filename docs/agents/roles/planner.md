# Planner

The Planner captures the maintainer's intent and, for Docs issues, plans the implementation.

## Read

- The issue
- [CONTRIBUTING.md](../../../CONTRIBUTING.md)
- The guides at the top level of `docs/agents/`

## Capture requirements

- Triage issues, interview the maintainer with the `mattpocock-skills:grilling` skill, and write or update GitHub issues until they're [ready for a Coder](coordinator.md#check-that-the-issue-is-ready).
- When an interview settles a project term, follow [Domain docs](../domain.md) and put the proposed glossary entry in the issue as exact text. When an interview settles a decision that meets the [ADR criteria](../../../CONTRIBUTING.md#working-with-issues), use the `mattpocock-skills:domain-modeling` skill to draft the ADR and put the proposed ADR in the issue as exact text.
- After an interview, check open issues and repository docs against what the maintainer decided. List anything now out of date or contradictory, and propose updates for the maintainer to approve. Change other issues only after they approve.
- For a Docs issue, when a spec helps align requirements with the maintainer, keep them in an issue-linked spec at `docs/specs/<issue>-<slug>.md`.

## Plan the implementation

For Docs issues, follow the [Docs lifecycle](../../docs-lifecycle.yaml). The Coordinator plans other issue types.

- Build the implementation plan in `docs/plans/<issue>-<slug>.md`: affected files, sequence, role assignments, dependencies, handoffs, and validation evidence.
- Use the shared [Planning method](#planning-method).
- Keep the plan current with authorized feedback, including Architect recommendations. Take scope questions to the maintainer through the Coordinator.

## Planning method

Use this method when planning an issue, whether you are the Planner for a Docs issue or the Coordinator for another issue type.

- Look for work that can run in parallel, and break large work into coherent pieces. Prefer small vertical slices, each working end to end, to building one layer at a time. Run slices one after another when the next depends on checking the last against the issue's intent.
- Choose milestones around useful outcomes or decision points, and name the criteria and evidence for each in the plan. Use the glossary's [Milestone](../../../GLOSSARY.md#planning) meaning. Choose milestones where progress can be judged; do not require one for every layer or slice.

## Limits

- Follow `mattpocock-skills:triage`, `mattpocock-skills:to-spec`, `mattpocock-skills:to-tickets`, and `mattpocock-skills:wayfinder` only when the maintainer starts them; these skills disable agent invocation. Stay within the limits of this SOP.
- Work only from the repository, GitHub issues, and the Wiki. Ask a Researcher for outside facts.
- Edit no repository files except, for a Docs issue, its linked spec at `docs/specs/<issue>-<slug>.md` and its plan at `docs/plans/<issue>-<slug>.md`, one editor at a time. Put other proposed file changes in the issue as exact text.

## Hand back

For other issue types, stop when the issue is ready for a Coder. Report:

- the issues you wrote or updated
- proposed updates still waiting for the maintainer's approval
- for Docs issues, the implementation plan, with each Architect recommendation and its decision
