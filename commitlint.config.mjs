import onlyCoauthorTrailers from "./tools/commitlint/only-coauthor-trailers.mjs";
import singleScope from "./tools/commitlint/single-scope.mjs";

// The commit types. One closed set, identical in every repository: copy it
// unchanged and never add to it.
export const TYPES = [
  "feat",
  "fix",
  "perf",
  "revert",
  "docs",
  "refactor",
  "test",
  "build",
  "ci",
  "style",
  "chore",
];

// This repository's scopes: the only ones a commit may use. Every repository
// defines its own set. `deps` and `release` are in every set because
// Dependabot and Release Please write them. The Scopes table in
// CONTRIBUTING.md mirrors this object, in the same order; `npm test` fails if
// the two drift apart.
export const SCOPES = {
  conventions: "repository-conventions.md and organization-conventions.md",
  templates: "The pull request template and the issue forms",
  commitlint: "The commitlint config, the local rules, their tests and fixtures",
  workflows: "GitHub Actions workflows and the Dependabot config",
  repo: "README, CONTRIBUTING, AGENTS, LICENSE, CODEOWNERS, scripts and tooling config",
  deps: "Dependency updates, mostly Dependabot's",
  release: "Release Please's release pull requests and its config",
};

// A commit message is exactly one line, `type(scope): subject`, of at most
// 100 characters. The only thing allowed after it is a blank line followed by
// `Co-authored-by: Name <email>` trailers. Detail belongs in the pull request.
export default {
  extends: ["@commitlint/config-conventional"],
  plugins: [
    {
      rules: {
        "only-coauthor-trailers": onlyCoauthorTrailers,
        "single-scope": singleScope,
      },
    },
  ],
  // Do not silently skip merge, fixup or revert messages: history is linear
  // and every commit on main is a Conventional Commit.
  defaultIgnores: false,
  rules: {
    "header-max-length": [2, "always", 100],
    "type-enum": [2, "always", TYPES],
    "scope-enum": [2, "always", Object.keys(SCOPES)],
    "scope-empty": [2, "never"],
    "single-scope": [2, "always"],
    "only-coauthor-trailers": [2, "always"],
    // The local rule above is the authority on everything after the header;
    // the built-in body and footer rules would only produce duplicates.
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
    "body-leading-blank": [0],
    "footer-leading-blank": [0],
  },
};
