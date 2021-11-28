import Vue from "vue";

import {
  MdButton,
  MdCheckbox,
  MdProgress,
  MdSwitch,
  MdRadio,
  MdField,
  MdTooltip,
  MdBadge,
  MdSnackbar,
  MdEmptyState,
  MdDialog,
  MdSteppers,
  MdContent,
  MdMenu,
  MdList,
  MdSubheader,
  MdAutocomplete,
} from "vue-material/dist/components";

import "vue-material/dist/vue-material.min.css";
import "@/assets/css/theme.css";

import "@/assets/font-awesome/css/all.css";
import "@/assets/fonts/fonts.css";
import HLSRConsole from "hlsr-console";
import Localisation from "@/scripts/Language.js";

Vue.use(MdButton);
Vue.use(MdCheckbox);
Vue.use(MdProgress);
Vue.use(MdSwitch);
Vue.use(MdRadio);
Vue.use(MdField);
Vue.use(MdTooltip);
Vue.use(MdBadge);
Vue.use(MdSnackbar);
Vue.use(MdEmptyState);
Vue.use(MdDialog);
Vue.use(MdSteppers);
Vue.use(MdContent);
Vue.use(MdMenu);
Vue.use(MdList);
Vue.use(MdSubheader);
Vue.use(MdAutocomplete);

import App from "./App";
import router from "./router";
import store from "./store";

Vue.localisation = Vue.prototype.$localisation = new Localisation();
Vue.console = Vue.prototype.$hlsrConsole = new HLSRConsole();
Vue.config.productionTip = false;

new Vue({
  store,
  components: {
    App,
  },
  router,
  template: "<App/>",
}).$mount("#app");
