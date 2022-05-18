import { ipcRenderer } from "electron";
import GameList from "../../games.config";
const electron = require("electron");
const path = require("path");
const fs = require("fs");
const remote =
  process.type == "renderer" ? require("@electron/remote") : electron;

export default {
  checkInstalled(store, appid) {
    let installed = store.get("installed");
    return Object.keys(installed).indexOf(appid) >= 0;
  },
  getInstalledCount(store) {
    let installed = store.get("installed");
    return Object.keys(installed).length;
  },
  setLiveSplitSplitsFile(store, gameID, file) {
    let config = store.get("config");
    let params = config[gameID];

    params.splitsFile = file;
    store.set("config", config);
  },
  getLiveSplitSplitsFile(store, gameID) {
    let config = store.get("config");
    let params = config[gameID];

    // check if the file is valid and it exists
    if (params.splitsFile) {
      if (
        !params.splitsFile.endsWith(".lss") ||
        !fs.existsSync(params.splitsFile)
      )
        params.splitsFile = null;
    }

    if (!params.splitsFile) {
      let library = this.getLibraryPath(store);
      let fileName = "";

      switch (gameID) {
        case "50":
          fileName = "Half-Life Opposing Force.lss";
          break;
        case "130":
          fileName = "Half-Life Blue Shift.lss";
          break;
        case "218":
          fileName = "Half-Life 2 - HL1Movement.lss";
          break;
        case "220":
          fileName = "Half-Life 2.lss";
          break;
        default:
          fileName = "Half-Life.lss";
          break;
      }

      params.splitsFile = path.join(library, "LiveSplit", "splits", fileName);

      if (!fs.existsSync(params.splitsFile)) {
        // splits file doesn't exist, so just leaving the function
        return null;
      }

      store.set("config", config);
    }

    return params.splitsFile;
  },
  startGame(hlsrConsole, store, gameID, globalstore, navbar) {
    let config = store.get("config");
    let params = config[gameID];

    let coresParams = {
      1: "-onecore",
      2: "-twocores",
      3: "-threecores",
      4: "-fourcores",
    };

    let startArgs = [
      "game",
      this.getLibraryPath(store),
      gameID,
      `-${params.priority || "normal"}`,
    ];
    if (params.edited_dll) startArgs.push("-dll");
    if (params.bxt) startArgs.push("-bxt");
    if (params.rinput) startArgs.push("-ri");
    if (params.livesplit) {
      startArgs.push("-livesplit");
      startArgs.push(this.getLiveSplitSplitsFile(store, gameID));
    }
    if (params.steam) startArgs.push("-steam");
    if (params.allcores) startArgs.push("-allcores");
    else startArgs.push(coresParams[params.corescount || 1]);
    startArgs.push(
      gameID == "218" && params.hl1movement
        ? "-game ghosting " + params.args
        : gameID == "218"
        ? "-game ghostingmod " + params.args
        : params.args
    );

    hlsrConsole.execute(startArgs, () => {
      // Завершение работы hlsr-console
      config = store.get("config");
      params = config[gameID];

      if (!params.inGameTime || typeof params.inGameTime != "number")
        params.inGameTime = 0;

      params.inGameTime += Date.now() - globalstore.state.game.startDate;
      store.set("config", config);

      if (globalstore) globalstore.commit("setCurrentGame", null);
      if (navbar) navbar.$forceUpdate();

      ipcRenderer.sendSync("setRichPresence", "HLSR");
    });

    let gameTitle = this.getTitle(gameID);
    ipcRenderer.sendSync("setRichPresence", `HLSR [${gameTitle}]`);

    store.set("lastLaunched", gameID);
    if (globalstore) globalstore.commit("setCurrentGame", gameTitle);
  },
  getTitle(id) {
    return this.getGame(id).name || "Unknown game";
  },
  getIcon(id) {
    return this.getGame(id).iconFile;
  },
  getBackground(id) {
    return this.getGame(id).background;
  },
  getGame(id) {
    return GameList.find((t) => t.id == id);
  },
  uninstallGame(store, id) {
    const libraryPath = this.getLibraryPath(store);
    const game = this.getGame(id);
    if (!game) return;

    let installedGames = store.get("installed");

    game.info.uninstallPaths.forEach((fn) => {
      let gamePath = path.join(libraryPath, fn);

      try {
        fs.rmSync(gamePath, {
          recursive: true,
        });
      } catch (e) {}
    });

    GameList.forEach((g) => {
      if (g.info.isStandalone == false && g.info.requiredGame == game.id)
        delete installedGames[g.id];
    });

    delete installedGames[game.id];
    store.set("installed", installedGames);
  },
  openGameDir(id, store) {
    const libraryPath = this.getLibraryPath(store);

    let game = this.getGame(id);
    if (!game) return;

    let open_path = path.join(libraryPath, game.info.uninstallPaths[0]);

    if (id == "218") {
      let cfg = store.get("config")[id];

      if (cfg.hl1movement) open_path = path.join(open_path, "ghosting");
      else open_path = path.join(open_path, "ghostingmod");
    }

    try {
      remote.shell.openPath(open_path);
    } catch (e) {
      console.error(e);
    }
  },
  getLibraryPath(store) {
    let libPath = store.get("libraryPath");
    if (libPath) return libPath;

    libPath = path.join(remote.app.getPath("userData"), "library");
    if (!fs.existsSync(libPath)) fs.mkdirSync(libPath, { recursive: true });

    return libPath;
  },
  getCacheDir(store) {
    let cacheDir = path.join(this.getLibraryPath(store), "dlcache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    return cacheDir;
  },
  getCacheDir_OLDPATH(store) {
    let libPath = store.get("libraryPath");
    let cacheDir = null;

    if (libPath) cacheDir = path.join(libPath, "downloads");
    else cacheDir = path.join(remote.app.getPath("userData"), "temp");

    return cacheDir;
  },
  getCacheFileName(store) {
    return path.join(this.getCacheDir(store), "cache_" + Date.now());
  },
  getSourceRunsLink(id) {
    let game = this.getGame(id);
    return game ? game.info.sourceruns : null;
  },
  getLeaderboardLink(id) {
    let game = this.getGame(id);
    return game ? game.info.leaderboard : null;
  },
};
