# Agent setup

Settings in the maintainer's own agent tools that go with the [agent roles](../AGENTS.md#roles). They live in each tool, not in this repository; copy the text below into them.

The maintainer applies this setup and runs the live [checks](#check-the-setup) after the pull request that adds the role SOPs merges to `main`. The profile notes point agents to SOP files that exist only once they're on `main`.

## Paseo profiles

Paseo shows a profile's **When to use** notes only to an agent choosing a profile, not to the agent it starts. Each note below says what the role is for and tells the choosing agent how to start it. Create or update a profile for each role: paste its note into the **When to use** field, and pick the provider and model yourself.

There is no Coordinator profile; delete one if it exists. An agent started without a role is the Coordinator.

### Planner

```text
Gets a GitHub issue ready for a Coder: triage, maintainer interviews, and issue writing. Edits issues, not repository files. In the new agent's first message, write "You are the Planner. Follow docs/agents/roles/planner.md." and include the issue.
```

### Researcher

```text
Answers one question with checked facts and sources. Read-only. In the new agent's first message, write "You are the Researcher. Follow docs/agents/roles/researcher.md." and include the question and the issue.
```

### Architect

```text
Checks whether a plan fits the codebase before coding, or whether a larger change left it better or worse after review. Read-only. In the new agent's first message, write "You are the Architect. Follow docs/agents/roles/architect.md." and include the issue.
```

### Coder

```text
Implements an issue that is ready for an agent, with its test plan, for independent review. In the new agent's first message, write "You are the Coder. Follow docs/agents/roles/coder.md." and include the issue.
```

### Reviewer

```text
Reviews a change independently and recommends "accept" or "changes needed". Fixes nothing. In the new agent's first message, write "You are the Reviewer. Follow docs/agents/roles/reviewer.md." and include the issue.
```

## Paseo universal system prompt

Add this line:

```text
- To check on agents over time or wait for a usage limit to reset, use Paseo heartbeats or schedules.
```

## Claude Code

Newer Claude models leave the task list tools off by default ([task tool availability](https://code.claude.com/docs/en/tools-reference#task-tool-availability)), and the Coordinator tracks its work with them. Turn them on once by setting `CLAUDE_CODE_ENABLE_TODO_TOOLS` in the `env` section of `~/.claude/settings.json`:

```json
{
  "env": {
    "CLAUDE_CODE_ENABLE_TODO_TOOLS": "1"
  }
}
```

## Check the setup

After the role SOPs pull request merges and the setup above is applied, the maintainer checks it on a real issue from a checkout of the updated `main`:

1. Start a Claude agent with only the issue attached and no typed text. Check that it follows the Coordinator SOP: it fetches `origin/main` first, asks its questions one at a time, and tracks the work in the task list. Repeat with a Codex agent.
2. Check that the Coordinator hands work to each of the other five roles at least once, and that each agent follows its role's SOP.
3. Start one role directly by typing its name with the issue, such as "You are the Reviewer." Check that it follows that role's SOP.
