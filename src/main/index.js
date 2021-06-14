"use strict";

import fs from "fs";
import { app } from "electron";
import AppReady from "./appReady";
import { createWindow } from "./createWindow";

let window = null;
app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");
app.allowRendererProcessReuse = false;

app.on("ready", () => {
  window = createWindow();
  const appReady = new AppReady(window);
  appReady.secondInstance();

  appReady.readyEvent();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    window = null;
  }
});

app.on("activate", () => {
  if (window === null) {
    window = createWindow();
  }
});

app.setAppUserModelId(process.execPath);

// Only for release build
if (process.env.NODE_ENV === "production") {
  let dir = app.getPath("exe").split("\\");
  dir.splice(-1, 1);

  require("process").chdir(dir.join("\\"));

  // Prevent steam_appid.txt from changing
  fs.writeFileSync(
    "./steam_appid.txt",
    require("../../package.json").steamworks.appid
  );
}
