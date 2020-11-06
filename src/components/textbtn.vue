<template>
  <button class="btn">
    <div class="btnText">{{text}}</div>
  </button>
</template>

<script>
export default {
  name: "textbtn",
  props:{
    text: String
  }
}
</script>

<style scoped>
  .btn{
    cursor: pointer;
    border: none;
    height: 2.5rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    background-color: #00BCD4;
    box-shadow: 3px 3px 10px #222;
    border-radius: 1.25rem;
  }
  .btnText {
    position: relative;
    font-size: 1.4rem;
    color:#fff;
    font-family:Arial, "lucida console", sans-serif;
  }
</style>