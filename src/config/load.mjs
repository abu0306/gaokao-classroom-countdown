import fs from "node:fs";
import path from "node:path";
import { nextAnnualDate } from "../core/time.mjs";
import { motivationalQuotes } from "../data/quotes.mjs";
import { cleanBackgrounds } from "../data/backgrounds.mjs";

const DEFAULT_CONFIG = {
  className: "实验高中三（7）班",
  schoolName: "实验高中",
  countdownLabel: "距离高考",
  examMonth: 6,
  examDay: 7,
  timeZone: "Asia/Shanghai",
  quotes: motivationalQuotes,
  backgrounds: cleanBackgrounds,
  refreshIntervalMs: 60_000
};

function readJsonConfig(appDir) {
  const configPath = path.join(appDir, "config", "app-config.json");
  if (!fs.existsSync(configPath)) {
    return {};
  }

  const content = fs.readFileSync(configPath, "utf8");
  const parsed = JSON.parse(content);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("config/app-config.json must be a JSON object");
  }
  return parsed;
}

function ensureNonEmptyString(value, name) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${name} must be a non-empty string`);
  }
}

function ensureStringArray(value, name) {
  if (!Array.isArray(value) || value.length === 0 || value.some((item) => typeof item !== "string" || item.length === 0)) {
    throw new Error(`${name} must be a non-empty string array`);
  }
}

export function loadRuntimeConfig({ appDir, env = process.env, now = new Date() }) {
  const fileConfig = readJsonConfig(appDir);

  const merged = {
    ...DEFAULT_CONFIG,
    ...fileConfig
  };

  const className = env.CLASS_NAME || merged.className;
  const schoolName = env.SCHOOL_NAME || merged.schoolName;
  const countdownLabel = env.COUNTDOWN_LABEL || merged.countdownLabel;
  const timeZone = env.TIME_ZONE || merged.timeZone;

  ensureNonEmptyString(className, "className");
  ensureNonEmptyString(schoolName, "schoolName");
  ensureNonEmptyString(countdownLabel, "countdownLabel");
  ensureNonEmptyString(timeZone, "timeZone");

  ensureStringArray(merged.quotes, "quotes");
  ensureStringArray(merged.backgrounds, "backgrounds");

  const examMonth = Number(merged.examMonth);
  const examDay = Number(merged.examDay);
  const targetDate = env.TARGET_DATE || nextAnnualDate(examMonth, examDay, now);

  return {
    className,
    schoolName,
    countdownLabel,
    targetDate,
    timeZone,
    quotes: merged.quotes,
    backgrounds: merged.backgrounds,
    refreshIntervalMs: Number(merged.refreshIntervalMs) || 60_000
  };
}
