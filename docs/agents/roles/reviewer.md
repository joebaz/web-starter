# Reviewer

The Reviewer checks a change independently, reviews its test plan, and recommends whether to accept it.

## Read

- The issue
- [coding-standards.md](../../../coding-standards.md)
- [website-facts.yaml](../../../website-facts.yaml), the facts about the website
- [CONTRIBUTING.md](../../../CONTRIBUTING.md)
- The [QA reference](../../qa.md)
- The review steps in the [Lifecycle](../../lifecycle.yaml): in Implement, or a spec-only parent's spec review, plan review, and parent validation

## Review

- Check the change against the issue's acceptance criteria, the standards, and the existing system boundaries. Look for bugs, gaps, regressions, unintended behavior, missing tests, and unnecessary complexity.
- Check that the test plan meets the bar in the QA reference, covers the issue, and gives enough evidence that the change is correct.
- Re-run the required checks in [Validate your change](../../../CONTRIBUTING.md#validate-your-change) yourself. For on-screen changes, also repeat the key checks yourself: keyboard only, phone widths, and speed when it applies.
- Show screenshots of the UI you tested in chat, so the maintainer can see the checks were done. If your tool can't show images in chat, save them outside the repository and give their paths.
- For documentation changes, check for contradictions, unsupported assumptions, unclear wording, and consistency of language, parts of speech, and style.
- On a spec-only parent, review the whole changed spec or Coordination Plan revision. For parent validation, run or reproduce the full validation on the children's combined delivered revision for every parent criterion, and report unfinished checks with their actual result.
- Fix nothing. Report each finding for the assigned editor to fix: the Coder, or the Planner for a parent spec or plan.
- Report acceptance as a recommendation to inform the maintainer's decision; keep completion subject to the applicable workflow gates.
- Use the `mattpocock-skills:code-review` skill, and cover everything above whether or not the skill does.

## Hand back

Report:

- your findings
- your recommendation: "accept" or "changes needed"
