<template>
  <div class="newMessageBanner">
    <textarea name="input" id="newMessageInput" class="newMessageInput" placeholder="type a message ..." type="text" v-model="content" />
    <icon style="position: absolute; right: 1rem; bottom: 0.5rem;" ic="../sym/ic_send_white_24px.svg" />
  </div>
</template>

<script>
import icon from './icon.vue';

export default {
  name: "newMessage",
  components: {
    icon
  },
  props: {
    content: String
  },
  mounted() {
    ResizeListener(document.getElementById("newMessageInput"));
  }
}

export const ResizeListener = (id) => {
  id.addEventListener("input", resize);
}
function resize() {
  this.style.height = "auto";
  this.style.height = `${this.scrollHeight}px`;
}
</script>

<style scoped>
  .newMessageBanner{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: min-content;
    min-height: 4rem;
    background-color: #1d1d1d;
    border-radius: 1rem 1rem 0 0;
  }
  .newMessageInput{
    position: relative;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    left: 2rem;
    min-height: 3rem;
    max-height: 14rem;
    width: calc(100% - 7rem);
    background-color: #fff0;
    border: 0 solid #fff0;
    color: #fff;
    font-size: 1rem;
    resize: none;
    vertical-align: middle;
    font-family: Avenir, Helvetica, Arial, sans-serif;
  }
</style>