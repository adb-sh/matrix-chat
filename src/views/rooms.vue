<template>
  <div>
    <div id="roomList" class="roomList">
      <h1>[chat]</h1>
      <h2>{{session.rooms.length}} rooms:</h2>
      <div v-for="room in session.rooms" :key="room.roomId" @click="openChat(room)" class="roomListElement">
        <div class="roomImgPlaceholder">{{room.name.substr(0,2)}}</div>
        <div class="roomListName">{{room.name}}</div>
      </div>
    </div>
    <chat class="chat" v-if="session.currentRoom" />
    <div class="noRoomSelected" v-else>Please select a room to be displayed.</div>
    <div class="roomListSmall">
      <h1>[c]</h1>
      <h2>—</h2>
      <div v-for="(room, index) in session.rooms" :key="index" @click="openChat(room)" class="roomListElement" :title="room.name">
        <div class="roomImgPlaceholder">{{room.name.substr(0,2)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import matrix from '@/matrix.js';
import chat from '@/views/chat.vue'

export default {
  name: "rooms",
  components:{
    chat
  },
  methods:{
    openChat(room){
      this.session.currentRoom = room;
      this.$router.push(`/rooms/${room.roomId}`)
      this.$forceUpdate()
      let msgContainer = document.getElementById("messagesContainer")
      setTimeout(() => {msgContainer.scrollTo(0, msgContainer.scrollHeight)}, 10)
    }
  },
  data(){
    return {
      session: matrix.data().session,
    }
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
  margin-top: 0.5rem;
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
  top: 0;
  height: 2rem;
  width: 3rem;
  padding-top: 1rem;
  background-color: #42a7b9;
  border-radius: 1.5rem;
  text-align: center;
  vertical-align: middle;
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