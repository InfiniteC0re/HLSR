<template>
  <div id="wrap">
    <div id="form">
      <div class="title">
        {{ $t("#UI_CONFIGS_CONSTRUCTOR") }}
        <div style="flex: 1; margin: 0px 32px; margin-right: 100px">
          <md-field>
            <label for="games">Game</label>
            <md-select
              v-model="game"
              name="games"
              id="games"
              @md-selected="onGameSelect"
            >
              <md-option value="hl">Half-Life</md-option>
              <md-option value="hlof">Half-Life: Opposing Force</md-option>
              <md-option value="hlbs">Half-Life: Blue Shift</md-option>
            </md-select>
          </md-field>
        </div>
        <md-badge :md-content="needsUpdate" md-dense style="margin-left: auto">
          <md-button
            @click.stop="updateScripts"
            class="md-icon-button md-accent"
          >
            <md-icon class="fal fa-glass-citrus"></md-icon>
            <md-tooltip>{{ $t("#UI_SCRIPT_UPDATE") }}</md-tooltip>
          </md-button>
        </md-badge>
      </div>
      <div class="constructor__configs">
        <ScriptList
          :list="scripts.scriptless"
          :title="$t('#UI_SCRIPT_SCRIPTLESS')"
          :scriptless="true"
          @select="onScriptSelect"
        />
        <ScriptList
          :list="scripts.scripted"
          :title="$t('#UI_SCRIPT_SCRIPTED')"
          :scriptless="false"
          @select="onScriptSelect"
        />
      </div>
      <div class="constructor__buttons">
        <ButtonAlt @click="save" :disabled="!installed">
          <p>{{ $t("#UI_SCRIPT_GENERATE") }}</p>
          <i class="fas fa-save"></i>
        </ButtonAlt>
        <ButtonAlt @click="saveToFile" :red="true">
          <p>{{ $t("#UI_SCRIPT_SAVE") }}</p>
          <i class="fas fa-file-alt"></i>
        </ButtonAlt>
      </div>

      <!-- Диалоговое окно  -->

      <md-dialog :md-active.sync="detailsOpen" :mdClickOutsideToClose="true">
        <md-dialog-title
          v-html="$t('#UI_SCRIPT_SETTINGS', selected.name)"
        ></md-dialog-title>
        <md-dialog-content v-if="selected">
          <span style="opacity: 0.2; margin-bottom: 12px; display: flex">{{
            $t("#UI_SCRIPT_BINDS")
          }}</span>
          <div class="binds">
            <div class="inline" v-for="bind in selected.binds" :key="bind._id">
              <md-field style="margin-right: 4px">
                <label>{{ $t("#UI_SCRIPT_KEY") }}</label>
                <md-input v-model="bind.key"></md-input>
              </md-field>
              <md-field style="margin-left: 4px">
                <label>{{ $t("#UI_SCRIPT_COMMAND") }}</label>
                <md-input v-model="bind.command" readonly></md-input>
              </md-field>
            </div>
          </div>
          <video
            v-if="selected.video"
            style="margin-top: 16px"
            :src="video"
            width
            autoplay
            loop
          ></video>
          <div v-if="selected.author" style="margin-top: 10px; opacity: 0.4">
            Author: {{ selected.author }}
          </div>
        </md-dialog-content>
      </md-dialog>
    </div>
  </div>
</template>

<script>
const remote = require("@electron/remote");
import ButtonAlt from "@/components/Elements/Button";
import Store from "@/utils/Store.js";
import StoreDefaults from "@/utils/StoreDefaults.js";
import GameControl from "@/utils/GameControl";
import ScriptList from "@/components/ConfigConstructor/ScriptList.vue";

const store = new Store({
  configName: "scripts",
  defaults: StoreDefaults.scripts,
});

const library = new Store({
  configName: "library",
  defaults: StoreDefaults.library,
});

export default {
  name: "config-constructor",
  components: {
    ButtonAlt,
    ScriptList,
  },
  data() {
    return {
      selected: {},
      detailsOpen: false,
      scripts: {},
      needsUpdate: 0,
      game: "hl",
      library,
      GameControl,
      installed: false,
    };
  },
  computed: {
    video() {
      if (this.selected.video)
        return require("@/assets/scripts/" + this.selected.video);
    },
  },
  methods: {
    checkScriptsUpdated() {
      this.updateScriptsData();
      let defaultScripts = JSON.parse(
        JSON.stringify(
          StoreDefaults.scripts.data.db[
            StoreDefaults.scripts.data.games[this.game].db
          ]
        )
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

      this.needsUpdate =
        JSON.stringify(defaultScripts) != JSON.stringify(currentScripts)
          ? 1
          : 0;
    },
    updateScripts() {
      let settingsData = StoreDefaults.scripts.data;
      let game = settingsData.games[this.game];

      game.store = settingsData.db[game.db];
      store.set("data", settingsData);

      this.checkScriptsUpdated();
    },
    generate() {
      let scriptedSelected = this.scripts.scripted.filter((x) => x.selected);
      let scriptlessSelected = this.scripts.scriptless.filter(
        (x) => x.selected
      );

      let selected = scriptedSelected.concat(scriptlessSelected);

      let output = `echo "This config was generated with HLSR"`;
      selected.forEach((script) => {
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
      var fs = require("fs");
      var path = require("path");
      var data = this.generate();

      const gamesPath = path.join(
        GameControl.getLibraryPath(library),
        "Half-Life"
      );

      if (fs.existsSync(gamesPath)) {
        let dirs = [];

        switch (this.game) {
          case "hl":
            dirs = ["valve", "valve_WON"];
            break;
          case "hlof":
            dirs = ["gearbox", "gearbox_WON"];
            break;
          case "hlbs":
            dirs = ["bshift"];
            break;
        }

        let patchDirs = dirs.map((dir) =>
          path.join(gamesPath, dir, "hlsr.cfg")
        );

        patchDirs.forEach((cfgPath) => {
          if (fs.existsSync(path.dirname(cfgPath)))
            fs.writeFileSync(cfgPath, data);
        });

        this.saveDB();
      }
    },
    saveToFile() {
      var fs = require("fs");
      var data = this.generate();

      remote.dialog
        .showSaveDialog({
          filters: [{ name: "Config File", extensions: ["cfg"] }],
        })
        .then((file) => {
          if (file.filePath) {
            fs.writeFileSync(file.filePath, data);

            this.saveDB();
          }
        });
    },
    saveDB() {
      let settingsData = store.get("data");
      settingsData.games[this.game].store = this.scripts;
      store.set("data", settingsData);

      // Send a notification
      this.$store.commit("createNotification", {
        text: this.$t("#UI_NOTIFICATION_SAVED"),
      });
    },
    updateScriptsData() {
      let data = store.get("data");
      this.scripts = data.games[this.game].store;

      if (Object.keys(this.scripts).length == 0) {
        this.scripts = data.db[data.games[this.game].db];
      }
    },
    onGameSelect() {
      this.checkScriptsUpdated();
    },
    onScriptSelect(script) {
      if (script.binds) {
        this.selected = script;
        this.detailsOpen = true;
      }
    },
  },
  mounted() {
    this.checkScriptsUpdated();
    this.installed = GameControl.checkInstalled(library, "70");
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

.md-subheader {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.md-dialog-container {
  width: 680px;
}
</style>
