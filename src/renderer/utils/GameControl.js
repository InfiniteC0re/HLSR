export default {
  checkInstalled(store, appid) {
    let installed = store.get("installed");
    return Object.keys(installed).indexOf(appid) >= 0;
  },
};
