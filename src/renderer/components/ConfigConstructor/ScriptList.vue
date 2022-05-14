<template>
  <md-list style="background: transparent">
    <md-subheader>{{ title }}</md-subheader>
    <md-list-item
      class="md-inset"
      v-for="script in list"
      :key="script._id"
      @click="itemClick(script)"
    >
      <md-checkbox
        v-model="script.selected"
        :class="{ 'md-primary': scriptless }"
      />
      <span class="md-list-item-text script-name"
        >{{ script.name }}
        <span class="tag" v-if="isSequence(script.name)">Sequence</span></span
      >
      <i v-if="script.binds" class="viewIcon fas fa-cog"></i>
    </md-list-item>
  </md-list>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default() {
        return this.$t("#UI_SCRIPT_SCRIPTLESS");
      },
    },
    scriptless: {
      type: Boolean,
      default: () => true,
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    // temporary workaround (to be replaced with adding the support of hld files)
    isSequence(scriptName) {
      return (
        [
          "Lambda Complex Boost",
          "Nihilanth Boost",
          "Test Chamber Skip",
          "Surface Tension Trigger Delay",
          "Test Chamber Skip",
        ].indexOf(scriptName) >= 0
      );
    },
    itemClick(script) {
      this.$emit("select", script);
    },
  },
};
</script>

<style lang="scss" scoped>
.viewIcon {
  color: rgba(255, 255, 255, 0.3);
  padding: 8px;
  border-radius: 50%;
  transition: 0.2s ease;

  &:hover {
    color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.1);
  }
}

.script-name {
  flex-direction: row;
  align-items: center;

  .tag {
    font-size: 12px;
    margin-left: 12px;
    padding: 4px 10px;
    width: fit-content;
    color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.1);
    border-radius: 96px;
  }
}
</style>
