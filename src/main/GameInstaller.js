import Axios from "axios";
import sevenBin from "7zip-bin";
import Seven from "node-7z";
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
          writeStream.close(() => resolve(archive));
        });
      })
      .catch(timeoutCallback);
  });
};

const extractArchive = (archive, extractPath, split, progressCb) => {
  return new Promise(async (resolve, reject) => {
    const pathTo7zip = sevenBin.path7za;

    const stream = Seven.extractFull(
      split ? archive[0] : archive,
      extractPath,
      {
        $bin: pathTo7zip,
        $progress: true,
      }
    );

    stream.on("progress", (progress) => progressCb(progress / 100));

    stream.on("end", () => {
      if (!stream.destroyed) {
        stream.destroy();

        let cacheFiles = split ? archive : [archive];
        for (const cacheFile of cacheFiles) {
          fs.rm(cacheFile, (err) => {
            if (err) console.log("Unable to remove the cache file: " + err);
          });
        }

        resolve();
      }
    });

    stream.on("error", (err) => {
      stream.destroy();
      reject(err);
    });
  });
};

export default {
  downloadFile,
  extractArchive,
};
