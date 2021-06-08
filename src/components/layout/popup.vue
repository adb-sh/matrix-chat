<template>
  <div class="popup">
    <div class="scrollContainer" ref="scrollContainer">
      <div class="content">
        <slot></slot>
      </div>
      <icon v-if="onClose" class="closeBtn" @click.native="onClose(false)" ic="./sym/ic_close_white.svg" />
    </div>
  </div>
</template>

<script>
import icon from '@/components/layout/icon';

export default {
  name: 'popup',
  components: {
    icon
  },
  props: {
    onClose: Function
  },
  methods: {
    calcMaxHeight(){
      this.$refs.scrollContainer.style.maxHeight = `calc(${this.$el.parentElement.clientHeight}px - 4rem`;
    }
  },
  mounted() {
    this.calcMaxHeight();
  }
}
</script>

<style scoped>
.popup{
  position: relative;
  top: 5rem;
  width: calc(100% - 4rem);
  max-width: 30rem;
  min-height: 10rem;
  background-color: #1d1d1d;
  box-shadow: 6px 6px 20px #111;
  border-radius: 1rem;
  z-index: 30;
  overflow: hidden;
}
.scrollContainer{
  position: relative;
  max-height: 30rem;
  top: 0;
  width: calc(100% - 2rem);
  padding: 0 1rem 0 1rem;
  overflow-y: auto;
  overflow-x: hidden;
}
@media (max-width: 30rem) {
  .popup{
    transform: unset;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
  .scrollContainer{
    max-height: 100% !important;
  }
}
@media (max-height: 40rem) {
  .popup{
    top: 0;
    height: 100%;
  }
  .scrollContainer{
    max-height: 100% !important;
  }
}
.closeBtn{
  position: fixed;
  top: 0;
  right: 0;
  background-color: #0000;
  box-shadow: none;
}
.content{
  position: relative;
  padding: 1rem 0 1rem 0;
  width: 100%;
  height: auto;
}
</style>