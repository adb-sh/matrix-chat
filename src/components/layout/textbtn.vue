<template>
  <button class="btn">
    <div class="btnText">{{text}}</div>
  </button>
</template>

<script>
export default {
  name: "textbtn",
  props:{
    text: String,
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
    background-color: var(--primary);
    box-shadow: var(--shadow100);
    border-radius: 1rem;
    margin: 0.2rem;
  }
  .btn.primary{
    background-color: var(--primary);
  }
  .btn.underline{
    background-color: unset;
    text-decoration: underline;
    color: #fff;
    box-shadow: none;
  }
  .btn.rounded{
    border-radius: 1.25rem;
  }
  .btn.outline{
    background-color: unset;
    box-shadow: none;
    text-decoration: underline;
    border: #fff solid 1px;
  }
  .btn.squared{
    border-radius: 0;
  }
  .btnText {
    position: relative;
    font-size: 1rem;
    color:#fff;
    font-family:Arial, "lucida console", sans-serif;
  }
</style>