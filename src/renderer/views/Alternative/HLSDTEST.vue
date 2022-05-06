<template>
  <div id="wrap">
    <div id="form">
      <div class="title">{{ $t("#DEBUG_HLSD") }}</div>
      <input type="file" @change="fileSelected" />
      <div class="info-table">
        <div class="cell">
          <h3 style="margin-bottom: 8px">Информация о файле</h3>
          <div class="entry">
            <div class="name">{{ $t("#HLSD_NAME") }}</div>
            <div class="value">{{ hlsc.name ? hlsc.name : "Значение" }}</div>
          </div>
          <div class="entry">
            <div class="name">{{ $t("#HLSD_DESC") }}</div>
            <div class="value">
              {{ hlsc.description ? hlsc.description : "Значение" }}
            </div>
          </div>
          <div class="entry">
            <div class="name">{{ $t("#HLSD_AUTHOR") }}</div>
            <div class="value">
              {{ hlsc.author ? hlsc.author : "Значение" }}
            </div>
          </div>
          <div class="entry">
            <div class="name">{{ $t("#HLSD_GAME") }}</div>
            <div class="value">{{ hlsc.game ? hlsc.game : "Значение" }}</div>
          </div>
          <div class="entry">
            <div class="name">{{ $t("#HLSD_SCRIPTLESS") }}</div>
            <div class="value">
              {{ hlsc.scriptless ? hlsc.scriptless : "Значение" }}
            </div>
          </div>
          <div class="entry">
            <div class="name">{{ $t("#HLSD_DATA_LEN") }}</div>
            <div class="value">
              {{ hlsc.scriptJSON ? hlsc.scriptJSON.length : "Значение" }}
            </div>
          </div>
        </div>
        <div class="cell">
          <video
            :src="url"
            v-for="url in videoFiles"
            v-bind:key="url._id"
            controls
          ></video>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import hlsd from "hlsr-hlsd/index";

export default {
  data() {
    return {
      hlsd: {},
      hlsc: {},
    };
  },
  methods: {
    fileSelected(e) {
      let files = e.target.files;

      if (files.length >= 1) {
        try {
          hlsd.handleFile(files[0].path).then((file) => {
            this.hlsd = file.hlsd;
            this.hlsc = file;
          });
        } catch (e) {}
      }
    },
  },
  computed: {
    videoFiles() {
      let urls = [];

      if (!this.hlsc.filesMeta) return [];
      let videoFiles = this.hlsc.filesMeta.list.filter(
        (x) => x.type == hlsd.HLSD_FILETYPE.VIDEO
      );

      videoFiles.map((file) => {
        let blob = new Blob([file.data], {
          type: "video/webm",
        });

        let url = URL.createObjectURL(blob);

        urls.push(url);
      });

      return urls;
    },
  },
};
</script>

<style lang="scss" scoped>
#form {
  .title {
    margin-bottom: 16px !important;
  }

  .info-table {
    margin-top: 16px;
    display: grid;
    grid-template-columns: 0.65fr 1fr;
    grid-gap: 8px;
    flex: 1;
    color: #fff;
    overflow: hidden;

    .cell {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
      padding: 12px 8px;
      overflow: auto;

      .entry {
        line-height: 16px;
        margin-bottom: 8px;
        font-weight: 100;
        font-family: "Roboto";

        .name {
          opacity: 0.4;
          font-size: 0.73rem;
        }

        .value {
          margin-left: 8px;
          opacity: 0.5;
          font-size: 0.85rem;
        }
      }
    }
  }
}
</style>