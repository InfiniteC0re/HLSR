<template>
  <div class="checkbox" @click="clickHandle">
    <input v-model="active" :value="value" :name="name" type="radio" />
    <span>{{ text }}</span>
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
  },
  model: {
    prop: "active",
    event: "click",
  },
  methods: {
    clickHandle() {
      this.$emit("click", this.value);
    },
  },
};
</script>

<style scoped>
.checkbox {
    margin-bottom: 16px;
}
.checkbox input {
  opacity: 0;
  position: absolute;
  width: 0;
  height: 0;
}
.checkbox span::after {
  content: "";
  display: inline-block;
  height: 21px;
  width: 21px;
  background-image: url("../../../assets/customization/button-icon/icon-checkbox.png");
}
.checkbox span {
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
  height: 21px;
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  font-size: 17px;
  color: #d2d2d2;
  transition: 0.1s;
}
.checkbox span::before {
  position: relative;
  margin-right: 18px;
}
.checkbox span::after {
  position: absolute;
}
.checkbox span::before {
  display: inline-block;
  content: "";
  width: 21px;
  height: 21px;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.29);
}
.checkbox input + span::after {
  content: none;
}
.checkbox input:checked + span::after {
  content: "";
}
.checkbox input:checked + span {
  font-family: Roboto;
  font-style: normal;
  font-size: 17px;
  color: var(--accent-color);
  letter-spacing: 1px;
}
</style>