# Bootstrap a website repository

This runbook guides setting up a new website repository created from the [web-starter Template](https://github.com/joebaz/web-starter). It specifies each step, its responsible actor, and required approvals.

## Prerequisites and tools

### Responsibility markers

Every step in this runbook is assigned to an actor:

- `Maintainer`: Human-only actions (credentials, account and repository settings, business decisions, written approvals, git commits, pushes, merges, wiki pushes, repository deletion).
- `Agent — <role> — written approval required`: Agent operations requiring explicit written approval from the Maintainer in the issue or chat before execution.
- `Agent — <role>`: Agent operations performed under that role's standard operating procedure.

The bootstrap process follows the canonical [Lifecycle](lifecycle.yaml). The Lifecycle owns the stage sequence, handoffs, and approval gates; this runbook maps bootstrap activities to those stages.

### Once-per-machine tools (`skip if done`)

- **Node.js**: Compatible with the `engines` specification in [package.json](../package.json). The repository's `.nvmrc` selects the Node.js major version, while `.npmrc` enforces the supported version range through `engine-strict`.
- **npm**: Standard Node package manager.
- **GitHub CLI (`gh`)**: Installed and authenticated (`gh auth status`) with access to the owning account and the `project` scope (`gh auth refresh -s project`). Credential operations are human-owned Maintainer actions; agents never modify credentials. For setup instructions, see [CONTRIBUTING.md](../CONTRIBUTING.md#set-up-a-local-checkout) and the Wiki's [Agent setup](https://github.com/joebaz/web-starter/wiki/Agent-Setup).
- **Playwright browsers**: Installed with `npx playwright install`. Required for running `npm test`.
- **Agent workspace**: Repository opened in Paseo (project and Local workspace) or the Maintainer's agent environment.

---

## Repository and branch setup

1. **Create repository** (`Maintainer`):
   - Create a new repository from the Template using GitHub's **Use this template** button.
   - Choose repository owner and name.
   - Choose visibility (public or private) based on project requirements.
   - Clone the repository locally or open it in Paseo.

2. **Verify repository and authenticated account** (`Agent — Coordinator`):
   - Verify that the `origin` remote matches the repository URL on `github.com`:
     ```sh
     git remote get-url origin
     ```
   - Confirm the default branch (typically `main`).
   - Independently verify the authenticated account and repository owner:
     ```sh
     gh api user --jq .login
     gh api /repos/<owner>/<repo> --jq .owner.login
     ```
     The authenticated user and repository owner may match for a personal repository or differ for an organization repository; confirm the authenticated account is the Maintainer.

3. **Create local branch before editing** (`Agent — Coordinator`):
   - Before making any file edit, create a local feature branch:
     ```sh
     git checkout -b feature/bootstrap-website
     ```

4. **Open the bootstrap issue** (`Agent — Coordinator`):
   - Open an issue titled `Bootstrap website repository` using a unique temporary file path:
     ```sh
     ISSUE_BODY=$(mktemp /tmp/bootstrap-issue.XXXXXX)
     cat << 'EOF' > "$ISSUE_BODY"
     ## Overview
     Tracking end-to-end bootstrap setup for this repository.

     ## Intake and decisions
     - [ ] Six required website facts confirmed
     - [ ] Sitemap and 404 choices confirmed
     - [ ] GitHub Project deferral recorded

     ## Implementation and approvals
     - [ ] Labels and delete-on-merge written approval and apply
     - [ ] GitHub Project creation written approval, creation, and link
     - [ ] Wiki initialized, copied, and published
     - [ ] Repository files updated and validated

     ## Publishing
     - [ ] Pull request opened and CI passed
     - [ ] Read-only bootstrap check passed
     - [ ] Merged and Lifecycle closed
     EOF

     gh issue create --title "Bootstrap website repository" --body-file "$ISSUE_BODY"
     rm -f "$ISSUE_BODY"
     ```
   - Record the issue number and URL. Do not assign category labels on creation; labels do not exist yet. Record all intake answers, check results, and written approvals as comments in this issue.

---

## Intake and choices

The Planner conducts intake under the canonical Define stage.

1. **Intake for website facts** (`Agent — Planner`):
   - Interview the Maintainer to gather facts defined in [website-facts.yaml](../website-facts.yaml).
   - Six facts are **mandatory** to complete bootstrap setup:
     - `site_name`: Public name of the website. Prefilled once from the repository name. If the initial prompt already named the site, present that name alongside the repository-name prefill and confirm once; do not overwrite or ask twice. Repository name and site name are distinct facts (though they may share the same value).
     - `site_description`: Brief description of the website. Prefilled once from the repository's GitHub Description for Maintainer confirmation or replacement. If empty, ask the Maintainer directly. Never kept in continuous sync with the GitHub Description afterward.
     - `business_name`: Legal or operating business name.
     - `maintainer`: Responsible technical maintainer.
     - `client_approver`: Business client contact/approver. Must name a person. If there is no separate client, use the Maintainer (never `none`).
     - `language`: Valid HTML language tag (e.g. `en`, `es`, `ja`). **If undecided, pause bootstrap until chosen. Never assume English.** Reference the existing reader and build diagnostic (`astro.config.mjs` / `src/website-facts.ts` or `npm run build`); do not edit site files before plan approval.
   - If any of these six required facts is undecided, bootstrap cannot complete; pause until the missing answer is supplied.
   - All other facts defined in [website-facts.yaml](../website-facts.yaml) (`production_url`, `redirecting_hostnames`, `other_languages`, `hosting_provider`, `dns_provider`, `domain_registrar`, `analytics`, `user_data_stored`) may remain blank (undecided) and do not block minimal repository bootstrap.
   - Never put secrets or credentials into [website-facts.yaml](../website-facts.yaml).

2. **One-time sitemap and 404 choices** (`Agent — Planner`):
   - Ask the Maintainer once regarding:
     - `sitemapExclusions` in [astro.config.mjs](../astro.config.mjs) (default is none).
     - 404 page copy in [src/pages/404.astro](../src/pages/404.astro) (title, description, explanation, homepage link label). Confirm retaining defaults if that is the choice.
   - Retaining no sitemap exclusions and default 404 copy is an easy explicit choice revisable later. Bootstrap is minimal repository setup, not a full site implementation roadmap.
   - If custom 404 copy is chosen, update exact-copy assertions in [tests/smoke/not-found.spec.ts](../tests/smoke/not-found.spec.ts) and [tests/smoke/build.spec.ts](../tests/smoke/build.spec.ts) during implementation.

3. **Fresh-bootstrap Project-status deferral** (`Agent — Coordinator`):
   - Verify that no linked GitHub Project exists yet.
   - Record `Project not created yet` in the bootstrap issue and execution checkpoint.
   - This approved deferral permits planning to proceed to the Plan stage without a premature `In progress` Project status move.

---

## Plan stage

Implementation planning, Architect assessment, and Maintainer plan approval follow the canonical [Lifecycle](lifecycle.yaml). No file edits or administrative setup may run before the Plan stage is approved.

---

## Implementation

### Labels and delete-on-merge

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
   - Immediately repeat the command once under the same approval to verify repeatability:
     ```sh
     npm run bootstrap:apply
     ```
   - Apply mode verifies mutations via readback:
     - `delete_branch_on_merge` is enabled.
     - All canonical labels exist with exact case names, colors, and descriptions.
     - All stock default labels were deleted.
     - Any partial failure reports successful, attempted, and failed/unknown outcomes and exits with code `2`.
   - **Decision on preserved custom labels**: If non-default custom labels existed in the repository, apply mode preserves them for separate review. Because `bootstrap:check` expects an exact match with the canonical set, preserved custom labels will continue to cause check mode to report a mismatch until the Maintainer decides on each one (either deleting it via `gh label delete <name>` or adding it to `.github/labels.yml`).
   - Apply the canonical lowercase `feature` label to the bootstrap issue now that labels exist:
     ```sh
     gh issue edit <bootstrap-issue-number> --add-label "feature"
     ```

### GitHub Project setup

1. **Prerequisites and approval** (`Agent — Coder — written approval required`):
   - Verify prerequisites: repository admin access, `project` token scope (`gh auth status`), and user account ownership.
   - Check the repository owner type:
     ```sh
     gh api /repos/<owner>/<repo> --jq .owner.type
     ```
     If the repository is owned by an Organization, pause and route the conflict through the Coordinator to the Maintainer. A user-level same-owner Project is required; do not silently create or substitute an organization Project.
   - Obtain explicit written approval from the Maintainer to create a user-level GitHub Project and link it to the repository.
2. **Create and configure GitHub Project** (`Agent — Coder — written approval required`):
   - Create the Project and capture its number and ID:
     ```sh
     PROJECT_JSON=$(gh project create --owner <user> --title "<repo-name>" --format json)
     PROJECT_NUMBER=$(echo "$PROJECT_JSON" | jq -r .number)
     PROJECT_ID=$(echo "$PROJECT_JSON" | jq -r .id)
     ```
   - Discover the `Status` single-select field ID:
     ```sh
     STATUS_FIELD_ID=$(gh project field-list "$PROJECT_NUMBER" --owner <user> --format json --jq '.fields[] | select(.name=="Status") | .id')
     ```
   - Configure the four contract-required Status names using GraphQL mutation `updateProjectV2Field` with real JSON via a temporary input file:
     ```sh
     MUTATION_FILE=$(mktemp /tmp/update-status-options.XXXXXX)
     cat << EOF > "$MUTATION_FILE"
     {
       "query": "mutation(\$fieldId: ID!, \$singleSelectOptions: [ProjectV2SingleSelectFieldOptionInput!]!) { updateProjectV2Field(input: { fieldId: \$fieldId, singleSelectOptions: \$singleSelectOptions }) { projectV2Field { ... on ProjectV2SingleSelectField { id name options { id name } } } } }",
       "variables": {
         "fieldId": "$STATUS_FIELD_ID",
         "singleSelectOptions": [
           {"name": "Parking", "color": "GRAY", "description": "Items parked or deferred"},
           {"name": "Todo", "color": "GRAY", "description": "Items ready to be planned or worked on"},
           {"name": "In progress", "color": "GRAY", "description": "Items currently being worked on"},
           {"name": "Done", "color": "GRAY", "description": "Completed items"}
         ]
       }
     }
     EOF

     MUTATION_RES=$(gh api graphql --input "$MUTATION_FILE")
     rm -f "$MUTATION_FILE"

     IN_PROGRESS_OPTION_ID=$(echo "$MUTATION_RES" | jq -r '.data.updateProjectV2Field.projectV2Field.options[] | select(.name=="In progress") | .id')
     ```
     _(Note: Order and color are creation details; the acceptance requirement is the exact four Status names)._
   - Link the Project to the repository:
     ```sh
     gh project link "$PROJECT_NUMBER" --owner <user> --repo <owner/repo>
     ```
   - Read back the project linkage and status field options to verify:
     ```sh
     gh api graphql -f query='query($owner: String!, $repo: String!) { repository(owner: $owner, name: $repo) { projectsV2(first: 5) { nodes { id number title fields(first: 20) { nodes { ... on ProjectV2SingleSelectField { name options { id name } } } } } } } }' -f owner=<owner> -f repo=<repo>
     ```
3. **Fulfill deferred Project status action** (`Agent — Coordinator`):
   - Add the bootstrap issue to the new Project and capture the item ID:
     ```sh
     ITEM_ID=$(gh project item-add "$PROJECT_NUMBER" --owner <user> --url <issue-url> --format json --jq .id)
     ```
   - Update the item's Status to `In progress`:
     ```sh
     gh project item-edit --id "$ITEM_ID" --field-id "$STATUS_FIELD_ID" --project-id "$PROJECT_ID" --single-select-option-id "$IN_PROGRESS_OPTION_ID"
     ```
   - Read back the item's status to confirm `In progress`:
     ```sh
     gh api graphql -f query='query($id: ID!) { node(id: $id) { ... on ProjectV2Item { fieldValueByName(name: "Status") { ... on ProjectV2ItemFieldSingleSelectValue { name } } } } }' -f id="$ITEM_ID"
     ```

### Wiki setup

1. **Check eligibility and initialize** (`Agent — Coder` & `Maintainer`):
   - Agent checks `has_wiki` and plan eligibility via the GitHub API:
     ```sh
     gh api /repos/<owner>/<repo> --jq '{has_wiki: .has_wiki, private: .private}'
     ```
     Public repositories include wikis on all plans; private repositories require a GitHub Pro, Team, or Enterprise plan. If unavailable, the agent reports via the Coordinator to the Maintainer; never silently alter repository settings.
   - Maintainer navigates to the GitHub repository web UI Wiki tab and creates the first page (e.g. Home) so GitHub initializes the wiki git repository.
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
     - Retarget operational wiki and repository links to the new repository while keeping Template provenance references intact.
   - Review local diff in `$TGT_WIKI`.
3. **Publish wiki** (`Maintainer`):
   - Provide concrete literal path and branch commands to the Maintainer (do not rely on cross-shell environment variables):
     Verify working tree and remote:
     ```sh
     git -C <target-wiki-path> remote -v
     git -C <target-wiki-path> status
     ```
     Stage and commit pages with quoted pathspec:
     ```sh
     git -C <target-wiki-path> add -- '*.md'
     git -C <target-wiki-path> commit -m "docs: bootstrap repository wiki from template"
     git -C <target-wiki-path> push origin <wiki-branch>
     ```
   - Remove the temporary directories:
     ```sh
     rm -rf "$SRC_WIKI" "$TGT_WIKI"
     ```

### Repository file updates

Perform only the specified bootstrap modifications (`Agent — Coder`):

1. **[website-facts.yaml](../website-facts.yaml)**:
   - Fill in approved intake values. Keep all existing keys intact. Undecided optional facts remain blank.
2. **[README.md](../README.md)**:
   - Update the top-level heading to the repository name.
   - Replace the marked `<!-- template-only:start --> ... <!-- template-only:end -->` block with a generic opening linking back to the [web-starter Template](https://github.com/joebaz/web-starter):
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
   - Inventory existing plans and specs before removing:
     ```sh
     ls -la docs/plans docs/specs
     ```
   - Remove only Template-specific plans and specs (such as `docs/plans/87-bootstrap-website.md`). Keep [docs/plans/README.md](plans/README.md) and any target-owned Task Artifacts (including the bootstrap plan). Note: there is no `docs/specs/README.md`.
   - In [docs/lifecycle.yaml](lifecycle.yaml), update the `authority` reference for `specs/15-lifecycle.md` to point to the Template's published URL:
     `https://github.com/joebaz/web-starter/blob/main/docs/specs/15-lifecycle.md`
   - Inspect retained documentation links across the repository and repoint any links into the removed Template history to valid destinations.
7. **Retained Template links**:
   - Find all Template references:
     ```sh
     rg "web-starter" --glob '!docs/plans/**' --glob '!docs/specs/**'
     ```
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

## Validation and publishing

The remainder of the bootstrap process completes through the canonical [Lifecycle](lifecycle.yaml), which governs independent review, Maintainer sign-off, publishing, merge, and retro.

1. **Run local validation checks** (`Agent — Coder`):
   - Run the standard feature checks:
     ```sh
     npm run format:check
     npm run lint
     npm run check
     npm test
     npm run build
     npm run bootstrap:check
     ```
   - Verify that built HTML output contains the configured `lang` attribute and valid metadata. Note that `bootstrap:check` CI runs will report missing or pending until the pull request branch is pushed and CI runs.

2. **Verify publishing evidence** (`Agent — Coordinator`):
   - Verify a clean working tree:
     ```sh
     git status --porcelain
     ```
   - Verify local `HEAD` commit equals pull request `headRefOid`:
     ```sh
     LOCAL_HEAD=$(git rev-parse HEAD)
     PR_HEAD=$(gh pr view <pr-number> --json headRefOid --jq .headRefOid)
     test "$LOCAL_HEAD" = "$PR_HEAD"
     ```
   - Inspect GitHub Actions CI runs for the pull request event on the current head commit:
     ```sh
     gh run list --commit "$LOCAL_HEAD" --event pull_request --json databaseId,name,event,headSha,status,conclusion,url
     ```
     Require all runs to show `status: "completed"` and `conclusion: "success"`. Missing or running CI counts as pending/failure; no older green run can substitute for current-head pull request CI.
   - Run the final read-only setup check:
     ```sh
     npm run bootstrap:check
     ```
     Verify that `bootstrap:check` exits `0`.
