const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export function toStartOfDay(dateLike) {
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${dateLike}`);
  }
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function daysUntil(targetDate, now = new Date()) {
  const target = toStartOfDay(targetDate).getTime();
  const current = toStartOfDay(now).getTime();
  return Math.round((target - current) / MILLISECONDS_PER_DAY);
}

export function formatDate(dateLike) {
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${dateLike}`);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
