import vuex from "vuex";
import vue from "vue";
import axios from "axios";
import crypto from "crypto";

import sortFriends from "./sortFriends";
vue.use(vuex);

let parser = new DOMParser();

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
    shouldOpenChangelog: false,
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
      friends = sortFriends(friends, true);

      let needToUpdate = [];
      let newFriends = [];

      friends.map((friend, i) => {
        let result = state.steamworks.friends.find(
          (f) => f.friendID == friend.friendID
        );

        if (!result) needToUpdate.push(friend);
        else {
          result.appID = friend.appID;
          result.friendRPC = friend.friendRPC;
          result.gamePlayed = friend.gamePlayed;
          result.personaName = friend.personaName;
          result.personaState = friend.personaState;
          result.priority = friend.priority;
        }

        if (i == friends.length - 1) {
          state.steamworks.friends = sortFriends(
            state.steamworks.friends,
            false,
            true
          );
        }
      });

      if (state.steamworks.friends.length == 0) needToUpdate = friends;

      let c = 0;
      needToUpdate.map((friend, i) => {
        let id = friend.friendID;
        setTimeout(() => {
          axios
            .get(`https://steamcommunity.com/profiles/${id}?xml=1`)
            .then((res) => {
              c++;
              let doc = parser.parseFromString(res.data, "text/xml");

              try {
                friend.url = doc.querySelector("avatarFull").textContent;
              } catch (e) {}

              newFriends.push(friend);

              if (c == needToUpdate.length) {
                newFriends = sortFriends(newFriends, false, true);

                state.steamworks.friends = state.steamworks.friends.concat(
                  newFriends
                );
              }
            });
        }, i * 50);
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
