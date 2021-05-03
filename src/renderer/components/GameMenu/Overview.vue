<template>
  <div id="wrap">
    <div class="title">{{ localization.get("#UI_OVERVIEW") }}</div>
    <div
      class="post"
      v-for="post in posts"
      :key="post._id"
      @click="openLink(post.url)"
    >
      <div class="post-author">{{ post.feedlabel }}</div>
      <div class="post-title">{{ post.title }}</div>
    </div>
    <div class="post" v-if="posts.length == 0">
      <div class="post-author">Loading...</div>
    </div>
  </div>
</template>

<script type="text/javascript">
import localization from "@/utils/Language.js";

const local = new localization();

export default {
  name: "gamemenu-overview",
  components: {},
  props: {
    id: {
      type: String,
      default: "no id specified",
    },
  },
  data() {
    return {
      localization: this.$parent.localization,
      posts: [],
    };
  },
  methods: {
    openLink(url) {
      let shell = require("electron").remote.shell;
      shell.openExternal(url);
    },
  },
  mounted() {
    if (!navigator.onLine) return;

    fetch(
      `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${
        this.id == "218" ? "220" : this.id
      }&count=15`
    )
      .then((a) => {
        return a.json();
      })
      .then((data) => {
        if (!data.appnews) return;
        this.posts = data.appnews.newsitems;
      });
  },
};
</script>

<style scoped>
.title {
  color: #00abff !important;
  font-size: 20px !important;
  font-weight: bold !important;
  margin-left: 16px !important;
}
.post {
  margin: 16px;
  color: rgb(155, 155, 155);
  transition: 0.06s color;
  cursor: pointer;
}
.post:hover {
  color: rgb(185, 185, 185);
}
.post:nth-last-child(1) {
  margin-bottom: 0;
}
.post-author {
  opacity: 0.4;
}
.post-title {
  margin: 0 4px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>