<template>
  <md-list style="background: transparent">
    <md-subheader>{{ title }}</md-subheader>
    <md-list-item
      class="md-inset"
      v-for="script in list"
      :key="script._id"
      @click="itemClick(script)"
    >
      <md-checkbox v-model="script.selected" :class="{'md-primary': scriptless}" />
      <span class="md-list-item-text">{{ script.name }}</span>
      <i v-if="script.binds" class="viewIcon icon fas fa-eye"></i>
    </md-list-item>
  </md-list>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default() {
        return this.$localisation.get("#UI_SCRIPT_SCRIPTLESS");
      },
    },
    scriptless: {
      type: Boolean,
      default: () => true
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    itemClick(script) {
      this.$emit("select", script);
    },
  },
};
</script>

<style scoped>
.fa-eye {
  opacity: 0.3;
}
</style>
