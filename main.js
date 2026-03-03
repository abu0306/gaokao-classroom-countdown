import path from "node:path";
import { fileURLToPath } from "node:url";
import { app, BrowserWindow, ipcMain } from "electron";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_TARGET_DATE = "2026-06-07";

function parseMode(argv) {
  const args = argv.slice(1).map((value) => value.toLowerCase());
  if (args.includes("/s") || args.includes("--screensaver")) {
    return "screensaver";
  }
  if (args.includes("/c") || args.includes("--config")) {
    return "config";
  }
  if (args.includes("/p") || args.includes("--preview")) {
    return "preview";
  }
  return "dashboard";
}

const mode = parseMode(process.argv);

function createWindow() {
  const isSaver = mode === "screensaver";
  const isPreview = mode === "preview";

  const win = new BrowserWindow({
    width: isPreview ? 420 : 1280,
    height: isPreview ? 280 : 720,
    show: false,
    frame: !isSaver,
    autoHideMenuBar: true,
    kiosk: isSaver,
    fullscreen: isSaver,
    alwaysOnTop: isSaver,
    backgroundColor: "#0b1020",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.once("ready-to-show", () => {
    win.show();
    if (isSaver) {
      win.setAlwaysOnTop(true, "screen-saver");
    }
  });

  win.loadFile(path.join(__dirname, "src/renderer/index.html"));
}

app.whenReady().then(() => {
  ipcMain.handle("app:mode", () => mode);
  ipcMain.handle("app:target-date", () => process.env.TARGET_DATE || DEFAULT_TARGET_DATE);
  ipcMain.on("app:exit", () => app.quit());

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
