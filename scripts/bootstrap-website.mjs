// @ts-check
import { execFileSync } from "node:child_process";
import console from "node:console";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import yaml from "yaml";

const REQUIRED_STATUS_NAMES = ["Parking", "Todo", "In progress", "Done"];

/**
 * Execute a subprocess with an argument array and return its stdout.
 * @param {string} file
 * @param {string[]} args
 * @param {import("node:child_process").ExecFileSyncOptions} [options]
 * @returns {string}
 */
function runSubprocess(file, args, options = {}) {
  return execFileSync(file, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...options,
  });
}

/**
 * Parse owner and repository name from the origin remote URL.
 * @returns {{ owner: string, repo: string }}
 */
function resolveOriginTarget() {
  let remoteUrl = "";
  try {
    remoteUrl = runSubprocess("git", ["remote", "get-url", "origin"]).trim();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to resolve git remote "origin": ${message}`);
  }

  const match = remoteUrl.match(
    /github\.com[:/](?<owner>[^/]+)\/(?<repo>[^/]+?)(?:\.git)?$/,
  );
  if (!match || !match.groups?.owner || !match.groups?.repo) {
    throw new Error(
      `Unable to parse GitHub owner/repo from git remote origin URL: "${remoteUrl}"`,
    );
  }

  return {
    owner: match.groups.owner,
    repo: match.groups.repo,
  };
}

/**
 * Load and validate canonical labels from .github/labels.yml.
 * @param {string} repoRoot
 * @returns {Array<{ name: string, color: string, description: string }>}
 */
function loadCanonicalLabels(repoRoot) {
  const labelsPath = path.join(repoRoot, ".github", "labels.yml");
  if (!fs.existsSync(labelsPath)) {
    throw new Error(`Canonical label file not found at ${labelsPath}`);
  }

  const raw = fs.readFileSync(labelsPath, "utf8");
  const parsed = yaml.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error(`.github/labels.yml must contain a YAML array of labels.`);
  }

  for (const item of parsed) {
    if (
      !item ||
      typeof item.name !== "string" ||
      typeof item.color !== "string" ||
      typeof item.description !== "string"
    ) {
      throw new Error(
        `Invalid label entry in .github/labels.yml: ${JSON.stringify(item)}`,
      );
    }
  }

  return parsed;
}

/**
 * Fetch repository metadata via gh api.
 * @param {string} owner
 * @param {string} repo
 * @returns {Record<string, unknown>}
 */
function fetchRepoMetadata(owner, repo) {
  const output = runSubprocess("gh", ["api", `/repos/${owner}/${repo}`]);
  return JSON.parse(output);
}

/**
 * Fetch all labels for the repository via gh api.
 * @param {string} owner
 * @param {string} repo
 * @returns {Array<{ name: string, color: string, description: string, default: boolean }>}
 */
function fetchRepoLabels(owner, repo) {
  const output = runSubprocess("gh", [
    "api",
    "--paginate",
    `/repos/${owner}/${repo}/labels`,
  ]);
  return JSON.parse(output);
}

/**
 * Normalize a hex color string for comparison (removes leading # and lowercases).
 * @param {string} color
 * @returns {string}
 */
function normalizeColor(color) {
  return color.replace(/^#/, "").trim().toLowerCase();
}

/**
 * Run check mode.
 * @param {string} owner
 * @param {string} repo
 * @param {string} repoRoot
 * @param {Record<string, unknown>} repoMetadata
 * @returns {number} Exit code: 0 if all pass, 1 if missing/mismatched, 2 on tool/inspection failure.
 */
function runCheckMode(owner, repo, repoRoot, repoMetadata) {
  console.log(`\n=== Running Bootstrap Check for ${owner}/${repo} ===\n`);

  let hasMissingOrMismatch = false;
  let hasInspectionFailure = false;

  // 1. Canonical labels check
  try {
    const canonicalLabels = loadCanonicalLabels(repoRoot);
    const repoLabels = fetchRepoLabels(owner, repo);

    const canonicalMap = new Map(
      canonicalLabels.map((l) => [l.name.toLowerCase(), l]),
    );
    const repoMap = new Map(repoLabels.map((l) => [l.name.toLowerCase(), l]));

    const missingLabels = [];
    const mismatchedLabels = [];
    const unexpectedLabels = [];

    for (const [nameLower, canonical] of canonicalMap.entries()) {
      const observed = repoMap.get(nameLower);
      if (!observed) {
        missingLabels.push(canonical.name);
      } else {
        const colorMatches =
          normalizeColor(observed.color) === normalizeColor(canonical.color);
        const descMatches =
          (observed.description || "").trim() ===
          (canonical.description || "").trim();
        if (!colorMatches || !descMatches) {
          mismatchedLabels.push({
            name: canonical.name,
            expected: {
              color: canonical.color,
              description: canonical.description,
            },
            observed: {
              color: observed.color,
              description: observed.description,
            },
          });
        }
      }
    }

    for (const [nameLower, observed] of repoMap.entries()) {
      if (!canonicalMap.has(nameLower)) {
        unexpectedLabels.push(observed.name);
      }
    }

    if (
      missingLabels.length === 0 &&
      mismatchedLabels.length === 0 &&
      unexpectedLabels.length === 0
    ) {
      console.log(
        `[PASS] Labels: Canonical label set (${canonicalLabels.length} labels) matches repository labels exactly.`,
      );
    } else {
      hasMissingOrMismatch = true;
      console.log(`[FAIL] Labels: Mismatches detected:`);
      if (missingLabels.length > 0) {
        console.log(`  - Missing canonical labels: ${missingLabels.join(", ")}`);
      }
      if (mismatchedLabels.length > 0) {
        console.log(`  - Mismatched labels:`);
        for (const item of mismatchedLabels) {
          console.log(
            `    * ${item.name}: expected (color: ${item.expected.color}, desc: "${item.expected.description}"), observed (color: ${item.observed.color}, desc: "${item.observed.description}")`,
          );
        }
      }
      if (unexpectedLabels.length > 0) {
        console.log(
          `  - Unexpected non-canonical labels: ${unexpectedLabels.join(", ")}`,
        );
      }
    }
  } catch (error) {
    hasInspectionFailure = true;
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[ERROR] Labels check failed: ${message}`);
  }

  // 2. Delete branch after merge
  const deleteOnMerge = repoMetadata.delete_branch_on_merge === true;
  if (deleteOnMerge) {
    console.log(
      `[PASS] Delete-branch-on-merge: Enabled on repository ${owner}/${repo}.`,
    );
  } else {
    hasMissingOrMismatch = true;
    console.log(
      `[FAIL] Delete-branch-on-merge: Disabled on repository ${owner}/${repo} (expected: true, observed: ${repoMetadata.delete_branch_on_merge}).`,
    );
  }

  // 3. Linked Project check
  try {
    const projectQuery = `
      query($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          projectsV2(first: 20) {
            nodes {
              id
              title
              number
              url
              owner {
                __typename
                ... on User { login }
                ... on Organization { login }
              }
              fields(first: 50) {
                nodes {
                  ... on ProjectV2SingleSelectField {
                    name
                    options { name }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const projectOutput = runSubprocess("gh", [
      "api",
      "graphql",
      "-f",
      `query=${projectQuery}`,
      "-F",
      `owner=${owner}`,
      "-F",
      `repo=${repo}`,
    ]);

    const projectData = JSON.parse(projectOutput);
    const projects = projectData.data?.repository?.projectsV2?.nodes || [];

    const qualifyingProjects = [];
    const nonQualifyingProjects = [];

    for (const proj of projects) {
      const isUserOwner =
        proj.owner?.__typename === "User" &&
        proj.owner?.login?.toLowerCase() === owner.toLowerCase();

      let hasExactStatusNames = false;
      let observedStatusNames = [];

      const statusField = proj.fields?.nodes?.find(
        (f) => f && f.name === "Status" && Array.isArray(f.options),
      );

      if (statusField) {
        observedStatusNames = statusField.options.map((o) => o.name);
        const nameSet = new Set(observedStatusNames);
        if (
          nameSet.size === REQUIRED_STATUS_NAMES.length &&
          REQUIRED_STATUS_NAMES.every((name) => nameSet.has(name))
        ) {
          hasExactStatusNames = true;
        }
      }

      if (isUserOwner && hasExactStatusNames) {
        qualifyingProjects.push(proj);
      } else {
        nonQualifyingProjects.push({
          title: proj.title,
          number: proj.number,
          owner: proj.owner,
          statusOptions: observedStatusNames,
        });
      }
    }

    if (qualifyingProjects.length === 1) {
      const q = qualifyingProjects[0];
      console.log(
        `[PASS] Linked Project: Found qualifying same-owner user Project #${q.number} "${q.title}" (${q.url}) with required Status names.`,
      );
    } else if (qualifyingProjects.length === 0) {
      hasMissingOrMismatch = true;
      console.log(
        `[FAIL] Linked Project: No qualifying user-level same-owner Project found with exact Status options [${REQUIRED_STATUS_NAMES.join(", ")}].`,
      );
      if (nonQualifyingProjects.length > 0) {
        console.log(`  Observed non-qualifying linked projects:`);
        for (const nq of nonQualifyingProjects) {
          console.log(
            `  - Project #${nq.number} "${nq.title}" (owner: ${nq.owner?.login}, status options: [${nq.statusOptions.join(", ")}])`,
          );
        }
      }
    } else {
      hasMissingOrMismatch = true;
      console.log(
        `[FAIL] Linked Project: Ambiguity detected. Found ${qualifyingProjects.length} qualifying Projects:`,
      );
      for (const q of qualifyingProjects) {
        console.log(`  - Project #${q.number} "${q.title}" (${q.url})`);
      }
    }
  } catch (error) {
    hasInspectionFailure = true;
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[ERROR] Linked Projects check failed: ${message}`);
  }

  // 4. CLAUDE.md symlink check
  try {
    const claudePath = path.join(repoRoot, "CLAUDE.md");
    if (!fs.existsSync(claudePath)) {
      hasMissingOrMismatch = true;
      console.log(`[FAIL] Symlink: CLAUDE.md does not exist.`);
    } else {
      const stat = fs.lstatSync(claudePath);
      if (!stat.isSymbolicLink()) {
        hasMissingOrMismatch = true;
        console.log(`[FAIL] Symlink: CLAUDE.md exists but is not a symbolic link.`);
      } else {
        const target = fs.readlinkSync(claudePath);
        if (target === "AGENTS.md" || target === "./AGENTS.md") {
          console.log(
            `[PASS] Symlink: CLAUDE.md is a symlink targeting ${target}.`,
          );
        } else {
          hasMissingOrMismatch = true;
          console.log(
            `[FAIL] Symlink: CLAUDE.md targets "${target}" instead of "AGENTS.md".`,
          );
        }
      }
    }
  } catch (error) {
    hasInspectionFailure = true;
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[ERROR] Symlink check failed: ${message}`);
  }

  // 5. Contribution guide contact URL check
  try {
    const defaultBranch =
      typeof repoMetadata.default_branch === "string"
        ? repoMetadata.default_branch
        : "main";
    const expectedUrl = `https://github.com/${owner}/${repo}/blob/${defaultBranch}/CONTRIBUTING.md`;

    const configPath = path.join(
      repoRoot,
      ".github",
      "ISSUE_TEMPLATE",
      "config.yml",
    );
    if (!fs.existsSync(configPath)) {
      hasMissingOrMismatch = true;
      console.log(
        `[FAIL] Contact URL: .github/ISSUE_TEMPLATE/config.yml does not exist.`,
      );
    } else {
      const configRaw = fs.readFileSync(configPath, "utf8");
      const configParsed = yaml.parse(configRaw);
      const contactLinks = configParsed?.contact_links || [];
      const contribLink = contactLinks.find(
        (l) => l && l.name === "Contribution guide",
      );

      if (!contribLink) {
        hasMissingOrMismatch = true;
        console.log(
          `[FAIL] Contact URL: "Contribution guide" link not found in config.yml contact_links.`,
        );
      } else if (contribLink.url === expectedUrl) {
        console.log(
          `[PASS] Contact URL: Contribution guide URL points to ${expectedUrl}.`,
        );
      } else {
        hasMissingOrMismatch = true;
        console.log(
          `[FAIL] Contact URL: Expected "${expectedUrl}", observed "${contribLink.url}".`,
        );
      }
    }
  } catch (error) {
    hasInspectionFailure = true;
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[ERROR] Contact URL check failed: ${message}`);
  }

  // 6. CI runs for checked-out local HEAD
  try {
    const headSha = runSubprocess("git", ["rev-parse", "HEAD"]).trim();
    const runsOutput = runSubprocess("gh", [
      "api",
      "--paginate",
      `/repos/${owner}/${repo}/actions/runs?head_sha=${headSha}`,
    ]);
    const runsData = JSON.parse(runsOutput);
    const workflowRuns = runsData.workflow_runs || [];

    if (workflowRuns.length === 0) {
      hasMissingOrMismatch = true;
      console.log(
        `[FAIL] CI runs: No workflow runs found for local HEAD commit ${headSha}.`,
      );
    } else {
      let allPassed = true;
      console.log(
        `[INFO] CI runs: Found ${workflowRuns.length} run(s) for local HEAD ${headSha}:`,
      );
      for (const run of workflowRuns) {
        const isSuccess =
          run.status === "completed" && run.conclusion === "success";
        if (!isSuccess) {
          allPassed = false;
        }
        console.log(
          `  - [${run.status}/${run.conclusion ?? "pending"}] ${run.name} (event: ${run.event}, branch: ${run.head_branch}, URL: ${run.html_url})`,
        );
      }

      if (allPassed) {
        console.log(
          `[PASS] CI runs: All workflow runs for local HEAD ${headSha} completed successfully.`,
        );
      } else {
        hasMissingOrMismatch = true;
        console.log(
          `[FAIL] CI runs: One or more workflow runs for local HEAD ${headSha} are pending or failed.`,
        );
      }
    }
  } catch (error) {
    hasInspectionFailure = true;
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[ERROR] CI check failed: ${message}`);
  }

  console.log("\n----------------------------------------");
  if (hasInspectionFailure) {
    console.error(
      "Overall Result: Inability to inspect one or more categories (tool or API failure).",
    );
    return 2;
  }
  if (hasMissingOrMismatch) {
    console.log(
      "Overall Result: Bootstrap setup incomplete or mismatched (missing/pending setup).",
    );
    return 1;
  }

  console.log("Overall Result: All bootstrap checks passed successfully.");
  return 0;
}

/**
 * Run apply mode.
 * @param {string} owner
 * @param {string} repo
 * @param {string} repoRoot
 * @param {Record<string, unknown>} repoMetadata
 * @returns {number} Exit code: 0 on success, 2 on refusal, error, or incomplete readback.
 */
function runApplyMode(owner, repo, repoRoot, repoMetadata) {
  console.log(`\n=== Running Bootstrap Apply for ${owner}/${repo} ===\n`);

  if (repoMetadata.is_template === true) {
    console.error(
      `Refusal: Repository ${owner}/${repo} is marked as a template (is_template: true). Apply mode refuses mutation of template repositories.`,
    );
    return 2;
  }

  let canonicalLabels = [];
  try {
    canonicalLabels = loadCanonicalLabels(repoRoot);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Failed to load canonical labels: ${message}`);
    return 2;
  }

  let initialLabels = [];
  try {
    initialLabels = fetchRepoLabels(owner, repo);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Failed to fetch current repository labels: ${message}`);
    return 2;
  }

  const existingMap = new Map(
    initialLabels.map((l) => [l.name.toLowerCase(), l]),
  );
  const canonicalMap = new Map(
    canonicalLabels.map((l) => [l.name.toLowerCase(), l]),
  );

  // 1. Enable delete-on-merge if needed
  try {
    if (repoMetadata.delete_branch_on_merge !== true) {
      console.log(`Enabling delete_branch_on_merge on ${owner}/${repo}...`);
      runSubprocess("gh", [
        "api",
        "-X",
        "PATCH",
        `/repos/${owner}/${repo}`,
        "-F",
        "delete_branch_on_merge=true",
      ]);
    } else {
      console.log(`delete_branch_on_merge is already enabled.`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Failed to set delete_branch_on_merge: ${message}`);
    return 2;
  }

  // 2. Reconcile labels
  try {
    for (const canonical of canonicalLabels) {
      const existing = existingMap.get(canonical.name.toLowerCase());
      const normalizedCanonicalColor = normalizeColor(canonical.color);

      if (existing) {
        const colorDiffers =
          normalizeColor(existing.color) !== normalizedCanonicalColor;
        const descDiffers =
          (existing.description || "").trim() !==
          (canonical.description || "").trim();
        const nameCaseDiffers = existing.name !== canonical.name;

        if (colorDiffers || descDiffers || nameCaseDiffers) {
          console.log(`Updating canonical label "${canonical.name}"...`);
          runSubprocess("gh", [
            "api",
            "-X",
            "PATCH",
            `/repos/${owner}/${repo}/labels/${encodeURIComponent(existing.name)}`,
            "-f",
            `new_name=${canonical.name}`,
            "-f",
            `color=${normalizedCanonicalColor}`,
            "-f",
            `description=${canonical.description}`,
          ]);
        } else {
          console.log(`Canonical label "${canonical.name}" is already up to date.`);
        }
      } else {
        console.log(`Creating canonical label "${canonical.name}"...`);
        runSubprocess("gh", [
          "api",
          "-X",
          "POST",
          `/repos/${owner}/${repo}/labels`,
          "-f",
          `name=${canonical.name}`,
          "-f",
          `color=${normalizedCanonicalColor}`,
          "-f",
          `description=${canonical.description}`,
        ]);
      }
    }

    // Delete ONLY GitHub stock labels (default === true) that are NOT in canonical set
    for (const existing of initialLabels) {
      const isCanonical = canonicalMap.has(existing.name.toLowerCase());
      if (!isCanonical) {
        if (existing.default === true) {
          console.log(
            `Deleting GitHub stock default label "${existing.name}"...`,
          );
          runSubprocess("gh", [
            "api",
            "-X",
            "DELETE",
            `/repos/${owner}/${repo}/labels/${encodeURIComponent(existing.name)}`,
          ]);
        } else {
          console.log(
            `Preserving non-default custom label "${existing.name}" for separate review.`,
          );
        }
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Failed during label reconciliation: ${message}`);
    return 2;
  }

  // 3. Read back and verify mutations
  try {
    console.log(`\nVerifying applied changes via readback...`);
    const readbackMetadata = fetchRepoMetadata(owner, repo);
    if (readbackMetadata.delete_branch_on_merge !== true) {
      console.error(
        `Readback failure: delete_branch_on_merge was not enabled on ${owner}/${repo}.`,
      );
      return 2;
    }

    const readbackLabels = fetchRepoLabels(owner, repo);
    const readbackMap = new Map(
      readbackLabels.map((l) => [l.name.toLowerCase(), l]),
    );

    for (const canonical of canonicalLabels) {
      const observed = readbackMap.get(canonical.name.toLowerCase());
      if (!observed) {
        console.error(
          `Readback failure: Canonical label "${canonical.name}" missing after apply.`,
        );
        return 2;
      }
      if (
        normalizeColor(observed.color) !== normalizeColor(canonical.color) ||
        (observed.description || "").trim() !==
          (canonical.description || "").trim()
      ) {
        console.error(
          `Readback failure: Canonical label "${canonical.name}" attributes did not match expected values after apply.`,
        );
        return 2;
      }
    }

    console.log(`Apply completed and verified successfully.`);
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Readback verification failed: ${message}`);
    return 2;
  }
}

function main() {
  const args = process.argv.slice(2);
  const mode = args[0];

  if (args.length !== 1 || (mode !== "check" && mode !== "apply")) {
    console.error("Usage: node scripts/bootstrap-website.mjs <check|apply>");
    process.exit(2);
  }

  let target;
  try {
    target = resolveOriginTarget();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Target resolution error: ${message}`);
    process.exit(2);
  }

  console.log(`Target repository: ${target.owner}/${target.repo}`);

  let repoMetadata;
  try {
    repoMetadata = fetchRepoMetadata(target.owner, target.repo);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      `Failed to fetch metadata for target repository ${target.owner}/${target.repo}: ${message}`,
    );
    process.exit(2);
  }

  const repoRoot = process.cwd();

  if (mode === "check") {
    const exitCode = runCheckMode(
      target.owner,
      target.repo,
      repoRoot,
      repoMetadata,
    );
    process.exit(exitCode);
  } else {
    const exitCode = runApplyMode(
      target.owner,
      target.repo,
      repoRoot,
      repoMetadata,
    );
    process.exit(exitCode);
  }
}

main();
