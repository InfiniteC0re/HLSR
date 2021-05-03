import { ipcRenderer } from "electron";
import GameList from "../GameList";

export default {
  checkInstalled(store, appid) {
    let installed = store.get("installed");
    return Object.keys(installed).indexOf(appid) >= 0;
  },
  startGame(hlsrconsole, store, gameID, globalstore, navbar) {
    let config = store.get("config");
    hlsrconsole.execute(
      [
        "game",
        require("path").join(
          require("electron").remote.app.getPath("userData"),
          "library"
        ),
        gameID,
        config[gameID].edited_dll ? "-dll" : "",
        config[gameID].bxt ? "-bxt" : "",
        config[gameID].rinput ? "-ri" : "",
        config[gameID].livesplit ? "-livesplit" : "",
        config[gameID].steam ? "-steam" : "",
        config[gameID].allcores ? "-allcores" : "",
        config[gameID].allcores == false && config[gameID].corescount == "1"
          ? "-onecore"
          : "",
        config[gameID].allcores == false && config[gameID].corescount == "2"
          ? "-twocores"
          : "",
        config[gameID].allcores == false && config[gameID].corescount == "3"
          ? "-threecores"
          : "",
        config[gameID].allcores == false && config[gameID].corescount == "4"
          ? "-fourcores"
          : "",
        "-" + config[gameID].priority,
        config[gameID].hl1movement && gameID == "218"
          ? "-game ghosting " + config[gameID].args
          : gameID == "218" ? "-game ghostingmod " + config[gameID].args : config[gameID].args,
      ],
      () => {
        // Завершение работы hlsr-console
        config = store.get("config");

        if (
          config[gameID].inGameTime == undefined ||
          config[gameID].inGameTime == null ||
          config[gameID].inGameTime < 0
        )
          config[gameID].inGameTime = 0;

        config[gameID].inGameTime += Date.now() - globalstore.state.game.date;

        store.set("config", config);

        if (globalstore) globalstore.commit("setLastGame", null);
        if (navbar) navbar.$forceUpdate();
        ipcRenderer.send("setRichPresence", "HLSR");
      }
    );

    let gameTitle = this.getTitle(gameID);
    ipcRenderer.send("setRichPresence", `HLSR [${gameTitle}]`);

    store.set("lastLaunched", gameID);
    if (globalstore) globalstore.commit("setLastGame", gameTitle);
  },
  getTitle(id) {
    return GameList.find((t) => t.id == id).name || "Unknown game";
  },
  uninstallGame(store, id) {
    const libraryPath = require("path").join(
      require("electron").remote.app.getPath("userData"),
      "library"
    );

    const fs = require("fs");
    const path = require("path");
    const game = GameList.find((t) => t.id == id);
    if (!game) return;

    let installed = store.get("installed");

    game.info.removePaths.forEach((fn) => {
      if (typeof fn === "string") {
        let gamePath = path.join(libraryPath, fn);

        fs.rmdirSync(gamePath, { recursive: true });
      }
    });

    GameList.forEach((g) => {
      if (g.info.isStandalone == false && g.info.requiredGame == game.id)
        delete installed[g.id];
    });

    delete installed[game.id];

    store.set("installed", installed);

    // if (game.id == "70") {
    //   fs.rmdirSync(gamePath, { recursive: true });
    //   delete installed["70"];
    //   delete installed["50"];
    //   delete installed["130"];

    //   store.set("installed", installed);
    // } else if (id == "50") {
    //   let gamePath = path.join(libraryPath, "Half-Life", "gearbox");
    //   fs.rmdirSync(gamePath, { recursive: true });

    //   gamePath = path.join(libraryPath, "Half-Life", "gearbox_WON");
    //   fs.rmdirSync(gamePath, { recursive: true });

    //   delete installed["50"];
    //   store.set("installed", installed);
    // } else if (id == "130") {
    //   let gamePath = path.join(libraryPath, "Half-Life", "bshift");
    //   fs.rmdirSync(gamePath, { recursive: true });

    //   delete installed["130"];
    //   store.set("installed", installed);
    // } else if (id == "220") {
    //   let gamePath = path.join(libraryPath, "Half-Life 2");
    //   fs.rmdirSync(gamePath, { recursive: true });

    //   delete installed["220"];
    //   store.set("installed", installed);
    // }
  },
  openGameFolder(id) {
    const path = require("path");
    const libraryPath = path.join(
      require("electron").remote.app.getPath("userData"),
      "library"
    );

    let game = GameList.find((t) => t.id == id);
    if (!game) return;

    let open_path = path.join(libraryPath, game.info.removePaths[0]);

    try {
      require("electron").remote.shell.openPath(open_path);
    } catch (e) {
      console.error(e);
    }
  },
  getSourceRunsLink(id) {
    let game = GameList.find((t) => t.id == id);
    return game ? game.info.sourceruns : null;
  },
};
