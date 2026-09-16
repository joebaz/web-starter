# Contributing

This guide describes the workflow for contributing to this repository.

## Start with an issue

Use a GitHub Issue to define the work before making a change. Keep each change focused on one issue or cohesive outcome.

## Choose a branch type

Create a branch using this format:

```text
<type>/<short-kebab-case-description>
```

Choose exactly one of these types:

- `content`: Japanese site copy, images, events, page content, and site links.
- `docs`: Repository documentation and instructions only, such as `README.md`, `CONTRIBUTING.md`, `AGENTS.md`, `CLAUDE.md`, and similar non-site documentation.
- `fix`: Broken or incorrect site behavior, layout, accessibility, or functionality.
- `feature`: One cohesive new or expanded capability.

Use a concise, specific, lowercase kebab-case description. Do not use any other prefix.

Do not use `docs` if the change affects site content, site behavior, test behavior, build behavior, deployment, or external services.

## Validate your change

### `content`

Run:

```sh
npm run format:check
npm test
```

Also review Japanese copy, links, meaningful alt text, and affected pages at relevant responsive sizes.

### `docs`

Run:

```sh
npm run format:check
```

Also review the final text for accuracy, clarity, and unintended scope.

### `fix` and `feature`

Run:

```sh
npm run format:check
npm run lint
npm run check
npm test
npm run build
```

For a `fix`, reproduce the issue or document verification and add regression coverage where practical.

For a `feature`, define acceptance criteria, add relevant tests, and include visual evidence when the interface changes.

### Every change

Run:

```sh
git diff --check
git diff
git status --short
```

Confirm that only intended files are included.

## Open a pull request

- Link the pull request to its GitHub Issue and use the closing keyword for that issue.
- Describe the changed files and validation performed.
- Ensure CI passes.
- A maintainer must review the pull request before merge.
- After review approval and successful CI, use squash auto-merge and delete the head branch after merge.

## Safety and non-goals

- Do not commit secrets, credentials, `.env` files, or `~/.paseo/` state.
- Do not add GitHub settings, templates, labels, services, deployment configuration, production access, or external integrations unless separately approved.
