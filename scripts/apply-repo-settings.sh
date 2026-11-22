#!/usr/bin/env bash
# Applies the repository conventions to a repository with the GitHub CLI:
# merge methods, the squash commit format, the issue labels, and the ruleset
# on main. Run it once, after the conventions pull request has merged and CI
# has run at least once (a ruleset can only require checks that exist), and
# again whenever the list of required checks below changes.
#
#   scripts/apply-repo-settings.sh [owner/repo]
#
# IS_TEMPLATE=true also marks the repository as a template repository; this
# repository is one, project repositories are not.
set -euo pipefail

REPO="${1:-jwallace145/repository-template}"
IS_TEMPLATE="${IS_TEMPLATE:-false}"

# Every job in .github/workflows/ci.yml. Add the repository's own jobs here.
REQUIRED_CHECKS=(commitlint pr-title commitlint-rules)

echo "==> Merge methods, squash commit format, auto-delete head branches ($REPO)"
gh api -X PATCH "repos/$REPO" \
  -F allow_squash_merge=true \
  -F allow_rebase_merge=true \
  -F allow_merge_commit=false \
  -f squash_merge_commit_title=PR_TITLE \
  -f squash_merge_commit_message=BLANK \
  -F delete_branch_on_merge=true \
  -F allow_update_branch=true \
  -F is_template="$IS_TEMPLATE" \
  > /dev/null

echo "==> Issue labels (applied by the issue forms)"
gh label create bug --repo "$REPO" --force --color d73a4a \
  --description "Something is broken" > /dev/null
gh label create enhancement --repo "$REPO" --force --color a2eeef \
  --description "A new capability or a change in behavior" > /dev/null
gh label create task --repo "$REPO" --force --color c5def5 \
  --description "Work that changes no behavior: refactor, docs, CI, tests, upkeep" > /dev/null

echo "==> Ruleset on main"
existing_id="$(gh api "repos/$REPO/rulesets" --jq '.[] | select(.name == "main") | .id' || true)"

checks="$(printf '{ "context": "%s" },' "${REQUIRED_CHECKS[@]}")"
ruleset='{
  "name": "main",
  "target": "branch",
  "enforcement": "active",
  "bypass_actors": [],
  "conditions": { "ref_name": { "include": ["~DEFAULT_BRANCH"], "exclude": [] } },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "required_linear_history" },
    {
      "type": "pull_request",
      "parameters": {
        "required_approving_review_count": 0,
        "dismiss_stale_reviews_on_push": false,
        "require_code_owner_review": false,
        "require_last_push_approval": false,
        "required_review_thread_resolution": false,
        "allowed_merge_methods": ["squash", "rebase"]
      }
    },
    {
      "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": false,
        "do_not_enforce_on_create": false,
        "required_status_checks": ['"${checks%,}"']
      }
    }
  ]
}'

if [[ -n "$existing_id" ]]; then
  echo "$ruleset" | gh api -X PUT "repos/$REPO/rulesets/$existing_id" --input - > /dev/null
  echo "    updated ruleset $existing_id"
else
  echo "$ruleset" | gh api -X POST "repos/$REPO/rulesets" --input - > /dev/null
  echo "    created"
fi

echo "==> Done. Verify at https://github.com/$REPO/settings/rules"
