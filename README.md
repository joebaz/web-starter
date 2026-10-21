# Astro Web Starter

A private template for informational websites for small and medium-sized businesses, built with Astro, React, Tailwind CSS, and TypeScript. Each project establishes its content architecture and hosting; the starter currently builds a static site.

## Requirements

- Node.js 22.22.3 or later, below 23, as declared in [package.json](package.json)
- npm
- Playwright browsers

The repository's `.nvmrc` declares Node 22. A configured zsh/nvm auto-switch hook selects that major version when entering the directory; an older installed Node 22 release may still fall below the required 22.22.3 minimum. The repository's `.npmrc` enables `engine-strict`, so npm rejects Node versions outside the declared range.

[CONTRIBUTING.md](CONTRIBUTING.md) describes local setup and the contribution workflow.

## Commands

| Command                  | Purpose                                                      |
| ------------------------ | ------------------------------------------------------------ |
| `npm install`            | Installs project dependencies from the manifest and lockfile |
| `npm run dev`            | Starts the local Astro development server                    |
| `npm test`               | Runs browser smoke tests in Chromium, Firefox, and WebKit    |
| `npm run build`          | Builds the static site into `dist/`                          |
| `npm run preview`        | Previews the completed `dist/` build locally                 |
| `npx playwright install` | Installs Playwright browser binaries                         |

Command definitions and dependency versions are in [package.json](package.json).

## Paseo

This repository supports [Paseo](https://paseo.sh/) for isolated, agent-assisted work. [paseo.json](paseo.json) contains committed configuration for worktree setup, scripts, and branch-name generation.

The configured worktree setup hook runs `npm ci` to install dependencies from the lockfile.

| Script          | Type    | Command         | Purpose                              |
| --------------- | ------- | --------------- | ------------------------------------ |
| Dev Server      | Service | `npm run dev`   | Starts Astro for local visual review |
| Playwright Test | Command | `npm test`      | Runs browser smoke tests             |
| Build Site      | Command | `npm run build` | Builds the deployable site           |

Paseo's local configuration, worktrees, logs, and credentials live outside the repository at `~/.paseo/`.

Paseo is optional. The website can be developed, tested, and built using standard Node.js and npm tooling, directly or through another coding agent or orchestrator. Deployment depends on the hosting provider selected for each project.

## Testing

`npm test` removes stale Playwright output, runs the configured browser tests, and removes output after a successful run. Playwright starts Astro when needed or reuses an existing server at its configured URL locally; reuse is disabled in CI.

If a test fails, the final cleanup does not run. Fresh failure evidence remains in `test-results/` for diagnosis, including a screenshot. Routine successful runs do not create an HTML report. Generated Playwright output is ignored by Git.

The smoke tests cover Chromium, Firefox, and WebKit.

## Launch checklist

The human-facing [site launch checklist](https://github.com/joebaz/web-starter/wiki) covers project setup, project-specific choices, launch verification, and operating notes. Agent instructions and project-owned agent references live in the repository.

## Project structure

| Path                               | Purpose                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------ |
| `.github/ISSUE_TEMPLATE/`          | Forms for content, documentation, fix, and feature issues                            |
| `.github/pull_request_template.md` | Pull request summary, scope, and validation fields                                   |
| `.github/workflows/ci.yml`         | Validation CI: formatting for documentation-only changes, full baseline otherwise    |
| `.gitignore`                       | Exclusions for generated output, dependencies, environment files, and test artifacts |
| `.npmrc`                           | npm configuration enforcing the declared Node version range                          |
| `.nvmrc`                           | Node major version selection                                                         |
| `AGENTS.md`                        | Instructions directing agents to repository guidance                                 |
| `CLAUDE.md`                        | Symlink to `AGENTS.md` for Claude Code                                               |
| `CONTRIBUTING.md`                  | Local setup and contribution workflow                                                |
| `README.md`                        | Human-facing repository overview                                                     |
| `coding-standards.md`              | Implementation conventions scoped to the requested change                            |
| `astro.config.mjs`                 | Astro configuration                                                                  |
| `eslint.config.mjs`                | ESLint configuration                                                                 |
| `package.json`                     | Dependencies, Node compatibility, and commands                                       |
| `package-lock.json`                | Locked dependency versions                                                           |
| `paseo.json`                       | Worktree setup, scripts, and branch-name generation                                  |
| `playwright.config.ts`             | Browser projects, server startup, retries, and failure artifacts                     |
| `prettier.config.mjs`              | Formatting configuration                                                             |
| `public/`                          | Static files copied to the build unchanged                                           |
| `src/`                             | Site source processed by Astro                                                       |
| `src/pages/`                       | File-based routes; `index.astro` provides the homepage                               |
| `src/styles/`                      | Shared styles; `global.css` loads Tailwind                                           |
| `tests/smoke/`                     | Browser smoke tests                                                                  |
| `tsconfig.json`                    | TypeScript configuration                                                             |
| `dist/`                            | Generated deployment output, ignored by Git                                          |

## CI

Validation tools:

- GitHub Actions runs the checks on pushes and pull requests targeting `main`
- Prettier for formatting
- ESLint for linting
- Astro's checker for type checking
- Playwright for browser smoke tests in Chromium, Firefox, and WebKit
- Astro for the production build

See [CONTRIBUTING](CONTRIBUTING.md#validate-your-change) for which checks run and when.

## Project facts

Project facts are a project's current approved values. A fact with a configuration home lives only in that configuration; business facts without one, such as the hosting provider or approved third-party services, are listed here with a link to the decision issue that set them, when one exists. Leave unknown facts out rather than adding placeholders, and record "not applicable" only where a capability might otherwise be assumed, such as "Forms: none".

This template is never deployed, so it records no business facts.

## Deployment

`npm run build` creates a static site in `dist/`. The template has no hosting-specific code or configuration, so projects can choose or change hosts without code changes.

Projects can add server-side features or hosting-specific code as needed; explain why in the project's README.

Record the chosen host in [Project facts](#project-facts). Use the human launch checklist to set up hosting and check the live site.
