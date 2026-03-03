import test from "node:test";
import assert from "node:assert/strict";
import { daysUntil, formatDate } from "../src/core/time.mjs";
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
  assert.equal(pickDailyItem(items, date, 9), pickDailyItem(items, date, 9));
  assert.equal(stableIndexFromDate(items, date, 9), stableIndexFromDate(items, date, 9));
});
