import { ipcMain, BrowserWindow } from "electron";
import { download } from "electron-dl";
import StoreDefaults from "../renderer/scripts/StoreDefaults.js";
import Store from "../renderer/scripts/Store.js";

const onezip = require("onezip");

class Unpacker {
  constructor(window) {
    this.window = window;
    this.unzip = null;
  }

  extract(from, to) {
    let extract = onezip.extract(from, to);

    extract.once("end", () => {
      this.window.setProgressBar(0);
      this.window.webContents.send("game-unpack-complete");

      extract = null;
    });

    extract.on("progress", (percent) => {
      this.window.setProgressBar(percent / 100);
      this.window.webContents.send("set-progress", {
        percent,
      });
    });
  }
}

class GameManager {
  constructor(window) {
    this.window = window;
    this.unpacker = new Unpacker(window);
  }

  cleanTemp() {
    const GameControl = require("../renderer/scripts/GameControl");

    const LibraryStore = new Store({
      configName: "library",
      defaults: StoreDefaults.library,
    });

    let downloadsFolder = GameControl.default.getTempPath(LibraryStore);

    try {
      fs.rmdirSync(downloadsFolder, { recursive: true });
    } catch (e) {}
  }

  registerEvents() {
    ipcMain.on("game-download", async (event, info) => {
      info.properties.onProgress = (e) => {
        e.percent *= 100;
        event.sender.send("set-progress", e);
      };

      info.properties.onCancel = () => {
        this.window.setProgressBar(0);
        event.sender.send("game-canceled");
      };

      download(
        BrowserWindow.getAllWindows()[0],
        info.url,
        info.properties
      ).then((d) => {
        // Game has been downloaded so now we can notify client
        event.sender.send("game-download-complete", d.getSavePath());

        // Client asked to unpack downloaded game
        ipcMain.once("game-unpack", (e, args) => {
          this.unpacker.extract(args.archive, args.extractTo);
        });
      });
    });
  }
}

export default GameManager;
