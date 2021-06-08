<template>
  <div v-if="this.$slots.default" class="overlay">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'overlay'
}
</script>

<style scoped>
.overlay{
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #111d;
  user-select: none;
  z-index: 50;
}
</style>