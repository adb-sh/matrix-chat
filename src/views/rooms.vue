<template>
  <div v-if="matrix.loading">
    <throbber-overlay text="loading"/>
  </div>
  <div v-else>
    <div id="roomList" class="roomList">
      <h1 class="wideElement">[chat]</h1><h1 class="smallElement">[c]</h1>
      <input v-model="search" class="input wideElement" type="text" maxlength="50" placeholder="search">
      <div
        v-for="room in Object.assign([], matrix.rooms)
          .sort(obj => obj.timeline[obj.timeline.length-1].event.origin_server_ts)"
        :key="room.roomId" @click="openChat(room)"
      >
        <room-list-element
            v-if="!search || room.name.toLowerCase().includes(search.toLowerCase().trim())"
            :room="room"
            class="roomListElement"
        />
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
    <chatInformation v-if="currentRoom && showChatInfo" :room="currentRoom" :close-chat-info="()=>showChatInfo=false"/>
  </div>
</template>

<script>
import chat from '@/views/chat.vue';
import chatInformation from "@/components/chatInformation";
import {matrix} from "@/main";
import ThrobberOverlay from "@/components/throbberOverlay";
import {getMxcFromRoom} from "@/lib/getMxc";
import roomListElement from "@/components/roomListElement";

export default {
  name: "rooms",
  components:{
    ThrobberOverlay,
    chat,
    chatInformation,
    roomListElement
  },
  methods:{
    openChat(room){
      this.showChatInfo = false;
      this.currentRoom = undefined
      this.$nextTick(() => this.currentRoom = room);
      this.$router.push(`/rooms/${room.roomId}`);
      this.search = '';
    },
    getMxcFromRoom
  },
  data(){
    return {
      matrix,
      currentRoom: undefined,
      showChatInfo: false,
      search: ''
    }
  },
  mounted() {
    if (matrix.client === undefined) this.$router.push('/login');
  }
}
</script>

<style scoped lang="scss">
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
.noRoomSelected{
  position: absolute;
  width: calc(100% - 20rem);
  top: 5rem;
  left: 20rem;
  text-align: center;
}
input{
  width: calc(100% - 5rem);
}
.wideElement{
  display: block;
}
.smallElement{
  display: none;
}

@media (max-width: 48rem) and (min-width: 30rem) {
  .wideElement{
    display: none;
  }
  .smallElement{
    display: block;
  }
  .roomList{
    z-index: 30;
    width: 4rem;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }
  .roomList:hover{
    width: 18rem;
    scrollbar-width: thin;
    box-shadow: 0 0 20px #111;
    .wideElement{
      display: block;
    }
    .smallElement{
      display: none;
    }
  }
  .chat{
    width: calc(100% - 4rem);
  }
  .noRoomSelected{
    left: 4rem;
    width: calc(100% - 4rem);
  }
}

@media (max-width: 30rem) {
  .wideElement{
    display: block;
  }
  .smallElement{
    display: none;
  }
  .roomList{
    width: 100%;
  }
  .chat{
    width: 100%;
  }
  .noRoomSelected{
    display: none;
  }
}
</style>