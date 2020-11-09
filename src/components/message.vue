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
    margin-top: 0.25rem;
    width: calc(100% - 2rem);
    left: 1rem;
  }
  .message{
    margin-left:auto; margin-right:0;
    position: relative;
    width: max-content;
    min-width: 5rem;
    max-width: calc(100% - 3rem);
    padding: 0.7rem 1rem 0.45rem 1rem;
    right: 0;
    background-color: #42a7b9;
    border-radius: 1rem 1rem 0 1rem;
    text-align: left;
    word-break: break-word;
    white-space: pre-line;
  }

  @media (min-width: 45rem){
    .message{
      margin-left: 0; margin-right: auto;
      border-radius: 1rem 1rem 1rem 0;
    }
  }
</style>