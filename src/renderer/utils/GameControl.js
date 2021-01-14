import { ipcRenderer } from "electron";

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
        config[gameID].args,
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
        ipcRenderer.send("setRichPresence", "HLSR")
      }
    );
    
    let gameTitle = this.getTitle(gameID);
    ipcRenderer.send("setRichPresence", `HLSR [${gameTitle}]`)

    store.set("lastLaunched", gameID);
    if (globalstore) globalstore.commit("setLastGame", gameTitle);
  },
  getTitle(gameID) {
    switch (gameID) {
      case "70":
        return "Half-Life";
      case "50":
        return "Half-Life: Opposing Force";
      case "130":
        return "Half-Life: Blue Shift";
      case "220":
        return "Half-Life 2";
      default:
        return "Unknown Game";
    }
  },
};
