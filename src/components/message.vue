<template>
  <div class="messageContainer">
    <div class="message" :title="time">
      {{msg}}
      <div class="time">{{time}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "message",
  props: {
    msg: String,
    time: String,
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
    margin-left:auto; margin-right:0;
    position: relative;
    width: max-content;
    min-width: 2rem;
    max-width: calc(100% - 3rem);
    padding: 0.7rem 1rem 0.45rem 1rem;
    right: 0;
    background-color: #42a7b9;
    border-radius: 1rem 1rem 0 1rem;
    text-align: left;
    word-break: break-word;
    white-space: pre-line;
  }
  .time{
    position: relative;
    bottom: -0.2rem;
    font-size: 0.7rem;
    text-align: right;
  }
</style>