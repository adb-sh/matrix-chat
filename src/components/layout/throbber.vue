<template>
  <div class="box">
    <img class="icon" :src="'./sym/throbber.svg'" alt="[animation]"/>
    <div class="text">{{text}}</div>
  </div>
</template>

<script>
export default {
  name: "throbber",
  props:{
    text: String
  }
}
</script>

<style scoped lang="scss">
  .box{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 8rem;
    width: 8rem;
    background-color: #1d1d1d;
    box-shadow: 6px 6px 10px #111;
    border-radius: 2rem;
    .icon{
      position: absolute;
      top: 15%;
      left: 25%;
      height: 50%;
      width: 50%;
    }
    .text{
      position: absolute;
      bottom: 1rem;
      width: 100%;
      text-align: center;
    }
  }
</style>