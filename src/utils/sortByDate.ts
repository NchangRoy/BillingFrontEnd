/** Sorts a list newest-first using whichever of these date-like fields the item has. */
const DATE_KEYS = [
  "createdAt",
  "dateCreation",
  "dateEmission",
  "createdDate",
  "dateCommande",
  "dateInvite",
  "invitedAt",
  "updatedAt",
  "date",
];

export function sortByDateDesc<T extends Record<string, unknown>>(items: T[]): T[] {
  const timeOf = (item: T): number => {
    for (const key of DATE_KEYS) {
      const value = item[key];
      if (value) {
        const t = new Date(value as string).getTime();
        if (!Number.isNaN(t)) return t;
      }
    }
    return 0;
  };
  return [...items].sort((a, b) => timeOf(b) - timeOf(a));
}
