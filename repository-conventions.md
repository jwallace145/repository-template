# Repository conventions

## How to use this

Every repository in every one of my projects applies this whole document unless its own brief says otherwise. Hand it to coding agents together with the repository's brief and say "apply the repository conventions". Requirements marked **MUST** are non-negotiable; an agent asks before deviating from one. Placeholders look like `<REPO>`.

How the GitHub organization around a repository is set up (its release bot, organization secrets, branding repository and Jaws) is in [organization-conventions.md](organization-conventions.md). This template repository ships a working copy of every file described here; copy them from it rather than writing them again.

## Commit messages

**MUST:** every commit is a single-line Conventional Commit with a type and a scope, at most 100 characters. Details go in the pull request description, never in the commit.

- Format: `type(scope): subject`, with an imperative, lowercase subject and no trailing period.
- Breaking changes are marked with `!` before the colon: `feat(api)!: drop the v1 routes`.
- The only thing allowed after the header is a blank line followed by `Co-authored-by: Name <email>` trailers, which credit a pairing human or an AI model. The key matches in any letter case, so Claude Code's `Co-Authored-By:` passes. Nothing else: no body, no `Closes #12`, no `Signed-off-by`.
- Merge commits and git's default `Revert "..."` messages are rejected. Write a revert as `revert(scope): subject`.
- The one exception to the lowercase subject is Dependabot, which always writes `chore(deps): Bump ...`; the local `subject-lowercase` rule allows exactly that header and nothing else.

### Types

**MUST:** one closed set of types, identical in every repository. Never add a type.

| Type | Use it for | Release |
| --- | --- | --- |
| `feat` | A new capability or a change in behavior | minor |
| `fix` | A bug fix | patch |
| `perf` | The same behavior, faster or cheaper | patch |
| `revert` | Undoing an earlier commit | patch |
| `docs` | Documentation only | none |
| `refactor` | Restructuring with no change in behavior | none |
| `test` | Tests only | none |
| `build` | The build system, packaging, toolchains | none |
| `ci` | CI workflows | none |
| `style` | Formatting only | none |
| `chore` | Upkeep: dependencies, tooling, releases | none |

Any type marked with `!` bumps the major version (the minor version while `0.x`).

### Scopes

**MUST:** every repository defines its own closed set of scopes, and every commit names exactly one of them.

- Scopes name the parts of *this* repository, for example `search`, `nnue` and `uci` in a chess engine, or `foundation`, `config` and `cli` in Jaws. There is no shared list across repositories.
- Each scope is short, kebab-case and stable. Five to ten is typical; a scope that would be used once is too narrow, and one that covers half the repository is too broad.
- Every set includes `deps` and `release`, because Dependabot writes `chore(deps): ...` and Release Please writes `chore(release): ...`.
- The set lives in `SCOPES` in `commitlint.config.mjs`, with a one-line meaning for each, and the Scopes table in `CONTRIBUTING.md` mirrors it in the same order. A test fails when they drift.
- A change that spans two scopes is either two pull requests or belongs to the scope it is mostly about. Lists such as `feat(api,ui)` are rejected.
- Adding, renaming or removing a scope goes through a pull request like any other change.

| Message | Valid |
| --- | --- |
| `feat(search): add aspiration windows` | Yes |
| `fix(uci): parse movetime` + blank line + `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` | Yes |
| `feat: add aspiration windows` | No, no scope |
| `feat(engine): add aspiration windows` | No, `engine` is not one of the repository's scopes |
| `feat(search,uci): add aspiration windows` | No, two scopes |
| `feat(search): add aspiration windows` + blank line + `This adds…` | No, body text |
| `Added aspiration windows` | No, not conventional |

## Commitlint

Copy `commitlint.config.mjs`, `tools/commitlint/`, `tests/commitlint/`, `scripts/test-commitlint.sh`, `package.json` and `.pre-commit-config.yaml` from this template, then replace `SCOPES` and the fixtures with the repository's own. The config is `@commitlint/config-conventional` plus:

```js
// commitlint.config.mjs (abridged)
export const TYPES = ["feat", "fix", "perf", "revert", "docs", "refactor",
  "test", "build", "ci", "style", "chore"];               // the same everywhere

export const SCOPES = {                                    // this repository's own
  search: "Alpha-beta search, move ordering and pruning",
  uci: "The UCI protocol front end",
  deps: "Dependency updates, mostly Dependabot's",
  release: "Release Please's release pull requests and its config",
};

rules: {
  "header-max-length": [2, "always", 100],
  "type-enum": [2, "always", TYPES],
  "scope-enum": [2, "always", Object.keys(SCOPES)],
  "scope-empty": [2, "never"],
  "single-scope": [2, "always"],          // local rule: one scope, not a list
  "subject-case": [0],
  "subject-lowercase": [2, "always"],     // local rule: lowercase, except Dependabot's `chore(deps): Bump`
  "only-coauthor-trailers": [2, "always"], // local rule: nothing after the header but trailers
}
```

- The three local rules are in `tools/commitlint/` with unit tests. The built-in body and footer rules can't express "only co-author trailers" reliably.
- `npm test` runs the unit tests, checks that `CONTRIBUTING.md` lists exactly the configured scopes, and runs every fixture in `tests/commitlint/valid` (must pass) and `tests/commitlint/invalid` (must fail).
- **Local:** a `commit-msg` hook through `pre-commit`, documented in `CONTRIBUTING.md`. It's a convenience only.
- **CI is authoritative:** it lints every commit in the pull request range (base..head), and lints the pull request title through the same config, because squash merges use the title as the commit message.

## Pull requests

**MUST:** after the initial scaffold commit, every change reaches `main` through a pull request. The pull request description carries the detail that commits don't.

- The title is a valid commit header, scope included. It becomes the squash commit on `main`, so it's the line people read in `git log`.
- One template, `.github/pull_request_template.md`, with Summary, Why, Changes and Verification sections and a four-item checklist. Fill in every section; write "n/a" rather than deleting one. For a fix, Why names the bug, its root cause and how to reproduce it.
- A repository may add **one** section of its own, between Verification and Checklist, when its CI or review depends on a measurement no other repository has: braveheart's **Bench and SPRT** (the Bench job reads its last `Bench:` line), the trainer's **Nets**, self-play's **Data**. It is still filled in on every pull request ("n/a" when it doesn't apply), its CONTRIBUTING.md names it, and the four standard sections and the checklist stay as they are. A second extra section, or one that only restates Verification, belongs in Verification instead.
- Link the issue with `Closes #<n>` in the description, never in a commit.
- One logical change per pull request: if the title can't describe it in one line, split it.

**Coding agents** follow the same rules, restated in `AGENTS.md` (and imported by `CLAUDE.md`):

1. Never push to `main`; always work on a branch.
2. One-line commits with a type and one of the repository's scopes; `Co-authored-by` trailers are the only thing allowed after it.
3. Open pull requests with the template's sections, in order, every one filled in: `gh pr create --title "<header>" --body-file <file>`.
4. Run the repository's checks locally before opening the pull request.

## Issues

- Issues start from the issue forms in `.github/ISSUE_TEMPLATE/`. Blank issues are turned off (`config.yml`).

  | Form | For | Label |
  | --- | --- | --- |
  | `bug.yml` | Something is broken: what happened, reproduction, version, logs | `bug` |
  | `feature.yml` | A new capability: problem, proposal, done when, alternatives | `enhancement` |
  | `task.yml` | Work that changes no behavior: what, why, done when | `task` |

- Issue titles are plain, specific sentences ("Search hangs on positions with a single legal move"). The Conventional Commit belongs on the pull request that closes it.
- `scripts/apply-repo-settings.sh` creates the three labels.

## Branch protection and merging

**MUST:** pull requests merge by squash or rebase only, with no merge commits and a linear history. Apply these settings with `scripts/apply-repo-settings.sh` once the conventions pull request has merged.

| Setting | Value |
| --- | --- |
| Allow squash merging | On |
| Allow rebase merging | On |
| Allow merge commits | Off |
| Squash commit title | `PR_TITLE` |
| Squash commit message | `BLANK` (GitHub still adds co-author trailers) |
| Auto-delete head branches | On |

Branch ruleset on `main`:

- Require a pull request before merging
- Allowed merge methods: squash and rebase
- Require status checks: every CI job
- Require linear history
- Block force pushes and deletion
- No bypass actors

## CI baseline

Every repository's `ci.yml` runs on `pull_request` (including `edited`, so a retitled pull request is checked again) with these jobs, plus whatever build and test jobs the repository's brief adds.

| Job | Checks |
| --- | --- |
| `commitlint` | Every commit in base..head |
| `pr-title` | The title, through the same commitlint config as a commit |
| `commitlint-rules` | `npm test`: the local rules, the scopes table and the fixtures |
| repo-specific | Build, lint, test, as the repository's brief defines |

- Each job sets least-privilege `permissions:`.
- Actions are pinned to major versions, and Dependabot updates `github-actions` (and the repository's own ecosystems) weekly.
- Dependabot's `commit-message.prefix` is `chore(deps)` for every ecosystem, so its pull request titles are valid headers. Its commits carry a release-notes body, so `commitlint` skips its pull requests; they are squash merged, and only the title lands on `main`.
- AWS access goes through GitHub OIDC roles that Jaws creates, never long-lived keys. Role ARNs are stored as repository **variables**, not secrets.

## Cloud infrastructure with Jaws

**MUST:** every repository that needs cloud infrastructure has it created and managed by [Jaws](https://github.com/Jaws-Platform/jaws), the common platform across all of my AWS accounts. Jaws centralizes infrastructure management, so every project gets the same governance, tagging, cost allocation, state handling, and least-privilege CI roles without reinventing them.

How a project uses Jaws:

1. **Onboard the project to Jaws.** Onboarding is one reviewed change to `config/projects.yaml` in the `jaws` repository, registered under the project's GitHub organization. It creates the project's CI roles (plan, apply, and preview, release or task as the project type needs), its state prefix in the shared state bucket, and its guardrails.
2. **Declare the infrastructure in a `jaws.yaml`** at the repository root, following the Jaws schema: `version`, `project`, `repository`, the required `tags`, and then `components` (for example `task-runner`, `dataset`, `container-image`, `lichess-bot`, `databricks-workspace`) or `domain` and `site` for a static site. The `jaws` CLI derives everything else (region, account, networking, names, state, roles). See [braveheart's `jaws.yaml`](https://github.com/Braveheart-Chess/braveheart/blob/main/jaws.yaml) for a working example.
3. **Run it from CI** by calling the Jaws reusable workflows (for example `site-plan.yml`, `site-deploy.yml`, `remote-task.yml`), pinned to an exact Jaws tag that Dependabot bumps. Role ARNs go in repository **variables**. Pass secrets to Jaws workflows by name; `secrets: inherit` only reaches callers inside the `Jaws-Platform` organization.

Rules:

- Project repositories keep **no Terraform** and no hand-made cloud resources. Don't create state backends, OIDC providers, IAM roles, or resources outside Jaws.
- Every project file carries the standard tags (`Organization`, `Project`, `Environment`, `Repository`, `Owner`). Jaws cross-checks them and adds `ManagedBy`, and cost reporting groups by them.
- Runtime secrets for deployed infrastructure live in AWS through Jaws, not in GitHub.
- If Jaws doesn't support something a project needs (a new resource or a new use case), open a feature request on [Jaws](https://github.com/Jaws-Platform/jaws) rather than working around it locally. Ask before deviating.

## Releases with Release Please

Merging the Release Please pull request is the human-reviewed gate for every release, whether that's a package, a module version, or an infrastructure apply. Release Please owns `CHANGELOG.md` and `version.txt`; nobody edits them by hand, and nobody creates tags by hand.

- Release pull requests are authored by the organization's own GitHub App, `<org>-release-bot[bot]` (for example `jaws-platform-release-bot[bot]`), so CI runs on them. Pull requests opened with `GITHUB_TOKEN` don't trigger CI. The bot and its secrets are set up once per organization; see [organization-conventions.md](organization-conventions.md#release-bot).
- The workflow reads the **organization** secrets `RELEASE_BOT_CLIENT_ID` and `RELEASE_BOT_PRIVATE_KEY`. A repository on a personal account, which has no organization secrets, sets them as repository secrets for the personal bot.
- Config uses a manifest (`release-please-config.json` and `.release-please-manifest.json`), `release-type: simple` unless an ecosystem type fits better, starting at `0.1.0`.
- `pull-request-title-pattern` is `chore(release): release${component} ${version}`, so the release commit uses the `release` scope instead of Release Please's default `chore(main)`.
- Jobs that ship an artifact use `needs: release-please` and `if: needs.release-please.outputs.release_created == 'true'`.

```yaml
# .github/workflows/release-please.yml (abridged)
on:
  push:
    branches: [main]
permissions: {}
jobs:
  release-please:
    runs-on: ubuntu-latest
    permissions: { contents: write, pull-requests: write }
    outputs:
      release_created: ${{ steps.rp.outputs.release_created }}
      tag_name: ${{ steps.rp.outputs.tag_name }}
    steps:
      - uses: actions/create-github-app-token@v3
        id: app-token
        with:
          client-id: ${{ secrets.RELEASE_BOT_CLIENT_ID }}
          private-key: ${{ secrets.RELEASE_BOT_PRIVATE_KEY }}
      - uses: googleapis/release-please-action@v5
        id: rp
        with:
          token: ${{ steps.app-token.outputs.token }}
          config-file: release-please-config.json
          manifest-file: .release-please-manifest.json
```

## README header

Every README in an organization opens with the same three parts, in this order, as defined by the organization's branding repository (see [organization-conventions.md](organization-conventions.md#branding)):

1. The organization's shared banner, linked to the organization. Link to it on `main` in `<project>-branding`; never copy it in.
2. The repository's name as the only level-one heading.
3. The repository's badges, one per line in a single paragraph: package or registry version, release, CI, license, then anything else.

Then one paragraph that says what the repository is and which project it belongs to. Use Markdown image syntax with absolute URLs, so registries that render READMEs (the Terraform Registry, crates.io, npm) show the header too.

## New repository checklist

Public repositories use the MIT license, with the copyright holder taken from `git config user.name`. Every repository ships `README.md`, `CONTRIBUTING.md`, `AGENTS.md`, `CLAUDE.md`, `LICENSE`, `.github/CODEOWNERS`, `.github/dependabot.yml`, the pull request template and the issue forms.

Agent:

- [ ] Decide the repository's scopes with the owner before writing anything else.
- [ ] Scaffold and push `chore(<scope>): initial scaffold` to `main`. This is the only direct push, ever.
- [ ] Add commitlint (with the repository's `SCOPES` and fixtures), the pre-commit hook, the pull request template, the issue forms, `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md` and CI, via a pull request.
- [ ] Add the Release Please config and workflow, via a pull request.
- [ ] If the repository needs cloud infrastructure, add its `jaws.yaml` and the Jaws reusable workflows, via a pull request, once the project is onboarded to Jaws.
- [ ] Run `scripts/apply-repo-settings.sh <ORG>/<REPO>` to apply the merge settings, the labels and the `main` ruleset.
- [ ] Verify that a commit without a scope fails CI, a multi-line commit fails CI, a one-line commit with a co-author trailer passes, and a pull request title with an unknown scope fails.

Owner:

- [ ] If the repository needs cloud infrastructure, onboard the project to Jaws.
- [ ] Check that the organization's release bot is installed on the repository. It is when the App is installed on all repositories.
- [ ] Set the repository's social preview from the branding repository.
- [ ] Merge the first Release Please pull request to cut `v0.1.0`.
