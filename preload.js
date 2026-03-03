import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("countdownApp", {
  getMode: () => ipcRenderer.invoke("app:mode"),
  getTargetDate: () => ipcRenderer.invoke("app:target-date"),
  requestExit: () => ipcRenderer.send("app:exit")
});
