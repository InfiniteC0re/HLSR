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
  startGame(hlsrConsole, store, gameID, globalstore, navbar) {
    let config = store.get("config");
    let params = config[gameID];

    let coresParams = {
      1: "-onecore",
      2: "-twocores",
      3: "-threecores",
      4: "-fourcores",
    };

    hlsrConsole.execute(
      [
        "game", // action
        this.getLibraryPath(store), // path of the library
        gameID,
        params.edited_dll ? "-dll" : "",
        params.bxt ? "-bxt" : "",
        params.rinput ? "-ri" : "",
        params.livesplit ? "-livesplit" : "",
        params.steam ? "-steam" : "",
        params.allcores ? "-allcores" : coresParams[params.corescount],
        "-" + params.priority,
        gameID == "218" && params.hl1movement
          ? "-game ghosting " + params.args
          : gameID == "218"
          ? "-game ghostingmod " + params.args
          : params.args,
      ],
      () => {
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
      }
    );

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

    let installed = store.get("installed");

    game.info.uninstallPaths.forEach((fn) => {
      if (typeof fn === "string") {
        let gamePath = path.join(libraryPath, fn);

        try {
          fs.rmSync(gamePath, {
            recursive: true,
          });
        } catch (e) {}
      }
    });

    GameList.forEach((g) => {
      if (g.info.isStandalone == false && g.info.requiredGame == game.id)
        delete installed[g.id];
    });

    delete installed[game.id];

    store.set("installed", installed);
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
};
