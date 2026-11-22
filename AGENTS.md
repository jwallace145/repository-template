# Rules for coding agents

This file restates the repository conventions for coding agents. The human-facing version, with setup details, is [CONTRIBUTING.md](CONTRIBUTING.md); the full standard is [repository-conventions.md](repository-conventions.md).

## Non-negotiable

- **Never push to `main`.** Every change reaches `main` through a pull request. Direct pushes are blocked by a branch ruleset; do not try to work around it.
- **Commits are a single line**: `type(scope): subject`, at most 100 characters, with a lowercase imperative subject and no trailing period. After that line, only a blank line and `Co-authored-by: Name <email>` trailers are allowed (your attribution trailer is fine). No body text; details go in the pull request description.
  - Types: `feat`, `fix`, `perf`, `revert`, `docs`, `refactor`, `test`, `build`, `ci`, `style`, `chore`. Never invent another.
  - Scope: exactly one of this repository's scopes, listed in `SCOPES` in `commitlint.config.mjs` and in the Scopes table in CONTRIBUTING.md. Never invent one; if none fits, ask. A change spanning two scopes is two pull requests, or it takes the scope it is mostly about.
  - Breaking changes use `!`: `feat(commitlint)!: require a scope on every commit`.
- **Pull request titles are valid commit headers**, scope included. The title becomes the squash-merge commit message.
- **Pull request bodies use the template's sections, in order, every one filled in** (Summary, Why, Changes, Verification, Checklist). Write "n/a" rather than deleting one.

  ```sh
  gh pr create --title "type(scope): subject" --body-file <file>
  ```

- **Merges are squash or rebase only.** History stays linear.
- **Releases are made by merging the Release Please pull request.** Do not create tags or releases by hand, and do not edit `CHANGELOG.md`, `version.txt` or `.release-please-manifest.json`.
- **Cloud infrastructure goes through Jaws.** Never add Terraform or create cloud resources directly; see [repository-conventions.md](repository-conventions.md#cloud-infrastructure-with-jaws).
- **Keep the conventions and their files in step.** A change to a rule in `repository-conventions.md` or `organization-conventions.md` and the change to the file that implements it land in the same pull request.
- **Run the checks before opening a pull request:**

  ```sh
  npm test
  ```
