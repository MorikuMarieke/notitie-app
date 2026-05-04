/** Open items first, then completed; preserves relative order within each group. */
export function orderChecklistItemsOpenThenDone<T extends { checked: boolean }>(
  itemsInDisplayOrder: readonly T[],
): T[] {
  const open = itemsInDisplayOrder.filter((i) => !i.checked);
  const done = itemsInDisplayOrder.filter((i) => i.checked);
  return [...open, ...done];
}
