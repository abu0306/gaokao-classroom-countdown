import { daysUntil, formatDate } from "../core/time.mjs";
import { pickDailyItem } from "../core/content.mjs";
import { motivationalQuotes } from "../data/quotes.mjs";
import { cleanBackgrounds } from "../data/backgrounds.mjs";

const daysValue = document.getElementById("daysValue");
const daysUnit = document.getElementById("daysUnit");
const targetDateText = document.getElementById("targetDateText");
const quoteText = document.getElementById("quoteText");
const todayText = document.getElementById("todayText");
const screen = document.getElementById("screen");

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

function renderDailyContent(now = new Date()) {
  const quote = pickDailyItem(motivationalQuotes, now, 7);
  const background = pickDailyItem(cleanBackgrounds, now, 31);
  quoteText.textContent = quote;
  screen.style.setProperty("--bg-image", `url('${background}')`);

  todayText.textContent = `今天：${now.toLocaleDateString("zh-CN", {
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
  const mode = await window.countdownApp.getMode();
  const targetDate = await window.countdownApp.getTargetDate();

  renderCountdown(targetDate);
  renderDailyContent();
  setupScreenSaverExit(mode);

  setInterval(() => {
    renderCountdown(targetDate);
    renderDailyContent();
  }, 60_000);
}

bootstrap().catch((error) => {
  quoteText.textContent = `加载失败：${error.message}`;
});
