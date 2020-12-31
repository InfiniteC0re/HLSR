<template>
  <div id="navbar">
    <Header />
    <div id="buttons">
      <NavBarButton
        :text="localization.get('#UI_HOME')"
        icon="home"
        standardActive="true"
        @click.native="goTo('home')"
      />
      <NavBarButton
        :text="localization.get('#UI_LIBRARY')"
        icon="play"
        notActivable="true"
        @click.native="revealTab('games-tab')"
      />
      <div class="tab" id="games-tab">
        <NavBarButton
          :lambdaColor="1"
          text="Half-Life"
          small="true"
          ref="hl"
          @click.native="goTo('game', { id: '70' })"
        />
        <NavBarButton
          :lambdaColor="2"
          text="Half-Life: Opposing Force"
          ref="of"
          small="true"
          @click.native="goTo('game', { id: '50' })"
        />
        <NavBarButton
          :lambdaColor="3"
          text="Half-Life: Blue Shift"
          ref="bs"
          small="true"
          @click.native="goTo('game', { id: '130' })"
        />
        <NavBarButton
          :lambdaColor="4"
          text="Half-Life 2"
          ref="hl2"
          small="true"
          @click.native="goTo('game', { id: '220' })"
        />
        <span class="split"></span>
      </div>
      <NavBarButton
        :text="localization.get('#UI_CONFIGS')"
        notActivable="true"
        icon="table"
        @click.native="revealTab('configs-tab')"
      />
      <div class="tab" id="configs-tab">
        <NavBarButton
          :text="localization.get('#UI_CONFIGS_CONSTRUCTOR')"
          small="true"
          @click.native="goTo('config-constructor')"
        />
        <NavBarButton
          :text="localization.get('#UI_CONFIGS_ADVANCED')"
          small="true"
          @click.native="goTo('config-editor')"
        />
        <span class="split"></span>
      </div>
      <NavBarButton
        :text="localization.get('#UI_CUSTOMIZATION')"
        icon="sliders-h"
        @click.native="goTo('customization')"
      />
      <NavBarButton
        :text="localization.get('#UI_SETTINGS')"
        icon="cog"
        @click.native="goTo('settings')"
      />
    </div>
    <div class="bottomButtons">
      <NavBarButton
        v-if="updateAvailable"
        notActivable="true"
        :text="updateState"
        icon="sync-alt"
      />
      <!-- <NavBarButton notActivable="true" text="#UI_DOWNLOADS_MARKET" icon="arrow-alt-circle-down"/>   -->
    </div>
  </div>
</template>

<script>
import Header from "./NavBar/Header";
import NavBarButton from "./NavBar/Button";
import $ from "jquery";

export default {
  name: "NavBar",
  components: { Header, NavBarButton },
  props: {
    active: String,
  },
  data() {
    return {
      localization: this.$parent.localization,
    };
  },
  computed: {
    updateAvailable() {
      return this.$parent.updateAvailable > 0;
    },
    updateState() {
      switch (this.$parent.updateAvailable) {
        case 0:
          return "";
          break;
        case 1:
          return this.localization.get("#UI_UPDATE_DOWNLOADING");
          break;
        case 2:
          return this.localization.get("#UI_UPDATE_READY");
          break;
      }
    },
  },
  methods: {
    revealTab(id) {
      let shown = $("#" + id).css("display") != "none";
      $(".tab").slideUp();
      if (!shown) $("#" + id).slideToggle();
    },
    changeButtonsState(gameID) {
      if (!gameID) return;

      let button = null;
      if (gameID == "70") button = this.$refs.hl;
      else if (gameID == "50") button = this.$refs.of;
      else if (gameID == "130") button = this.$refs.bs;
      else if (gameID == "220") button = this.$refs.hl2;

      if (button) {
        button.deactivateButtons();
        button.toggleActive();
      }
    },
    goTo(path, query) {
      let router = this.$router;
      let route = this.$route;
      if (!query) query = {};

      this.changeButtonsState(query.id);
      if (route.path != "/" + path) return router.push({ path, query });

      if (route.query.id != query.id || query.refresh) {
        router.push({
          query: { id: query.id, time: Date.now(), section: query.section },
        });
        this.changeButtonsState(query.id);
      }
    },
  },
};
</script>

<style scoped>
#navbar {
  flex: 0.45;
  max-width: 397px;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

#buttons {
  display: flex;
  flex-flow: column;
  flex: 1;
}

.tab {
  display: none;
}
</style>