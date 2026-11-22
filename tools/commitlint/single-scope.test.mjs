import assert from "node:assert/strict";
import { test } from "node:test";

import singleScope from "./single-scope.mjs";

const check = (scope) => singleScope({ scope })[0];

test("accepts one scope", () => {
  assert.equal(check("templates"), true);
});

test("leaves a missing scope to scope-empty", () => {
  assert.equal(check(null), true);
  assert.equal(check(""), true);
});

test("rejects a comma-separated list", () => {
  assert.equal(check("templates,workflows"), false);
  assert.equal(check("templates, workflows"), false);
});

test("rejects slash-separated scopes", () => {
  assert.equal(check("templates/workflows"), false);
  assert.equal(check("templates\\workflows"), false);
});

test("names the scope in the message", () => {
  const [, message] = singleScope({ scope: "a,b" });
  assert.match(message, /"a,b"/);
});

test("supports the never flavour", () => {
  assert.equal(singleScope({ scope: "a,b" }, "never")[0], true);
});
