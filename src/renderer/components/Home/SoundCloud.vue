<template>
  <div id="widget-wrap">
    <div class="center" v-if="!song.id">
      <LoaderSpinner />
    </div>
    <template v-else>
      <div class="player-info">
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
            <div class="song-duration">
              {{ song ? toHHMMSS(song.duration / 1000) : "00:00" }}
            </div>
          </div>
          <div class="progress" ref="progress" @mousedown="barMouseDown">
            <div class="bar" :style="{ width: `${barWidth * 100}%` }"></div>
          </div>
        </div>
      </div>
      <div class="volume" @click.stop="volumeChange">
        <div class="bar" :style="{ height: `${volume}%` }"></div>
      </div>
    </div>
    <div class="player-songs">
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
            <div class="song-duration">{{ toHHMMSS(val.duration / 1000) }}</div>
          </div>
          <div class="tags">
            <div class="tag">
              {{ val.genre ? val.genre : "No tag" }}
            </div>
          </div>
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<script>
import LoaderSpinner from "@/components/Elements/Loader";

export default {
  components: {
    LoaderSpinner
  },
  data() {
    return {
      songPos: "00:00",
      barWidth: 0,
      volume: 100,
      updater: null,
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
        console.log(this.barWidth)
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
  padding-right: 4px;

  .song {
    width: 100%;
    height: 48px;
    padding-left: 12px;
    position: relative;
    background: rgba(255, 255, 255, 0.03);
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: 0.05s ease;
    overflow: hidden;

    &:nth-child(1) {
      border-radius: 4px 4px 0 0;
    }

    &:nth-last-child(1) {
      border-radius: 0 0 4px 4px;
    }

    &:hover {
      transition: 0.1s background-color;
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
      .top {
        h5 {
          color: rgb(211, 211, 211);
        }
      }

      &::before {
        background: var(--accent-color);
      }
    }

    .artwork {
      min-width: 38px;
      height: 38px;
      background-image: url("~@/assets/nocover.jpg");
      background-position: center;
      background-size: cover;
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
    }

    .wrap {
      overflow: hidden;
      width: 100%;
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
        padding-right: 24px;
      }

      .song-duration {
        color: rgba(255, 255, 255, 0.12);
        font-size: 12px;
        margin-left: auto;
        margin-right: 6px;
      }
    }

    .tags {
      display: flex;
      margin-left: 6px;

      .tag {
        padding: 0px 6px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 32px;
        color: rgba(255, 255, 255, 0.3);
        font-size: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 18px;
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

        .bar {
          height: 100%;
          border-radius: 8px;
          background: var(--accent-color);
        }
      }

      .time {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.5);
        display: flex;

        .song-duration {
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
    background-image: url("~@/assets/nocover.jpg");
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