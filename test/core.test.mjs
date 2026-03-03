import test from "node:test";
import assert from "node:assert/strict";
import { daysUntil, formatDate, nextAnnualDate, nextGaokaoDate } from "../src/core/time.mjs";
import { dayKey, pickDailyItem, stableIndexFromDate } from "../src/core/content.mjs";

test("daysUntil counts day boundaries", () => {
  const now = new Date("2026-06-01T23:59:59+08:00");
  assert.equal(daysUntil("2026-06-07", now), 6);
});

test("daysUntil returns negative after exam date", () => {
  const now = new Date("2026-06-08T10:00:00+08:00");
  assert.equal(daysUntil("2026-06-07", now), -1);
});

test("formatDate returns YYYY-MM-DD", () => {
  assert.equal(formatDate("2026-01-02T15:00:00+08:00"), "2026-01-02");
});

test("dayKey is stable", () => {
  assert.equal(dayKey(new Date("2026-03-03T08:00:00+08:00")), "2026-03-03");
});

test("pickDailyItem stays consistent for same date", () => {
  const items = ["a", "b", "c", "d"];
  const date = new Date("2026-03-03T08:00:00+08:00");
  assert.equal(pickDailyItem(items, date, 9, "Asia/Shanghai"), pickDailyItem(items, date, 9, "Asia/Shanghai"));
  assert.equal(stableIndexFromDate(items, date, 9, "Asia/Shanghai"), stableIndexFromDate(items, date, 9, "Asia/Shanghai"));
});

test("dayKey supports fixed timezone", () => {
  const date = new Date("2026-03-03T00:30:00+08:00");
  assert.equal(dayKey(date, "Asia/Shanghai"), "2026-03-03");
});

test("nextGaokaoDate returns this year when before June 7", () => {
  assert.equal(nextGaokaoDate(new Date("2026-03-03T08:00:00+08:00")), "2026-06-07");
});

test("nextGaokaoDate returns next year when after June 7", () => {
  assert.equal(nextGaokaoDate(new Date("2026-06-10T08:00:00+08:00")), "2027-06-07");
});

test("nextAnnualDate supports custom month/day", () => {
  assert.equal(nextAnnualDate(12, 1, new Date("2026-06-10T08:00:00+08:00")), "2026-12-01");
});
