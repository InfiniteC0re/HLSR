import vuex from "vuex";
import vue from "vue";
import axios from "axios";

import sortFriends from "./sortFriends";

vue.use(vuex);

let parser = new DOMParser();

export default new vuex.Store({
  state: {
    defaultSoundCloudPlaylist:
      "https://api.soundcloud.com/playlists/1024488982%3Fsecret_token%3Ds-t3rIoE0luqj&color=%23e81387&auto_play=false&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
    noParticles: false,
    notification: {
      text: "",
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
  },
  mutations: {
    // Steamworks

    steamworks_setStatus(state, status) {
      state.steamworks.started = status;
    },
    steamworks_setFriends(state, friends) {
      friends = sortFriends(friends);

      let c = 0;

      friends.map((friend, i) => {
        let id = friend.friendID;
        setTimeout(() => {
          axios
            .get(`https://steamcommunity.com/profiles/${id}?xml=1`)
            .then((res) => {
              c++;
              let doc = parser.parseFromString(res.data, "text/xml");

              try {
                friend.url = doc.querySelector("avatarFull").textContent;
              } catch (e) {
                navigator.clipboard.writeText(
                  `https://steamcommunity.com/profiles/${id}?xml=1`
                );
              }

              if (
                !friends.find((f) => f.url == undefined) ||
                c == friends.length
              )
                state.steamworks.friends = friends;
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
      const { text } = obj;

      if (state.notificationTimer) return;

      state.notification.text = text;

      setTimeout(() => {
        state.notification.text = "";
        state.notificationTimer = null;
      }, 3000);
    },
    setParticlesState(state, disabled) {
      state.noParticles = disabled;
    },
  },
});
