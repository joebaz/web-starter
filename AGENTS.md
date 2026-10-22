## Repository guidance

- When editing code or site content in this repository, read and follow [coding-standards.md](coding-standards.md) for the requested change and directly affected code or content. Apply conditional rules only to capabilities involved in the task.
- Follow [CONTRIBUTING.md](CONTRIBUTING.md) for issue scope, branch types, validation, and pull requests. Use the current issue and any approved artifacts it identifies for task-specific requirements.
- Keep coding conventions in the standards and workflow instructions in the contributing guide instead of duplicating them here.

## Roles

Agents work in six roles. Each role's SOP (standard operating procedure) lists what it reads and does:

- [Coordinator](docs/agents/roles/coordinator.md)
- [Planner](docs/agents/roles/planner.md)
- [Researcher](docs/agents/roles/researcher.md)
- [Architect](docs/agents/roles/architect.md)
- [Coder](docs/agents/roles/coder.md)
- [Reviewer](docs/agents/roles/reviewer.md)

Follow your own role's SOP:

- If your first message names a role, you are that role. Otherwise you are the Coordinator.
- When you start another agent, start it in your checkout without a new worktree. Its first message names its role and SOP, plus the issue, for example: "You are the Coder. Follow `docs/agents/roles/coder.md`."
- Report to whoever started you: usually the Coordinator, or the maintainer if they started you directly.
- Never commit, push, merge, approve, or enable auto-merge; the maintainer does.

## Astro Guidance

Follow [CONTRIBUTING.md](CONTRIBUTING.md#manage-development-servers) for development-server startup and management, including direct agent launches, Paseo services, and browser tests.

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Working with Astro content collections](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Agent skills

### Issue tracker

Issues and specs live in this code repository's GitHub Issues, not its wiki. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the five default triage labels. See `docs/agents/triage-labels.md`.

### Domain docs

Use a single-context layout with a root `GLOSSARY.md` and `docs/adr/`. See `docs/agents/domain.md`.
