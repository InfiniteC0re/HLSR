import { autoUpdater } from "electron-updater";

class AutoUpdater {
  constructor(window) {
    this.updateDetected = false;
    this.window = window;
    this.interval = null;
  }

  setWindow(window) {
    this.window = window;
  }

  sendStatusToWindow(text) {
    this.window.webContents.send("message", text);
  }

  registerEvents() {
    autoUpdater.on("checking-for-update", () => {
      this.sendStatusToWindow("checking-for-update");
    });

    autoUpdater.on("update-available", (info) => {
      this.updateDetected = true;
      this.sendStatusToWindow("update-available");
    });

    autoUpdater.on("update-not-available", (info) => {
      this.sendStatusToWindow("update-not-available");
    });

    autoUpdater.on("error", (err) => {
      this.sendStatusToWindow("Error: " + err);
    });

    autoUpdater.on("download-progress", (progressObj) => {
      if (!this.window.isDestroyed())
        this.window.setProgressBar(progressObj.percent / 100);
    });

    autoUpdater.on("update-downloaded", (info) => {
      this.sendStatusToWindow("update-downloaded");
      autoUpdater.quitAndInstall(true, true);
    });
  }

  checkUpdates() {
    if (process.env.NODE_ENV === "production") {
      if (!this.updateDetected) autoUpdater.checkForUpdatesAndNotify();
    }
  }

  startCheckingInterval() {
    clearInterval(this.interval);
    this.checkUpdates();
    this.interval = setInterval(this.checkUpdates, 1000 * 60 * 15);
  }
}

export default AutoUpdater;
