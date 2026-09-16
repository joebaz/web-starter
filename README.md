# Astro Web Starter

A private, code-owned starter for small static websites.

## Requirements

- Node.js 22.12.0 or later, below 23
- npm
- Playwright browsers

This repository includes `.nvmrc`. With the zsh/nvm auto-switch hook configured, entering this directory selects the declared Node version automatically.

## Start a new project

Create a new **private** GitHub repository from this template, clone it, then run:

```sh
git clone <new-private-repository-url>
cd <new-project-directory>
node --version     # Should show Node 22.x
npm install        # Installs all project dependencies
npm run dev        # Starts local Astro development
npm test           # Runs Chromium, Firefox, and WebKit smoke tests
```

`npm install` reads `package.json` and `package-lock.json` and installs the complete dependency tree. Do not install dependencies individually unless you intentionally add a new package.

Playwright starts Astro automatically when you run `npm test`; you do not need to keep `npm run dev` running for the test command.

## Commands

| Command                  | Manifest       | Tool       | Purpose                                                |
| ------------------------ | -------------- | ---------- | ------------------------------------------------------ |
| `npm install`            | `package.json` | npm        | Install all project dependencies locally               |
| `npm run dev`            | `package.json` | Astro      | Start the local development server                     |
| `npm test`               | `package.json` | Playwright | Run smoke tests in Chromium, Firefox, and WebKit       |
| `npm run build`          | `package.json` | Astro      | Build the deployable static site into `dist/`          |
| `npm run preview`        | `package.json` | Astro      | Preview the completed `dist/` build locally            |
| `npx playwright install` | Playwright CLI | Playwright | Install browser binaries locally when they are missing |

## Paseo

This repository supports [Paseo](https://paseo.sh/) for isolated, agent-assisted work. `paseo.json` is committed project configuration. Paseo runs `npm ci` through the configured worktree setup hook when it creates a worktree.

Configured Paseo scripts:

| Script            | Command         | Purpose                             |
| ----------------- | --------------- | ----------------------------------- |
| Dev Server        | `npm run dev`   | Start Astro for local visual review |
| Playwright Test   | `npm test`      | Run browser smoke tests             |
| Verify Production | `npm run build` | Build the deployable site           |

Worktree branch names follow this format:

```text
<type>/<short-kebab-case-description>
```

Types:

- `content` for Japanese site copy, images, events, page content, and site links
- `docs` for repository documentation and instructions only, such as `README.md`, `CONTRIBUTING.md`, `AGENTS.md`, `CLAUDE.md`, and similar non-site documentation
- `fix` for broken or incorrect site behavior, layout, accessibility, or functionality
- `feature` for one cohesive new or expanded capability

Paseo’s local configuration, worktrees, logs, and credentials live in the User/Home folder outside the repo at `~/.paseo/`.

## Testing

Run all browser smoke tests:

```sh
npm test
```

The command removes stale Playwright output, starts Astro automatically, runs the configured browser tests, and removes output after a successful run.

If a test fails, the final cleanup does not run. Fresh failure evidence remains in `test-results/` for diagnosis. Failed tests also capture a screenshot. Routine successful test runs do not create an HTML report. Generated Playwright output is ignored by Git.

Browser coverage:

- Chromium
- Firefox
- WebKit

## Project structure

| Path                               | Purpose                                                                                             |
| ---------------------------------- | --------------------------------------------------------------------------------------------------- |
| `.github/workflows/playwright.yml` | GitHub Actions workflow that runs tests for pushes and pull requests to `main`                      |
| `.gitignore`                       | Prevents generated output, dependencies, environment files, and test artifacts from being committed |
| `.nvmrc`                           | Selects the current Node 22 release for this project                                                |
| `AGENTS.md`                        | General instructions for coding agents working in this repository                                   |
| `CLAUDE.md`                        | Claude Code-specific repository guidance                                                            |
| `README.md`                        | Human-facing project reference                                                                      |
| `astro.config.mjs`                 | Astro configuration                                                                                 |
| `eslint.config.mjs`                | ESLint configuration                                                                                |
| `package.json`                     | Dependency manifest, Node compatibility range, and project command definitions                      |
| `package-lock.json`                | Locked dependency versions for repeatable installs                                                  |
| `paseo.json`                       | Paseo worktree setup, scripts, and branch-name generation guidance                                  |
| `playwright.config.ts`             | Browser projects, server startup, retry, trace, screenshot, and artifact settings                   |
| `prettier.config.mjs`              | Prettier formatting configuration                                                                   |
| `public/`                          | Static files copied to the built site unchanged                                                     |
| `src/`                             | Site source code processed by Astro                                                                 |
| `src/pages/`                       | File-based routes; `index.astro` provides the `/` homepage                                          |
| `src/styles/`                      | Shared site styles; `global.css` loads Tailwind                                                     |
| `tests/smoke/`                     | Browser smoke tests                                                                                 |
| `tsconfig.json`                    | TypeScript configuration                                                                            |
| `dist/`                            | Generated deployment output; never committed                                                        |

## CI

GitHub Actions runs `npm test` on pushes and pull requests targeting `main`.

- Uses the Node version from `.nvmrc`
- Stops a stalled job after 15 minutes
- Uploads `test-results/` only after a failed run
- Retains CI failure artifacts for 7 days

## Deployment

The expected deployment target is Cloudflare Pages.

```sh
npm run build
```

Astro produces the deployable static site in `dist/`. Configure the deployment platform to publish `dist/`, never the repository root.
