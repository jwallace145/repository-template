import assert from "node:assert/strict";
import { test } from "node:test";

import subjectLowercase from "./subject-lowercase.mjs";

const check = (header) => {
  const subject = header.replace(/^[^:]*:\s*/, "");
  return subjectLowercase({ header, subject })[0];
};

test("accepts a lowercase subject", () => {
  assert.equal(check("feat(repo): add the issue forms"), true);
});

test("accepts a subject that starts with a non-letter", () => {
  assert.equal(check("chore(release): release 0.2.0"), true);
  assert.equal(check("fix(repo): `npm test` runs the fixtures"), true);
});

test("rejects a capitalised subject", () => {
  assert.equal(check("feat(repo): Add the issue forms"), false);
  assert.equal(check("feat(repo): ADD THE ISSUE FORMS"), false);
});

test("accepts Dependabot's capitalised Bump", () => {
  assert.equal(check("chore(deps): Bump actions/checkout from 6 to 7"), true);
});

test("the exception is only Dependabot's exact header", () => {
  assert.equal(check("chore(repo): Bump actions/checkout from 6 to 7"), false);
  assert.equal(check("feat(deps): Bump actions/checkout from 6 to 7"), false);
  assert.equal(check("chore(deps): Update actions/checkout"), false);
});

test("names the subject in the message", () => {
  const [, message] = subjectLowercase({ header: "feat(repo): Add x", subject: "Add x" });
  assert.match(message, /"Add x"/);
});

test("supports the never flavour", () => {
  assert.equal(subjectLowercase({ header: "feat(repo): Add x", subject: "Add x" }, "never")[0], true);
});
