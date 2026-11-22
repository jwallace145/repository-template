# Contributing

This repository holds my repository and organization conventions, plus a working copy of every file they describe. It has no build step and deploys nothing. Coding agents should read [AGENTS.md](AGENTS.md).

It follows its own conventions: a change to a convention and the change to the file that implements it land in the same pull request.

## Local development setup

Requirements: Node.js 24, [pre-commit](https://pre-commit.com) and the GitHub CLI (`gh`).

```sh
git clone https://github.com/jwallace145/repository-template.git
cd repository-template
npm ci                                         # commitlint
pre-commit install --hook-type commit-msg      # local commit-msg hook
```

The `commit-msg` hook runs commitlint locally. It is a convenience only; **CI is the authoritative check**.

Run the CI checks locally before opening a pull request:

```sh
npm test
```

## Commits

Each commit message is a **single-line** Conventional Commit with a type and a scope:

```
type(scope): subject
```

- At most 100 characters, with an imperative, lowercase subject and no trailing period.
- Breaking changes are marked with `!`, for example `feat(commitlint)!: require a scope on every commit`.
- The **only** content allowed after the header is a blank line followed by `Co-authored-by: Name <email>` trailers (any letter case). No body text; details belong in the pull request description.

commitlint enforces this: `@commitlint/config-conventional` plus the local rules `single-scope`, `subject-lowercase` (which lets Dependabot's fixed `chore(deps): Bump ...` through) and `only-coauthor-trailers` in `tools/commitlint/`. The fixtures in `tests/commitlint/` show accepted and rejected messages; CI checks them.

### Types

`feat`, `fix`, `perf`, `revert`, `docs`, `refactor`, `test`, `build`, `ci`, `style`, `chore`. The set is the same in every repository; see [repository-conventions.md](repository-conventions.md#types) for what each is for.

### Scopes

Every commit names exactly one of this repository's scopes. They are `SCOPES` in `commitlint.config.mjs`; this table mirrors it, in the same order, and `npm test` fails if they drift.

| Scope | Covers |
| --- | --- |
| `conventions` | `repository-conventions.md` and `organization-conventions.md` |
| `templates` | The pull request template and the issue forms |
| `commitlint` | The commitlint config, the local rules, their tests and fixtures |
| `workflows` | GitHub Actions workflows and the Dependabot config |
| `repo` | README, CONTRIBUTING, AGENTS, LICENSE, CODEOWNERS, scripts and tooling config |
| `deps` | Dependency updates, mostly Dependabot's |
| `release` | Release Please's release pull requests and its config |

## Pull requests

- After the initial scaffold commit, **every change reaches `main` through a pull request**. Direct pushes are blocked.
- Merges are **squash or rebase only**. No merge commits; history is linear.
- The **title must be a valid commit header**, scope included, because a squash merge uses it as the commit message.
- Fill in every section of the [template](.github/pull_request_template.md): Summary, Why, Changes, Verification. Write "n/a" rather than deleting one.

CI runs these jobs on every pull request, and all of them are required on `main`:

| Job | Checks |
| --- | --- |
| `commitlint` | Every commit in the range `base..head`, so rebase-merged commits are all checked |
| `pr-title` | The title, through the same commitlint config as a commit |
| `commitlint-rules` | Unit tests for the local rules, the scopes table, and the fixture messages |

## Issues

Open issues from the forms: **Bug**, **Feature** or **Task**. Blank issues are off.

## Releases and versioning

Releases are managed by [Release Please](https://github.com/googleapis/release-please).

- One version for the whole repository (`release-type: simple`), tagged `vX.Y.Z`, starting at `v0.1.0`. Release Please owns `CHANGELOG.md` and `version.txt`; nobody edits them by hand.
- On every push to `main`, the `release-please` workflow opens or updates a release pull request titled `chore(release): release X.Y.Z`, authored by the release bot so CI runs on it. This repository is on a personal account, so its credentials are the repository secrets `RELEASE_BOT_CLIENT_ID` and `RELEASE_BOT_PRIVATE_KEY`.
- **Merging the Release Please pull request is the deliberate, human-reviewed act that releases a version.** Nobody creates tags by hand.

| Change | Commit type | Bump |
| --- | --- | --- |
| A rule removed or loosened, or a file a project copies changed incompatibly | `feat!` / `fix!` | major (minor while `0.x`) |
| A new rule, template or file | `feat` | minor |
| A correction | `fix` | patch |
| `docs`, `chore`, `ci`, `refactor`, `test`, `style`, `build` | | no release on their own |

## Repository settings

`IS_TEMPLATE=true scripts/apply-repo-settings.sh` applies the settings through the GitHub API:

- Squash and rebase merges only; squash commits use the pull request title and a blank body. Head branches are deleted after merge.
- The `bug`, `enhancement` and `task` labels the issue forms apply.
- The repository is marked as a template repository.
- A ruleset on `main` requires a pull request, squash or rebase merges, every CI job as a status check and linear history, and blocks force pushes and deletion, with no bypass actors.
