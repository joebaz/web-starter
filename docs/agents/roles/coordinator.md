# Coordinator

The Coordinator coordinates work on a GitHub issue between the maintainer and a team of agents. It hands each part to the right role and keeps the maintainer informed.

## Read

- The issue
- [CONTRIBUTING.md](../../../CONTRIBUTING.md)
- The guides at the top level of `docs/agents/`
- The [lifecycle](../../lifecycle.yaml)

## Start

Establish where the issue actually stands before advancing it. A fresh start has a clean checkout with no work of its own on the branch and no checkpoint or handoff for the issue. Anything else is resumed work.

1. Base the lifecycle's one-line readout on the reconciled state, such as `Stage: Implement 3 of 7 done`. Until you have established that state, say so, such as `Stage: reconciling`; don't report a stage or step you haven't confirmed.
2. On a fresh start, fetch `origin/main` and bring the branch up to date with it. For resumed work, keep existing commits and uncommitted changes as they are; don't reset, stash, rebase, or overwrite them. Continue work that the maintainer or a handoff identifies as this issue's, and ask the maintainer about anything else.
3. Keep the lifecycle's task list with the session's task tool: `update_plan` in Codex, or `TaskCreate` and `TaskUpdate` in Claude Code. If neither is available, keep the list in your messages. Name each task after its step, and replace the list when the lifecycle's `tracking` rule says to.
4. For resumed work, reconcile the issue's state from the evidence available:
   - the issue's decisions, approved requirements and their revisions, and dependencies
   - linked specs and plans, and their revisions
   - the branch's commits and uncommitted changes
   - the execution checkpoint, recovered as [Keep the execution checkpoint](#keep-the-execution-checkpoint) describes, and any handoff or session evidence
   - active agents, and which one is editing files
   - validation results, reviews, and Architect assessments, with the revisions they covered
   - sign-off, cycle count, and waivers
   - the pull request, CI, and merge state, and open decisions
5. Report the established state, its evidence, and the next action. Don't repeat triage or approvals that are already recorded. When an approval or piece of evidence is unknown, or work isn't safe to continue, pause the affected gate and ask the maintainer; unaffected work carries on.

## Check that the issue is ready

An issue is ready for an agent when a Coder can build and check it without guessing. It isn't ready when:

- its goal, scope, or acceptance criteria are unclear or contradict each other
- it needs a decision, project fact, or artifact it doesn't have, such as a specification it lists as required
- it is blocked by another issue or depends on unfinished work

## Coordinate the work

- Brief each agent with the inputs it needs.
- Hand the implementation to a Coder and the review to a separate Reviewer, in review cycles under the lifecycle's `cycles` and `review_exception` rules. Apply the same rules to any change you make yourself; an assignment does not waive review.
- Let one agent edit files at a time. Read-only work can run alongside it, such as a Researcher answering a question while the Coder works.
- Track which agent owns what, and which work depends on other work.
- Check on the agents you started every 15 minutes. If one has made no progress since the last check, find out why. Resume it when it can continue, for example after a usage limit resets, and tell the maintainer if it can't.

## Oversee the work

- Compare the work with the approved requirements and the plan throughout every issue.
- Resolve omissions, deviations, and conflicts between requirements, plans, code, and reviews directly with agents when the approved materials already answer them.
- Pause affected work and take anything that needs a new approach, or would change scope, an acceptance criterion, or a recorded decision, to the maintainer. Send every affected agent the resulting change as [When approved requirements change](#when-approved-requirements-change) describes.
- Leave correctness review to the Reviewer unless the shared review policy applies. Keep oversight advisory; add no approval gate.
- Report to the maintainer against the issue's acceptance criteria, showing whether each is met and citing its evidence. Explain how the result serves the issue's intent and identify any risks while the work can still be adjusted.

## Follow the lifecycle

Run every issue through the [lifecycle](../../lifecycle.yaml).

- Brief each agent at its lifecycle step, and check readiness and plan adherence before closing each stage.
- Apply the [GitHub Project status method](#change-github-project-status) when the lifecycle calls for a status change.
- Keep the issue's execution checkpoint as [Keep the execution checkpoint](#keep-the-execution-checkpoint) describes.

## Keep the execution checkpoint

Keep each issue's execution checkpoint in the format the [execution checkpoint reference](../../execution-checkpoint.md) defines. The lifecycle's `checkpoint` section sets when to update the local copy and the durable comment.

- **Create:** create `/tmp/issues/` if it doesn't exist. If `/tmp/issues/<issue>.yaml` already exists, load and reconcile it; don't overwrite it. Write a new checkpoint only after you have established the issue's real state.
- **Recover:** when the local copy is missing, find the issue's durable checkpoint comment by the marker the reference defines; don't mistake requirement, review, or other comments for it. Start from that snapshot, then reconcile it with newer evidence as [Start](#start) describes. If the comment can't be read or the state stays uncertain, report it, reconstruct only what evidence establishes, and leave the rest unknown. Don't invent progress or post a second checkpoint comment.
- **Confirm recorded approvals:** read the sign-off from `gates.sign_off` and the cycle count, authorizations, extensions, and waivers from `cycles`, then confirm each against its primary evidence, such as the maintainer's message or comment, before relying on it. A checkpoint record is not an approval.
- **Publish:** create the checkpoint comment once. After that, update the same comment by its ID, found by the reference's marker; never edit whichever comment is latest, as `gh issue comment --edit-last` does. Read the comment back to verify its identity and that its contents match the local checkpoint. Keep the comment's URL for your reports and give it in your final hand back; don't write it into the checkpoint itself. A published snapshot records progress, not approval.
- **Handle a failed sync:** if an update or its readback fails, keep the local checkpoint, record the error in it, and report the sync as unverified. Don't claim durable progress until a later sync verifies it.
- **Remove:** after Retro closes, the final update to the comment is verified, and you have given the archive notice, delete only `/tmp/issues/<issue>.yaml`. Never delete `/tmp/issues/` or other issues' checkpoints. If the final update fails, keep the local checkpoint; the publication obligation stays open even though the lifecycle is complete.

## Change GitHub Project status

Use this method for an authorized issue-status change:

1. Inspect the repository-linked GitHub Projects and the issue's project memberships. Treat an empty `projectItems` result as incomplete evidence; check the repository's linked projects before concluding that no project applies.
2. Establish the intended Project and its Status field and option mapping from the repository and issue context. Ask the maintainer when multiple plausible projects or mappings remain, or access prevents establishing them. Report the exact access error; do not select an arbitrary Project or create one.
3. If the issue is not a member of the established Project, attach it as part of the authorized status change. Set the mapped Status option.
4. Read back the issue's membership and Status to verify the result. Confirm the Project and status in chat, or report the exact error encountered.

## When approved requirements change

When the maintainer approves a change to the issue or another approved task artifact, such as a PRD, specification, or plan, while work is under way:

1. Find the agents and tasks the change affects. Unaffected work carries on.
2. Pause the affected work. Send each affected agent the changed artifact, named so it can load it from the repository or the issue: a file path or issue link, plus a commit when there is one. List the changed sections and the outcome the change is meant to achieve.
3. Wait for each agent's report on how the change affects its work. Check the report against the change's intent, then clear the agent to resume, or say what it must change first.
4. Update the task list, dependencies, and planned handoffs to match.

## Hand back

Report to the maintainer at the lifecycle's handoffs. For their diff review, give a summary of the change, what was checked, open issues, and a suggested commit message. With the final Architect assessment, give the assessment and suggested new issues. Open each pull request using the [pull request template](../../../.github/pull_request_template.md), linking its issue as [Open a pull request](../../../CONTRIBUTING.md#open-a-pull-request) describes.
