<template>
    <div :class="`${type==='send'?'messageSend':'messageReceive'} ${group?'groupMessage':''}`" class="message" :title="time">
      <div v-html="solveTextLinks(msg.replace(/</g, '&lt')
         .replace(/>/g, '&gt'))"></div>
      <div class="time">{{time}}</div>
    </div>
</template>

<script>
export default {
  name: "message",
  props: {
    msg: String,
    time: String,
    type: String,
    group: Boolean
  },
  methods:{
    solveTextLinks(text){
      return (text || "").replace(
        /([^\S]|^)(((https?:\/\/)|(www\.))(\S+))/gi,
        (match, space, url)=>{
          let hyperlink = url;
          if (!hyperlink.match('^https?://')) {
            hyperlink = 'http://' + hyperlink;
          }
          return `${space}<a href="${hyperlink}" target="_blank">${url}</a>`;
        }
      )
    }
  }
}
</script>

<style scoped>
  .message{
    position: relative;
    width: max-content;
    min-width: 2rem;
    max-width: calc(100% - 5rem);
    padding: 0.7rem 1rem 0.45rem 1rem;
    background-color: #42a7b9;
    border-radius: 1rem 1rem 0 1rem;
    text-align: left;
    word-break: break-word;
    white-space: pre-line;
    margin-top: 0.25rem;
  }
  .messageReceive{
    margin-left: 1rem;
    background-color: #42b983;
    border-radius: 1rem 1rem 1rem 0;
  }
  .messageSend{
    margin-left:auto; margin-right:1rem;
    background-color: #42a7b9;
    border-radius: 1rem 1rem 0 1rem;
  }
  .messageReceive.groupMessage{
    margin-left: 3rem;
    max-width: calc(100% - 7rem);
  }
  .messageSend.groupMessage{
    max-width: calc(100% - 6rem);
  }
  .time{
    position: relative;
    bottom: -0.2rem;
    font-size: 0.7rem;
    text-align: right;
  }
</style>