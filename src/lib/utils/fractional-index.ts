/**
 * Fractional Indexing Utility
 *
 * Generates alphanumeric order strings for dynamic ordering.
 * - New items get sequential keys: a0, a1, a2...
 * - Items moved between others get midpoint keys: between a0 and a1 → a0V
 */

const BASE_CHAR = 'a';
const MIDPOINT_CHAR = 'V';

/**
 * Generate the next sequential order key
 * @param lastOrder The last order key in the sequence (e.g., 'a2')
 * @returns The next order key (e.g., 'a3')
 */
export function generateNextOrder(lastOrder?: string): string {
  if (!lastOrder) {
    return `${BASE_CHAR}0`;
  }

  // Extract the numeric suffix
  const match = lastOrder.match(/^a(\d+)$/);
  if (match) {
    const num = parseInt(match[1], 10);
    return `${BASE_CHAR}${num + 1}`;
  }

  // If it's a complex key (with midpoint chars), just append 0
  return `${lastOrder}0`;
}

/**
 * Generate an order key between two existing keys
 * @param before The order key before the new position
 * @param after The order key after the new position
 * @returns A new order key that sorts between before and after
 */
export function generateOrderBetween(
  before: string | null,
  after: string | null,
): string {
  if (!before && !after) {
    return `${BASE_CHAR}0`;
  }

  if (!before) {
    // Prepending: add a character before the first element
    return `${BASE_CHAR}0${MIDPOINT_CHAR}`;
  }

  if (!after) {
    // Appending: generate next sequential key
    return generateNextOrder(before);
  }

  // Between two keys: append midpoint character to the 'before' key
  // This ensures the new key is lexicographically between before and after
  return `${before}${MIDPOINT_CHAR}`;
}

/**
 * Reassign clean order keys (a0, a1, a2...) to all items
 * Useful for normalizing orders after many reorderings
 * @param items Array of items with order property
 * @returns Same items with normalized order values
 */
export function normalizeOrders<T extends { order: string }>(items: T[]): T[] {
  return items
    .sort((a, b) => a.order.localeCompare(b.order))
    .map((item, index) => ({
      ...item,
      order: `${BASE_CHAR}${index}`,
    }));
}
