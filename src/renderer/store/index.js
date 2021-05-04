import vuex from "vuex";
import vue from "vue";
import axios from "axios";

import sortFriends from "./sortFriends";
import { existsSync, readFileSync } from "fs";

vue.use(vuex);

let parser = new DOMParser();

export default new vuex.Store({
  state: {
    defaultSoundCloudPlaylist:
      "https://api.soundcloud.com/playlists/1024488982%3Fsecret_token%3Ds-t3rIoE0luqj&color=%23e81387&auto_play=false&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
    noParticles: false,
    debugMenu: false,
    shouldOpenChangelog: false,
    notification: {
      text: "",
      type: 0,
    },
    notificationTimer: null,
    steamworks: {
      started: false,
      friends: [],
      personaName: null,
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
      const { text, type } = obj;

      if (state.notificationTimer) return;

      state.notification.text = text;
      state.notification.type = typeof type !== "number" ? 0 : type;

      setTimeout(() => {
        state.notification.text = "";
        state.notificationTimer = null;
      }, 5000);
    },
    setParticlesState(state, disabled) {
      state.noParticles = disabled;
    },
    setLastGame(state, name) {
      if (!name) state.game.started = false;
      else state.game.started = true;
      state.game.name = name;
      state.game.date = Date.now();
    },
    checkHLSRC() {
      let text = "Некорректный HLSRC";

      if (existsSync("./hlsrc.json")) {
        let data = readFileSync("./hlsrc.json").toJSON();
        if (data.title) text = `HLSRC успешно загружен`;
      }

      this.commit("createNotification", {
        text,
      });
    },
  },
});
