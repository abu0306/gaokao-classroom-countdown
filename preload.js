import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("countdownApp", {
  getConfig: () => ipcRenderer.invoke("app:get-config"),
  requestExit: () => ipcRenderer.send("app:exit")
});
