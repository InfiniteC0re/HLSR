import vuex from "vuex";
import vue from "vue";
import crypto from "crypto";
import steamFriends from "./steamFriends";

vue.use(vuex);

class Notification {
  constructor(
    text,
    type,
    lifetime,
    deathCallback = () => {},
    persistent = false
  ) {
    this.text = text;
    this.type = type;
    this.show = true;
    this.timeoutID = null;
    this.lifetime = lifetime;
    this.deathCallback = deathCallback;
    this.id = crypto.randomBytes(16).toString("hex");
    this.persistent = persistent;

    if (this.lifetime > 0) this._setLifetime();
  }

  _setLifetime() {
    this.timeoutID = setTimeout(() => {
      this.show = false;
      this.deathCallback();
    }, this.lifetime);
  }

  remove() {
    this.show = false;
    this.deathCallback();

    clearTimeout(this.timeoutID);
  }

  setDeathCallback(deathCallback) {
    this.deathCallback = deathCallback;
  }
}

export default new vuex.Store({
  state: {
    defaultSoundCloudPlaylist:
      "https://api.soundcloud.com/playlists/1024488982%3Fsecret_token%3Ds-t3rIoE0luqj&color=%23e81387&auto_play=false&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
    noParticles: false,
    debugMenu: false,
    launchedNewVersion: false,
    sidebarBlocked: false,
    notifications: [],
    extraNotification: null,
    blobs: null,
    steamworks: {
      started: false,
      friends: [],
      personaName: null,
      licenses: {},
    },
    soundCloud: {
      widget: null,
      gotSounds: false,
      sounds: [],
      currentSound: {},
      isPaused: true,
      startTime: 0,
    },
    game: {
      name: "",
      date: null,
      started: false,
    },
    scriptEditor: {
      filePath: "",
      fileName: "",
      content: "",
    },
    window: {
      focused: true,
    },
  },
  mutations: {
    // Steamworks
    steamworks_setStatus(state, status) {
      state.steamworks.started = status;
    },
    steamworks_setFriends(state, friends) {
      let list = state.steamworks.friends;
      let newFriends = [];

      friends.forEach((friend, i) => {
        let old = list.find((x) => x.friendID == friend.friendID);

        if (old) {
          // update old values
          old.appID = friend.appID;
          old.friendRPC = friend.friendRPC;
          old.gamePlayed = friend.gamePlayed;
          old.personaName = friend.personaName;
          old.personaState = friend.personaState;
        } else {
          newFriends.push(friend);
        }
      });

      newFriends = newFriends.filter((x) => x.personaState > 0);
      steamFriends.getAvatars(newFriends).then(() => {
        state.steamworks.friends = steamFriends.sort(
          state.steamworks.friends.concat(newFriends)
        );
      });
    },
    steamworks_setName(state, name) {
      state.steamworks.personaName = name;
    },

    // SoundCloud
    setSCWidget(state, widget) {
      state.soundCloud.widget = widget;
    },
    setSCSound(state, sound) {
      state.soundCloud.endTimestamp = Date.now() + sound.duration;
      state.soundCloud.currentSound = sound;
    },
    getSCSounds(state) {
      if (!state.soundCloud.widget) return;

      state.soundCloud.widget.getSounds((sounds) => {
        if (!sounds.find((sound) => sound.title == undefined)) {
          sounds.forEach((sound, i) => {
            sound.realIndex = i;
          });

          state.soundCloud.sounds = sounds;
          state.soundCloud.gotSounds = true;
          state.soundCloud.currentSound = sounds[0];
        }
      });
    },
    setSCPaused(state, paused) {
      state.soundCloud.isPaused = paused;

      if (paused == false) {
        state.soundCloud.widget.getPosition((pos) => {
          state.soundCloud.endTimestamp =
            Date.now() + state.soundCloud.currentSound.duration - pos;
        });
      }
    },

    // Others
    createNotification(state, obj) {
      let { text, type, lifetime } = obj;

      if (type == undefined || type == null) type = 0;
      if (lifetime == undefined || lifetime == null) lifetime = 2000;
      let notification = new Notification(text, type, lifetime);

      notification.setDeathCallback(() => {
        notification.show = false;

        setTimeout(() => {
          state.notifications.splice(
            state.notifications.findIndex((t) => t.id == notification.id),
            1
          );
        }, 300);
      });

      state.notifications.push(notification);
    },
    setExtraNotification(state, obj) {
      let { text } = obj;

      let notification = new Notification(text, 0, 0);

      notification.setDeathCallback(() => {
        notification.show = false;

        setTimeout(() => {
          state.extraNotification = null;
        }, 300);
      });

      state.extraNotification = notification;
    },
    setParticlesState(state, disabled) {
      state.noParticles = disabled;
    },
    setCurrentGame(state, name) {
      state.game.started = !!name;
      state.game.name = name;
      state.game.startDate = Date.now();
    },
  },
});
