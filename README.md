# repository-template

[![GitHub release](https://img.shields.io/github/v/release/jwallace145/repository-template?label=release)](https://github.com/jwallace145/repository-template/releases/latest)
[![CI](https://github.com/jwallace145/repository-template/actions/workflows/ci.yml/badge.svg?event=pull_request)](https://github.com/jwallace145/repository-template/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jwallace145/repository-template/blob/main/LICENSE)

The standard every one of my projects starts from: how its GitHub organization is set up, how each repository in it works, and a working copy of every file those rules call for. The repository follows its own conventions, so what's here is known to pass its own CI.

## The conventions

| Document | Covers |
| --- | --- |
| [organization-conventions.md](organization-conventions.md) | When a project gets its own GitHub organization, naming, the standard `.github` and `<project>-branding` repositories, the per-organization release bot and organization secrets, Jaws for all cloud infrastructure, and the new organization checklist |
| [repository-conventions.md](repository-conventions.md) | One-line Conventional Commits with a shared set of types and a per-repository set of scopes, commitlint, pull requests, issues, merging, CI, Jaws, Release Please, the README header, and the new repository checklist |

## The files a new repository copies

| Path | What it is |
| --- | --- |
| `commitlint.config.mjs` | The shared types and this repository's `SCOPES`; replace the scopes with the new repository's own |
| `tools/commitlint/` | The local rules `only-coauthor-trailers`, `single-scope` and `subject-lowercase`, with unit tests, and the scopes drift test |
| `tests/commitlint/`, `scripts/test-commitlint.sh` | Fixture messages that must pass or fail, and their runner |
| `package.json`, `.pre-commit-config.yaml` | commitlint and the local `commit-msg` hook |
| `.github/workflows/ci.yml` | The `commitlint`, `pr-title` and `commitlint-rules` jobs |
| `.github/workflows/release-please.yml`, `release-please-config.json`, `.release-please-manifest.json`, `version.txt` | Release Please with the release bot |
| `.github/pull_request_template.md` | The one pull request template |
| `.github/ISSUE_TEMPLATE/` | The Bug, Feature and Task forms, with blank issues off |
| `.github/dependabot.yml`, `.github/CODEOWNERS` | Weekly updates as `chore(deps)`, and the owner |
| `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `LICENSE` | The rules for agents and people, and the MIT license |
| `scripts/apply-repo-settings.sh` | Merge settings, labels and the `main` ruleset, through the GitHub API |

The two conventions documents, this README and `CHANGELOG.md` belong to this repository only; a new repository writes its own README and lets Release Please create its changelog.

What changed in each version of the conventions is in [CHANGELOG.md](CHANGELOG.md), which Release Please writes from the commits; pin a project to a [release](https://github.com/jwallace145/repository-template/releases) when it needs to say which version of the conventions it follows.

Contribution rules are in [CONTRIBUTING.md](CONTRIBUTING.md); the rules for coding agents are in [AGENTS.md](AGENTS.md).
