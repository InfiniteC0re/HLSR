import sevenBin from "7zip-bin";
import Seven from "node-7z";
import fs from "fs";
import path from "path";
import DownloadManager from "./download-manager";

DownloadManager.register();

const downloadFile = (url, archive, progressCb, updateCb) => {
  return new Promise(async (resolve, reject) => {
    let parsedPath = path.parse(archive);

    DownloadManager.download(
      {
        url: url,
        path: parsedPath.dir,
        filename: parsedPath.base,
        onProgress: (progress, item) => {
          if (progress.state == "interrupted") {
            // retry timeout
            setTimeout(() => {
              item.resume();
            }, 3000);
          }

          updateCb(progress, item);
          progressCb(progress.progress);
        },
      },
      (error, info) => {
        if (!error) resolve(info.filePath);
        else reject(error);
      }
    );

    // const timeoutCallback = (e) => reject(e);
    // let timeoutId = null;

    // Axios({
    //   url: url,
    //   method: "GET",
    //   responseType: "stream",
    //   headers: {
    //     "user-agent":
    //       "Mozilla/5.0 (X11; Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Raspbian Chromium/74.0.3729.157 Chrome/74.0.3729.157 Safari/537.36",
    //   },
    // })
    //   .then(({ data, headers }) => {
    //     const contentLength = headers["content-length"];
    //     const writeStream = fs.createWriteStream(archive);
    //     let downloadedCount = 0;

    //     data.on("data", (chunk) => {
    //       downloadedCount += chunk.length;

    //       let progress = downloadedCount / contentLength;
    //       if (progressCb != null) progressCb(progress);

    //       if (timeoutId) clearTimeout(timeoutId);
    //       timeoutId = setTimeout(timeoutCallback, timeoutTime);
    //     });

    //     data.pipe(writeStream);

    //     writeStream.on("finish", () => {
    //       if (timeoutId) clearTimeout(timeoutId);
    //       writeStream.close(() => resolve(archive));
    //     });
    //   })
    //   .catch(timeoutCallback);
  });
};

const extractArchive = (archive, extractPath, progressCb) => {
  return new Promise(async (resolve, reject) => {
    const pathTo7zip = sevenBin.path7za;

    let firstArchive = archive;
    if (Array.isArray(archive)) firstArchive = archive[0];
    else archive = [archive];

    const stream = Seven.extractFull(firstArchive, extractPath, {
      $bin: pathTo7zip,
      $progress: true,
    });

    stream.on("progress", (progress) => progressCb(progress.percent / 100));

    stream.on("end", () => {
      if (!stream.destroyed) {
        stream.destroy();

        for (const cacheFile of archive) {
          fs.rm(cacheFile, (err) => {
            if (err) console.log("Unable to remove the cache file: " + err);
          });
        }

        resolve();
      }
    });

    stream.on("error", (err) => {
      console.log(err);
      stream.destroy();
      reject(err);
    });
  });
};

export default {
  downloadFile,
  extractArchive,
};
