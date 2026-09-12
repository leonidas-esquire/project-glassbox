import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const load = path => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the application states its epistemic boundary", async () => {
  const html = await load("dist/index.html");
  assert.match(html, /Observable trace, not private thoughts/);
  assert.match(html, /never literal thoughts or proven “understanding\.”/);
});

test("all three agent architectures are represented", async () => {
  const app = await load("dist/app.js");
  assert.match(app, /architecture: "llm"/);
  assert.match(app, /architecture: "deterministic"/);
  assert.match(app, /architecture: "hybrid"/);
});

test("observable event adapter rejects unsupported states", async () => {
  const app = await load("dist/app.js");
  for (const status of [
    "observed", "deterministically-verified", "human-readable-interpretation",
    "inferred", "restricted", "not-instrumented", "unavailable", "blocked",
    "awaiting-human-authorization"
  ]) assert.ok(app.includes(`"${status}"`), `missing status ${status}`);
  assert.match(app, /Unsupported verification status/);
});

test("audit export preserves deterministic and human-review evidence", async () => {
  const app = await load("dist/app.js");
  assert.match(app, /deterministicReplay:/);
  assert.match(app, /humanReviewLedger:/);
  assert.match(app, /instrumentationBoundaries:/);
});

test("the static interface includes responsive and accessible fallbacks", async () => {
  const [html, css] = await Promise.all([load("dist/index.html"), load("dist/styles.css")]);
  assert.match(html, /<html lang="en">/);
  assert.match(html, /name="viewport"/);
  assert.match(html, /aria-label="Context granularity"/);
  assert.match(html, /role="dialog"/);
  assert.match(css, /@media \(max-width: 600px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /:focus-visible/);
});

test("the overview image is a readable landscape asset", async () => {
  const image = await readFile(new URL("../docs/assets/project-glassbox-overview.png", import.meta.url));
  assert.equal(image.subarray(1, 4).toString("ascii"), "PNG");
  assert.equal(image.readUInt32BE(16), 1672);
  assert.equal(image.readUInt32BE(20), 941);
});

test("the developer SVG has accessible metadata and a high-resolution viewBox", async () => {
  const svg = await load("docs/assets/project-glassbox-architecture.svg");
  assert.match(svg, /viewBox="0 0 1600 1100"/);
  assert.match(svg, /<title id="title">Project Glassbox architecture and assurance model<\/title>/);
  assert.match(svg, /<desc id="description">/);
});

test("user-visible values are escaped before dynamic HTML rendering", async () => {
  const app = await load("dist/app.js");
  assert.match(app, /function escapeHTML\(value\)/);
  assert.match(app, /replace\(\/\[&<>'"\]\/g/);
  assert.match(app, /escapeHTML\(item\.summary\)/);
  assert.match(app, /escapeHTML\(file\.name\)/);
});

test("JSON schemas are valid and identify their contracts", async () => {
  const eventSchema = JSON.parse(await load("schemas/observable-agent-event.schema.json"));
  const auditSchema = JSON.parse(await load("schemas/audit-record.schema.json"));
  assert.equal(eventSchema.title, "Project Glassbox Observable Agent Event");
  assert.equal(auditSchema.title, "Project Glassbox Audit Record");
  assert.ok(eventSchema.required.includes("agentId"));
  assert.ok(auditSchema.required.includes("instrumentationBoundaries"));
});
