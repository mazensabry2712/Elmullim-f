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
export const hasMinimumWords = (value: string, minimum: number): boolean =>
  value.trim().split(/\s+/u).filter(Boolean).length >= minimum;
export const isDisplayableProfileText = (value: string | null | undefined, minimumWords = 1): boolean => {
  const text = value?.trim() ?? "";
  return text.length > 0 && hasMinimumWords(text, minimumWords) && !hasRepeatedTextPattern(text);
};
