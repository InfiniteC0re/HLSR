<template>
  <div id="wrap">
    <div class="title">
      {{ localization.get("#UI_CONFIGURATOR") }}
    </div>
    <div class="section" style="margin-top: 16px">
      {{ localization.get("#UI_GAME_VERSION") }}
    </div>
    <div class="container">
      <md-radio v-model="version" @change="saveChoice" value="Steam"
        >Steam</md-radio
      >
      <md-radio
        v-model="version"
        @change="saveChoice"
        :disabled="id == '130'"
        value="WON"
        >WON</md-radio
      >
    </div>
    <div class="container">
      <md-switch
        v-model="edited_dll"
        @change="saveChoice"
        class="md-primary"
        :disabled="id != '70' || version == 'Steam'"
        >{{ localization.get("#UI_EDITED_DLL") }}</md-switch
      >
    </div>
    <div class="section">{{ localization.get("#UI_EXTERNAL_TOOLS") }}</div>
    <div class="flex">
      <div>
        <div class="container">
          <md-checkbox v-model="bxt" @change="saveChoice" class="md-primary"
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
          <md-checkbox v-model="rinput" @change="saveChoice" class="md-primary"
            >RInput</md-checkbox
          >
        </div>
      </div>
      <div style="margin-left: auto; margin-right: 32px">
        <div class="container">
          <md-checkbox
            v-model="allcores"
            @change="saveChoice"
            >{{ localization.get("#UI_GAME_ALLCORES") }}</md-checkbox
          >
        </div>
        <div class="container" v-if="!allcores">
          <div style="max-width: 200px;display: grid;grid-template-columns: 1fr 1fr;">
            <md-radio v-model="corescount" value="1">1 ядро</md-radio>
            <md-radio v-model="corescount" value="2">2 ядра</md-radio>
            <md-radio v-model="corescount" value="3">3 ядра</md-radio>
            <md-radio v-model="corescount" value="4">4 ядра</md-radio>
          </div>
        </div>
      </div>
    </div>
    <div
      class="container"
      style="
        width: 100%;
        position: absolute;
        bottom: 8px;
        display: grid;
        grid-template-columns: 0.15fr 1fr;
        grid-gap: 8px;
      "
    >
      <md-field>
        <label for="priorities">{{ localization.get("#UI_GAME_PRIORITY") }}</label>
        <md-select @md-selected="saveChoice" v-model="priority" name="priorities" id="priorities">
          <md-option value="normal">{{
            localization.get("#UI_GAME_PRIORITY_NORMAL")
          }}</md-option>
          <md-option value="abovenormal">{{
            localization.get("#UI_GAME_PRIORITY_ABOVENORMAL")
          }}</md-option>
          <md-option value="high">{{
            localization.get("#UI_GAME_PRIORITY_HIGH")
          }}</md-option>
          <md-option value="realtime">{{
            localization.get("#UI_GAME_PRIORITY_REALTIME")
          }}</md-option>
        </md-select>
      </md-field>
      <md-field>
        <label>{{ localization.get("#UI_START_ARGS") }}</label>
        <md-input v-model="args"></md-input>
      </md-field>
    </div>
  </div>
</template>

<script type="text/javascript">
import Store from "../../utils/Store.js";
import StoreDefaults from "../../utils/StoreDefaults.js";

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
      version: "Steam",
      args: "",
      localization: this.$parent.localization,
	  priority: "normal",
	  corescount: "1"
    };
  },
  props: {
    id: {
      type: String,
      default: "no id specified",
    },
  },
  mounted() {
    let config = store.get("config")[this.id];
    this.bxt = config.bxt;
    this.livesplit = config.livesplit;
    this.rinput = config.rinput;
    this.allcores = config.allcores;
    if (config.steam) this.version = "Steam";
    else if (this.id != "130") this.version = "WON";
    if (!config.steam && config.edited_dll && this.id == "70")
      this.edited_dll = true;
    this.args = config.args;
	this.priority = config.priority || "normal";
	this.corescount = config.corescount || "1";
  },
  watch: {
	  args: function(newArgs, oldArgs) {
		  this.saveChoice();
	  },
	  corescount: function(newArgs, oldArgs) {
		  this.saveChoice();
	  }
  },
  methods: {
    coresInput() {
      console.log(parseInt(this.corescount.toString().match(/\d/g).join("")));
      this.corescount = parseInt(
        this.corescount.toString().match(/\d/g).join("")
      );
    },
    saveChoice() {
      if (this.version == "Steam") this.edited_dll = false;
      let config = store.get("config");
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
      store.set("config", config);
    },
  },
};
</script>

<style scoped>
.title {
  color: #00abff !important;
  font-size: 20px !important;
  font-weight: bold !important;
  margin-left: 16px !important;
}
.section {
  margin-left: 16px;
  opacity: 0.2;
}
.container {
  margin-bottom: 0px;
  padding: 0 16px;
}
div#wrap {
  color: white;
}
.flex {
  display: flex;
}
</style>