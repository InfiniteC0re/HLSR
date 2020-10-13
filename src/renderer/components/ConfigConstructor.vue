<template>
  <div id="wrap">
    <div id="form">
      <div class="title">
        {{localization.get('#UI_CONFIGS_CONSTRUCTOR')}}
        <div style="flex: 1;margin: 0px 32px;margin-right: 100px;">
          <md-field>
            <label for="movie">Game</label>
            <md-select v-model="game" name="games" id="games" @md-selected="onGameSelect">
              <md-option value="hl">Half-Life</md-option>
              <md-option value="hlof">Half-Life: Opposing Force</md-option>
              <md-option value="hlbs">Half-Life: Blue Shift</md-option>
            </md-select>
          </md-field>
        </div>
        <md-badge :md-content="needsUpdate" md-dense style="margin-left: auto">
          <md-button @click.stop="updateScripts" class="md-icon-button md-accent">
            <md-icon class="fal fa-glass-citrus"></md-icon>
            <md-tooltip>{{localization.get('#UI_SCRIPT_UPDATE')}}</md-tooltip>
          </md-button>
        </md-badge>
      </div>
      <div class="constructor__configs">
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
      <div class="constructor__buttons">
        <md-button
          class="md-accent md-raised"
          @click="save"
          :disabled="!checkInstalled('70')"
        >{{localization.get('#UI_SCRIPT_GENERATE')}}</md-button>
        <md-button
          class="md-primary md-raised"
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
          <div v-if="selected.author" style="margin-top: 10px;opacity: 0.4">{{selected.author}}</div>
        </md-dialog-content>
      </md-dialog>
    </div>
  </div>
</template>

<script>
import electron from "electron";
import Store from "../utils/Store.js";
import StoreDefaults from "../utils/StoreDefaults.js";

const gamesPath = require("path").join(
  (electron.app || electron.remote.app).getPath("userData"),
  "library",
  "Half-Life"
);

const store = new Store({
  configName: "scripts",
  defaults: StoreDefaults.scripts,
});

export default {
  name: "config-constructor",
  data() {
    return {
      localization: this.$parent.localization,
      selected: {},
      detailsOpen: false,
      scripts: {},
      needsUpdate: 0,
      game: 'hl'
    };
  },
  computed: {
    video() {
      if (this.selected.video)
        return require("@/assets/scripts/" + this.selected.video);
    },
  },
  methods: {
    needUpdate() {
      this.updateScriptsData();
      let defaultScripts = JSON.parse(
        JSON.stringify(StoreDefaults.scripts.data.db[StoreDefaults.scripts.data.games[this.game].db])
      );
      let currentScripts = JSON.parse(JSON.stringify(this.scripts));

      function removeIndeed(section) {
        for (let i = 0; i < defaultScripts[section].length; i++) {
          delete defaultScripts[section][i].selected;
          delete defaultScripts[section][i].binds;
        }
        for (let i = 0; i < currentScripts[section].length; i++) {
          delete currentScripts[section][i].selected;
          delete currentScripts[section][i].binds;
        }
      }

      removeIndeed("scriptless");
      removeIndeed("scripted");
      if (JSON.stringify(defaultScripts) != JSON.stringify(currentScripts))
        return 1;
      else return 0;
    },
    itemClick: (e) => {
      console.log(e.currentTarget);
    },
    updateScripts() {
      let settingsData = StoreDefaults.scripts.data;
      settingsData.games[this.game].store = settingsData.db[settingsData.games[this.game].db];
      store.set("data", settingsData);

      this.needsUpdate = this.needUpdate();
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
        var paths = [];

        if(this.game == "hl") {
          paths.push(path.join(gamesPath, "valve", "hlsr.cfg"));
          paths.push(path.join(gamesPath, "valve_WON", "hlsr.cfg"));
        }else if(this.game == "hlof") {
          paths.push(path.join(gamesPath, "gearbox", "hlsr.cfg"));
          paths.push(path.join(gamesPath, "gearbox_WON", "hlsr.cfg"));
        }else if(this.game == "hlbs") {
          paths.push(path.join(gamesPath, "bshift", "hlsr.cfg"));
        }

        paths.forEach((cfg) => {
          let gamePath = cfg.split("\\");
          gamePath.splice(-1);

          if (fs.existsSync(gamePath.join("\\"))) fs.writeFileSync(cfg, data);
        });

        let settingsData = store.get("data");
        settingsData.games[this.game].store = ctx.scripts;
        store.set("data", settingsData);
      }
    },
    saveToFile() {
      var ctx = this;
      var fs = require("fs");
      var dialog = require("electron").remote.dialog;
      var data = this.compile();

      dialog
        .showSaveDialog({
          filters: [{ name: "Config File", extensions: ["cfg"] }],
        })
        .then((file) => {
          if (file.filePath) {
            fs.writeFileSync(file.filePath, data);

            let settingsData = store.get("data");
            settingsData.games[this.game].store = ctx.scripts;
            store.set("data", settingsData);
          }
        });
    },
    updateScriptsData() {
      let data = store.get("data");
      let db = data.db;

      this.scripts = data.games[this.game].store;
    
      if(Object.keys(this.scripts).length == 0) {
        this.scripts = data.db[data.games[this.game].db];
      }
    },
    onGameSelect() {
      this.needsUpdate = this.needUpdate();
      console.log(this.game)
    }
  },
  mounted() {
    this.needsUpdate = this.needUpdate();
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
.constructor__configs {
  margin-top: 16px;
  background: rgba(0, 0, 0, 0.16);
  height: 100%;
  overflow: auto;
  border-radius: 4px;
}
.constructor__buttons {
  display: grid;
  grid-template-rows: 1fr;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  grid-gap: 16px;
  margin-top: 16px;
}
.constructor__buttons > button {
  margin: 0;
  height: 48px;
}

.md-field {
  margin: 4px 0 6px;
}
</style>