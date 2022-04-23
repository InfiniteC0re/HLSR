import { ipcMain } from "electron";
import sevenBin from "7zip-bin";
import Seven from "node-7z";
import StoreDefaults from "../renderer/scripts/StoreDefaults.js";
import Store from "../renderer/scripts/Store.js";
import Axios from "axios";
import GameControl from "../renderer/scripts/GameControl";
import fs from "fs";

class GameManager {
  constructor(window) {
    this.window = window;
  }

  clearCache() {
    const path = require("path");

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
                console.log("An error has occured while removing a cache file: ", err2);
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
    ipcMain.on("game-download", async (event, info) => {
      const timeoutTime = 10000;
      let timeoutId = null;

      const timeoutCallback = (e) => {
        event.sender.send("game-canceled");
        console.error("Download error:", e);
      };

      Axios({
        url: info.url,
        method: "GET",
        responseType: "stream",
        headers: {
          "user-agent": "Mozilla/5.0 (X11; Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Raspbian Chromium/74.0.3729.157 Chrome/74.0.3729.157 Safari/537.36",
        },
      })
        .then(({ data, headers }) => {
          const contentLength = headers["content-length"];
          const writeStream = fs.createWriteStream(info.archive);
          let downloadedCount = 0;

          data.on("data", (chunk) => {
            downloadedCount += chunk.length;

            let progress = downloadedCount / contentLength;
            this.window.setProgressBar(progress);
            event.sender.send("set-progress", progress * 100);

            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(timeoutCallback, timeoutTime);
          });

          data.pipe(writeStream);

          writeStream.on("finish", () => {
            if (timeoutId) clearTimeout(timeoutId);

            writeStream.close(() => {
              // the stream has been closed, can unpack the archive
              event.sender.send("game-download-complete");

              ipcMain.once("game-unpack", (e, args) => {
                const pathTo7zip = sevenBin.path7za;

                const stream = Seven.extractFull(args.archive, args.extractTo, {
                  $bin: pathTo7zip,
                  $progress: true,
                });

                stream.on("progress", (progress) => {
                  this.window.setProgressBar(progress.percent / 100);
                  this.window.webContents.send("set-progress", progress.percent);
                });

                stream.on("end", () => {
                  this.window.setProgressBar(0);
                  stream.destroy();
                  
                  this.window.webContents.send("game-installed");

                  fs.rm(args.archive, (err) => {
                    if (err) console.log("Unable to remove the cache file");
                  });
                });

                stream.on("error", (err) => {
                  this.window.setProgressBar(0);
                  stream.destroy();

                  event.sender.send("game-canceled");
                });
              });
            });
          });
        }).catch(timeoutCallback);
    });
  }
}

export default GameManager;
