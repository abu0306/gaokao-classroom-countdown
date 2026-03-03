export function dayKey(date = new Date(), timeZone = undefined) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);

  const year = parts.find((item) => item.type === "year")?.value;
  const month = parts.find((item) => item.type === "month")?.value;
  const day = parts.find((item) => item.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error("Could not compute day key");
  }

  return `${year}-${month}-${day}`;
}

export function stableIndexFromDate(items, date = new Date(), salt = 0, timeZone = undefined) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("items must be a non-empty array");
  }

  const key = dayKey(date, timeZone);
  let hash = salt;
  for (const char of key) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  return hash % items.length;
}

export function pickDailyItem(items, date = new Date(), salt = 0, timeZone = undefined) {
  return items[stableIndexFromDate(items, date, salt, timeZone)];
}
