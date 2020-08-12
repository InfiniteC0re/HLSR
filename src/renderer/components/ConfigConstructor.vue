<template>
  <div id="wrap">
    <div id="form">
      <div class="title">{{localization.get('#UI_CONFIGS_CONSTRUCTOR')}}</div>
      <div
        style="margin-top:16px;background:rgba(0,0,0,.16);height:100%;overflow:auto;border-radius:4px"
      >
        <md-list style="background:transparent" v-if="scripts.scriptless">
          <md-subheader>{{localization.get('#UI_SCRIPT_SCRIPTLESS')}}</md-subheader>
          <md-list-item
            class="md-inset"
            v-for="script in scripts.scriptless"
            :key="script._id"
            @click="itemClick;if(script.binds){selected=script;detailsOpen=true}"
          >
            <md-checkbox v-model="script.selected" class="md-primary" />
            <span class="md-list-item-text">{{script.name}}</span>
          </md-list-item>
          <md-subheader>{{localization.get('#UI_SCRIPT_SCRIPTED')}}</md-subheader>
          <md-list-item
            class="md-inset"
            v-for="script in scripts.scripted"
            :key="script._id"
            @click="itemClick;if(script.binds){selected=script;detailsOpen=true}"
          >
            <md-checkbox v-model="script.selected" />
            <span class="md-list-item-text">{{script.name}}</span>
          </md-list-item>
        </md-list>
      </div>
      <div
        style="display:grid;grid-template-rows:1fr;width:100%;grid-template-columns:1fr 1fr;grid-gap:16px;"
      >
        <md-button
          class="md-accent md-raised"
          style="margin:0;margin-top:16px;height:48px"
          @click="save"
          :disabled="!checkInstalled('70')"
        >{{localization.get('#UI_SCRIPT_GENERATE')}}</md-button>
        <md-button
          class="md-primary md-raised"
          style="margin:0;margin-top:16px;height:48px"
          @click="saveToFile"
        >{{localization.get('#UI_SCRIPT_SAVE')}}</md-button>
      </div>
      <md-dialog :md-active.sync="detailsOpen" :mdClickOutsideToClose="true">
        <md-dialog-title v-html="localization.get('#UI_SCRIPT_SETTINGS', selected.name)"></md-dialog-title>
        <md-dialog-content v-if="selected">
          <span
            style="opacity:0.2;margin-bottom:12px;display:flex"
          >{{localization.get('#UI_SCRIPT_BINDS')}}</span>
          <div class="binds">
            <div class="inline" v-for="bind in selected.binds" :key="bind._id">
              <md-field style="margin-right: 4px">
                <label>{{localization.get('#UI_SCRIPT_KEY')}}</label>
                <md-input v-model="bind.key"></md-input>
              </md-field>
              <md-field style="margin-left: 4px">
                <label>{{localization.get('#UI_SCRIPT_COMMAND')}}</label>
                <md-input v-model="bind.command" readonly></md-input>
              </md-field>
            </div>
          </div>
          <video v-if="selected.video" :src="video" width autoplay loop></video>
        </md-dialog-content>
      </md-dialog>
    </div>
  </div>
</template>

<script>
import electron from "electron";
import Store from "../utils/Store.js";
import StoreDefaults from "../utils/StoreDefaults.js";
import localization from "@/utils/Language.js";

const gamesPath = require("path").join(
  (electron.app || electron.remote.app).getPath("userData"),
  "library",
  "Half-Life"
);

const store = new Store({
  configName: "scripts",
  defaults: StoreDefaults.scripts,
});

const local = new localization();
export default {
  name: "config-constructor",
  data: () => ({
    localization: local,
    selected: {},
    detailsOpen: false,
    scripts: {},
  }),
  computed: {
    video() {
      if (this.selected.video)
        return require("@/assets/" + this.selected.video);
    },
  },
  methods: {
    itemClick: (e) => {
      console.log(e.currentTarget);
    },
    checkInstalled(appid) {
      const library = new Store({
        configName: "library",
        defaults: StoreDefaults.library,
      });

      let installed = library.get("installed");
      return Object.keys(installed).indexOf(appid) >= 0;
    },
    compile() {
      let scriptedSelected = this.scripts.scripted.filter((x) => {
        return x.selected;
      });
      let scriptlessSelected = this.scripts.scriptless.filter((x) => {
        return x.selected;
      });
      let all = scriptedSelected.concat(scriptlessSelected);

      let output = `echo "HLSR BETA"`;
      all.forEach((script) => {
        output += "\n//" + script.name + "\n";

        if (script.commands) {
          output += "\n";
          output += script.commands.join("\n");
        }

        output += "\n";

        if (script.aliases) {
          script.aliases.forEach((alias) => {
            output += `alias "${alias.name}" "${alias.command}"\n`;
          });
        }

        if (script.binds) {
          script.binds.forEach((bind) => {
            output += `bind "${bind.key}" "${bind.command}"\n`;
          });
        }
      });

      return output;
    },
    save() {
      var ctx = this;
      var fs = require("fs");
      var path = require("path");
      var data = this.compile();

      if (fs.existsSync(gamesPath)) {
        var paths = [
          path.join(gamesPath, "valve", "hlsr.cfg"),
          path.join(gamesPath, "valve_WON", "hlsr.cfg"),
          path.join(gamesPath, "bshift", "hlsr.cfg"),
          path.join(gamesPath, "gearbox", "hlsr.cfg"),
          path.join(gamesPath, "gearbox_WON", "hlsr.cfg"),
        ];

        paths.forEach((cfg) => {
          if (fs.existsSync(cfg)) fs.writeFileSync(cfg, data);
        });
        store.set("data", ctx.scripts);
      }
    },
    saveToFile() {
      var ctx = this;
      var fs = require("fs");
      var dialog = require("electron").remote.dialog;
      var data = this.compile();

      dialog
        .showSaveDialog({
          filters: [{ name: "Configs", extensions: ["cfg"] }],
        })
        .then((file) => {
          if (file.filePath) {
            fs.writeFileSync(file.filePath, data);
            store.set("data", ctx.scripts);
          }
        });
    },
  },
  mounted() {
    this.scripts = store.get("data");
  },
};
</script>

<style>
.md-list-item.md-inset .md-list-item-content {
  padding-left: 36px;
}
.inline {
  display: flex;
}
video {
  width: 100%;
}
</style>