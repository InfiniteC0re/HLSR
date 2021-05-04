<template>
  <div id="wrap">
    <div id="form">
      <div class="title">{{ localization.get("#UI_CONFIGS_ADVANCED") }}</div>
      <div class="toolbar">
        <div class="menubutton" @click="openFile">
          {{ localization.get("#UI_EDITOR_OPEN") }}
          <md-tooltip>CTRL-O</md-tooltip>
        </div>
        <div class="menubutton" @click="saveFile">
          {{ localization.get("#UI_EDITOR_SAVE") }}
          <md-tooltip>CTRL-S</md-tooltip>
        </div>
        <div class="menubutton" @click="hints">
          {{ localization.get("#UI_EDITOR_HINTS") }}
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
import { codemirror } from "vue-codemirror";
import "@/utils/hlscripts/hlscripts.js";

import fs from "fs";
import { remote } from "electron";

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
      const libraryPath = require("path").join(
        require("electron").remote.app.getPath("userData"),
        "library"
      );

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
      if (this.filePath) {
        fs.writeFileSync(this.filePath, this.code);

        // Send a notification
        this.$store.commit("createNotification", {
          text: this.localization.get("#UI_NOTIFICATION_SAVED"),
        });
      }
    },
    hints() {
      console.log(this.cm)
      this.cm.showHint({ completeSingle: false });
    },
  },
  data() {
    return {
      localization: this.$parent.localization,
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