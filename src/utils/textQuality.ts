/**
 * Defensive checks for obvious repeated keyboard-pattern input. This is not
 * semantic moderation; it only catches long, unspaced repeated character runs.
 */
export const hasRepeatedTextPattern = (value: string | null | undefined): boolean => {
  const raw = (value ?? "").trim().normalize("NFKC").toLocaleLowerCase();
  if (!raw) return false;
  return raw.split(/\s+/u).filter(Boolean).some((token) => {
    const chars = Array.from(token.replace(/[^\p{L}\p{N}]/gu, ""));
    if (chars.length < 12) return false;

    // Catch long keyboard mashing with very low character variety, including
    // short repeating Arabic/Latin patterns that do not repeat one n-gram four times.
    const uniqueCharacters = new Set(chars).size;
    if (chars.length >= 14 && uniqueCharacters <= 5 && uniqueCharacters / chars.length <= 0.36) {
      return true;
    }
    for (let size = 2; size <= 4; size += 1) {
      const counts = new Map<string, number>();
      let highest = 0;
      for (let start = 0; start <= chars.length - size; start += 1) {
        const gram = chars.slice(start, start + size).join("");
        const count = (counts.get(gram) ?? 0) + 1;
        counts.set(gram, count);
        highest = Math.max(highest, count);
      }
      const total = chars.length - size + 1;
      if (highest >= 4 && highest / total >= 0.18) return true;
    }
    return false;
  });
};
/**
 * Detects obvious repeated filler such as the same word repeated three or more
 * consecutive times. It does not flag a common word that appears elsewhere in
 * an otherwise natural sentence.
 */
export const hasRepeatedWordPattern = (value: string | null | undefined): boolean => {
  const words = (value ?? "")
    .normalize("NFKC")
    .toLocaleLowerCase()
    .match(/[\p{L}\p{N}]+/gu) ?? [];
  let previousWord = "";
  let consecutiveCount = 0;

  for (const word of words) {
    consecutiveCount = word === previousWord ? consecutiveCount + 1 : 1;
    previousWord = word;
    if (consecutiveCount >= 3) return true;
  }

  return false;
};

/** Detect infrastructure/HTTP error strings that must never be rendered as learner-facing content. */
export const isTechnicalErrorText = (value: string | null | undefined): boolean => {
  const text = (value ?? "").trim().normalize("NFKC");
  if (!text) return false;

  return /\b(?:request failed with status code\s*\d{3}|internal server error|sqlstate\s*\[|stack trace|uncaught exception|fatal error|http error\s*5\d{2})\b/iu.test(text);
};

export const hasMinimumWords = (value: string, minimum: number): boolean =>
  value.trim().split(/\s+/u).filter(Boolean).length >= minimum;
export const isDisplayableProfileText = (value: string | null | undefined, minimumWords = 1): boolean => {
  const text = value?.trim() ?? "";
  return (
    text.length > 0 &&
    hasMinimumWords(text, minimumWords) &&
    !hasRepeatedTextPattern(text) &&
    !hasRepeatedWordPattern(text) &&
    !isTechnicalErrorText(text)
  );
};
