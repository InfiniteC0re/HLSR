<template>
  <div id="wrap" ref="settings">
    <div id="form">
      <div class="title">{{ $localisation.get("#UI_SETTINGS") }}</div>
      <div id="settings-scroll">
        <div class="section basictext">
          {{ $localisation.get("#UI_INTERFACE_SETTINGS") }}
        </div>
        <Dropdown
          v-model="language"
          :text="$localisation.get('#UI_INTERFACE_LANGUAGE')"
          @change="saveChoice()"
          :items="languages"
        />
        <Dropdown
          v-model="theme"
          :text="$localisation.get('#UI_INTERFACE_THEME')"
          @change="themeChange()"
          :items="themes"
        />
        <div class="section basictext">
          {{ $localisation.get("#UI_MISC_SETTINGS") }}
        </div>
        <Checkbox
          v-model="rpc"
          @change="saveChoice()"
          :text="$localisation.get('#UI_DISCORD_RPC_SETTINGS')"
        />
        <Checkbox
          v-model="noParticles"
          @change="saveChoice()"
          :text="$localisation.get('#UI_NO_PARTICLES')"
        />
      </div>
      <div id="bottom">
        <div class="social">
          <div class="social-button" @click="openDiscord">
            <i class="fab fa-discord"></i>
            <md-tooltip>{{ $localisation.get("#UI_DISCORD") }}</md-tooltip>
          </div>
          <div class="social-button" @click="dialogOpen = true">
            <i class="fal fa-info-circle"></i>
            <md-tooltip>{{ $localisation.get("#UI_ABOUT_PROGRAM") }}</md-tooltip>
          </div>
        </div>
      </div>

      <!-- <checkbox v-model="experimental" @change="saveChoice" :text="$localisation.get('#UI_EXPERIMENTAL_MODE_SETTINGS')"/> -->

      <!-- Диалоговое окно  -->
      <md-dialog :md-active.sync="dialogOpen" :mdClickOutsideToClose="true">
        <md-dialog-title
          v-html="$localisation.get('#UI_ABOUT_TITLE')"
        ></md-dialog-title>
        <md-dialog-content style="display: flex; user-select: text">
          <div
            class="left-block"
            v-html="$localisation.get('#UI_ABOUT_CONTENT')"
          ></div>
          <div class="right-block">
            <img
              :src="require('@/assets/logo.png')"
              draggable="false"
              width="180px"
            />
          </div>
        </md-dialog-content>
      </md-dialog>
    </div>
  </div>
</template>

<script>
const remote = require("@electron/remote");
import Checkbox from "@/components/Elements/Checkbox";
import Dropdown from "@/components/Elements/Dropdown";
import Store from "@/scripts/Store.js";
import StoreDefaults from "@/scripts/StoreDefaults.js";

const store = new Store({
  configName: "settings",
  defaults: StoreDefaults.settings,
});

export default {
  name: "settings-page",
  components: { Checkbox, Dropdown },
  data() {
    return {
      languages: [],
      themes: [],
      language: 0,
      theme: 0,
      rpc: true,
      noParticles: false,
      experimental: false,
      dialogOpen: false,
    };
  },
  mounted() {
    let config = store.get("config");
    this.language = config.language;
    this.theme = config.theme;
    this.rpc = config.rpc;
    this.noParticles = config.noParticles;
    this.experimental = config.experimental;
    this.updateLocale();
  },
  methods: {
    openDiscord() {
      remote.shell.openExternal("https://discord.gg/3TN2yyJKE2");
    },
    updateLocale() {
      this.languages = [
        { name: this.$parent.$localisation.get("#UI_ENGLISH"), id: 0 },
        { name: this.$parent.$localisation.get("#UI_RUSSIAN"), id: 1 },
      ];

      this.themes = [
        { name: this.$parent.$localisation.get("#UI_GRADIENT_THEME"), id: 0 },
        { name: this.$parent.$localisation.get("#UI_BLUE_THEME"), id: 1 },
        { name: this.$parent.$localisation.get("#UI_RED_THEME"), id: 2 },
        // a freelancer theme was here (id 3)
        { name: this.$parent.$localisation.get("#UI_BLOBS_THEME"), id: 4 },
      ];

      if (store.get("config").mlpMode)
        this.themes.push({ name: "My Little Pony", id: 3 });
      else if (store.get("config").theme == 3)
        this.themes.push({ name: "Freelancer", id: 3 });

      // let release = require("os").release().split(".");

      // if (release[0] == "10") {
      //   // 17134 - Windows 10 1803
      //   let acryllicSupported = parseInt(release[2]) >= 17134;
      //   if (acryllicSupported) {
      //     this.themes.push({
      //       name: this.$parent.$localisation.get("#UI_ACRYLLIC_THEME"),
      //       id: 4,
      //     });
      //   }
      // }
    },
    themeChange() {
      if (this.$parent.lancerMode) return;
      this.saveChoice();
      this.$parent.$refs.theme.updateTheme();
    },
    saveChoice(restart = false) {
      let config = store.get("config");
      let langChanged = config.language != this.language;

      config.language = this.language;
      if (!this.$parent.lancerMode) config.theme = this.theme;
      config.rpc = this.rpc;
      config.experimental = this.experimental;
      config.noParticles = this.noParticles;
      store.set("config", config);

      if (langChanged) {
        this.$localisation.update();
        this.$parent.$refs.navbar.$forceUpdate();

        this.updateLocale();
      }

      this.$store.commit("setParticlesState", config.noParticles);

      if (restart && require("process").env.WEBPACK_DEV_SERVER !== "true") {
        let app = remote.app;

        app.relaunch();
        app.quit();
      } else if (restart) {
        // Send a notification
        this.$store.commit("createNotification", {
          text: this.$localisation.get("#RESTART_APP"),
        });
      }
    },
  },
};
</script>

<style scoped>
.section {
  margin-left: 26px;
  margin-top: 16px;
  margin-bottom: 16px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.05em;
}

#settings-scroll {
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex: 1;
  margin-bottom: 32px;
}

#bottom {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.social {
  color: rgba(255, 255, 255, 0.3);
  display: flex;
  font-size: 24px;
}

.social .social-button {
  width: 50px;
  height: 50px;
  margin-left: 8px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
}

.social .social-button:hover {
  background: rgba(0, 0, 0, 0.3);
  color: rgba(255, 255, 255, 0.4);
}

.left-block {
  flex: 1;
}

.right-block {
  flex: 0.8;
  display: flex;
  justify-content: center;
  align-items: center;
}

.right-block img {
  border-radius: 4px;
  filter: drop-shadow(6px 6px rgba(0, 0, 0, 0.2));
}
</style>