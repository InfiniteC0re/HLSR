"use strict";

import fs from "fs";
import path from "path";
import md5 from "md5-file";
import { app, BrowserWindow, ipcMain, screen } from "electron";
import { download } from "electron-dl";
import ConfigModuleReader from "hlsr-console/src/ConfigModuleReader";
import Store from "../renderer/utils/Store.js";
import StoreDefaults from "../renderer/utils/StoreDefaults.js";

const store = new Store({
  configName: "settings",
  defaults: StoreDefaults.settings,
});

if (process.env.NODE_ENV !== "development") {
  global.__static = path.join(__dirname, "/static").replace(/\\/g, "\\\\");
}

const gotTheLock = app.requestSingleInstanceLock();

let detected = false;
let mainWindow;
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

function installHLSRCModule(file, cb = () => {}) {
  md5(file).then((id) => {
    let data = ConfigModuleReader(file);
    let hlsrc_path = path.join(app.getPath("userData"), "hlsrc");

    if (!fs.existsSync(hlsrc_path)) fs.mkdirSync(hlsrc_path);

    let hlsrc = path.join(hlsrc_path, `${id}.hlsrc`);
    if (!fs.existsSync(hlsrc)) fs.copyFileSync(file, hlsrc);

    let json = path.join(hlsrc_path, `${id}.json`);
    if (!fs.existsSync(json)) fs.writeFileSync(json, JSON.stringify(data));

    cb();
  });
}

function checkHLSRCModule(args) {
  if (process.env.NODE_ENV === "production") {
    if (args.length >= 2) {
      let file = args[1];
      if (fs.existsSync(file)) {
        installHLSRCModule(file, () => {
          mainWindow.webContents.send("hlsrc", data);
        });
      }
    }
  }
}

function createWindow() {
  if (!gotTheLock) return app.quit();

  app.on("second-instance", (e, cmd, wdir) => {
    if (mainWindow) {
      cmd.splice(0, 1);
      checkHLSRCModule(cmd);

      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  let config = store.get("config");

  let screen = require("electron").screen;
  let display = screen.getPrimaryDisplay().size;

  if (display.width <= 1366 || display.height <= 768) {
    config.compactMode = true;
    store.set("config", config);
  }

  mainWindow = new BrowserWindow({
    height: config.compactMode ? 690 : 768,
    width: config.compactMode ? 950 : 1280,
    maxHeight: 768,
    maxWidth: config.compactMode ? 1100 : 1280,
    minHeight: config.compactMode ? 690 : 768,
    minWidth: config.compactMode ? 950 : 1280,
    show: false,
    frame: false,
    transparent: false,
    resizable: config.compactMode ? true : false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    ipcMain.on("game-download", async (event, info) => {
      info.properties.onProgress = (e) => {
        event.reply("game-download-progress", e);
      };
      download(
        BrowserWindow.getFocusedWindow(),
        info.url,
        info.properties
      ).then((d) => {
        event.sender.send("game-download-complete", d.getSavePath());
      });
    });
  });

  ipcMain.on("updateSize", () => {
    // let wWidth = mainWindow.getSize()[0];
    // let wHeight = mainWindow.getSize()[1];
    // let sWidth = screen.getPrimaryDisplay().workAreaSize.width;
    // let sHeight = screen.getPrimaryDisplay().workAreaSize.height;
    // let nWidth = wWidth;
    // let nHeight = wHeight;
    // if (wWidth < 1280 && sWidth > wWidth)
    //   nWidth = sWidth < 1280 ? sWidth : 1280;
    // if (wHeight < 768 && sHeight > wHeight)
    //   nHeight = sHeight < 768 ? sHeight : 768;
    // mainWindow.setSize(nWidth, nHeight);
  });

  mainWindow.setMenu(null);

  mainWindow.setFullScreenable(false);
  mainWindow.setMaximizable(false);
  mainWindow.isResizable(false);

  mainWindow.loadURL(winURL);

  mainWindow.on("closed", () => {
    mainWindow = null;
    let temp = path.join(app.getPath("userData"), "temp");
    try {
      fs.rmdirSync(temp, { recursive: true });
    } catch (e) {}
  });
}

app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");
app.allowRendererProcessReuse = false;

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.setAppUserModelId(process.execPath);

// Prevent steam_appid.txt from changing

if (process.env.NODE_ENV === "production") {
  let dir = app.getPath("exe").split("\\");
  dir.splice(-1, 1);

  require("process").chdir(dir.join("\\"));

  fs.writeFileSync("./steam_appid.txt", "70");
}

// AutoUpdater

import { autoUpdater } from "electron-updater";
import Axios from "axios";

function sendStatusToWindow(text) {
  mainWindow.webContents.send("message", text);
}

autoUpdater.on("checking-for-update", () => {
  sendStatusToWindow("checking-for-update");
});

autoUpdater.on("update-available", (info) => {
  detected = true;
  sendStatusToWindow("update-available");
});

autoUpdater.on("update-not-available", (info) => {
  sendStatusToWindow("update-not-available");
});

autoUpdater.on("error", (err) => {
  sendStatusToWindow("Error: " + err);
});

autoUpdater.on("download-progress", (progressObj) => {
  if (!mainWindow.isDestroyed())
    mainWindow.setProgressBar(progressObj.percent / 100);
});

autoUpdater.on("update-downloaded", (info) => {
  sendStatusToWindow("update-downloaded");
  autoUpdater.quitAndInstall(true, true);
});

app.on("ready", () => {
  // Steamworks
  const steamworks = require("steamworks");

  let initialized = false;
  let sentAnalytics = false;

  ipcMain.on("getSteamStatus", (e) => {
    initialized = steamworks.SteamAPI_Init();
    e.reply("steamStatus", initialized);
  });

  ipcMain.on("getSteamFriends", (e) => {
    if (initialized)
      e.reply("steamFriends", steamworks.GetFriends("launcher", false));
  });

  ipcMain.on("getSteamName", (e) => {
    if (!initialized) return;
    let name = steamworks.GetPersonName();

    if (!sentAnalytics)
      Axios({
        url: "https://hlsr.pro/analytics/",
        method: "POST",
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
          "content-type": "application/x-www-form-urlencoded",
        },
        data: `steam=${name}`,
      }).then(() => {
        sentAnalytics = true;
      });

    e.reply("steamName", name);
  });

  ipcMain.on("setRichPresence", (e, srpc) => {
    if (initialized) steamworks.SetRichPresense("launcher", srpc);
  });

  // Проверить обновления

  ipcMain.on("ready", (e) => {
    checkHLSRCModule(require("process").argv);

    if (process.env.NODE_ENV === "production") {
      autoUpdater.checkForUpdatesAndNotify();

      setInterval(function() {
        if (!detected) autoUpdater.checkForUpdatesAndNotify();
      }, 2 * 60 * 3600);
    }
  });
});
