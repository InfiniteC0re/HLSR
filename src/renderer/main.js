import Vue from "vue";
import axios from "axios";

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
  MdChips,
  MdSubheader,
  MdAutocomplete,
} from "vue-material/dist/components";
import "vue-material/dist/vue-material.min.css";
import "@/assets/css/theme.css";

import "@/assets/font-awesome/css/all.css";
import "@/assets/fonts/fonts.css";

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
Vue.use(MdChips);
Vue.use(MdAutocomplete);

import App from "./App";
import router from "./router";

/* Uncomment this section to enable experimental win10 acryllic background */

/*
const ewc = require('node-loader!@/native/ewc.node');
ewc.setComposition(require('electron').remote.getCurrentWindow().getNativeWindowHandle(), 4, 0x90000000);
*/

var steamworks;

steamworks = require("@/utils/steamworks");

if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.prototype.$navbarbuttons = [];
Vue.prototype.$steamworks = steamworks;

/* eslint-disable no-new */
new Vue({
  components: {
    App,
  },
  router,
  template: "<App/>",
}).$mount("#app");
