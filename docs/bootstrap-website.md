# Bootstrap a website repository

This runbook guides the end-to-end setup of a new website repository created from the [web-starter Template](https://github.com/joebaz/web-starter). It specifies each step, its responsible actor, and required approvals.

## 1. Entry and Prerequisites

### Responsibility markers

Every step in this runbook is assigned to an actor:

- `Maintainer`: Human-only actions (credentials, account/repo settings, business decisions, written approvals, git commits/pushes/merges/wiki pushes, repo deletion).
- `Agent — <target role> — written approval required`: Agent operations requiring explicit written approval from the Maintainer in the issue or chat before execution.
- `Agent — <target role>`: Agent operations performed under that role's standard operating procedure.

The bootstrap process follows the canonical [Lifecycle](lifecycle.yaml). The Lifecycle owns the stage sequence, handoffs, and approval gates; this runbook maps bootstrap activities to those stages rather than reproducing the sequence.

### Once-per-machine tools (`skip if done`)

- **Node.js**: Compatible with the `engines` specification in [package.json](../package.json) (enforced by `.nvmrc` and `.npmrc`).
- **npm**: Standard Node package manager.
- **GitHub CLI (`gh`)**: Installed and authenticated (`gh auth status`). Authenticated credentials and token scopes (`project` scope: `gh auth refresh -s project`) are human-owned Maintainer actions; agents never modify credentials. Confirm that the authenticated user (`gh api user --jq .login`) is the Maintainer's account, confirmed separately from the repository's origin owner. For tool setup and authorization instructions, consult [CONTRIBUTING.md](../CONTRIBUTING.md#set-up-a-local-checkout) and the Wiki's [Agent setup](https://github.com/joebaz/web-starter/wiki/Agent-Setup).
- **Playwright browsers**: Installed via `npx playwright install`. Required for running the test suite (`npm test`).
- **Agent workspace**: Repository opened in Paseo (project and Local workspace) or the Maintainer's agent environment.

---

## 2. Repository and Branch Initialization

1. **Create repository** (`Maintainer`):
   - Create a new repository from the Template using GitHub's **Use this template** button.
   - Choose repository owner and name.
   - Choose visibility (public or private) based on the project's requirements.
   - Clone the repository locally or open it in Paseo.

2. **Verify repository identity and checkout** (`Agent — Coordinator`):
   - Verify that the `origin` remote matches the new repository's URL on `github.com`:
     ```sh
     git remote get-url origin
     ```
   - Confirm that the origin owner is separate from the authenticated `gh` Maintainer account.
   - Inspect the repository default branch (typically `main`).

3. **Create local branch before editing** (`Agent — Coordinator`):
   - Before making any file edit, create a local feature branch:
     ```sh
     git checkout -b feature/bootstrap-website
     ```

4. **Open the bootstrap issue** (`Agent — Coordinator`):
   - Open a Feature issue titled `Bootstrap website repository` using a structured body file or heredoc. Do not attempt to assign the `Feature` label on creation, as repository labels do not exist yet:
     ```sh
     cat << 'EOF' > /tmp/bootstrap-issue-body.md
     ## Overview
     Tracking end-to-end bootstrap setup for this repository.

     ## Intake and Decisions
     - [ ] Website facts intake
     - [ ] Language choice confirmed
     - [ ] Sitemap and 404 choices confirmed
     - [ ] GitHub Project deferral recorded

     ## Implementation and Approvals
     - [ ] Labels and delete-on-merge written approval and apply
     - [ ] GitHub Project creation written approval, creation, and link
     - [ ] Wiki initialized, copied, and published
     - [ ] Repository files updated and validated

     ## Publishing
     - [ ] Pull request opened and CI passed
     - [ ] Read-only bootstrap check passed
     - [ ] Merged and Lifecycle closed
     EOF

     gh issue create --title "Bootstrap website repository" --body-file /tmp/bootstrap-issue-body.md
     rm -f /tmp/bootstrap-issue-body.md
     ```
   - Record the issue number and URL. All subsequent intake answers, check results, and written approvals are recorded as comments in this issue.

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
     - `language`: **Mandatory.** The valid HTML language tag (e.g., `en`, `es`, `ja`). **If undecided, pause bootstrap until chosen. Never assume English.** Validate the language input against standard BCP 47 language tag conventions without duplicating runtime validation logic; do not edit tracked repository files before plan approval (validation can be tested via a safe disposable snippet or deferred to the Implement build check).
     - `other_languages`: Additional supported locales or `none`.
     - `hosting_provider`: Hosting service (e.g., Cloudflare Pages, Vercel, Netlify) or `none`.
     - `dns_provider`: DNS provider or `none`.
     - `domain_registrar`: Domain registrar or `none`.
     - `analytics`: Analytics service or `none`.
     - `user_data_stored`: Summary of collected user data or `none`.
     - `maintainer`: Responsible technical maintainer. Keep this field unchanged; do not split or add a separate GitHub username field.
     - `client_approver`: Business client contact/approver or `none`.
   - Never put secrets or credentials into [website-facts.yaml](../website-facts.yaml).
   - All optional facts may remain visibly undecided (e.g., `analytics:`); only `language` requires an answer before proceeding.

2. **One-time sitemap and 404 choices** (`Agent — Planner`):
   - Ask the Maintainer once regarding:
     - `sitemapExclusions` in [astro.config.mjs](../astro.config.mjs) (default is none).
     - 404 page copy in [src/pages/404.astro](../src/pages/404.astro) (title, description, explanation, homepage link label). Confirm retaining defaults if that is the choice.
   - Retaining no sitemap exclusions and default 404 copy is an easy explicit choice that can be revised later. Bootstrap is minimal repository setup, not a full site implementation roadmap.
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
   - Run the setup script in read-only check mode:
     ```sh
     npm run bootstrap:check
     ```
   - Present the exact effects reported by check mode to the Maintainer in chat or the bootstrap issue:
     - Exact label additions to create from [.github/labels.yml](../.github/labels.yml) (name, color, description).
     - Exact label updates to modify (name casing, color, description).
     - Exact GitHub stock default labels (`default === true`) to delete.
     - Preserved custom labels (`default !== true`) noted as kept for separate review.
     - `delete_branch_on_merge` repository setting to enable.
   - Obtain explicit written approval before proceeding.
2. **Execute and verify apply mode** (`Agent — Coder — written approval required`):
   - Run the setup script in apply mode:
     ```sh
     npm run bootstrap:apply
     ```
   - Immediately repeat the command once under the same approval to verify repeatability (ensuring no unintended mutations or drift occur on re-run):
     ```sh
     npm run bootstrap:apply
     ```
   - Apply mode verifies mutations via readback:
     - `delete_branch_on_merge` is enabled.
     - All canonical labels exist with exact case names, colors, and descriptions.
     - All stock default labels were deleted.
     - Any partial failure reports successful, attempted, and failed/unknown outcomes and exits with code `2`.
   - Now that canonical labels exist, apply the `Feature` label to the bootstrap issue:
     ```sh
     gh issue edit <bootstrap-issue-number> --add-label "Feature"
     ```

### B. Create and link GitHub Project

1. **Obtain Project creation approval** (`Agent — Coder — written approval required`):
   - Verify prerequisites: repository admin access, `project` token scope (`gh auth status`), and user account ownership. If the repository is organization-owned, pause and report the conflict to the Maintainer rather than silently substituting an organization Project.
   - If prerequisites fail or permissions are missing, pause and report the exact evidence to the Maintainer.
   - Obtain explicit written approval from the Maintainer to create a new user-level GitHub Project and link it to the repository.
2. **Create and link user-level GitHub Project** (`Agent — Coder — written approval required`):
   - Create the user-level Project:
     ```sh
     gh project create --owner <user> --title "<repo-name>"
     ```
   - Discover the Project number and the `Status` single-select field ID:
     ```sh
     gh project field-list <project-number> --owner <user> --format json
     ```
   - Configure the four contract-required Status names using GraphQL mutation `updateProjectV2Field` with exact options:
     - `Parking` (`color: GRAY`, description: `"Items parked or deferred"`)
     - `Todo` (`color: GRAY`, description: `"Items ready to be planned or worked on"`)
     - `In progress` (`color: GRAY`, description: `"Items currently being worked on"`)
     - `Done` (`color: GRAY`, description: `"Completed items"`)

     Execute the mutation:

     ```sh
     gh api graphql -f query='
       mutation($fieldId: ID!, $singleSelectOptions: [ProjectV2SingleSelectFieldOptionInput!]!) {
         updateProjectV2Field(input: {
           fieldId: $fieldId,
           singleSelectOptions: $singleSelectOptions
         }) {
           projectV2Field {
             ... on ProjectV2SingleSelectField {
               id
               name
               options { id name }
             }
           }
         }
       }
     ' -f fieldId="<status-field-id>" -f singleSelectOptions='[
       {"name": "Parking", "color": "GRAY", "description": "Items parked or deferred"},
       {"name": "Todo", "color": "GRAY", "description": "Items ready to be planned or worked on"},
       {"name": "In progress", "color": "GRAY", "description": "Items currently being worked on"},
       {"name": "Done", "color": "GRAY", "description": "Completed items"}
     ]'
     ```

     _(Note: Order and color are creation details; the acceptance requirement is the exact four Status names)._

   - Link the Project to the repository:
     ```sh
     gh project link <project-number> --owner <user> --repo <owner/repo>
     ```
   - Read back the project linkage and status field options to verify.
3. **Fulfill deferred Project status action** (`Agent — Coordinator`):
   - Add the bootstrap issue to the new Project:
     ```sh
     gh project item-add <project-number> --owner <user> --url <issue-url> --format json
     ```
   - Update the item's Status to `In progress`:
     ```sh
     gh project item-edit --id <item-id> --field-id <status-field-id> --project-id <project-id> --single-select-option-id <in-progress-option-id>
     ```
   - Read back the item's status to confirm `In progress`.

### C. Initialize and copy the Wiki

1. **Check wiki availability and initialize** (`Maintainer`):
   - Confirm wiki eligibility for the repository's visibility and plan: public repositories include wikis on all plans; private repositories require a GitHub Pro, Team, or Enterprise plan. If unavailable, pause and report to the Maintainer; never silently alter repository settings.
   - In the GitHub repository web UI, navigate to the **Wiki** tab and create the first initial page (e.g., Home) so GitHub initializes the wiki git repository.
2. **Prepare wiki content and link retargeting** (`Agent — Coder`):
   - Create unique temporary directories for source and target checkouts:
     ```sh
     SRC_WIKI=$(mktemp -d -t web-starter-source-wiki-XXXXXX)
     TGT_WIKI=$(mktemp -d -t target-wiki-XXXXXX)
     ```
   - Clone both the template wiki and target wiki:
     ```sh
     git clone https://github.com/joebaz/web-starter.wiki.git "$SRC_WIKI"
     git clone https://github.com/<owner>/<repo>.wiki.git "$TGT_WIKI"
     ```
   - Discover the branch name for both wikis:
     ```sh
     SRC_BRANCH=$(git -C "$SRC_WIKI" branch --show-current)
     TGT_BRANCH=$(git -C "$TGT_WIKI" branch --show-current)
     ```
   - Copy markdown pages into the target wiki checkout, preserving the target's `.git` directory and history:
     ```sh
     cp "$SRC_WIKI"/*.md "$TGT_WIKI/"
     ```
   - Retarget operational repository links in the copied wiki pages:
     - In `Agent-Setup.md`, update `[agent roles](https://github.com/joebaz/web-starter/blob/main/AGENTS.md#roles)` to:
       `[agent roles](https://github.com/<owner>/<repo>/blob/<default-branch>/AGENTS.md#roles)`
     - Retarget operational wiki and repository links to the target repository while keeping Template provenance references intact.
   - Review local diff in `$TGT_WIKI`.
3. **Publish wiki** (`Maintainer`):
   - Stage and commit the updated wiki pages in the target wiki checkout (avoid broad `git add .`):
     ```sh
     git -C "$TGT_WIKI" add *.md
     git -C "$TGT_WIKI" commit -m "docs: bootstrap repository wiki from template"
     git -C "$TGT_WIKI" push origin "$TGT_BRANCH"
     ```
   - Remove the temporary directories:
     ```sh
     rm -rf "$SRC_WIKI" "$TGT_WIKI"
     ```

### D. File modifications in the repository

Perform only the specified bootstrap modifications (`Agent — Coder`):

1. **[website-facts.yaml](../website-facts.yaml)**:
   - Fill in the approved intake values. Keep all existing keys intact. Undecided optional facts remain blank.
2. **[README.md](../README.md)**:
   - Update the top-level heading to the repository name.
   - Replace the marked `<!-- template-only:start --> ... <!-- template-only:end -->` block with a generic opening that links back to the [web-starter Template](https://github.com/joebaz/web-starter):
     ```markdown
     # <repo-name>

     This repository was created from the [web-starter Template](https://github.com/joebaz/web-starter) for informational website projects.
     ```
   - Retarget operational wiki links (Agent setup, Paseo setup, Accessibility review, Site launch checklist) to the new repository's wiki.
   - Keep the repository tools/scripts/docs descriptions and the facts file pointer.
3. **[.github/ISSUE_TEMPLATE/config.yml](../.github/ISSUE_TEMPLATE/config.yml)**:
   - Update the `Contribution guide` contact URL to point to this repository's `CONTRIBUTING.md` on its default branch:
     `https://github.com/<owner>/<repo>/blob/<default-branch>/CONTRIBUTING.md`
4. **[docs/configure-sitemap-and-robots.md](configure-sitemap-and-robots.md)**:
   - Retarget the launch checklist wiki link and wording to the new repository's wiki.
5. **[package.json](../package.json) & [package-lock.json](../package-lock.json)**:
   - Update the `"name"` field in [package.json](../package.json) to match the normalized repository name (valid lowercase npm package name: lowercase, URL-friendly, converted spaces/underscores to hyphens). If the repository name is ambiguous or cannot be cleanly normalized, surface it to the Maintainer.
   - Refresh [package-lock.json](../package-lock.json) with `npm install --package-lock-only`. Verify package name matches in both files; no dependency upgrades.
6. **[docs/plans/](plans/) & [docs/specs/](specs/)**:
   - Inventory existing plans and specs before removing.
   - Remove only Template-specific plans and specs (such as `docs/plans/87-bootstrap-website.md`). Keep [docs/plans/README.md](plans/README.md) and any target-owned Task Artifacts (including the target's bootstrap plan). Note: there is no `docs/specs/README.md`.
   - In [docs/lifecycle.yaml](lifecycle.yaml), update the `authority` reference for `specs/15-lifecycle.md` to point to the Template's published URL:
     `https://github.com/joebaz/web-starter/blob/main/docs/specs/15-lifecycle.md`
   - Inspect retained documentation links across the repository and repoint any links into the removed Template history to valid destinations.
7. **Retained Template links**:
   - Explicitly retain Template reference notes and provenance links:
     - Pending reference notes for Template issues [#30](https://github.com/joebaz/web-starter/issues/30) and [#31](https://github.com/joebaz/web-starter/issues/31) in [coding-standards.md](../coding-standards.md).
     - Provenance and created-from links back to the web-starter Template.
     - Remote historical design record link in [docs/lifecycle.yaml](lifecycle.yaml).
   - Do not perform broad search-and-replace of `web-starter`.
8. **[astro.config.mjs](../astro.config.mjs), [src/pages/404.astro](../src/pages/404.astro), and smoke tests**:
   - Apply any custom sitemap exclusions or 404 copy choices confirmed during intake. Update [tests/smoke/not-found.spec.ts](../tests/smoke/not-found.spec.ts) and [tests/smoke/build.spec.ts](../tests/smoke/build.spec.ts) if 404 text was modified.
9. **[AGENTS.md](../AGENTS.md)**:
   - At the completion of all bootstrap file modifications, remove the single bullet pointing to `docs/bootstrap-website.md`. Preserve all other guidance and the [CLAUDE.md](../CLAUDE.md) symlink.

---

## 6. Validation and Canonical Lifecycle Completion

The bootstrap process completes through the canonical [Lifecycle](lifecycle.yaml).

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
     _(Note: CI runs check may report missing or pending until the PR branch is pushed and CI runs)._

2. **Commit implementation** (`Maintainer`):
   - The Maintainer reviews the diff and commits the implemented bootstrap changes:
     ```sh
     git commit -m "feat: bootstrap website repository"
     ```

3. **Independent review and final sign-off** (`Agent — Reviewer` & `Maintainer`):
   - Reviewer performs independent review of the committed changes.
   - Maintainer reviews diffs and gives final sign-off.
   - Target Architect assesses the signed-off commit.

4. **Publishing pull request and CI** (`Agent — Coordinator` & `Maintainer`):
   - Under the Publish stage, Maintainer pushes the feature branch:
     ```sh
     git push -u origin feature/bootstrap-website
     ```
   - Coordinator opens the pull request targeting `main` with `Closes #<bootstrap-issue>`.
   - Coordinator verifies a clean working tree:
     ```sh
     git status --porcelain
     ```
   - Coordinator queries the PR head commit and verifies it equals local `HEAD`:
     ```sh
     LOCAL_HEAD=$(git rev-parse HEAD)
     PR_HEAD=$(gh pr view --json headRefOid --jq .headRefOid)
     test "$LOCAL_HEAD" = "$PR_HEAD"
     ```
   - Coordinator monitors GitHub Actions CI on the pull request:
     - CI must pass on the current head commit (`pull_request` event).
     - Missing or running CI counts as pending/failure; no older success may hide a current failure.
   - Coordinator runs read-only setup check:
     ```sh
     npm run bootstrap:check
     ```
     Verify that `bootstrap:check` exits `0`.

5. **Merge and cleanup** (`Maintainer`):
   - Maintainer squash-merges the pull request.
   - GitHub deletes the head branch upon merge.
   - Coordinator and Maintainer confirm the merge.

6. **Retro stage** (`Maintainer` & `Agent — Coordinator`):
   - Under the Retro stage, Maintainer starts or skips `/retro` (`mattpocock-skills:retro`).
   - Coordinator records the outcome, presents any drafts, files approved drafts, and closes Retro, completing the Lifecycle.
