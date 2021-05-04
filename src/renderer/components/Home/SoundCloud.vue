<template>
  <div id="widget-wrap">
    <div class="center" v-if="!song.id">
      <md-empty-state
        class="md-accent"
        md-rounded
        :md-description="localization.get('#UI_NO_TRACKS')"
        :md-size="200"
      ></md-empty-state>
    </div>
    <div class="player-info" v-if="song.id">
      <div
        class="artwork"
        :style="getSongArtwork(song)"
        :class="{ pause: !isPaused }"
        @click="widget.toggle()"
      ></div>
      <div class="info">
        <h4>{{ song ? song.title : "" }}</h4>
        <div class="tags">
          <div class="tag">
            {{ song && song.genre ? song.genre : "No tag" }}
          </div>
        </div>
        <div class="progress-wrap">
          <div class="time">
            <div class="left">{{ songPos }}</div>
            <div class="total">
              {{ song ? toHHMMSS(song.duration / 1000) : "00:00" }}
            </div>
          </div>
          <div class="progress" ref="progress" @mousedown="barMouseDown">
            <div class="bar" :style="{ flex: `${barWidth}` }"></div>
          </div>
        </div>
      </div>
      <div class="volume" @click.stop="volumeChange">
        <div class="bar" :style="{ height: `${volume}%` }"></div>
      </div>
    </div>
    <div class="player-songs" v-if="song.id">
      <div
        v-for="val in songsList"
        class="song"
        :class="{ active: val.id == song.id }"
        @click="widget.skip(val.realIndex)"
        :key="val._id"
      >
        <div class="artwork" :style="getSongArtwork(val)"></div>
        <div class="wrap">
          <div class="top">
            <h5 :title="val.title">{{ val.title }}</h5>
            <div class="total">{{ toHHMMSS(val.duration / 1000) }}</div>
          </div>
          <div class="tags">
            <div class="tag">
              {{ val.genre ? val.genre : "No tag" }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      songPos: "00:00",
      barWidth: 0,
      volume: 100,
      updater: null,
      localization: this.$parent.localization,
      bar: {
        pressed: false,
        x: null,
      },
    };
  },
  computed: {
    songsList() {
      return this.$store.state.soundCloud.sounds;
    },
    isPaused() {
      return this.$store.state.soundCloud.isPaused;
    },
    widget() {
      return this.$store.state.soundCloud.widget;
    },
    song() {
      return this.$store.state.soundCloud.currentSound;
    },
  },
  methods: {
    getSongArtwork(song) {
      return {
        backgroundImage:
          song && song.artwork_url ? `url(${song.artwork_url}` : null,
      };
    },
    update() {
      if (this.widget) {
        this.widget.getPosition((pos) => {
          if (!this.bar.pressed) this.barWidth = pos / this.song.duration;
          this.songPos = this.toHHMMSS(pos / 1000);
        });

        this.widget.getVolume((volume) => {
          this.volume = volume;
        });
      }
    },
    volumeChange(e) {
      this.volume =
        ((e.currentTarget.clientHeight - e.offsetY) * 100) /
        e.currentTarget.clientHeight;
      this.widget.setVolume(this.volume);
    },
    toHHMMSS: (secs) => {
      var sec_num = parseInt(secs, 10);
      var hours = Math.floor(sec_num / 3600);
      var minutes = Math.floor(sec_num / 60) % 60;
      var seconds = sec_num % 60;

      return [hours, minutes, seconds]
        .map((v) => (v < 10 ? "0" + v : v))
        .filter((v, i) => v !== "00" || i > 0)
        .join(":");
    },
    barMouseDown(e) {
      this.bar.pressed = true;
      let rect = this.$refs.progress.getBoundingClientRect();
      let posX = e.pageX - rect.x;
      this.bar.x = posX;
    },
    mouseMove(e) {
      if (this.bar.pressed) {
        let rect = this.$refs.progress.getBoundingClientRect();
        let posX = e.pageX - rect.x;

        if (posX < 0) posX = 0;
        else if (posX > rect.width) posX = rect.width;

        this.bar.x = posX;
        this.barWidth = this.bar.x / this.$refs.progress.clientWidth;
      }
    },
    mouseUp() {
      if (this.bar.pressed) {
        this.bar.pressed = false;

        let newPos =
          (this.bar.x / this.$refs.progress.clientWidth) * this.song.duration;
        this.widget.seekTo(newPos);
        this.$store.state.soundCloud.endTimestamp =
          Date.now() + this.song.duration - newPos;
        this.update();
      }
    },
  },
  mounted() {
    this.update();

    this.updater = setInterval(() => {
      this.update();
    }, 1000);

    document.addEventListener("mousemove", this.mouseMove);
    document.addEventListener("mouseup", this.mouseUp);
  },
  beforeDestroy() {
    clearInterval(this.updater);
    document.removeEventListener("mousemove", this.mouseMove);
    document.removeEventListener("mouseup", this.mouseUp);
  },
};
</script>

<style lang="scss" scoped>
#widget-wrap {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .center {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(255, 255, 255, 0.2);
  }
}

.player-songs {
  overflow: auto;

  .song {
    width: 100%;
    padding: 8px;
    padding-left: 12px;
    position: relative;
    background: rgba(255, 255, 255, 0.03);
    display: flex;
    cursor: pointer;
    transition: 0.05s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
    }

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: rgba(255, 255, 255, 0.1);
      transition: 0.1s ease;
    }

    &.active {
      &::before {
        background: #00abff;
      }
    }

    .artwork {
      min-width: 40px;
      height: 40px;
      background-position: center;
      background-size: cover;
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
    }

    .wrap {
      overflow: hidden;
      max-width: 78%;
    }

    .top {
      margin-left: 6px;
      display: flex;

      h5 {
        color: rgba(176, 176, 176, 1);
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        display: block;
        text-overflow: ellipsis;
        font-weight: 500;
      }

      .total {
        color: rgba(255, 255, 255, 0.1);
        font-size: 12px;
        margin-left: 6px;
      }
    }

    .tags {
      display: flex;
      margin-left: 6px;

      .tag {
        padding: 0px 8px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 32px;
        color: rgba(255, 255, 255, 0.3);
        font-size: 12px;
      }
    }
  }
}

.player-info {
  display: flex;
  margin-bottom: 16px;
  margin-top: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  padding: 10px;
  box-sizing: border-box;

  .info {
    flex: 1;
    margin: 0 8px;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    h4 {
      margin-top: 2px;
      font-weight: 500;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      display: block;
      text-overflow: ellipsis;
      color: #b0b0b0;
    }

    .tags {
      margin-top: 2px;
      display: flex;

      .tag {
        padding: 0px 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 32px;
        color: rgba(255, 255, 255, 0.5);
        font-size: 12px;
      }
    }

    .progress-wrap {
      width: 100%;
      position: relative;
      margin-top: auto;

      .progress {
        background: rgba(196, 196, 196, 0.1);
        border-radius: 8px;
        width: 100%;
        height: 4px;
        display: flex;

        .bar {
          height: 100%;
          border-radius: 8px;
          background: #00abff;
        }
      }

      .time {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.5);
        display: flex;

        .total {
          margin-left: auto;
        }
      }
    }
  }

  .volume {
    width: 4px;
    height: 100%;
    background: rgba(196, 196, 196, 0.1);
    border-radius: 8px;
    display: flex;
    flex-direction: column-reverse;

    .bar {
      width: 100%;
      height: 20px;
      pointer-events: none;
      background: #fff;
      border-radius: 8px;
    }
  }

  .artwork {
    min-width: 80px;
    min-height: 80px;
    position: relative;
    background-image: url(../../assets/nocover.jpg);
    background-size: cover !important;
    background-position: center !important;
    border-radius: 4px;

    &:hover {
      &::after {
        background: rgba(0, 0, 0, 0.9);
        color: rgba(255, 255, 255, 0.6);

        content: "";
      }

      &.pause::after {
        content: "";
      }
    }

    &::after {
      font-family: "Font Awesome 5 Pro";
      font-weight: 900;
      font-size: 44px;
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      transition: color 0.2s, background 0.2s;
      color: transparent;
      cursor: pointer;
      border-radius: 3px;
    }
  }
}
</style>