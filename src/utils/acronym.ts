export function getAcronym(name: string): string {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return "HQ";

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    return words.map((w) => w[0]).join("").toUpperCase().slice(0, 4);
  }
  return trimmed.slice(0, 3).toUpperCase();
}
