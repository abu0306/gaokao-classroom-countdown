import { daysUntil, formatDate } from "../core/time.mjs";
import { pickDailyItem } from "../core/content.mjs";

const daysValue = document.getElementById("daysValue");
const daysUnit = document.getElementById("daysUnit");
const targetDateText = document.getElementById("targetDateText");
const quoteText = document.getElementById("quoteText");
const todayText = document.getElementById("todayText");
const screen = document.getElementById("screen");
const classNameText = document.getElementById("classNameText");
const schoolNameText = document.getElementById("schoolNameText");
const countdownLabelText = document.getElementById("countdownLabelText");

function renderCountdown(targetDate) {
  const leftDays = daysUntil(targetDate);
  if (leftDays >= 0) {
    daysValue.textContent = String(leftDays);
    daysUnit.textContent = "天";
  } else {
    daysValue.textContent = String(Math.abs(leftDays));
    daysUnit.textContent = "天（已过）";
  }

  targetDateText.textContent = `目标日期：${formatDate(targetDate)}`;
}

function renderDailyContent(config, now = new Date()) {
  const quote = pickDailyItem(config.quotes, now, 7, config.timeZone);
  const background = pickDailyItem(config.backgrounds, now, 31, config.timeZone);
  quoteText.textContent = quote;
  screen.style.setProperty("--bg-image", `url('${background}')`);

  todayText.textContent = `今天：${now.toLocaleDateString("zh-CN", {
    timeZone: config.timeZone,
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long"
  })}`;
}

function setupScreenSaverExit(mode) {
  if (mode !== "screensaver") {
    return;
  }

  const exit = () => window.countdownApp.requestExit();
  const events = ["keydown", "mousedown", "wheel", "touchstart"];
  for (const eventName of events) {
    window.addEventListener(eventName, exit, { once: true });
  }
}

async function bootstrap() {
  const config = await window.countdownApp.getConfig();

  classNameText.textContent = config.className;
  schoolNameText.textContent = config.schoolName;
  countdownLabelText.textContent = config.countdownLabel;

  renderCountdown(config.targetDate);
  renderDailyContent(config);
  setupScreenSaverExit(config.mode);

  setInterval(() => {
    renderCountdown(config.targetDate);
    renderDailyContent(config);
  }, config.refreshIntervalMs);
}

bootstrap().catch((error) => {
  quoteText.textContent = `加载失败：${error.message}`;
});
