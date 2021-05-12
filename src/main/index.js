"use strict";

import fs from "fs";
import path from "path";
import md5 from "md5-file";
import { app, BrowserWindow, ipcMain, ipcRenderer, screen } from "electron";
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
let isAppReady = false;

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

let quickLaunchInfo = {
  appid: null,
};

function startGameQuick() {
  if (quickLaunchInfo.appid) {
    mainWindow.webContents.send("start-game-quick", quickLaunchInfo.appid);
  }
}

function parseArgs(args) {
  args = args.filter((t) => t != "--allow-file-access-from-files");

  if (process.env.NODE_ENV === "production") {
    if (args.length >= 1) {
      let firstArg = args[0];

      if (firstArg == "-quick") {
        // Quick Game Start
        let appID = args[1];
        quickLaunchInfo.appid = appID;
      } else if (fs.existsSync(firstArg)) {
        // HLSRC
        installHLSRCModule(firstArg, () => {
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
      parseArgs(cmd);
      startGameQuick();

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
    // Clean downloads folder
    const GameControl = require("../renderer/utils/GameControl");

    const LibraryStore = new Store({
      configName: "library",
      defaults: StoreDefaults.library,
    });

    let downloadsFolder = GameControl.default.getTempPath(LibraryStore);

    try {
      fs.rmdirSync(downloadsFolder, { recursive: true });
    } catch (e) {}

    // Show window
    mainWindow.show();

    ipcMain.on("game-download", async (event, info) => {
      info.properties.onProgress = (e) => {
        mainWindow.setProgressBar(e.percent);

        e.percent *= 100;
        event.sender.send("set-progress", e);
      };

      info.properties.onCancel = () => {
        event.sender.send("game-canceled");
      };

      download(
        BrowserWindow.getFocusedWindow(),
        info.url,
        info.properties
      ).then((d) => {
        // Game downloaded so now we can notify client
        event.sender.send("game-download-complete", d.getSavePath());

        // Client asked to unpack downloaded game
        ipcMain.once("game-unpack", (e, args) => {
          const onezip = require("onezip");
          const extract = onezip.extract(args.archive, args.extractTo);

          extract.on("progress", (percent) => {
            mainWindow.setProgressBar(percent / 100);
            e.sender.send("set-progress", {
              percent,
            });
          });

          extract.once("end", () => {
            mainWindow.setProgressBar(0);
            e.sender.send("game-unpack-complete");
          });
        });
      });
    });
  });

  mainWindow.setMenu(null);

  mainWindow.setFullScreenable(false);
  mainWindow.setMaximizable(false);
  mainWindow.isResizable(false);

  mainWindow.loadURL(winURL);
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

// Only for release
if (process.env.NODE_ENV === "production") {
  let dir = app.getPath("exe").split("\\");
  dir.splice(-1, 1);

  require("process").chdir(dir.join("\\"));

  // Prevent steam_appid.txt from changing
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

  // Check for updates
  ipcMain.on("ready", (e) => {
    isAppReady = true;
    parseArgs(require("process").argv.slice(1));
    if (quickLaunchInfo.appid) startGameQuick();

    if (process.env.NODE_ENV === "production") {
      autoUpdater.checkForUpdatesAndNotify();

      setInterval(function() {
        if (!detected) autoUpdater.checkForUpdatesAndNotify();
      }, 2 * 60 * 3600);
    }
  });
});
