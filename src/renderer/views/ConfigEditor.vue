<template>
  <div id="wrap">
    <div id="form">
      <div class="title">{{ $localisation.get("#UI_CONFIGS_ADVANCED") }}</div>
      <div class="toolbar">
        <div class="menubutton" @click="openFile">
          {{ $localisation.get("#UI_EDITOR_OPEN") }}
          <md-tooltip>CTRL-O</md-tooltip>
        </div>
        <div class="menubutton" @click="saveFile">
          {{ $localisation.get("#UI_EDITOR_SAVE") }}
          <md-tooltip>CTRL-S</md-tooltip>
        </div>
        <div class="menubutton" @click="hints">
          {{ $localisation.get("#UI_EDITOR_HINTS") }}
          <md-tooltip>CTRL-Space</md-tooltip>
        </div>
        <div style="margin-left: auto; margin-right: 10px">{{ fileName }}</div>
      </div>
      <codemirror
        v-model="code"
        @ready="onCmReady"
        :options="cmOption"
        style="flex: 1; overflow: auto"
      />
    </div>
  </div>
</template>

<script>
const remote = require("@electron/remote");
import fs from "fs";
import "@/scripts/hlscripts.js";
import Store from "@/scripts/Store.js";
import StoreDefaults from "@/scripts/StoreDefaults.js";
import GameControl from "@/scripts/GameControl";
import { codemirror } from "vue-codemirror";

const library = new Store({
  configName: "library",
  defaults: StoreDefaults.library,
});

export default {
  name: "advanced-configs",
  components: {
    codemirror,
  },
  methods: {
    onCmReady(cm) {
      this.cm = cm;
    },
    openFile() {
      const libraryPath = GameControl.getLibraryPath(library);

      remote.dialog
        .showOpenDialog({
          defaultPath: libraryPath,
          properties: ["openFile"],
          filters: [{ name: "Configs", extensions: ["cfg"] }],
        })
        .then((event) => {
          if (event.filePaths.length > 0) {
            this.filePath = event.filePaths[0];
            this.fileName = this.filePath.split("\\").reverse()[0];
            this.code = fs.readFileSync(this.filePath).toString();
          }
        });
    },
    saveFile() {
      if (!this.filePath) {
        let filePath = remote.dialog.showSaveDialogSync({
          filters: [
            { name: "Config", extensions: ["cfg"] },
            { name: "All Files", extensions: ["*"] },
          ],
        });

        if (filePath) this.filePath = filePath;
        else return;
      }

      this.fileName = this.filePath.split("\\").reverse()[0];
      fs.writeFileSync(this.filePath, this.code);

      // Send a notification
      this.$store.commit("createNotification", {
        text: this.$localisation.get("#UI_NOTIFICATION_SAVED"),
      });
    },
    hints() {
      this.cm.showHint({ completeSingle: false });
    },
  },
  data() {
    return {
      cm: null,
      code: "",
      fileName: "",
      filePath: "",
      cmOption: {
        tabSize: 4,
        styleActiveLine: false,
        lineNumbers: true,
        lineWrapping: true,
        styleSelectedText: false,
        line: true,
        foldGutter: true,
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
        mode: "hlscripts",
        matchBrackets: true,
        showCursorWhenSelecting: true,
        theme: "dracula",
        extraKeys: {
          "Ctrl-Space": "autocomplete",
          "Ctrl-S": () => {
            this.saveFile();
          },
          "Ctrl-O": () => {
            this.openFile();
          },
        },
      },
    };
  },
  mounted() {
    this.filePath = this.$store.state.scriptEditor.filePath;
    this.fileName = this.$store.state.scriptEditor.fileName;
    this.code = this.$store.state.scriptEditor.content;
  },
  beforeDestroy() {
    this.$store.state.scriptEditor.filePath = this.filePath;
    this.$store.state.scriptEditor.fileName = this.fileName;
    this.$store.state.scriptEditor.content = this.code;
  },
};
</script>

<style>
#form {
  overflow: hidden;
}

.CodeMirror {
  height: 100%;
}
</style>