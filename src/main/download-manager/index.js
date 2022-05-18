/*
Author of the original module is danielnieto
https://github.com/danielnieto/electron-download-manager
*/

'use strict';
const path = require('path');
const electron = require('electron');
const { BrowserWindow, net, session } = electron;
const fs = require('fs');

const app = electron.app;
let lastWindowCreated;

const queue = [];

const _popQueueItem = (url) => {
    let queueItem = queue.find(item => item.url === url);
    queue.splice(queue.indexOf(queueItem), 1);
    return queueItem;
};

 const _bytesToSize = (bytes,decimals) => {
    if(bytes == 0) return '0 Bytes';
    var k = 1000,
        dm = decimals || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

 const _convertTime = (input, separator) => {
    var pad = function(input) {return input < 10 ? "0" + input : input;};
    return [
        pad(Math.floor(input / 3600)),
        pad(Math.floor(input % 3600 / 60)),
        pad(Math.floor(input % 60)),
    ].join(typeof separator !== 'undefined' ?  separator : ':' );
}

function _registerListener(win, opts = {}) {

    lastWindowCreated = win;

    const listener = (e, item) => {
        const itemUrl = decodeURIComponent(item.getURLChain()[0] || item.getURL())
        let queueItem = _popQueueItem(itemUrl);
        let ReceivedBytesArr = [];

        if (queueItem) {
            const filePath = path.join(queueItem.path, queueItem.filename);
            const totalBytes = item.getTotalBytes();

            let speedValue = 0;
            let receivedBytes;
            let PreviousReceivedBytes;

            item.setSavePath(filePath);

            // Resuming an interrupted download
            if (item.getState() === 'interrupted') {
                item.resume();
            }

            item.on('updated', () => {
                receivedBytes = item.getReceivedBytes();

                ReceivedBytesArr.push(receivedBytes);
                if (ReceivedBytesArr.length >= 2) {
                    PreviousReceivedBytes = ReceivedBytesArr.shift();
                    speedValue = Math.max(PreviousReceivedBytes, ReceivedBytesArr[0]) - Math.min(PreviousReceivedBytes, ReceivedBytesArr[0]);
                }

                const progress = {
                    progress: receivedBytes / totalBytes,
                    speedBytes: speedValue,
                    speed: _bytesToSize(speedValue) + '/s',
                    remainingBytes: totalBytes - receivedBytes,
                    remaining: _bytesToSize(totalBytes - receivedBytes),
                    totalBytes: totalBytes,
                    total: _bytesToSize(totalBytes),
                    downloadedBytes: receivedBytes,
                    downloaded: _bytesToSize(receivedBytes),
                    state: item.getState()
                }

                if (typeof queueItem.onProgress === 'function') {
                    queueItem.onProgress(progress, item);
                }
            });

            item.on('done', (e, state) => {
                let finishedDownloadCallback = queueItem.callback || function () {};

                if (!win.isDestroyed()) {
                    win.setProgressBar(-1);
                }

                if (state === 'interrupted') {
                    const message = `The download of ${item.getFilename()} was interrupted`;
                    finishedDownloadCallback(new Error(message), { url: item.getURL(), filePath });
                } else if (state === 'completed') {
                    finishedDownloadCallback(null, { url: item.getURL(), filePath });
                } else if (state === 'cancelled') {
                    try {
                        fs.unlinkSync(filePath);
                    } catch(e) {}

                    finishedDownloadCallback('cancelled', { url: item.getURL(), filePath });
                }
            });
        }
    };

    win.webContents.session.on('will-download', listener);
}

const register = (opts = {}) => {

    app.on('browser-window-created', (e, win) => {
        _registerListener(win, opts);
    });
};

const download = (options, callback) => {
    let win = BrowserWindow.getFocusedWindow() || lastWindowCreated;
    options = Object.assign({}, { path: '' }, options);

    const request = net.request(options.url);
    
    var filename = decodeURIComponent(path.basename(options.url));
    if (options.filename) {
        filename = options.filename;
    }
    const url = decodeURIComponent(options.url);

    const filePath = path.join(options.path.toString(), filename.split(/[?#]/)[0])

    if (options.headers) {
        options.headers.forEach((h) => { request.setHeader(h.name, h.value) })

        // Modify the user agent for all requests to the following urls.
        const filter = {
            urls: [options.url]
        }

        session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
            options.headers.forEach((h) => { details.requestHeaders[h.name] =  h.value })
            // details.requestHeaders['User-Agent'] = 'MyAgent'
            callback({ cancel: false, requestHeaders: details.requestHeaders })
        })
    }

    if (typeof options.onLogin === 'function') {
        request.on('login', options.onLogin)
    }

    request.on('error', function (error) {
        let finishedDownloadCallback = callback || function () { };

        const message = `The request for ${filename} was interrupted: ${error}`;

        finishedDownloadCallback(new Error(message), { url: options.url, filePath });
    });

    request.on('response', function (response) {
        request.abort();

        queue.push({
            url: url,
            filename: filename,
            path: options.path.toString(),
            callback: callback,
            onProgress: options.onProgress
        });


        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);

            const fileOffset = stats.size;

            const serverFileSize = parseInt(response.headers['content-length']);

            console.log(filename + ' exists, verifying file size: (' + fileOffset + ' / ' + serverFileSize + ' downloaded)');

            // Check if size on disk is lower than server
            if (fileOffset < serverFileSize) {
                console.log('File needs re-downloaded as it was not completed');

                options = {
                    path: filePath,
                    urlChain: [options.url],
                    offset: parseInt(fileOffset),
                    length: serverFileSize,
                    lastModified: response.headers['last-modified']
                };

                win.webContents.session.createInterruptedDownload(options);

            } else {

                console.log(filename + ' verified, no download needed');

                let finishedDownloadCallback = callback || function () {};

                finishedDownloadCallback(null, { url, filePath });
            }

        } else {
            console.log(filename + ' does not exist, download it now');
            win.webContents.downloadURL(options.url);
        }
    });
    request.end();
};

export default {
    register,
    download,
};