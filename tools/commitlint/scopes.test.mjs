import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { SCOPES } from "../../commitlint.config.mjs";

// CONTRIBUTING.md documents the scopes for people; commitlint.config.mjs
// enforces them. This keeps the two in step.
const contributing = readFileSync(new URL("../../CONTRIBUTING.md", import.meta.url), "utf8");

function documentedScopes() {
  const lines = contributing.split("\n");
  const start = lines.findIndex((line) => line.trim() === "### Scopes");
  assert.notEqual(start, -1, 'CONTRIBUTING.md needs a "### Scopes" section');
  const rows = [];
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith("#")) break;
    const match = line.match(/^\|\s*`([^`]+)`\s*\|/);
    if (match) rows.push(match[1]);
  }
  return rows;
}

test("every scope is kebab-case", () => {
  for (const scope of Object.keys(SCOPES)) {
    assert.match(scope, /^[a-z0-9]+(-[a-z0-9]+)*$/, `scope "${scope}"`);
  }
});

test("the scopes include deps and release, which the bots write", () => {
  assert.ok("deps" in SCOPES, "Dependabot commits as chore(deps)");
  assert.ok("release" in SCOPES, "Release Please commits as chore(release)");
});

test("CONTRIBUTING.md lists exactly the configured scopes, in order", () => {
  assert.deepEqual(documentedScopes(), Object.keys(SCOPES));
});
