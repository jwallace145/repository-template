/**
 * commitlint rule `only-coauthor-trailers`.
 *
 * A commit message is a single header line. The only content allowed after
 * it is a blank line followed by `Co-authored-by: Name <email>` trailers,
 * which credit a pairing human or an AI model. The key is matched in any
 * letter case, as git does, so `Co-Authored-By:` (what Claude Code writes)
 * passes too. Comment lines (`#`) are ignored because `git commit` editors
 * leave them in the message file; git strips them before the commit is made.
 *
 * The rule inspects the raw message rather than commitlint's parsed body and
 * footer, so trailer-like formatting cannot sidestep it.
 */
export const COAUTHOR_TRAILER = /^co-authored-by: .+ <[^<>\s]+>$/i;

/**
 * @param {{ raw?: string | null }} parsed
 * @param {'always' | 'never'} [when]
 * @returns {[boolean, string]}
 */
export default function onlyCoauthorTrailers(parsed, when = "always") {
  const raw = (parsed.raw ?? "").replace(/\r\n/g, "\n");
  const rest = raw
    .split("\n")
    .slice(1)
    .map((line) => line.trimEnd())
    .filter((line) => !line.startsWith("#"));

  // Trailing blank lines carry nothing.
  while (rest.length > 0 && rest[rest.length - 1] === "") rest.pop();

  const missingBlankLine = rest.length > 0 && rest[0] !== "";
  const offending = rest.filter((line) => line !== "" && !COAUTHOR_TRAILER.test(line));

  const passes = !missingBlankLine && offending.length === 0;
  const negated = when === "never";

  let message = "commit message must contain something other than Co-authored-by trailers";
  if (!negated) {
    message =
      offending.length > 0
        ? `commit message must be a single line; only "Co-authored-by: Name <email>" trailers may follow it. Offending line(s): ${offending
            .map((line) => JSON.stringify(line))
            .join(", ")}. Put details in the pull request description.`
        : "the line after the header must be blank; only Co-authored-by trailers may follow it";
  }

  return [negated ? !passes : passes, message];
}
