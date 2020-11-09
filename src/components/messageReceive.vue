<template>
  <div class="messageContainer">
    <div class="message">
      {{msg}}
    </div>
  </div>
</template>

<script>
export default {
  name: "messageReceive",
  props: {
    msg: String
  }
}
</script>

<style scoped>
  .messageContainer{
    position: relative;
    margin-top: 0.25rem;
    width: calc(100% - 2rem);
    left: 1rem;
  }
  .message{
    position: relative;
    width: max-content;
    min-width: 5rem;
    max-width: calc(100% - 3rem);
    padding: 0.7rem 1rem 0.45rem 1rem;
    left: 0;
    background-color: #42b983;
    border-radius: 1rem 1rem 1rem 0;
    text-align: left;
    word-break: break-word;
    white-space: pre-line;
  }
</style>