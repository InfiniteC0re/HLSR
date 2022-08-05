import { app, ipcMain } from "electron";
import hlsrNative from "hlsr-native";
import UpdateManager from "./UpdateManager";
import GameManager from "./GameManager";

class AppManager {
  constructor(window) {
    this.window = window;
    this.updateManager = new UpdateManager(window);
    this.gameManager = new GameManager(window);
    this.connectedToSteam = false;

    this.quickLaunchInfo = {
      appid: null,
    };
  }

  startGameQuick() {
    if (this.quickLaunchInfo.appid)
      this.window.webContents.send(
        "start-game-quick",
        this.quickLaunchInfo.appid
      );
  }

  parseArgs(args) {
    if (process.env.NODE_ENV === "production") {
      args = args.filter((t) => t != "--allow-file-access-from-files");

      // Check start arguments
      if (args.length >= 1) {
        let firstArg = args[0];

        // Quick launch
        if (firstArg == "-quick") {
          this.quickLaunchInfo.appid = args[1];
        }
      }
    }
  }

  initialize() {
    app.on("second-instance", (e, cmd, wdir) => {
      if (this.window) {
        cmd.splice(0, 1);
        this.parseArgs(cmd);
        this.startGameQuick();

        if (this.window.isMinimized()) this.window.restore();
        this.window.focus();
      }
    });

    // LiveSplit
    const liveSplit = hlsrNative.LiveSplit;
    
    ipcMain.on("LiveSplitReadFile", (e, filePath) => {
      const splitFile = liveSplit.ReadSplitsFile(filePath);
      e.sender.send("LiveSplitReadFile_reply", splitFile);
    });

    // WinApi
    const winapi = hlsrNative.WinApi;

    ipcMain.on("GetDiskFreeSpaceMbytes", (e, path) => {
      e.returnValue = winapi.GetDiskFreeSpaceMbytes(path);
    });

    // Steamworks
    const steamworks = hlsrNative.steamworks;

    ipcMain.on("getSteamStatus", (e) => {
      this.connectedToSteam = steamworks.SteamAPI_Init();
      e.returnValue = this.connectedToSteam;
    });

    ipcMain.on("getSteamFriends", (e) => {
      if (this.connectedToSteam)
        e.returnValue = steamworks.GetFriends("launcher", false);
      else e.returnValue = [];
    });

    ipcMain.on("getLicenses", (e) => {
      let hasHL1 = steamworks.BIsSubscribedApp(70);
      let hasHL2 = steamworks.BIsSubscribedApp(220);

      e.returnValue = {
        70: hasHL1,
        50: hasHL1,
        130: hasHL1,
        218: true,
        220: hasHL2,
      };
    });

    ipcMain.on("getSteamName", (e) => {
      if (!this.connectedToSteam) return;
      let name = steamworks.GetPersonaName();
      e.returnValue = name;
    });

    ipcMain.on("setRichPresence", (e, srpc) => {
      if (this.connectedToSteam)
        e.returnValue = steamworks.SetRichPresence("launcher", srpc);
      else e.returnValue = false;
    });

    ipcMain.on("ready", (e) => {
      this.parseArgs(require("process").argv.slice(1));
      if (this.quickLaunchInfo.appid) this.startGameQuick();

      this.updateManager.startCheckingInterval();
    });

    this.gameManager.cleanCache();
    this.updateManager.initialize();
    this.gameManager.initialize();
  }
}

export default AppManager;
