<template>
  <div v-if="matrix.loading">
    loading...
  </div>
  <div v-else>
    <div id="roomList" class="roomList">
      <h1>[chat]</h1>
      <div v-for="room in matrix.rooms" :key="room.roomId" @click="openChat(room)" class="roomListElement">
        <userThumbnail
          class="roomImg"
          :mxcURL="getUrl(room)"
          :fallback="room.roomId"
          :size="3"
        />
        <div class="roomListName">{{room.name}}</div>
      </div>
    </div>
    <chat
      class="chat"
      v-if="currentRoom"
      :room="currentRoom"
      :user="matrix.user"
      :close-chat="()=>currentRoom=undefined"
      :open-chat-info="()=>showChatInfo=true"
    />
    <div class="noRoomSelected" v-else>Please select a room to be displayed.</div>
    <div class="roomListSmall">
      <h1>[c]</h1>
      <div v-for="(room, index) in matrix.rooms" :key="index" @click="openChat(room)" class="roomListElement" :title="room.name">
        <userThumbnail
            class="roomImg"
            :mxcURL="getUrl(room)"
            :fallback="room.roomId"
            :size="3"
        />
        <div class="roomListName">{{room.name}}</div>
      </div>
    </div>
    <chatInformation v-if="currentRoom && showChatInfo" :room="currentRoom" :close-chat-info="()=>showChatInfo=false"/>
  </div>
</template>

<script>
import chat from '@/views/chat.vue';
import chatInformation from "@/components/chatInformation";
import userThumbnail from "@/components/userThumbnail";
import {matrix} from "@/main";
import sdk from "matrix-js-sdk";

export default {
  name: "rooms",
  components:{
    chat,
    chatInformation,
    userThumbnail
  },
  methods:{
    openChat(room){
      this.currentRoom = room;
      this.$router.push(`/rooms/${room.roomId}`);
      this.$forceUpdate();
      //chat.methods.scrollToBottom();
    },
    getUrl(room){
      let avatarState = room.getLiveTimeline().getState(sdk.EventTimeline.FORWARDS).getStateEvents("m.room.avatar");
      return avatarState.length>0?avatarState[avatarState.length-1].getContent().url:undefined;
      //return this.room.getLiveTimeline().getStateEvents("m.room.avatar");
    }
  },
  data(){
    return {
      matrix,
      currentRoom: undefined,
      showChatInfo: false
    }
  },
  mounted() {
    if (matrix.client === undefined) this.$router.push('/login');
  }
}
</script>

<style scoped>
.roomList{
  position: absolute;
  left: 0;
  top: 0;
  width: 18rem;
  height: 100%;
  background-color: #222;
  text-align: center;
  overflow-y: auto;
}
.chat{
  position: absolute;
  right: 0;
  top: 0;
  width: calc(100% - 18rem);
  height: 100%;
  background-color: #313131;
}
.roomListElement{
  position: relative;
  height: 3rem;
  margin: 0.5rem 0 0.5rem 0;
  font-size: 1.2rem;
  cursor: pointer;
  background-color: #222;
}
.roomListName{
  position: absolute;
  left: 4.5rem;
  top: 1rem;
  color: #fff;
}
.roomListSmall{
  position: absolute;
  left: 0;
  top: 0;
  width: 4rem;
  height: 100%;
  background-color: #222;
  text-align: center;
  display: none;
  overflow-y: auto;
  overflow-x: hidden;
  animation: ease;
  animation-duration: 0.2s;
  scrollbar-width: none;
}
.roomListSmall:hover{
  width: 18rem;
  scrollbar-width: thin;
  box-shadow: 0 0 20px #111;
}
.roomListSmall::-webkit-scrollbar {
  width: 0;
}
.roomListSmall:hover::-webkit-scrollbar {
  width: 0.5rem;
}
.noRoomSelected{
  position: absolute;
  width: calc(100% - 20rem);
  top: 5rem;
  left: 20rem;
  text-align: center;
}
.roomImg{
  position: absolute;
  left: 0.5rem;
  height: 3rem;
  width: 3rem;
}
.roomImg.small{
  margin-left: calc(50% - 2rem);
}

@media (max-width: 48rem) {
  .roomList{
    display: none;
  }
  .chat{
    width: calc(100% - 4rem);
  }
  .roomListSmall{
    display: block;
  }
  .roomImgPlaceholder{
    left: 0.5rem;
  }
  .noRoomSelected{
    left: 4rem;
    width: calc(100% - 4rem);
  }
}

@media (max-width: 30rem) {
  .roomList{
    width: 100%;
  }
  .chat{
    width: 100%;
  }
  .noRoomSelected{
    display: none;
  }
  .roomListSmall{
    display: none;
  }
  .roomList{
    display: block;
  }
}
</style>