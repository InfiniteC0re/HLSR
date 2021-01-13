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
      <div class="player-song-wrapper">
        <div class="player-song">
          <div class="song-name">{{ song ? song.title : "" }}</div>
          <div class="song-genre">
            {{ song && song.genre ? song.genre : "No specified genre" }}
          </div>
        </div>
        <div style="margin-top: auto">
          <div class="time">
            <div>{{ songPos }}</div>
            <div style="margin-left: auto">
              {{ song ? toHHMMSS(song.duration / 1000) : "00:00" }}
            </div>
          </div>
          <div class="progress" ref="progress" @mousedown="barMouseDown">
            <div class="bar" :style="{ width: `${barWidth * 100}%` }"></div>
          </div>
        </div>
      </div>
      <div class="player-volume" @click.stop="volumeChange">
        <div class="bar" :style="{ height: `${volume}%` }"></div>
      </div>
    </div>
    <div class="player-songs" v-if="song.id">
      <div
        v-for="val in songsList"
        class="player-songs-song"
        :class="{ active: val.id == song.id }"
        @click="widget.skip(val.realIndex)"
        :key="val._id"
      >
        <div class="song-artwork" :style="getSongArtwork(val)"></div>
        <div class="song-title">{{ val.title }}</div>
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
        background:
          song && song.artwork_url
            ? `url(${song.artwork_url}`
            : null,
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

<style scoped>
#widget-wrap {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.player-info {
  display: flex;
  padding: 16px;
}
.artwork {
  min-width: 96px;
  min-height: 96px;
  position: relative;
  background-image: url(../../assets/nocover.jpg);
  background-size: cover;
  background-position: center;
}

.artwork::after {
  font-family: "Font Awesome 5 Pro";
  font-weight: 900;
  font-size: 48px;
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
}

.artwork:hover::after {
  background: rgba(0, 0, 0, 0.4);
  color: rgba(255, 255, 255, 0.6);
}

.artwork:hover::after {
  content: "";
}

.artwork.pause:hover::after {
  content: "";
}

.player-song-wrapper {
  padding: 8px;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.player-song {
  margin-top: -8px;
  color: rgba(255, 255, 255, 0.4);
}

.player-volume {
  width: 6px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  position: relative;
}

.player-volume .bar {
  height: 50%;
  width: 100%;
  background: rgba(255, 255, 255, 0.2);
  pointer-events: none;
  position: absolute;
  bottom: 0;
}

.progress {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
}

.progress .bar {
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
}

.time {
  color: rgba(255, 255, 255, 0.2);
  display: flex;
  margin-top: auto;
}

.song-genre {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.2);
}

.player-songs {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.player-songs-song {
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px 16px;
}

.player-songs-song.active {
  background: rgba(255, 255, 255, 0.1) !important;
  cursor: default;
  transition: 100ms;
}

.player-songs-song.active .song-title {
  transition: 100ms;
  color: #00abff;
  opacity: 0.8;
}

.player-songs-song:hover {
  transition: 100ms;
  background: rgba(255, 255, 255, 0.05);
}

.song-artwork {
  min-height: 32px;
  min-width: 32px;
  background-image: url(../../assets/nocover.jpg);
  background-position: center !important;
  background-size: cover !important;
}

.song-title {
  white-space: nowrap;
  color: rgba(255, 255, 255, 0.3);
  text-overflow: ellipsis;
  overflow: hidden;
  margin-left: 8px;
  align-items: center;
  font-size: 13px;
}

.song-name {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: rgba(255, 255, 255, 0.4);
}
</style>