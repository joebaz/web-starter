# Bootstrap a website repository

This runbook guides the end-to-end setup of a new website repository created from the [web-starter Template](https://github.com/joebaz/web-starter). It specifies each step, its responsible actor, and required approvals.

## 1. Entry and Prerequisites

### Responsibility markers

Every step in this runbook is assigned to an actor:
- `Maintainer`: Human-only actions (credentials, account/repo settings, business decisions, written approvals, git commits/pushes/merges/wiki pushes, repo deletion).
- `Agent — <target role> — written approval required`: Agent operations requiring explicit written approval from the Maintainer in the issue or chat before execution.
- `Agent — <target role>`: Agent operations performed under that role's standard operating procedure.

The bootstrap process follows the canonical [Lifecycle](lifecycle.yaml). The Lifecycle owns the stage sequence, handoffs, and approval gates.

### Once-per-machine tools (`skip if done`)

- **Node.js**: Compatible with the `engines` specification in [package.json](../package.json) (enforced by `.nvmrc` and `.npmrc`).
- **npm**: Standard Node package manager.
- **GitHub CLI (`gh`)**: Installed and authenticated (`gh auth status`) with access to the owning account and the `project` scope (`gh auth refresh -s project`).
- **Playwright browsers**: Installed via `npx playwright install` if running local browser smoke tests.
- **Agent workspace**: Repository opened in Paseo (project and Local workspace) or the Maintainer's agent environment.

---

## 2. Repository and Branch Initialization

1. **Create repository** (`Maintainer`):
   - Create a new repository from the Template using GitHub's **Use this template** button.
   - Choose repository owner and name.
   - Choose visibility (public or private) based on the project's requirements.
   - Clone the repository locally or open it in Paseo.

2. **Verify repository identity and checkout** (`Agent — Coordinator`):
   - Verify that the `origin` remote matches the new repository's URL:
     ```sh
     git remote get-url origin
     ```
   - Inspect the repository default branch (typically `main`).

3. **Create local branch before editing** (`Agent — Coordinator`):
   - Before making any file edit, create a local feature branch:
     ```sh
     git checkout -b feature/bootstrap-website
     ```

4. **Open the bootstrap issue** (`Agent — Coordinator`):
   - Open a Feature issue titled `Bootstrap website repository` using the GitHub CLI or web UI (do not assume labels already exist):
     ```sh
     gh issue create --title "Bootstrap website repository" --body "Tracking end-to-end bootstrap setup for this repository."
     ```
   - Record the issue number and URL. All subsequent intake answers, check results, and written approvals are recorded in this issue.

---

## 3. Target Define and Intake

The target Planner conducts intake under the canonical Define stage.

1. **Intake for website facts** (`Agent — Planner`):
   - Interview the Maintainer to gather all facts defined in [website-facts.yaml](../website-facts.yaml):
     - `site_name`: The public name of the website.
     - `business_name`: The legal or operating business name.
     - `site_description`: Prefilled once from the repository's GitHub Description for Maintainer confirmation or replacement. Never kept in continuous sync. If GitHub Description is empty, ask the Maintainer directly.
     - `production_url`: The canonical live URL (e.g., `https://example.com`).
     - `redirecting_hostnames`: Additional hostnames redirecting to production, or `none`.
     - `language`: **Mandatory.** The valid HTML language tag (e.g., `en`, `ja`). **If undecided, pause bootstrap until chosen. Never assume English.**
     - `other_languages`: Additional supported locales or `none`.
     - `hosting_provider`: Hosting service (e.g., Cloudflare Pages, Vercel, Netlify) or `none`.
     - `dns_provider`: DNS provider or `none`.
     - `domain_registrar`: Domain registrar or `none`.
     - `analytics`: Analytics service or `none`.
     - `user_data_stored`: Summary of collected user data or `none`.
     - `maintainer`: Responsible technical maintainer.
     - `client_approver`: Business client contact/approver or `none`.
   - Never put secrets or credentials into [website-facts.yaml](../website-facts.yaml).
   - Undecided optional facts are left blank (e.g. `analytics:`).

2. **One-time sitemap and 404 choices** (`Agent — Planner`):
   - Ask the Maintainer once regarding:
     - `sitemapExclusions` in [astro.config.mjs](../astro.config.mjs) (default is none).
     - 404 page copy in [src/pages/404.astro](../src/pages/404.astro) (title, description, explanation, homepage link label). Confirm retaining defaults if that is the choice.
     - If custom 404 copy is chosen, update the exact-copy assertions in [tests/smoke/not-found.spec.ts](../tests/smoke/not-found.spec.ts) and [tests/smoke/build.spec.ts](../tests/smoke/build.spec.ts) during implementation.

3. **Fresh-bootstrap Project-status deferral** (`Agent — Coordinator`):
   - Verify that no linked GitHub Project exists yet.
   - Record `Project not created yet` in the bootstrap issue and execution checkpoint.
   - This approved deferral permits planning to proceed to the Plan stage without a premature `In progress` Project status move.

---

## 4. Target Plan Stage

1. **Implementation planning** (`Agent — Planner`):
   - Create the bootstrap implementation plan specifying file changes, label apply, Project creation, wiki setup, and validation checks.
2. **Architect assessment and approval** (`Agent — Architect` & `Maintainer`):
   - Target Architect assesses the plan.
   - Maintainer approves the final plan revision.
   - No file edits or administrative setup may run before the Plan stage is approved.

---

## 5. Target Implement Stage

### A. Apply labels and delete-on-merge

1. **Present apply effects for written approval** (`Agent — Coder — written approval required`):
   - Present the exact label additions/updates from [.github/labels.yml](../.github/labels.yml) and the deletion of default stock labels to the Maintainer in chat or the bootstrap issue.
   - Obtain explicit written approval before proceeding.
2. **Execute and verify apply mode** (`Agent — Coder`):
   - Run the setup script in apply mode:
     ```sh
     npm run bootstrap:apply
     ```
   - Immediately repeat the command once under the same approval to verify repeatability (ensuring no unintended mutations or drift occur on re-run):
     ```sh
     npm run bootstrap:apply
     ```

### B. Create and link GitHub Project

1. **Obtain Project creation approval** (`Agent — Coder — written approval required`):
   - Obtain explicit written approval from the Maintainer to create a new user-level GitHub Project and link it to the repository.
2. **Create user-level Project** (`Agent — Coder`):
   - Run `gh project create` under the owning user:
     ```sh
     gh project create --owner <user> --title "<repo-name>"
     ```
   - Inspect the created Project and identify its `Status` field ID:
     ```sh
     gh project field-list <project-number> --owner <user>
     ```
   - Configure the four contract-required Status options using GraphQL mutation `updateProjectV2Field` with `UpdateProjectV2FieldInput`:
     - **Option 1**: `name: "Parking"`, `color: GRAY`, `description: "Items parked or deferred"`
     - **Option 2**: `name: "Todo"`, `color: GRAY`, `description: "Items ready to be planned or worked on"`
     - **Option 3**: `name: "In progress"`, `color: GRAY`, `description: "Items currently being worked on"`
     - **Option 4**: `name: "Done"`, `color: GRAY`, `description: "Completed items"`
   - Link the Project to the repository:
     ```sh
     gh project link <project-number> --owner <user> --repo <owner/repo>
     ```
3. **Fulfill deferred Project status action** (`Agent — Coordinator`):
   - Add the bootstrap issue to the new Project and set its Status to `In progress`.
   - Read back the project linkage, status field options, and item status to verify.

### C. Initialize and copy the Wiki

1. **Initialize target wiki** (`Maintainer`):
   - In the GitHub repository web UI, navigate to the **Wiki** tab and create the first initial page (e.g., Home) so GitHub initializes the wiki git repository.
2. **Prepare wiki content and link retargeting** (`Agent — Coder`):
   - Clone both the template wiki and target wiki into temporary checkouts:
     ```sh
     git clone https://github.com/joebaz/web-starter.wiki.git /tmp/source-wiki
     git clone https://github.com/<owner>/<repo>.wiki.git /tmp/target-wiki
     ```
   - Discover the branch name for both wikis (e.g., `master` or `main`).
   - Copy markdown pages from the source wiki to the target wiki checkout, preserving the target's `.git` directory and history.
   - Retarget operational repository links in the copied wiki pages:
     - In `Agent-Setup.md`, update `[agent roles](https://github.com/joebaz/web-starter/blob/main/AGENTS.md#roles)` to `[agent roles](https://github.com/<owner>/<repo>/blob/<default-branch>/AGENTS.md#roles)`.
     - Retarget operational wiki and repository links to the target repository while keeping Template provenance references intact.
   - Review local diff of the wiki changes.
3. **Publish wiki** (`Maintainer`):
   - Commit and push the updated wiki pages in the target wiki checkout:
     ```sh
     cd /tmp/target-wiki
     git add .
     git commit -m "docs: bootstrap repository wiki from template"
     git push origin <wiki-branch>
     ```

### D. File modifications in the repository

Perform only the specified bootstrap modifications (`Agent — Coder`):

1. **[website-facts.yaml](../website-facts.yaml)**:
   - Fill in the approved intake values. Keep all existing keys intact.
2. **[README.md](../README.md)**:
   - Update the top-level heading to the repository name.
   - Replace the marked `<!-- template-only:start --> ... <!-- template-only:end -->` block with a generic opening that links back to the [web-starter Template](https://github.com/joebaz/web-starter).
   - Retarget operational wiki links (Agent setup, Paseo setup, Accessibility review, Site launch checklist) to the new repository's wiki.
   - Keep the repository tools/scripts/docs descriptions and the facts file pointer.
3. **[.github/ISSUE_TEMPLATE/config.yml](../.github/ISSUE_TEMPLATE/config.yml)**:
   - Update the `Contribution guide` contact URL to point to this repository's `CONTRIBUTING.md` on its default branch:
     `https://github.com/<owner>/<repo>/blob/<default-branch>/CONTRIBUTING.md`
4. **[docs/configure-sitemap-and-robots.md](configure-sitemap-and-robots.md)**:
   - Retarget the launch checklist wiki link and wording to the new repository's wiki.
5. **[package.json](../package.json) & [package-lock.json](../package-lock.json)**:
   - Update the `"name"` field in [package.json](../package.json) to match the normalized repository name (valid lowercase npm package name).
   - Refresh [package-lock.json](../package-lock.json) with `npm install --package-lock-only`. Verify package name matches in both files.
6. **[docs/plans/](plans/) & [docs/specs/](specs/)**:
   - Remove Template-specific plans and specs. Keep [docs/plans/README.md](plans/README.md) and any target-owned Task Artifacts (including the bootstrap plan).
   - In [docs/lifecycle.yaml](lifecycle.yaml), update the `authority` reference for `specs/15-lifecycle.md` to point to the Template's published URL:
     `https://github.com/joebaz/web-starter/blob/main/docs/specs/15-lifecycle.md`
7. **[astro.config.mjs](../astro.config.mjs), [src/pages/404.astro](../src/pages/404.astro), and smoke tests**:
   - Apply any custom sitemap exclusions or 404 copy choices confirmed during intake. Update [tests/smoke/not-found.spec.ts](../tests/smoke/not-found.spec.ts) and [tests/smoke/build.spec.ts](../tests/smoke/build.spec.ts) if 404 text was modified.
8. **[AGENTS.md](../AGENTS.md)**:
   - At the completion of all bootstrap file modifications, remove the single bullet pointing to `docs/bootstrap-website.md`. Preserve all other guidance and the [CLAUDE.md](../CLAUDE.md) symlink.

---

## 6. Validation and Lifecycle Completion

1. **Run local validation checks** (`Agent — Coder`):
   - Run the standard feature checks:
     ```sh
     npm run format:check
     npm run lint
     npm run check
     npm test
     npm run build
     ```
   - Verify that built HTML output contains the configured `lang` attribute and valid metadata.
   - Run the bootstrap setup check:
     ```sh
     npm run bootstrap:check
     ```
     *(Note: CI runs check may report pending or missing until the PR branch is pushed and CI runs).*

2. **Independent review and final sign-off** (`Agent — Reviewer` & `Maintainer`):
   - Reviewer performs independent review of all changes.
   - Maintainer reviews diffs and gives final sign-off.
   - Target Architect assesses the signed-off commit.

3. **Publishing pull request and CI** (`Agent — Coordinator` & `Maintainer`):
   - Maintainer pushes the feature branch:
     ```sh
     git push -u origin feature/bootstrap-website
     ```
   - Coordinator opens the pull request targeting `main` with `Closes #<bootstrap-issue>`.
   - Wait for GitHub Actions CI to pass on the pull request.
   - Verify that the local `HEAD` commit equals `gh pr view --json headRefOid`.
   - Run read-only setup check:
     ```sh
     npm run bootstrap:check
     ```
     Verify that `bootstrap:check` exits `0`.

4. **Merge and cleanup** (`Maintainer`):
   - Maintainer squash-merges the pull request.
   - GitHub deletes the head branch upon merge.
   - Target Coordinator verifies merge and closes the Lifecycle.
