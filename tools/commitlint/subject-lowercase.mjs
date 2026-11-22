/**
 * commitlint rule `subject-lowercase`.
 *
 * The subject starts with a lowercase letter (or a non-letter, such as a
 * version number or a code identifier). It replaces the built-in
 * `subject-case` with one exception: Dependabot's titles, which it always
 * writes as `chore(deps): Bump ...` and cannot be configured to lowercase.
 * Everything else about those titles (type, scope, length) is still checked.
 */
export const DEPENDABOT_HEADER = /^chore\(deps\): Bump /;

/**
 * @param {{ header?: string | null, subject?: string | null }} parsed
 * @param {'always' | 'never'} [when]
 * @returns {[boolean, string]}
 */
export default function subjectLowercase(parsed, when = "always") {
  const header = parsed.header ?? "";
  const subject = parsed.subject ?? "";
  const lowercase = !/^[A-Z]/.test(subject) || DEPENDABOT_HEADER.test(header);
  const negated = when === "never";

  const message = negated
    ? "subject must start with an uppercase letter"
    : `subject must start with a lowercase letter: "${subject}"`;

  return [negated ? !lowercase : lowercase, message];
}
