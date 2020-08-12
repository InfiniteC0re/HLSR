<template>
  <div id="wrap">
    <div id="form">
      <div class="title">{{localization.get('#UI_CONFIGS_ADVANCED')}}</div>
      <div class="toolbar">
        <div class="menubutton" @click="openFile">
          {{localization.get('#UI_EDITOR_OPEN')}}
          <md-tooltip>CTRL-O</md-tooltip>
        </div>
        <div class="menubutton">
          {{localization.get('#UI_EDITOR_SAVE')}}
          <md-tooltip>CTRL-S</md-tooltip>
        </div>
        <div class="menubutton" @click="hints">
          {{localization.get('#UI_EDITOR_HINTS')}}
          <md-tooltip>CTRL-Space</md-tooltip>
        </div>
        <div style="margin-left:auto;margin-right:10px">{{fileName}}</div>
      </div>
      <codemirror v-model="code" @ready="onCmReady" :options="cmOption" style="height:100%;max-height: 585px;max-width: 836px;" />
    </div>
  </div>
</template>

<script>
import { codemirror } from "vue-codemirror";

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
      remote.dialog
        .showOpenDialog({
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
      }
    },
    hints() {
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
            console.log(this);
            this.openFile();
          },
        },
      },
    };
  },
};
</script>

<style>
.CodeMirror {
  height: 100%;
}
</style>