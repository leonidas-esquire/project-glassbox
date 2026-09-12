import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const requiredFiles = [
  "README.md", "LICENSE", "NOTICE", "AUTHORS.md", "CITATION.cff",
  "CONTRIBUTING.md", "CODE_OF_CONDUCT.md", "SECURITY.md", "GOVERNANCE.md",
  "ROADMAP.md", "CHANGELOG.md", "TRADEMARKS.md", "DCO.md",
  "docs/architecture.md", "docs/provenance-model.md", "docs/safety-model.md",
  "docs/integration.md", "docs/maintainer/github-launch.md", "docs/assets/project-glassbox-overview.png",
  "docs/assets/project-glassbox-architecture.svg",
  "schemas/observable-agent-event.schema.json", "schemas/audit-record.schema.json",
  ".github/workflows/ci.yml", ".github/workflows/codeql.yml", ".github/workflows/labels.yml",
  ".github/labels.json",
  ".github/PULL_REQUEST_TEMPLATE.md", ".github/CODEOWNERS",
  "dist/index.html", "dist/styles.css", "dist/app.js"
];

const failures = [];
const fail = message => failures.push(message);

for (const file of requiredFiles) {
  const path = resolve(root, file);
  if (!existsSync(path) || !statSync(path).isFile()) fail(`Missing required file: ${file}`);
}

for (const schema of ["schemas/observable-agent-event.schema.json", "schemas/audit-record.schema.json"]) {
  try {
    JSON.parse(readFileSync(resolve(root, schema), "utf8"));
  } catch (error) {
    fail(`${schema} is not valid JSON: ${error.message}`);
  }
}

const html = readFileSync(resolve(root, "dist/index.html"), "utf8");
const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicateIds.length) fail(`Duplicate HTML ids: ${[...new Set(duplicateIds)].join(", ")}`);
if (!html.includes("Observable trace, not private thoughts")) fail("The in-product epistemic-boundary notice is missing.");
if (/\b(?:script\s+src|link[^>]+href)=["']https?:\/\//i.test(html)) fail("The application unexpectedly loads remote executable assets.");

const app = readFileSync(resolve(root, "dist/app.js"), "utf8");
for (const marker of [
  "GlassboxAgentAdapter", "deterministicReplay", "humanReviewLedger",
  "human-readable-interpretation", "not-instrumented", "awaiting-human-authorization"
]) {
  if (!app.includes(marker)) fail(`Application contract marker is missing: ${marker}`);
}

const markdownFiles = requiredFiles.filter(file => extname(file) === ".md");
for (const markdownFile of markdownFiles) {
  if (!existsSync(resolve(root, markdownFile))) continue;
  const content = readFileSync(resolve(root, markdownFile), "utf8");
  for (const match of content.matchAll(/!?\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g)) {
    const target = match[1].split("#")[0];
    if (!target || /^(?:https?:|mailto:)/.test(target)) continue;
    if (!existsSync(resolve(root, dirname(markdownFile), target))) fail(`${markdownFile} references missing local target: ${target}`);
  }
}

const secretPatterns = [
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ["AWS access key", /AKIA[0-9A-Z]{16}/],
  ["GitHub token", /(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{40,})/],
  ["Slack token", /xox[baprs]-[A-Za-z0-9-]{20,}/]
];

let history = "";
try {
  history = execFileSync("git", ["log", "-p", "--all", "--no-ext-diff", "--", ":!.openai/hosting.json"], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024
  });
} catch (error) {
  fail(`Unable to scan Git history: ${error.message}`);
}
for (const [label, pattern] of secretPatterns) {
  if (pattern.test(history)) fail(`Potential ${label} found in Git history; inspect before publication.`);
}

let repositoryFiles = [];
try {
  repositoryFiles = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], {
    cwd: root,
    encoding: "utf8"
  }).trim().split("\n").filter(Boolean);
} catch (error) {
  fail(`Unable to enumerate repository files: ${error.message}`);
}
for (const file of repositoryFiles) {
  const path = resolve(root, file);
  if (!existsSync(path) || statSync(path).size > 5 * 1024 * 1024) continue;
  const data = readFileSync(path);
  if (data.includes(0)) continue;
  const content = data.toString("utf8");
  for (const [label, pattern] of secretPatterns) {
    if (pattern.test(content)) fail(`Potential ${label} found in ${file}; inspect before publication.`);
  }
}

if (failures.length) {
  console.error("Validation failed:");
  failures.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`Validation passed: ${requiredFiles.length} required files, ${ids.length} unique interface ids, 2 schemas, local links, disclosure boundary, adapter contract, and repository/history token patterns.`);
