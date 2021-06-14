<template>
  <div class="transition element standardcursor dropdown basictext">
    <div class="text basictext">{{ text }}</div>
    <div class="right">
      <div class="selected" @click="toggleMenu">
        <span>{{ selected.name }}</span>
        <div class="icon">
          <i class="fas fa-sort-down"></i>
        </div>
      </div>
      <div class="list" ref="list" hidden>
        <div
          v-for="(item, index) in orderedItems"
          :num="index"
          @click="setItem(item)"
          :key="item.id"
        >
          <div class="item basictext">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "dropdown-component",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: Number,
      default: 0,
    },
    text: {
      type: String,
      default: "null",
    },
    items: {
      type: Array,
      default: [],
    },
  },
  computed: {
    selected() {
      let res = this.items.find((item) => item.id == this.value);
      if (res) return res;
      else return {};
    },
    orderedItems: function() {
      return this.items.sort((a, b) => a.id - b.id);
    }
  },
  data() {
    return {
      locked: false,
    };
  },
  watch: {
    /* eslint-disable */
    items(newVal, oldVal) {},
    /* eslint-enable */
  },
  methods: {
    toggleMenu() {
      if ($(this.$refs.list).is(":hidden")) {
        $(".list").slideUp(300);
        $(this.$refs.list).slideToggle(300);
      } else {
        $(this.$refs.list).slideToggle(300);
      }
    },
    setLocked(state) {
      if (state === true || state === false) this.locked = state;
    },
    setItem(item) {
      let id = item.id;
      this.$emit("change", id);
    },
  },
};
</script>

<style scoped>
.dropdown .text {
  font-size: 15px;
  margin-bottom: auto;
  margin-top: 9px;
}

.right {
  margin-left: auto;
  position: relative;
}

.selected {
  padding: 8px 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  width: 256px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.icon {
  margin-left: auto;
}

.list {
  overflow: hidden;
  border-radius: 4px;
  z-index: 2;
  border-radius: 4px;
  margin-top: 8px;
}

.item {
  padding: 8px;
  background: rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.item:hover {
  background: rgba(0, 0, 0, 0.4);
}
</style>