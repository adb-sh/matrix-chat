<template>
  <div class="roomListElement" :title="room.name">
    <div class="imageContainer">
      <avatar
        class="roomImage"
        :mxcURL="getMxcFromChat(room)"
        :fallback="room.roomId"
        :size="3"
      />
    </div>
    <div class="roomListName">{{room.name}}</div>
    <div class="time">{{getTimeThenDate(getLatestEvent(room).origin_server_ts)}}</div>
    <div class="status"><span class="user">{{calcUserName(getLatestEvent(room).sender)}}:</span> {{getPreviewString(room)}}</div>
  </div>
</template>

<script>
import avatar from '@/components/matrix/avatar';
import {getMxcFromChat} from '@/lib/getMxc';
import {getTimeThenDate} from '@/lib/getTimeStrings';
import {calcUserName} from '@/lib/matrixUtils';

export default {
  name: 'roomListElement',
  components:{
    avatar
  },
  props:{
    room: Object
  },
  methods:{
    getPreviewString(room){
      let event = this.getLatestEvent(room);
      if (!event) return '';
      if (event.content.msgtype) return `${event.content.msgtype==='m.text'?'':event.content.msgtype} ${event.content.body||''}`;
      return `${event.type}`;
    },
    getLatestEvent(room){
      return room.timeline[room.timeline.length-1]
        && room.timeline[room.timeline.length-1].event;
    },
    getMxcFromChat,
    calcUserName,
    getTimeThenDate
  }
}
</script>

<style scoped lang="scss">
.roomListElement{
  position: relative;
  height: 3rem;
  width: 100%;
  min-width: 10rem;
  cursor: pointer;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  .imageContainer{
    position: absolute;
    height: 3rem;
    width: 3rem;
    left: 0.5rem;
    .roomImage {
      height: inherit;
      width: inherit;
    }
  }
  .roomListName{
    position: absolute;
    left: 4rem;
    top: 0.4rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: calc(100% - 10rem);
    text-align: left;
    font-size: 1rem;
  }
  .time{
    position: absolute;
    top: 0.4rem;
    right: 0.5rem;
    font-size: 0.8rem;
  }
  .status{
    position: absolute;
    bottom: 0.4rem;
    left: 4rem;
    font-size: 0.8rem;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: calc(100% - 4.5rem);
    .user{
      font-weight: bold;
    }
  }
}
.roomListElement:hover{
  background-color: #4444;
}
</style>