<template>
  <div id="chatInformation" class="chatInformation">
    <h1>open chat</h1>
    <icon class="closeBtn" onclick="this.parentNode.style.display = 'none'" ic="./sym/ic_close_white_24px.svg" />
  </div>
</template>
<script>
import icon from './icon.vue';

export default {
  name: "chatInformation",
  components:{
    icon
  }
}
</script>
<style scoped>
.chatInformation{
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  top: 5rem;
  width: calc(100% - 8rem);
  max-width: 30rem;
  height: calc(100% - 10rem);
  background-color: #1d1d1d;
  box-shadow: 6px 6px 20px #111;
  border-radius: 1rem;
  text-align: center;
}
.closeBtn{
  position: absolute;
  top: 0;
  right: 0;
  background-color: #0000;
  box-shadow: none;
}

@media (max-width: 30rem) {
  .chatInformation{
    transform: unset;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>