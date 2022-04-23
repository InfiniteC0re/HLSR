import { app, BrowserWindow } from "electron";

const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

function createWindow() {
  if (!app.requestSingleInstanceLock()) return app.quit();

  let targetSize = {
    width: 950,
    height: 690,
  };

  let window = new BrowserWindow({
    width: targetSize.width,
    height: targetSize.height,
    minWidth: targetSize.width,
    minHeight: targetSize.height,
    maxWidth: targetSize.width,
    maxHeight: targetSize.height,
    show: false,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });

  window.once("ready-to-show", window.show);

  require("@electron/remote/main").enable(window.webContents);
  require("@electron/remote/main").initialize();
  window.setMenu(null);
  window.setFullScreenable(false);
  window.setMaximizable(false);
  window.loadURL(winURL);

  return window;
}

export default createWindow;
