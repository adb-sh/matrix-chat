<template>
  <div class="viewer" ref="images">
    <slot></slot>
  </div>
</template>

<script>
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';

export default {
  name: 'imageViewer',
  props: {
    options: Object
  },
  mounted() {
    new Viewer(this.$refs.images, this.options||{
      inline: false,
      navbar: false,
      button: true,
      toolbar: {
        reset: {show: 1, size: 'large'},
        zoomIn: {show: 1, size: 'large'},
        zoomOut: {show: 1, size: 'large'},
        rotateLeft: {show: 1, size: 'large'},
        rotateRight: {show: 1, size: 'large'}
      },
      zoomRatio: 0.25,
      minZoomRatio: 0.5,
      maxZoomRatio: 10,
      toggleOnDblclick: true,
    });
  }
}
</script>

<style scoped lang="scss">
.viewer{
  cursor: pointer;
}
</style>