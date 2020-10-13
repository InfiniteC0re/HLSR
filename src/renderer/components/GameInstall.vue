<template>
  <md-dialog :md-active.sync="show" :mdClickOutsideToClose="first == false || third == true" :mdCloseOnEsc="false">
    <md-dialog-title>{{localization.get('#UI_GAME_INSTALL')}}</md-dialog-title>
    <md-steppers :md-active-step.sync="active" md-alternative md-linear>
      <md-step
        id="first"
        :md-label="localization.get('#UI_INSTALL_SETTINGS')"
        :md-editable="false"
        :md-done.sync="first"
      >
        <p>{{localization.get('#UI_INSTALLATION', game)}}</p>
        <ul>
          <li v-for="item in items" :key="item._id">{{item}}</li>
        </ul>
        <div style="display:flex;align-items:center;margin-bottom:8px">
          <span
            style="margin-top: auto;margin-left: 8px;opacity: 0.2"
          >{{localization.get('#UI_SPACE_REQUIRED')}} {{memory}} MB</span>
          <md-button
            class="md-primary md-raised"
            style="margin-left: auto"
            @click="setDone('first', 'second')"
          >{{localization.get('#UI_NEXT')}}</md-button>
        </div>
        <md-progress-bar class="md-primary" md-mode="indeterminate"></md-progress-bar>
      </md-step>

      <md-step
        id="second"
        :md-label="localization.get('#UI_INSTALL_STATUS')"
        :md-editable="false"
        :md-done.sync="second"
      >
        <div style="display:flex;align-items:center;margin-bottom:8px">
          <span
            style="margin-top: auto;margin-left: 8px;opacity: 0.2"
          >{{localization.get('#UI_PROGRESS')}} {{progress}}%</span>
          <span
            style="margin-top: auto;margin-left: auto;margin-right:8px;opacity: 0.2"
            v-if="progress != 100"
          >{{status}}</span>
          <span style="margin-top: auto;margin-left: auto;margin-right:8px" v-if="unpacked == true">
            <md-button
              class="md-primary md-raised"
              style="margin-left: auto"
              @click="setDone('second', 'third')"
            >{{localization.get('#UI_NEXT')}}</md-button>
          </span>
        </div>
        <md-progress-bar md-mode="determinate" :md-value="progress"></md-progress-bar>
      </md-step>

      <md-step
        id="third"
        :md-label="localization.get('#UI_INSTALL_FINISH')"
        :md-editable="false"
        :md-done.sync="third"
      >
		<div style="display:flex;align-items:center">
			<p style="opacity:0.2">{{localization.get('#UI_NOTIFICATION_INSTALLED', this.game)}}</p>
			<span style="margin-top: auto;margin-left: auto;margin-right:8px" v-if="unpacked == true">
			<md-button
				class="md-primary md-raised"
				style="margin-left: auto"
				@click="show = false"
			>{{localization.get('#UI_DONE')}}</md-button>
			</span>
		</div>
      </md-step>
    </md-steppers>
  </md-dialog>
</template>

<script type="text/javascript">
import { ipcRenderer } from "electron";
import Store from "../utils/Store.js";
import StoreDefaults from "../utils/StoreDefaults.js";

const fs = require("fs");
const onezip = require("onezip");

const store = new Store({
  configName: "library",
  defaults: StoreDefaults.library
});

export default {
  name: "game-install",
  components: {},
  data(){
    return {
      active: "first",
      show: false,
      first: false,
      second: false,
      third: false,
      items: [],
      game: "",
      memory: 0,
      progress: 0,
      unpacked: false,
      status: null,
      appid: null,
      localization: this.$parent.localization
    }
  },
  methods: {
    setDone(id, index) {
      this[id] = true;

      if (index) this.active = index;

      if (id == "first") {
        this.status = this.localization.get("#UI_DOWNLOADING");
        let fn = "";

        switch (this.game) {
          case "Half-Life":
            fn = "Half-Life.zip";
            break;
          case "Half-Life: Opposing Force":
            fn = "Opposing-Force.zip";
            break;
          case "Half-Life: Blue Shift":
            fn = "Blue-Shift.zip";
            break;
        }

        let info = {
          url: "https://hlsr.pro/downloadable/" + fn,
          properties: {
            directory: require("path").join(
              require("electron").remote.app.getPath("userData"),
              "temp"
            )
          }
        };

        ipcRenderer.send("game-download", info);
        ipcRenderer.on("game-download-complete", (e, path) => {
          let install_path = require("path").join(
            require("electron").remote.app.getPath("userData"),
            "library"
          );
          this.status = this.localization.get("#UI_EXTRACTING");
          this.progress = 0;

          let extract_path = install_path;
          if (this.appid != "70")
            extract_path = require("path").join(extract_path, "Half-Life");
          const extract = onezip.extract(path, extract_path);

          extract.on("progress", percent => {
			this.progress = percent;
			require('electron').remote.getCurrentWindow().setProgressBar(percent / 100);
          });
          extract.on("end", () => {
            let installed = store.get("installed");

            if (!installed[this.appid]) installed[this.appid] = {};
            installed[this.appid].installed = true;
            installed[this.appid].directory = install_path;

            store.set("installed", installed);
            new Notification("HLSR", {
              body: this.localization.get(
                "#UI_NOTIFICATION_INSTALLED",
                this.game
              )
            });
            this.unpacked = true;
            this.$parent.$refs.navbar.goTo("game", {
              id: this.appid,
              refresh: true
			});
			require('electron').remote.getCurrentWindow().setProgressBar(0);
          });
        });
        ipcRenderer.on("game-download-progress", (e, data) => {
          this.progress = Math.round(data.percent * 100);
        });
      }
    },
    open(appid, callback) {
      this.active = "first";
      this.show = false;
      this.first = false;
      this.second = false;
      this.third = false;
      this.unpacked = false;
      this.progress = 0;

      let installed = store.get("installed");
      if (Object.keys(installed).indexOf(appid) < 0) {
        if (Object.keys(installed).indexOf("70") >= 0 || appid == "70") {
          this.show = true;
        } else {
          this.$parent.$refs.navbar.$refs.hl.toggleActive();
          this.$parent.$refs.navbar.goTo("game", { id: "70" });
          return this.open("70");
        }

        switch (appid) {
          case "70":
            this.game = "Half-Life";
            this.memory = 429;
            this.items = [
              this.localization.get("#UI_WON"),
              this.localization.get("#UI_STEAM"),
              "Edited DLL with HUD settings",
              "Bunnymod XT",
              "LiveSplit",
              "RInput"
            ];
            break;
          case "50":
            this.game = "Half-Life: Opposing Force";
            this.memory = 513;
            this.items = [
              this.localization.get("#UI_WON"),
              this.localization.get("#UI_STEAM"),
              "Bunnymod XT",
              "LiveSplit",
              "RInput"
            ];
            break;
          case "130":
            this.game = "Half-Life: Blue Shift";
            this.memory = 285;
            this.items = [
              this.localization.get("#UI_STEAM"),
              "Bunnymod XT",
              "LiveSplit",
              "RInput"
            ];
            break;
        }
        this.appid = appid;
      }
    }
  }
};
</script>