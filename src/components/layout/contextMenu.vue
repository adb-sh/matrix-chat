<template>
  <overlay class="overlay" @click.native="close()">
    <div class="menu" ref="menu">
      <div class="option" v-for="(action, name) in options" :key="name" @click="action()">{{name}}</div>
    </div>
  </overlay>
</template>

<script>
import overlay from '@/components/layout/overlay';

export default {
  name: 'contextMenu',
  components: {
    overlay
  },
  props: {
    options: Object,
    close: Function,
    event: MouseEvent
  },
  data(){
    return{
      x: this.event.pageX||this.event.x,
      y: this.event.pageY||this.event.y
    }
  },
  mounted(){
    let menu = this.$refs.menu;
    menu.style.left = `${this.x+menu.clientWidth>window.innerWidth?window.innerWidth-menu.clientWidth:this.x}px`;
    menu.style.top = `${this.y+menu.clientHeight>window.innerHeight?window.innerHeight-menu.clientHeight:this.y}px`;
  }
}
</script>

<style scoped lang="scss">
.overlay{
  position: fixed;
  background-color: unset;
}
.menu{
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: var(--grey500);
  box-shadow: var(--shadow300);
  font-size: 1rem;
  .option{
    padding: 0.5rem;
    border-top: 1px solid #fff;
    cursor: pointer;
  }
  .option:first-child{
    border-top: unset;
  }
  .option:hover{
    background-color: var(--grey400);
  }
}
</style>