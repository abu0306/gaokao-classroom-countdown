import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadRuntimeConfig } from "../src/config/load.mjs";

test("loadRuntimeConfig loads app-config.json", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "gaokao-config-"));
  const configDir = path.join(tempRoot, "config");
  fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(
    path.join(configDir, "app-config.json"),
    JSON.stringify(
      {
        className: "测试班级",
        schoolName: "测试中学",
        countdownLabel: "距离考试",
        examMonth: 6,
        examDay: 7,
        timeZone: "Asia/Shanghai",
        quotes: ["A"],
        backgrounds: ["./assets/backgrounds/dawn.svg"],
        refreshIntervalMs: 45000
      },
      null,
      2
    )
  );

  const config = loadRuntimeConfig({ appDir: tempRoot, env: {}, now: new Date("2026-03-03T08:00:00+08:00") });
  assert.equal(config.className, "测试班级");
  assert.equal(config.schoolName, "测试中学");
  assert.equal(config.countdownLabel, "距离考试");
  assert.equal(config.targetDate, "2026-06-07");
  assert.equal(config.refreshIntervalMs, 45000);
  assert.equal(config.quotes.length, 1);
  assert.equal(config.backgrounds.length, 1);

  fs.rmSync(tempRoot, { recursive: true, force: true });
});

test("loadRuntimeConfig supports env override", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "gaokao-config-"));
  const config = loadRuntimeConfig({
    appDir: tempRoot,
    env: {
      CLASS_NAME: "环境变量班级",
      TARGET_DATE: "2030-06-07"
    },
    now: new Date("2026-03-03T08:00:00+08:00")
  });

  assert.equal(config.className, "环境变量班级");
  assert.equal(config.targetDate, "2030-06-07");

  fs.rmSync(tempRoot, { recursive: true, force: true });
});
