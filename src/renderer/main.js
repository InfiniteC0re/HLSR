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
Vue.use(MdAutocomplete);

import App from "./App";
import router from "./router";
import store from "./store";

// const ewc = require('node-loader!@/native/ewc.node');
// ewc.setComposition(require('electron').remote.getCurrentWindow().getNativeWindowHandle(), 4, 0x90000000);

if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.prototype.$navbarbuttons = [];

let programmatic = false;
["push", "replace", "go", "back", "forward"].forEach((methodName) => {
  const method = router[methodName];
  router[methodName] = (...args) => {
    programmatic = true;
    method.apply(router, args);
  };
});

router.beforeEach((to, from, next) => {
  // name is null for initial load or page reload
  if (from.name === null || programmatic) {
    // triggered bu router.push/go/... call
    // route as usual
    next();
  } else {
    // triggered by user back/forward
    // do not route
    next(false);
  }
  programmatic = false; // clear flag
});

/* eslint-disable no-new */
new Vue({
  store,
  components: {
    App,
  },
  router,
  template: "<App/>",
}).$mount("#app");
