<template>
  <div id="errorBox" class="errorBox">
    <icon class="errorBtn" onclick="this.parentNode.style.display = 'none'" ic="/sym/ic_close_white_24px.svg" />
    <div id="errorMessage" class="btnText">
      {{msg}}
    </div>
  </div>
</template>

<script>
import icon from './icon.vue';

export default {
name: "error",
  components: {
    icon
  },
  props:{
    msg: String
  }
}
</script>

<style scoped>
  .errorBox{
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    height: 10rem;
    width: 16rem;
    background-color: #E53935;
    border-radius: 15px;
  }
  #errorBox{
    display: none;
  }
  .btnText {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.4rem;
    color: #fff;
    font-family:Arial, "lucida console", sans-serif;
  }
  .errorBtn{
    position: absolute;
    top: 0rem;
    right: 0rem;
    background-color: #0000;
    box-shadow: none;
  }

  @keyframes slide-from-left{
    from{left:-30rem;opacity: 0}
    to{left:1rem;opacity: 1}
  }

  @media (max-width: 35rem) {
    .errorBox {
      bottom: 1rem;
      left: 1rem;
      height: 8rem;
      width: calc(100% - 2rem);
    }
  }
</style>