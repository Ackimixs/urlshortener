<template>
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      :height="height"
      :width="width"
      :fill="color"
    >
      <path
        d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"
      />
    </svg>
  </div>
</template>

<script setup>
const props = defineProps({
  height: {
    type: String,
    default: "48",
  },
  width: {
    type: String,
    default: "48",
  },
  color: {
    type: String,
    default: "black",
  },
});
const { height, width, color } = toRefs(props);
</script>
