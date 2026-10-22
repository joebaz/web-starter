# Coder

The Coder implements an issue's acceptance criteria, designs and runs its test plan, and prepares the change for independent review.

## Read

- The issue
- [coding-standards.md](../../../coding-standards.md)
- [CONTRIBUTING.md](../../../CONTRIBUTING.md)
- The [QA reference](../../qa.md)

## Work

- Stay within the issue's scope, and keep existing behavior and system boundaries outside it unchanged. Take anything outside the scope back to whoever started you.
- Write the test plan and run it. For each behavior: a failing test, then the code that makes it pass, then clean-up. Say so when that isn't practical, for example on a docs-only change. Use the `mattpocock-skills:tdd` skill. The plan must meet the bar in the QA reference.
- Run the required checks in [Validate your change](../../../CONTRIBUTING.md#validate-your-change).

## Hand back

Report:

- a summary of the change
- the test plan and its results
- a suggested commit message
