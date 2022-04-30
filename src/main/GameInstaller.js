import Axios from "axios";
import fs from "fs";

const timeoutTime = 10000;

const downloadFile = (url, archive, progressCb) => {
  return new Promise(async (resolve, reject) => {
    const timeoutCallback = (e) => reject(e);
    let timeoutId = null;

    Axios({
      url: url,
      method: "GET",
      responseType: "stream",
      headers: {
        "user-agent":
          "Mozilla/5.0 (X11; Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Raspbian Chromium/74.0.3729.157 Chrome/74.0.3729.157 Safari/537.36",
      },
    })
      .then(({ data, headers }) => {
        const contentLength = headers["content-length"];
        const writeStream = fs.createWriteStream(archive);
        let downloadedCount = 0;

        data.on("data", (chunk) => {
          downloadedCount += chunk.length;

          let progress = downloadedCount / contentLength;
          if (progressCb != null) progressCb(progress);

          if (timeoutId) clearTimeout(timeoutId);
          timeoutId = setTimeout(timeoutCallback, timeoutTime);
        });

        data.pipe(writeStream);

        writeStream.on("finish", () => {
          if (timeoutId) clearTimeout(timeoutId);

          writeStream.close(() => {
            resolve(archive);
            // the stream has been closed, can unpack the archive
            // event.sender.send("game-download-complete");

            // ipcMain.once("game-unpack", (e, args) => {
            
            // });
          });
        });
      })
      .catch(timeoutCallback);
  });
};

export default {
  downloadFile,
};
