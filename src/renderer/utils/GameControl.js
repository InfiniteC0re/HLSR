export default {
  checkInstalled(store, appid) {
    let installed = store.get("installed");
    return Object.keys(installed).indexOf(appid) >= 0;
  },
  startGame(hlsrconsole, store, gameID, globalstore) {
    let config = store.get("config");
    hlsrconsole.execute([
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
    ]);
    store.set("lastLaunched", gameID);
    if (globalstore) globalstore.commit("setLastGame", gameID);
  },
};
