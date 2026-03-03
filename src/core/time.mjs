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

export function nextGaokaoDate(now = new Date()) {
  return nextAnnualDate(6, 7, now);
}

export function nextAnnualDate(month, day, now = new Date()) {
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error(`Invalid month: ${month}`);
  }
  if (!Number.isInteger(day) || day < 1 || day > 31) {
    throw new Error(`Invalid day: ${day}`);
  }

  const currentYear = now.getFullYear();
  const thisYearTarget = new Date(currentYear, month - 1, day);
  const today = toStartOfDay(now);

  if (today.getTime() <= thisYearTarget.getTime()) {
    return formatDate(thisYearTarget);
  }

  return formatDate(new Date(currentYear + 1, month - 1, day));
}
