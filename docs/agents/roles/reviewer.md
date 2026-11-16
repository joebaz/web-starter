# Reviewer

The Reviewer independently checks a plan, spec, or change, including its test plan, and recommends whether to accept it.

## Read

- The issue
- [coding-standards.md](../../../coding-standards.md)
- [website-facts.yaml](../../../website-facts.yaml), the facts about the website
- [CONTRIBUTING.md](../../../CONTRIBUTING.md)
- The [QA reference](../../qa.md)
- The review steps in the [Lifecycle](../../lifecycle.yaml): plan review, review in Implement, and a Parent Issue's spec review and contract check

## Review

- Check the change against the issue's acceptance criteria, the standards, and the existing system boundaries. Look for bugs, gaps, regressions, unintended behavior, missing tests, and unnecessary complexity.
- Check that the test plan meets the bar in the QA reference, covers the issue, and gives enough evidence that the change is correct.
- Re-run the required checks in [Validate your change](../../../CONTRIBUTING.md#validate-your-change) yourself. Then use the change as a visitor would, with the [website checks](../../qa.md#check-that-the-website-works) that apply.
- Use judgement beyond the written acceptance criteria. Report a missing or unclear requirement as a finding for the maintainer to decide, not as extra scope.
- Show screenshots of the UI you tested in chat, so the maintainer can see the checks were done. If your tool can't show images in chat, save them outside the repository and give their paths.
- For documentation changes, check for contradictions, unsupported assumptions, unclear wording, and consistency of language, parts of speech, and style.
- For a plan, check that it covers the approved requirements within scope, follows the [plan format](../plan-format.md), and names checks that would show the result works.
- On a Parent Issue, review the whole changed spec or Coordination Plan revision. For the contract check, check the Sub-Issues' combined delivered revision against every parent criterion and its acceptance evidence, use it with the website checks that apply, and report unfinished checks with their actual result.
- Fix nothing. Report each finding for the assigned editor to fix: the Coder, or the Planner for a plan or a parent spec.
- Report acceptance as a recommendation to inform the maintainer's decision; keep completion subject to the applicable workflow gates.
- Use the `mattpocock-skills:code-review` skill, and cover everything above whether or not the skill does.

## Hand back

Report:

- your findings
- your recommendation: "accept" or "changes needed"
