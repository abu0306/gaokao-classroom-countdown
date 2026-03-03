export function dayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function stableIndexFromDate(items, date = new Date(), salt = 0) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("items must be a non-empty array");
  }

  const key = dayKey(date);
  let hash = salt;
  for (const char of key) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  return hash % items.length;
}

export function pickDailyItem(items, date = new Date(), salt = 0) {
  return items[stableIndexFromDate(items, date, salt)];
}
