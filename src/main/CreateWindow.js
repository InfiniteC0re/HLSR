import { app, BrowserWindow } from "electron";
import StoreDefaults from "../renderer/scripts/StoreDefaults.js";
import Store from "../renderer/scripts/Store.js";

const SettingsStore = new Store({
  configName: "settings",
  defaults: StoreDefaults.settings,
});

const gotTheLock = app.requestSingleInstanceLock();

const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

function createWindow() {
  if (!gotTheLock) return app.quit();

  let config = SettingsStore.get("config");

  let screen = require("electron").screen;
  let display = screen.getPrimaryDisplay().size;

  if (display.width <= 1366 || display.height <= 768) {
    config.compactMode = true;
    SettingsStore.set("config", config);
  }

  let window = new BrowserWindow({
    height: config.compactMode ? 690 : 768,
    width: config.compactMode ? 950 : 1280,
    maxHeight: 768,
    maxWidth: config.compactMode ? 1100 : 1280,
    minHeight: config.compactMode ? 690 : 768,
    minWidth: config.compactMode ? 950 : 1280,
    show: false,
    frame: false,
    resizable: config.compactMode ? true : false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  window.once("ready-to-show", () => {
    window.show();
  });

  window.setMenu(null);

  window.setFullScreenable(false);
  window.setMaximizable(false);
  window.isResizable(false);

  window.loadURL(winURL);

  return window;
}

export { createWindow };
