"use strict";

import { app, BrowserWindow, ipcMain } from "electron";
import { download } from "electron-dl";

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

let detected = false;
let mainWindow;
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 768,
    width: 1280,
    maxHeight: 768,
    maxWidth: 1280,
    show: false,
    frame: false,
    transparent: true,
    resizable: false,
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

  mainWindow.setMenu(null);

  mainWindow.setFullScreenable(false);
  mainWindow.setMaximizable(false);
  mainWindow.isResizable(false);

  mainWindow.loadURL(winURL);

  mainWindow.on("closed", () => {
    mainWindow = null;
    let temp = require("path").join(app.getPath("userData"), "temp");
    try {
      require("fs").rmdirSync(temp, { recursive: true });
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
  const fs = require("fs");
  fs.writeFileSync("./steam_appid.txt", "70");
}

// AutoUpdater

import { autoUpdater } from "electron-updater";

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
  mainWindow.setProgressBar(progressObj.percent / 100);
});

autoUpdater.on("update-downloaded", (info) => {
  sendStatusToWindow("update-downloaded");
});

app.on("ready", () => {
  // Steamworks
  const steamworks = require("steamworks");

  let initialized = false;

  ipcMain.on("getSteamStatus", (e) => {
    initialized = steamworks.SteamAPI_Init();
    e.reply("steamStatus", initialized);
  });

  ipcMain.on("getSteamFriends", (e) => {
    if (initialized)
      e.reply("steamFriends", steamworks.GetFriends("launcher", false));
  });

  ipcMain.on("getSteamName", (e) => {
    if (initialized) e.reply("steamName", steamworks.GetPersonName());
  });

  ipcMain.on("setRichPresence", (e) => {
    if (initialized) steamworks.SetRichPresense("launcher", "HLSR");
  });

  // Проверить обновления

  if (process.env.NODE_ENV === "production") {
    autoUpdater.checkForUpdatesAndNotify();

    setInterval(function() {
      if (!detected) autoUpdater.checkForUpdatesAndNotify();
    }, 2 * 60 * 3600);
  }
});
