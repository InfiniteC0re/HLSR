import { app, ipcMain } from "electron";
import hlsrNative from "hlsr-native";
import AutoUpdater from "./AutoUpdater";
import GameManager from "./GameManager";
import Axios from "axios";

class AppReady {
  constructor(window) {
    this.window = window;
    this.autoUpdater = new AutoUpdater(window);
    this.gameManager = new GameManager(window);

    this.quickLaunchInfo = {
      appid: null,
    };
  }

  startGameQuick() {
    if (this.quickLaunchInfo.appid) {
      this.window.webContents.send("start-game-quick", this.quickLaunchInfo.appid);
    }
  }

  parseArgs(args) {
    args = args.filter((t) => t != "--allow-file-access-from-files");

    if (process.env.NODE_ENV === "production") {
      // Check start arguments
      if (args.length >= 1) {
        let firstArg = args[0];

        // Quick launch
        if (firstArg == "-quick") {
          let appID = args[1];
          this.quickLaunchInfo.appid = appID;
        }
      }
    }
  }

  secondInstance() {
    app.on("second-instance", (e, cmd, wdir) => {
      if (this.window) {
        cmd.splice(0, 1);
        this.parseArgs(cmd);
        this.startGameQuick();

        if (this.window.isMinimized()) this.window.restore();
        this.window.focus();
      }
    });
  }

  readyEvent() {
    // WinApi
    const winapi = hlsrNative.WinApi;

    ipcMain.on("GetDiskFreeSpaceMbytes", (e, path) => {
      e.returnValue = winapi.GetDiskFreeSpaceMbytes(path);
    });

    // Steamworks
    const steamworks = hlsrNative.steamworks;

    let steamReady = false;
    let sentAnalytics = false;

    ipcMain.on("getSteamStatus", (e) => {
      steamReady = steamworks.SteamAPI_Init();
      e.reply("steamStatus", steamReady);
    });

    ipcMain.on("getSteamFriends", (e) => {
      if (steamReady)
        e.reply("steamFriends", steamworks.GetFriends("launcher", false));
    });

    ipcMain.on("getLicenses", (e) => {
      let hl1 = steamworks.BIsSubscribedApp(70);
      let hl2 = steamworks.BIsSubscribedApp(220);

      e.reply("steamLicenses", {
        "70": hl1,
        "50": hl1,
        "130": hl1,
        "220": hl2,
      });
    });

    ipcMain.on("getSteamName", (e) => {
      if (!steamReady) return;
      let name = steamworks.GetPersonaName();

      if (!sentAnalytics)
        Axios({
          url: "https://hlsr.pro/analytics/",
          method: "POST",
          headers: {
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
            "content-type": "application/x-www-form-urlencoded",
          },
          data: `steam=${name}`,
        }).then(() => {
          sentAnalytics = true;
        });

      e.reply("steamName", name);
    });

    ipcMain.on("setRichPresence", (e, srpc) => {
      if (steamReady) steamworks.SetRichPresence("launcher", srpc);
    });

    ipcMain.on("ready", (e) => {
      this.parseArgs(require("process").argv.slice(1));
      if (this.quickLaunchInfo.appid) this.startGameQuick();

      this.autoUpdater.startCheckingInterval();
    });

    this.autoUpdater.registerEvents();
    this.gameManager.cleanTemp();
    this.gameManager.registerEvents();
  }
}

export default AppReady;
