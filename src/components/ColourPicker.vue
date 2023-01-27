<script>
import { ref } from "vue";

export default {
  emits: ["colour"],
  setup() {
    return {
      colourPickerElement: ref(null),
    };
  },

  methods: {
    invertHex(hex) {
      return (Number(`0x1${hex}`) ^ 0xffffff)
        .toString(16)
        .slice(1)
        .toUpperCase();
    },
    colour() {
      this.$emit("colour", this.colourPickerElement);
    },
    changeDefaultValue(value) {
      defaultValue = value;
    },
  },

  props: {
    defaultValue: {
      type: String,
      default: "#000000",
    },
  },
};
</script>

<template>
  <q-icon name="colorize" class="cursor-pointer" size="20px">
    <q-popup-proxy transition-show="scale" transition-hide="scale">
      <q-color
        v-model="colourPickerElement"
        default-value="defaultValue"
        no-footer
        @update:model-value="colour()"
      />
    </q-popup-proxy>
  </q-icon>
</template>
