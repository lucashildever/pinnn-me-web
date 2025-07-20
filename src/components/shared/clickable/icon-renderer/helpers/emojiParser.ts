export function emojiParser(input: string): string {
  const isUnicodeFormat = /^[0-9A-Fa-f]+(-[0-9A-Fa-f]+)*$/.test(input);

  if (isUnicodeFormat) {
    return unicodeToEmoji(input);
  } else {
    return emojiToUnicode(input);
  }
}

function emojiToUnicode(emoji: string): string {
  const codePoints = Array.from(emoji)
    .map((char) => char.codePointAt(0))
    .filter((cp) => cp !== 0xfe0f)
    .map((cp) => cp!.toString(16).toUpperCase());

  return codePoints.length === 1 ? codePoints[0] : codePoints.join("-");
}

function unicodeToEmoji(unicode: string): string {
  const codePoints = unicode.split("-").map((cp) => parseInt(cp, 16));
  return String.fromCodePoint(...codePoints);
}
