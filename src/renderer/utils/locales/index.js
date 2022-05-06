import Store from "@/utils/Store.js";
import StoreDefaults from "@/utils/StoreDefaults.js";
import en from "./en.locale";
import ru from "./ru.locale";

const DEFAULT_LANG = "eng";

const store = new Store({
  configName: "settings",
  defaults: StoreDefaults.settings,
});

const LocalizationHelper = {
  lang: store.get("config").language,
  locales: { en, ru },
  _parse(str, vars) {
    for (let i = 0; i < vars.length; i++) str = str.replace(`%${i}%`, vars[i]);
    return str;
  },
  update() {
    this.lang = store.get("config").language;
  },
  get(key, ...vars) {
    let lang = Object.keys(this.locales)[this.lang];

    if (this.locales[lang] && this.locales[lang][key])
      return this._parse(this.locales[lang][key], vars);
    if (this.locales[DEFAULT_LANG] && this.locales[DEFAULT_LANG][key])
      return this._parse(this.locales[DEFAULT_LANG][key], vars);

    return key;
  },
}

export default LocalizationHelper;
