import { ipcMain } from "electron";
import StoreDefaults from "../renderer/utils/StoreDefaults.js";
import Store from "../renderer/utils/Store.js";
import GameControl from "../renderer/utils/GameControl";
import GameInstaller from "./GameInstaller.js";
import path from "path";
import fs from "fs";

class GameManager {
  constructor(window) {
    this.window = window;
  }

  cleanCache() {
    const LibraryStore = new Store({
      configName: "library",
      defaults: StoreDefaults.library,
    });

    const cleanFolder = (dir) => {
      fs.readdir(dir, (err, files) => {
        if (!err) {
          for (const file in files) {
            fs.rm(path.join(dir, files[file]), { recursive: true }, (err2) => {
              if (err2)
                console.log(
                  "An error has occured while removing a cache file: ",
                  err2
                );
            });
          }
        }
      });
    };

    let cacheDir = GameControl.getCacheDir(LibraryStore);
    cleanFolder(cacheDir);

    // cleaning the old cache folder from early HLSR versions
    let oldCacheDir = GameControl.getCacheDir_OLDPATH(LibraryStore);
    if (fs.existsSync(oldCacheDir)) cleanFolder(oldCacheDir);
  }

  initialize() {
    ipcMain.on("download-game", async (ipcEvent, data) => {
      const { gameId } = data;

      const game = GameControl.getGame(gameId);
      if (!game) return;

      const archives = game.info.archives;
      let archivesCount = archives.length;
      let downloadedArchives = 0;
      let downloadItem = null;

      const LibraryStore = new Store({
        configName: "library",
        defaults: StoreDefaults.library,
      });

      ipcMain.once("cancel-download", () => {
        if (downloadItem) {
          downloadItem.cancel();
        }
      });

      const progressCallback = (progress) => {
        progress = (progress + downloadedArchives) / archivesCount;
        this.window.setProgressBar(progress);
        ipcEvent.sender.send("progress-update", progress * 100);
      };

      const updateCallback = (progress, item) => {
        downloadItem = item;
        ipcEvent.sender.send("speed-update", progress.speed);
      };

      let cacheFileBase = GameControl.getCacheFileName(LibraryStore);
      let cacheFiles = [];

      for (let i = 0; i < archives.length; i++) {
        let url = archives[i];

        try {
          let fn = `${cacheFileBase}.${(i + 1).toString().padStart(3, "0")}`;
          let downloadedPath = await GameInstaller.downloadFile(
            url,
            fn,
            progressCallback,
            updateCallback
          );
          downloadedArchives++;
          cacheFiles.push(downloadedPath);
        } catch (err) {
          ipcEvent.sender.send("download-game-reply", {
            status: err != "cancelled" ? 1 : 2,
            err,
          });
          return;
        }
      }

      ipcEvent.sender.send("download-game-reply", { status: 0, err: null });
      ipcMain.removeAllListeners("cancel-download");

      // extracting downloaded archives
      let extractPath = GameControl.getLibraryPath(LibraryStore);

      if (!game.info.isStandalone)
        extractPath = path.join(extractPath, game.info.installPath);

      archivesCount = 1;
      downloadedArchives = 0;

      GameInstaller.extractArchive(cacheFiles, extractPath, progressCallback)
        .then(() => {
          this.window.setProgressBar(0);
          ipcEvent.sender.send("unpack-game-reply", {
            status: 0,
            err: null,
          });
        })
        .catch((err) => {
          this.window.setProgressBar(0);
          this.window.webContents.send("unpack-game-reply", {
            status: 1,
            err,
          });
        });
    });
  }
}

export default GameManager;
