<template>
  <div id="wrap">
    <div class="title">
      {{ $t("#UI_CONFIGURATOR") }}
    </div>
    <div class="settings-panel" v-if="id != 220 && id != 130">
      <div class="section">
        {{ $t("#UI_GAME_VERSION") }}
      </div>
      <div class="container">
        <div class="steam-won-select" v-if="id != 130 && id != 218">
          <md-radio v-model="version" @change="saveChoice" value="Steam"
            >Steam</md-radio
          >
          <md-radio v-model="version" @change="saveChoice" value="WON"
            >WON</md-radio
          >
        </div>
        <!-- <md-switch
          v-model="edited_dll"
          @change="saveChoice"
          class="md-primary"
          :disabled="version == 'Steam'"
          v-if="id == '70'"
          >{{ $t("#UI_EDITED_DLL") }}
        </md-switch> -->
        <md-switch
          v-model="hl1movement"
          @change="saveChoice"
          class="md-primary"
          v-else-if="id == '218'"
          >{{ $t("#UI_HL1MOVEMENT") }}
        </md-switch>
      </div>
    </div>
    <div class="settings-panel" style="flex: 1">
      <div class="section">{{ $t("#UI_EXTERNAL_TOOLS") }}</div>
      <div class="flex">
        <div>
          <div class="container" v-if="!disableBXT">
            <md-checkbox
              v-model="bxt"
              @change="saveChoice"
              class="md-primary"
              :disabled="disableBXT"
              >Bunnymod XT</md-checkbox
            >
          </div>
          <div class="container">
            <md-checkbox
              v-model="livesplit"
              @change="saveChoice"
              class="md-primary"
              >LiveSplit</md-checkbox
            >
          </div>
          <div class="container">
            <md-checkbox
              v-model="rinput"
              @change="saveChoice"
              class="md-primary"
              >RInput</md-checkbox
            >
          </div>
        </div>
        <div style="margin-left: auto; margin-right: 32px; width: 280px">
          <div class="container">
            <md-checkbox v-model="allcores" @change="saveChoice">{{
              $t("#UI_GAME_ALLCORES")
            }}</md-checkbox>
          </div>
          <div class="container" v-if="!allcores">
            <div style="display: grid; grid-template-columns: 1fr 1fr">
              <md-radio v-model="corescount" value="1">{{
                $t("#UI_GAME_PRIORITY_1C")
              }}</md-radio>
              <md-radio v-model="corescount" value="2">{{
                $t("#UI_GAME_PRIORITY_2C")
              }}</md-radio>
              <md-radio v-model="corescount" value="3">{{
                $t("#UI_GAME_PRIORITY_3C")
              }}</md-radio>
              <md-radio v-model="corescount" value="4">{{
                $t("#UI_GAME_PRIORITY_4C")
              }}</md-radio>
            </div>
          </div>
        </div>
      </div>
      <div
        class="container"
        style="
          width: 100%;
          display: grid;
          grid-template-columns: 0.15fr 1fr;
          grid-gap: 8px;
          margin-top: auto;
        "
      >
        <md-field>
          <label for="priorities">{{ $t("#UI_GAME_PRIORITY") }}</label>
          <md-select
            @md-selected="saveChoice"
            v-model="priority"
            name="priorities"
            id="priorities"
          >
            <md-option value="normal">{{
              $t("#UI_GAME_PRIORITY_NORMAL")
            }}</md-option>
            <md-option value="abovenormal">{{
              $t("#UI_GAME_PRIORITY_ABOVENORMAL")
            }}</md-option>
            <md-option value="high">{{
              $t("#UI_GAME_PRIORITY_HIGH")
            }}</md-option>
            <md-option value="realtime">{{
              $t("#UI_GAME_PRIORITY_REALTIME")
            }}</md-option>
          </md-select>
        </md-field>
        <md-field>
          <label>{{ $t("#UI_START_ARGS") }}</label>
          <md-input v-model="args"></md-input>
        </md-field>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import Store from "@/utils/Store";
import StoreDefaults from "@/utils/StoreDefaults";

const store = new Store({
  configName: "library",
  defaults: StoreDefaults.library,
});

export default {
  name: "gamemenu-configurator",
  components: {},
  data() {
    return {
      bxt: false,
      livesplit: false,
      rinput: false,
      edited_dll: false,
      allcores: false,
      hl1movement: false,
      version: "Steam",
      args: "",
      priority: "normal",
      corescount: "1",
      disableBXT: false,
    };
  },
  props: {
    id: {
      type: String,
      default: "no id specified",
    },
  },
  mounted() {
    let config = store.get("config")[this.id] || {};
    this.bxt = config.bxt;
    this.livesplit = config.livesplit;
    this.rinput = config.rinput;
    this.allcores = config.allcores;
    if (config.steam) this.version = "Steam";
    else if (this.id != "130") this.version = "WON";
    if (!config.steam && config.edited_dll && this.id == "70")
      this.edited_dll = !config.edited_dll;
    this.args = config.args;
    this.priority = config.priority || "normal";
    this.corescount = config.corescount || "1";

    if (this.id == "218") this.hl1movement = config.hl1movement || false;

    if (this.id == "220" || this.id == "218") this.disableBXT = true;
    if (this.id == "220" || this.id == "218" || this.id == "130")
      this.version = "Steam";
  },
  watch: {
    args: function (newArgs, oldArgs) {
      this.saveChoice();
    },
    corescount: function (newArgs, oldArgs) {
      this.saveChoice();
    },
  },
  methods: {
    saveChoice() {
      if (this.version == "Steam") this.edited_dll = false;
      let config = store.get("config");
      if (!config[this.id]) config[this.id] = {};

      config[this.id].bxt = this.bxt;
      config[this.id].livesplit = this.livesplit;
      config[this.id].rinput = this.rinput;
      if (this.version == "Steam") config[this.id].steam = true;
      else config[this.id].steam = false;
      config[this.id].edited_dll = this.edited_dll;
      config[this.id].args = this.args;
      config[this.id].allcores = this.allcores;
      config[this.id].priority = this.priority;
      config[this.id].corescount = this.corescount;

      if (this.id == "218") config[this.id].hl1movement = this.hl1movement;

      store.set("config", config);
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  color: var(--accent-color) !important;
  font-size: 20px !important;
  font-weight: bold !important;
  margin-left: 16px !important;
}
.section {
  margin-left: 16px;
  color: rgb(150, 150, 150);
}
.container {
  margin-bottom: 0px;
  padding: 0 16px;
}
div#wrap {
  color: white;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.flex {
  display: flex;
}

.md-disabled {
  color: gray;
}

.settings-panel {
  display: flex;
  flex-direction: column;

  &:nth-child(2) {
    margin-top: 16px;
  }
}
</style>
