<template>
  <div class="reply">
    <span class="username">{{calcUserName(event.sender)}}</span><br>
    <span v-if="event.type==='m.room.message'">
      <span v-if="event.content.msgtype==='m.text'" v-html="parseMessage(event.content.body).substr(0,200)"/>
      <span v-else-if="event.content.msgtype==='m.notice'" class="italic" v-html="parseMessage(event.content.body).substr(0,200)"/>
      <span v-else>
        <span class="italic">{{event.content.msgtype}}</span><br>
        <span>{{event.content.body}}</span>
      </span>
    </span>
    <span v-else>unsupported event</span>
  </div>
</template>

<script>
import {calcUserName} from '@/lib/matrixUtils';
import {parseMessage} from '@/lib/eventUtils';

export default {
  name: 'replyEvent',
  props:{
    event: Object
  },
  methods:{
    calcUserName,
    parseMessage
  }
}
</script>

<style scoped lang="scss">
.reply{
  border-left:  2px solid #fff;
  padding-left: 0.5rem;
  margin-bottom: 0.5rem;
  .username{
    font-weight: bold;
  }
}
.italic{
  font-style: italic;
}
</style>