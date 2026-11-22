# Organization conventions

## How to use this

This document covers how I set up a project large enough to get its own GitHub organization: the standard repositories, the branding, the release bot, the organization secrets, and the Jaws infrastructure behind it. Every repository inside the organization then follows [repository-conventions.md](repository-conventions.md). Requirements marked **MUST** are non-negotiable; an agent asks before deviating from one. Placeholders look like `<Org-Name>`, `<org>` (the same name, lowercase) and `<project>`.

Working examples: [Braveheart-Chess](https://github.com/Braveheart-Chess) and [Jaws-Platform](https://github.com/Jaws-Platform).

## When a project gets an organization

- A project gets its own organization once it has more than one repository, or its own brand, releases or infrastructure. Braveheart-Chess holds the engine, its trainer, its self-play data, its Lichess bot and its Homebrew tap; Jaws-Platform holds the platform and its Terraform module families.
- A single-repository project or an experiment stays on my personal account, `jwallace145`, and moves into a new organization when it grows a second repository. Transferring a repository keeps redirects from the old URL.
- Everything that belongs to the project lives in its organization, so its repositories, bot, secrets and branding sit in one place, and it can be shared or handed over as a unit.

## Naming

| Thing | Pattern | Examples |
| --- | --- | --- |
| Organization | `<Org-Name>`: the project's name, Title-Case, hyphenated | `Braveheart-Chess`, `Jaws-Platform` |
| Main repository | `<project>`, lowercase | `braveheart`, `jaws` |
| Other repositories | `<project>-<part>`, lowercase kebab-case | `braveheart-trainer`, `braveheart-lichess-bot` |
| Branding repository | `<project>-branding` | `braveheart-branding`, `jaws-branding` |
| GitHub Apps | `<org>-<purpose>` | `braveheart-chess-release-bot`, `jaws-platform-comments` |

Names an ecosystem fixes keep its pattern: `.github`, `homebrew-tap`, `terraform-aws-<name>`.

## Standard repositories

**MUST:** every organization has these repositories, and each one follows the repository conventions.

| Repository | What it holds |
| --- | --- |
| `.github` | The organization profile, `profile/README.md`: what the project is, how its pieces fit, and a table of every repository and every GitHub App. It also provides default community health files for any repository that has none of its own (every repository still ships its own). |
| `<project>-branding` | The project's logo, avatar, README banner, social preview, favicons and fonts, the scripts that render them, and the README header standard. See [Branding](#branding). |
| `<project>` and `<project>-<part>` | The project itself. |

Update `profile/README.md` whenever a repository or an App is added or retired.

## Branding

**MUST:** every organization has a `<project>-branding` repository from the start, and every other repository links to its files instead of copying them, so a change to the brand reaches every repository without a pull request.

- **Standard assets.** Each lives at a fixed path, documented in a table in the branding README with its size and use.

  | Asset | Size | Used for |
  | --- | --- | --- |
  | Logo | 1024 × 1024, transparent | Anywhere that supplies its own background |
  | Avatar | 1024 × 1024, solid background, fits GitHub's circle crop | The organization picture and every App's logo |
  | README banner | 1280 × 320 | The first line of every README in the organization, and the profile |
  | Social preview | 1280 × 640 | Each repository's social preview image |
  | Favicons | 32, 64 and 180 px | Sites, when the project has one |

- **Published paths never move.** Other repositories link to `https://raw.githubusercontent.com/<Org-Name>/<project>-branding/main/<path>`, so moving, renaming or removing a path is a breaking change (`feat!`) that needs every linking repository updated first. What is drawn at a path can change freely; a redrawn asset is a `feat`.
- **Assets are rendered, not hand-edited.** A script draws every asset from the original artwork and fonts committed in the repository. CI fails when a published path is missing, has the wrong size, or no longer matches what the script draws.
- **The README header standard** lives in the branding README as a copyable block: the banner linked to the organization, the repository name as the only level-one heading, then the badges (see [repository-conventions.md](repository-conventions.md#readme-header)).
- **Palette and type** are documented in the branding README: named colors with hex values and uses, and the fonts with their licenses.
- **Licensing.** Code is MIT. The artwork may be all rights reserved instead; when it is, ship `LICENSE` for the artwork and `LICENSE-CODE` for the scripts, as `braveheart-branding` does, and say so in the README.

## Release bot

**MUST:** every organization owns one release bot, a GitHub App named `<org>-release-bot`, and every repository's Release Please workflow uses it.

- Release pull requests opened with `GITHUB_TOKEN` don't trigger CI. A pull request opened by an App does, so release pull requests get the same checks as any other.
- The App is owned by the organization, not by my personal account, so its reach ends at the organization's boundary and it moves with the organization.
- **Settings:** no webhook; repository permissions Contents read and write, and Pull requests read and write (Metadata read is implied); installed on **all repositories**, so every new repository gets it without a step.
- **Logo:** the organization avatar from the branding repository.
- Other Apps follow the same pattern: one App per purpose, owned by the organization, listed in the profile. For example, `jaws-platform-comments` posts the Jaws plan and preview comments and is installed in every organization that uses Jaws sites.

## Organization secrets and variables

**MUST:** credentials that every repository needs are **organization** secrets with access for all repositories, set once per organization. They are never copied into repository secrets.

| Secret | Value |
| --- | --- |
| `RELEASE_BOT_CLIENT_ID` | The release bot's client ID |
| `RELEASE_BOT_PRIVATE_KEY` | The full contents of one of the release bot's `.pem` private keys |

```sh
gh secret set RELEASE_BOT_CLIENT_ID   --org <Org-Name> --visibility all --body "<client-id>"
gh secret set RELEASE_BOT_PRIVATE_KEY --org <Org-Name> --visibility all < <org>-release-bot.private-key.pem
```

- The names are the same in every organization, so every workflow is identical across organizations; only the App behind the secrets differs.
- Anything specific to one repository stays on that repository: AWS role ARNs from Jaws are repository **variables** (they aren't sensitive), and a token only one repository uses is a repository secret.
- Runtime secrets for deployed infrastructure live in AWS through Jaws, not in GitHub.
- Rotate a key by generating a new one on the App, updating `RELEASE_BOT_PRIVATE_KEY`, and then deleting the old key from the App.

## Cloud infrastructure with Jaws

**MUST:** all cloud infrastructure for every project is created and managed by [Jaws](https://github.com/Jaws-Platform/jaws). No organization or repository keeps its own Terraform, state backends, OIDC providers, IAM roles or hand-made resources.

- Jaws standardizes governance, tagging, cost allocation, state and least-privilege CI roles across every project, so a new project starts with all of it.
- Each repository that needs infrastructure is onboarded in Jaws's `config/projects.yaml`, registered under its organization, and declares what it needs in a `jaws.yaml` at its root. The `Organization` and `Repository` tags tie every resource and every dollar back to the organization and repository that own it.
- If the project needs something Jaws doesn't do, it becomes a feature request on Jaws, not a workaround in the project.

The details for a repository are in [repository-conventions.md](repository-conventions.md#cloud-infrastructure-with-jaws).

## Organization settings

- Require two-factor authentication for members.
- The default branch name for new repositories is `main`.
- Set the organization picture to the avatar, and the display name, description and URL to match the profile.

## New organization checklist

Do the steps in this order: the bot needs the organization, the secrets need the bot, and every repository's README needs the branding.

Owner (these need the GitHub web UI or owner credentials):

- [ ] Create the organization `<Org-Name>` on the free plan, with `jwallace145` as owner, and apply the [organization settings](#organization-settings).
- [ ] Create the GitHub App `<org>-release-bot`, owned by the organization, with the [release bot settings](#release-bot). Install it on all repositories and generate a private key.
- [ ] Set the organization secrets `RELEASE_BOT_CLIENT_ID` and `RELEASE_BOT_PRIVATE_KEY`, with access for all repositories.
- [ ] If any repository will use Jaws sites, install `jaws-platform-comments` on the organization.
- [ ] Once the branding exists, set the organization picture and the App's logo to the avatar.

Agent (each repository with the [new repository checklist](repository-conventions.md#new-repository-checklist)):

- [ ] Create `<project>-branding`: the source artwork and fonts, the render script, every standard asset, the published-paths table, the palette and the README header block.
- [ ] Create `.github`: `profile/README.md` with the banner, what the project is, and the repository and App tables.
- [ ] Create the project repositories, each with its own scopes, opening its README with the standard header.
- [ ] For each repository that needs infrastructure, prepare its Jaws onboarding change and its `jaws.yaml` for the owner to review.
- [ ] Update `profile/README.md` with every repository created.
