/**
 * commitlint rule `single-scope`.
 *
 * A commit names exactly one of the repository's scopes. commitlint's
 * `scope-enum` accepts a list such as `feat(api,ui)` as long as each part is
 * allowed; this rule rejects the list. A change that spans two scopes is
 * either two pull requests or belongs to the scope it is mostly about.
 * `scope-empty` covers a missing scope, so an empty one passes here.
 */
const DELIMITER = /[,/\\]/;

/**
 * @param {{ scope?: string | null }} parsed
 * @param {'always' | 'never'} [when]
 * @returns {[boolean, string]}
 */
export default function singleScope(parsed, when = "always") {
  const scope = parsed.scope ?? "";
  const single = !DELIMITER.test(scope);
  const negated = when === "never";

  const message = negated
    ? "scope must name more than one scope"
    : `scope must be exactly one of this repository's scopes, not a list: "${scope}"`;

  return [negated ? !single : single, message];
}
