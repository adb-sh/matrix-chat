<template>
  <div v-if="matrix.loading">
    loading...
  </div>
  <div v-else>
    <div id="roomList" class="roomList">
      <h1>[chat]</h1>
      <div v-for="room in matrix.rooms" :key="room.roomId" @click="openChat(room)" class="roomListElement">
        <div class="roomImgPlaceholder">{{room.name.substr(0,2)}}</div>
        <div class="roomListName">{{room.name}}</div>
      </div>
    </div>
    <chat class="chat" v-if="currentRoom" :room="currentRoom" :user="matrix.user" />
    <div class="noRoomSelected" v-else>Please select a room to be displayed.</div>
    <div class="roomListSmall">
      <h1>[c]</h1>
      <h2>—</h2>
      <div v-for="(room, index) in matrix.rooms" :key="index" @click="openChat(room)" class="roomListElement" :title="room.name">
        <div class="roomImgPlaceholder">{{room.name.substr(0,2)}}</div>
        <div class="roomListName">{{room.name}}</div>
      </div>
    </div>
    <chatInformation v-if="currentRoom" :room="currentRoom"/>
  </div>
</template>

<script>
import chat from '@/views/chat.vue';
import chatInformation from "@/components/chatInformation";
import {matrix} from "@/main";

export default {
  name: "rooms",
  components:{
    chat,
    chatInformation
  },
  methods:{
    openChat(room){
      this.currentRoom = room;
      chat.data().room = room;
      chat.data().user = matrix.user;
      this.$router.push(`/rooms/${room.roomId}`);
      this.$forceUpdate();
    }
  },
  data(){
    return {
      matrix,
      currentRoom: undefined
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
.roomImgPlaceholder{
  position: absolute;
  left: 1rem;
  height: 2rem;
  width: 3rem;
  padding-top: 1rem;
  background-color: #42a7b9;
  border-radius: 1.5rem;
  text-align: center;
}
.roomImgPlaceholder.small{
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