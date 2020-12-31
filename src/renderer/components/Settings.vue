<template>
  <div id="wrap">
    <div id="form">
      <div class="title">{{ localization.get("#UI_SETTINGS") }}</div>
      <div class="section basictext">
        {{ localization.get("#UI_INTERFACE_SETTINGS") }}
      </div>
      <dropdown
        v-model="language"
        :text="localization.get('#UI_INTERFACE_LANGUAGE')"
        @change="saveChoice"
        :items="languages"
      />
      <dropdown
        v-model="theme"
        :text="localization.get('#UI_INTERFACE_THEME')"
        @change="themeChange"
        :items="themes"
      />
      <div class="section basictext">
        {{ localization.get("#UI_MISC_SETTINGS") }}
      </div>
      <checkbox
        v-model="rpc"
        @change="saveChoice"
        :text="localization.get('#UI_DISCORD_RPC_SETTINGS')"
      />
      <checkbox
        v-model="noParticles"
        @change="saveChoice"
        :text="localization.get('#UI_NO_PARTICLES')"
      />
      <div class="social">
        <div class="social-button" @click="openDiscord">
          <i class="fab fa-discord"></i>
        </div>
        <div class="social-button" @click="openDialog">
          <i class="fal fa-question-circle"></i>
        </div>
      </div>
      <!-- <checkbox v-model="experimental" @change="saveChoice" :text="localization.get('#UI_EXPERIMENTAL_MODE_SETTINGS')"/> -->

      <!-- Диалоговое окно  -->

      <md-dialog :md-active.sync="dialogOpen" :mdClickOutsideToClose="true">
        <md-dialog-title
          v-html="localization.get('#UI_ABOUT_TITLE')"
        ></md-dialog-title>
        <md-dialog-content style="display: flex; user-select: text">
          <div
            class="left-block"
            v-html="localization.get('#UI_ABOUT_CONTENT')"
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
import checkbox from "./Elements/Checkbox";
import dropdown from "./Elements/Dropdown";
import Store from "../utils/Store.js";
import StoreDefaults from "../utils/StoreDefaults.js";

const store = new Store({
  configName: "settings",
  defaults: StoreDefaults.settings,
});

export default {
  name: "settings-page",
  components: { checkbox, dropdown },
  data() {
    return {
      languages: [],
      themes: [],
      language: 0,
      theme: 0,
      rpc: true,
      noParticles: false,
      experimental: false,
      localization: this.$parent.localization,
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
      let shell = require("electron").remote.shell;
      shell.openExternal("https://discord.gg/3TN2yyJKE2");
    },
    openDialog() {
      this.dialogOpen = true;
    },
    updateLocale() {
      this.languages = [
        this.$parent.localization.get("#UI_ENGLISH"),
        this.$parent.localization.get("#UI_RUSSIAN"),
      ];

      this.themes = [
        this.$parent.localization.get("#UI_GRADIENT_THEME"),
        this.$parent.localization.get("#UI_BLUE_THEME"),
        this.$parent.localization.get("#UI_RED_THEME"),
        this.$parent.localization.get("#UI_SNOW_THEME"),
      ];
    },
    themeChange() {
      if (this.$parent.lancerMode) return;
      this.saveChoice();
      this.$parent.$refs.theme.updateTheme();
    },
    saveChoice() {
      let config = store.get("config");
      let langChanged = config.language != this.language;

      config.language = this.language;
      if (!this.$parent.lancerMode) config.theme = this.theme;
      config.rpc = this.rpc;
      config.experimental = this.experimental;
      config.noParticles = this.noParticles;
      store.set("config", config);

      if (langChanged) {
        this.localization.update();
        this.$parent.$refs.navbar.$forceUpdate(); // Обновить панель навигации

        this.updateLocale();
      }

      this.$store.commit("setParticlesState", config.noParticles);
    },
    pink() {
      document.body.style.filter = "hue-rotate(45deg)";
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

.social {
  color: rgba(255, 255, 255, 0.3);
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
  font-size: 24px;
  padding: 16px;
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