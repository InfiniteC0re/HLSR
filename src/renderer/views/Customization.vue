<template>
  <div id="wrap">
    <div id="form">
      <div class="title">{{ localization.get("#UI_CUSTOMIZATION") }}</div>
      <GameSelector v-model="selectedGame" />
      <div class="wrapper">
        <div class="block-background">
          <div class="block-background-title title-form">
            {{ localization.get("#UI_CUSTOMIZATION_MENU_BACKGROUNDS") }}
          </div>
          <div class="block-background-wrapper">
            <BackgroundItem
              v-for="(background, index) in this.background"
              :url="background.url"
              :i_index="index"
              :onIndex="onIndexPropsBackground"
              @parentChange="onIndexPropsBackground = index"
              v-bind:key="index"
            />
          </div>
        </div>
        <div class="block-aim">
          <div class="block-background-title title-form">
            {{ localization.get("#UI_CUSTOMIZATION_SCOPE_SETTINGS") }}
          </div>
          <div class="block-crosshairs-wrapper">
            <AimItem
              v-for="(aim, index) in this.aim"
              :url="aim.url"
              :i_index="index"
              :onIndex="onIndexPropsAim"
              @parentChangeAim="onIndexPropsAim = index"
              v-bind:key="index"
            />
          </div>
        </div>
        <div class="block-checkbox">
          <div class="block-checkbox-title title-form">
            {{ localization.get("#UI_CUSTOMIZATION_HUD_SETTINGS") }}
          </div>
          <div class="selector2">
            <Block
              :url="require('@/assets/customization/hud/1.jpg')"
              target="Standard"
              v-model="hud"
            />
            <Block
              :url="require('@/assets/customization/hud/2.jpg')"
              target="Huge"
              v-model="hud"
            />
          </div>
        </div>
        <div class="block-checkbox">
          <div class="block-checkbox-title title-form">
            {{ localization.get("#UI_CUSTOMIZATION_SPRITES") }}
          </div>
          <div class="selector2">
            <Block
              :url="require('@/assets/customization/sprites/1.jpg')"
              target="Standard"
              v-model="sprites"
            />
            <Block
              :url="require('@/assets/customization/sprites/2.jpg')"
              target="Q3"
              v-model="sprites"
            />
          </div>
        </div>
        <div class="block-checkbox">
          <div class="block-checkbox-title title-form">
            {{ localization.get("#UI_CUSTOMIZATION_SKYBOXES") }}
          </div>
          <div class="block-checkbox-checkbox">
            <div class="checkboxes">
              <CheckBox
                :text="localization.get('#UI_CUSTOMIZATION_LQ')"
                value="LQ"
                name="skyboxes"
                v-model="skyboxes"
              />
              <CheckBox
                :text="localization.get('#UI_CUSTOMIZATION_HD')"
                value="HD"
                name="skyboxes"
                v-model="skyboxes"
              />
            </div>
            <div
              class="img"
              :style="{
                backgroundImage: `url(${require('@/assets/customization/hud/1.jpg')})`,
              }"
            ></div>
            <div
              class="img"
              :style="{
                backgroundImage: `url(${require('@/assets/customization/hud/2.jpg')})`,
              }"
            ></div>
          </div>
        </div>
      </div>
      <div class="block-button">
        <div class="block-button-save button-style">
          <ButtonAlt
            class="button-style"
            @click="saveConfigHandle"
            :disabled="!installed || isGameStarted"
          >
            <p>{{ localization.get("#UI_CUSTOMIZATION_BUTTON_SAVE") }}</p>
            <i class="fas fa-save"></i>
          </ButtonAlt>
        </div>
        <div class="block-button-error button-style" @click="cancelSettings">
          <ButtonAlt
            class="button-style"
            :red="true"
            :disabled="!installed || isGameStarted"
          >
            <p>{{ localization.get("#UI_CUSTOMIZATION_BUTTON_RESET") }}</p>
            <i class="far fa-ban"></i>
          </ButtonAlt>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Store from "@/scripts/Store";
import StoreDefaults from "@/scripts/StoreDefaults";
import GameSelector from "@/components/Elements/GameSelector";
import BackgroundItem from "@/components/Customization/backgroundItem/BackgroundItem";
import AimItem from "@/components/Customization/aimItem/AimItem";
import CheckBox from "@/components/Customization/checkbox/CheckBox";
import Block from "@/components/Customization/Block";
import ButtonAlt from "@/components/Elements/Button";
import GameControl from "@/scripts/GameControl";

const store = new Store({
  configName: "library",
  defaults: StoreDefaults.library,
});

export default {
  name: "customization",
  components: {
    GameSelector,
    BackgroundItem,
    AimItem,
    ButtonAlt,
    CheckBox,
    Block,
  },
  data() {
    return {
      store,
      GameControl,
      installed: false,
      gameId: "70",
      selectedGame: 0,
      localization: this.$parent.localization,
      hlsrconsole: this.$parent.hlsrconsole,
      skyboxes: "LQ",
      hud: "Standard",
      sprites: "Standard",
      onIndexPropsBackground: 0,
      onIndexPropsAim: 0,
      background: [
        {
          url: require("@/assets/customization/Standard.jpg"),
        },
        {
          url: require("@/assets/customization/CF.jpg"),
        },
        {
          url: require("@/assets/customization/BM.jpg"),
        },
        {
          url: require("@/assets/customization/ST.jpg"),
        },
        {
          url: require("@/assets/customization/XEN.jpg"),
        },
        {
          url: require("@/assets/customization/XEN_2.jpg"),
        },
      ],
      aim: [
        // фотки прицелов поставить
        {
          url: require("@/assets/customization/crosshairs/Standard.jpg"),
        },
        {
          url: require("@/assets/customization/crosshairs/Enchanced.jpg"),
        },
        {
          url: require("@/assets/customization/crosshairs/Dot.jpg"),
        },
        {
          url: require("@/assets/customization/crosshairs/Counter-Strike.jpg"),
        },
        {
          url: require("@/assets/customization/crosshairs/Green.jpg"),
        },
      ],
    };
  },
  watch: {
    selectedGame(newState, oldState) {
      this.cancelSettings();
      if (newState == 0)
        this.background[0].url = require("@/assets/customization/Standard.jpg");
      else if (newState == 1)
        this.background[0].url = require("@/assets/customization/Standard_OF.jpg");
      else if (newState == 2)
        this.background[0].url = require("@/assets/customization/Standard_BS.jpg");
    },
  },
  mounted() {
    this.installed = GameControl.checkInstalled(store, this.gameId);
  },
  methods: {
    buildSettings() {
      return {
        selectedGame: this.selectedGame,
        selectedBackground: this.onIndexPropsBackground,
        selectedSkyboxes: this.skyboxes,
        selectedHud: this.hud,
        selectedAim: this.onIndexPropsAim,
        selectedSprites: this.sprites,
      };
    },
    cancelSettings() {
      this.onIndexPropsBackground = 0;
      this.onIndexPropsAim = 0;
      this.skyboxes = "LQ";
      this.hud = "Standard";
      this.sprites = "Standard";
    },
    saveConfigHandle() {
      const rPath = require("path");
      const settings = this.buildSettings();

      let path = rPath.join(GameControl.getLibraryPath(store), "Half-Life");

      if (settings.selectedGame == 0) {
        this.gameId = "70";
      } else if (settings.selectedGame == 1) {
        this.gameId = "50";
      } else if (settings.selectedGame == 2) {
        this.gameId = "130";
      }

      let isInstalled = GameControl.checkInstalled(store, this.gameId);

      if (isInstalled) {
        let patchesPath = this.hlsrconsole.getCustomization();
        let patchPath = "";
        let extractPath = "";

        // Paths for the customization
        let backgrounds_path = rPath.join(patchesPath, "backgrounds");
        let skyboxes_path = rPath.join(patchesPath, "skyboxes");
        let sprites_path = rPath.join(patchesPath, "itemsprites");
        let crosshairs_path = rPath.join(patchesPath, "crosshairs");
        let huds_path = rPath.join(patchesPath, "hud");

        // Backgrounds
        let bk_n = "";
        switch (settings.selectedBackground) {
          case 0:
            if (this.selectedGame == 0) bk_n = "Standard";
            else if (this.selectedGame == 1) bk_n = "Opposing Force Standard";
            else if (this.selectedGame == 2) bk_n = "Blue Shift Standard";
            break;
          case 1:
            bk_n = "Crossfire";
            break;
          case 2:
            bk_n = "Black Mesa";
            break;
          case 3:
            bk_n = "Surface Tension";
            break;
          case 4:
            bk_n = "Xen";
            break;
          case 5:
            bk_n = "Xen 2";
            break;
          default:
            bk_n = "Standard";
        }

        patchPath = rPath.join(backgrounds_path, bk_n);

        if (this.selectedGame == 0) {
          extractPath = rPath.join(path, "valve", "resource", "background");
          this.hlsrconsole.execute(["patch", patchPath, extractPath]);
          extractPath = rPath.join(path, "valve_WON", "resource", "background");
          this.hlsrconsole.execute(["patch", patchPath, extractPath]);
        } else if (this.selectedGame == 1) {
          extractPath = rPath.join(path, "gearbox", "resource", "background");
          this.hlsrconsole.execute(["patch", patchPath, extractPath]);
          extractPath = rPath.join(
            path,
            "gearbox_WON",
            "resource",
            "background"
          );
          this.hlsrconsole.execute(["patch", patchPath, extractPath]);
        } else if (this.selectedGame == 2) {
          extractPath = rPath.join(path, "bshift", "resource", "background");
          this.hlsrconsole.execute(["patch", patchPath, extractPath]);
        }

        // Skyboxes
        let sb_n = "";
        switch (settings.selectedSkyboxes) {
          case "LQ":
            sb_n = "Standard";
            break;
          case "HD":
            sb_n = "HQ";
            break;
          default:
            sb_n = "Standard";
        }

        patchPath = rPath.join(skyboxes_path, sb_n);

        if (this.selectedGame == 0) {
          extractPath = rPath.join(path, "valve", "gfx", "env");
          this.hlsrconsole.execute(["patch", patchPath, extractPath]);
          extractPath = rPath.join(path, "valve_WON", "gfx", "env");
          this.hlsrconsole.execute(["patch", patchPath, extractPath]);
        } else if (this.selectedGame == 1) {
          extractPath = rPath.join(path, "gearbox", "gfx", "env");
          this.hlsrconsole.execute(["patch", patchPath, extractPath]);
          extractPath = rPath.join(path, "gearbox_WON", "gfx", "env");
          this.hlsrconsole.execute(["patch", patchPath, extractPath]);
        } else if (this.selectedGame == 2) {
          extractPath = rPath.join(path, "bshift", "gfx", "env");
          this.hlsrconsole.execute(["patch", patchPath, extractPath]);
        }

        // Item Sprites
        let is_n = "";
        switch (settings.selectedSprites) {
          case "Standard":
            is_n = "Standard";
            break;
          case "Q3":
            is_n = "Q3 Styled";
            break;
          default:
            is_n = "Standard";
        }

        patchPath = rPath.join(sprites_path, is_n);

        if (this.selectedGame == 0) {
          extractPath = rPath.join(path, "valve", "models");
          this.hlsrconsole.execute(["patch", patchPath, extractPath]);
          extractPath = rPath.join(path, "valve_WON", "models");
          this.hlsrconsole.execute(["patch", patchPath, extractPath]);
        } else if (this.selectedGame == 1) {
          extractPath = rPath.join(path, "gearbox", "models");
          this.hlsrconsole.execute(["patch", patchPath, extractPath]);
          extractPath = rPath.join(path, "gearbox_WON", "models");
          this.hlsrconsole.execute(["patch", patchPath, extractPath]);
        } else if (this.selectedGame == 2) {
          extractPath = rPath.join(path, "bshift", "models");
          this.hlsrconsole.execute(["patch", patchPath, extractPath]);
        }

        // Crosshairs
        let crosshairs_n = "";
        switch (settings.selectedAim) {
          case 0:
            crosshairs_n = "Standard";
            break;
          case 1:
            crosshairs_n = "Enchanced";
            break;
          case 2:
            crosshairs_n = "Dot";
            break;
          case 3:
            crosshairs_n = "Counter-Strike";
            break;
          case 4:
            crosshairs_n = "Green";
            break;
          default:
            crosshairs_n = "Standard";
        }

        patchPath = rPath.join(crosshairs_path, crosshairs_n);

        if (this.selectedGame == 0) {
          extractPath = rPath.join(path, "valve", "sprites");
          this.hlsrconsole.execute(["patch", patchPath, extractPath]);
          extractPath = rPath.join(path, "valve_WON", "sprites");
          this.hlsrconsole.execute(["patch", patchPath, extractPath]);
        } else if (this.selectedGame == 1) {
          extractPath = rPath.join(path, "gearbox", "sprites");
          this.hlsrconsole.execute(["patch", patchPath, extractPath]);
          extractPath = rPath.join(path, "gearbox_WON", "sprites");
          this.hlsrconsole.execute(["patch", patchPath, extractPath]);
        } else if (this.selectedGame == 2) {
          extractPath = rPath.join(path, "bshift", "sprites");
          this.hlsrconsole.execute(["patch", patchPath, extractPath]);
        }

        console.log(patchPath, extractPath);

        // HUD
        let hud_n = "";
        switch (settings.selectedHud) {
          case "Standard":
            hud_n = "Standard";
            break;
          case "Huge":
            hud_n = "Huge";
            break;
          default:
            hud_n = "Standard";
        }

        patchPath = rPath.join(huds_path, hud_n);

        if (this.selectedGame == 0) {
          extractPath = rPath.join(path, "valve", "sprites");
          this.hlsrconsole.execute(["patch", patchPath, extractPath]);
          extractPath = rPath.join(path, "valve_WON", "sprites");
          this.hlsrconsole.execute(["patch", patchPath, extractPath]);
        } else if (this.selectedGame == 1) {
          extractPath = rPath.join(path, "gearbox", "sprites");
          this.hlsrconsole.execute(["patch", patchPath, extractPath]);
          extractPath = rPath.join(path, "gearbox_WON", "sprites");
          this.hlsrconsole.execute(["patch", patchPath, extractPath]);
        } else if (this.selectedGame == 2) {
          extractPath = rPath.join(path, "bshift", "sprites");
          this.hlsrconsole.execute(["patch", patchPath, extractPath]);
        }

        // Send a notification
        this.$store.commit("createNotification", {
          text: this.localization.get("#UI_NOTIFICATION_DONE"),
        });
      }
    },
  },
  computed: {
    isGameStarted() {
      return this.$store.state.game.started;
    },
  },
};
</script>

<style scoped>
#wrap {
  text-transform: uppercase;
}
#form {
  overflow: auto;
}
.title-form {
  font-family: Rubik;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  text-transform: uppercase;
  color: #d2d2d2;
}
.block-background-wrapper,
.block-crosshairs-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 10px;
  margin-top: 12px;
}
.block-crosshairs-wrapper {
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr;
}
.wrapper {
  margin-top: 40px;
  padding-right: 20px;
  overflow: auto;
}
.block-checkbox {
  margin-top: 18px;
}
.block-checkbox-checkbox {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
}
.block-button {
  z-index: 20px;
  margin-top: 40px;
  display: flex;
  flex-direction: row;
}
.block-button-save {
  width: 185px;
  height: 52px;
  border-radius: 2px;
}
.block-button-error {
  margin-left: 10px;
  width: 185px;
  height: 52px;
}
.block-aim {
  margin-top: 16px;
}
.button-style {
  align-items: center;
  display: flex;
}
.button-icon {
  margin-right: px;
}
.two {
  margin-top: 15px;
}
.selector2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 150px;
  grid-gap: 12px;
  margin-top: 12px;
}
</style>