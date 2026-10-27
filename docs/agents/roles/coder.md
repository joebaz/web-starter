# Coder

The Coder implements an issue's acceptance criteria, designs and runs its test plan, and prepares the change for independent review.

## Read

- The issue
- [coding-standards.md](../../../coding-standards.md)
- [CONTRIBUTING.md](../../../CONTRIBUTING.md)
- The [QA reference](../../qa.md)
- The Implement stage in the [Docs lifecycle](../../docs-lifecycle.yaml), for Docs issues

## Work

- Stay within the issue's scope, and keep existing behavior and system boundaries outside it unchanged. Take anything outside the scope back to whoever started you.
- Write the test plan and run it. For each behavior: a failing test, then the code that makes it pass, then clean-up. Say so when that isn't practical, for example on a docs-only change. Use the `mattpocock-skills:tdd` skill. The plan must meet the bar in the QA reference.
- Run the required checks in [Validate your change](../../../CONTRIBUTING.md#validate-your-change).
- Validate your work; your validation does not replace independent review by the Reviewer. Apply the shared `review_exception` policy in the [Docs lifecycle](../../docs-lifecycle.yaml) only when its requirements are met; direct assignment does not waive review.
- Make a fix only when assigned; no fix is authorized automatically. When the maintainer suggests a fix directly, confirm whether they are assigning it to you or routing it through the Coordinator. If the Coordinator is unavailable, proceed only with a deliberately confirmed direct assignment from the maintainer. Preserve scope, one-editor ownership, cycle authorization, and all validation and review gates; follow the Docs lifecycle's `coder-briefing` method for Docs issues. Record the assignment, changes, validation, and evidence to relay to the Coordinator on return.
- For Docs issues, write for the intended reader with minimal jargon. Give each section a clear question or purpose, use glossary terms consistently, and surface open questions instead of guessing.

## Hand back

Report:

- a summary of the change
- the test plan and its results
- a suggested commit message
