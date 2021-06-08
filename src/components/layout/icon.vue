<template>
  <button class="iconContainer" >
    <img class="icon" :src=ic alt="" />
  </button>
</template>

<script>
export default {
name: "icon",
  props: {
    ic: String
  }
}
</script>

<style scoped>
  .iconContainer{
    position: relative;
    width: 3rem;
    height: 3rem;
    border-radius: 1.5rem;
    background-color: #42a7b9;
    box-shadow: 3px 3px 10px #111;
    cursor: pointer;
    user-select: none;
    border: none;
  }
  .icon{
    position: absolute;
    height: 1.5rem;
    width: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>