<template>
  <div class="messageContainer">
    <div class="message">
      {{msg}}
    </div>
  </div>
</template>

<script>
export default {
  name: "message",
  props: {
    msg: String
  }
}
</script>

<style scoped>
  .messageContainer{
    position: relative;
    margin-top: 0.5rem;
    width: calc(100% - 2rem);
    left: 1rem;
  }
  .message{
    margin-left:auto; margin-right:0;
    position: relative;
    width: max-content;
    min-width: 5rem;
    max-width: calc(100% - 3rem);
    padding: 1rem;
    right: 0rem;
    background-color: #42b983;
    border-radius: 1rem 1rem 0rem 1rem;
    text-align: left;
  }
</style>