import { autoUpdater } from "electron-updater";

class UpdateManager {
  constructor(window) {
    this.updateDetected = false;
    this.window = window;
  }

  setWindow(window) {
    this.window = window;
  }

  sendStatusToWindow(text) {
    this.window.webContents.send("updatemanager-status", text);
  }

  initialize() {
    // autoUpdater.on("checking-for-update", () => {
    //   this.sendStatusToWindow("checking-for-update");
    // });

    autoUpdater.on("update-available", (info) => {
      this.updateDetected = true;
      this.sendStatusToWindow(1);
    });

    autoUpdater.on("update-not-available", (info) => {
      this.sendStatusToWindow(0);
    });

    autoUpdater.on("error", () => {
      this.sendStatusToWindow(0);
    });

    autoUpdater.on("download-progress", (progressObj) => {
      if (!this.window.isDestroyed())
        this.window.setProgressBar(progressObj.percent / 100);
    });

    autoUpdater.on("update-downloaded", (info) => {
      this.sendStatusToWindow(1);
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
  }
}

export default UpdateManager;
