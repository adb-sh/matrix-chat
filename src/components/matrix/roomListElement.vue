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
    <div class="status">{{previewString}}</div>
  </div>
</template>

<script>
import avatar from '@/components/matrix/avatar';
import {getMxcFromChat} from '@/lib/getMxc';
import {getTime} from '@/lib/getTimeStrings';
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
      return `${this.calcUserName(event.sender)}: ${event.content.body||'unknown event'} ${getTime(event.origin_server_ts)}`;
    },
    getLatestEvent(room){
      return room.timeline[room.timeline.length-1]
        && room.timeline[room.timeline.length-1].event;
    },
    getMxcFromChat,
    calcUserName,
  },
  data(){
    return {
      previewString: 'loading'
    }
  },
  created() {
    this.previewString = this.getPreviewString(this.room);
  }
}
</script>

<style scoped lang="scss">
.roomListElement{
  position: relative;
  height: 3rem;
  width: 100%;
  font-size: 1.2rem;
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
    top: 0.25rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: calc(100% - 5rem);
    text-align: left;
  }
  .status{
    position: absolute;
    top: 1.5rem;
    left: 4rem;
    font-size: 0.8rem;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: calc(100% - 4.5rem);
  }
}
.roomListElement:hover{
  background-color: #4444;
}
</style>