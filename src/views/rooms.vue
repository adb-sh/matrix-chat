<template>
  <div>
    <div id="roomList" class="roomList">
      <h1>[chat]</h1>
      <h2>rooms</h2>
      <div class="roomListElement" v-for="(room, index) in rooms" :key="index">
        <router-link @click="getRooms()" :to="`/rooms/${room.roomId}`">
          <div class="roomListName">{{room.name}}</div>
        </router-link>
      </div>
      <textbtn @click.native="getRooms()" text="update" />
    </div>
    <chat class="chat" v-if="this.$router.currentRoute.fullPath.split('/',3)[2]" />
    <div class="noRoomSelected" v-else>Please select a room to be displayed.</div>
  </div>
</template>

<script>
import matrix from '@/matrix.js';
import textbtn from "@/components/textbtn";
import chat from '@/views/chat.vue'

export default {
  name: "rooms",
  props: {
    rooms: String
  },
  components:{
    textbtn,
    chat
  },
  methods:{
    getRooms(){
      //matrix.methods.getRooms()
      //console.log(matrix.methods.getRooms())
    }
  },
  data(){
    return {
      session: matrix.data().session
    }
  }
}
</script>

<style scoped>
.roomList{
  position: absolute;
  left: 0;
  top: 0;
  width: 20rem;
  height: 100%;
  background-color: #222;
  text-align: center;
  overflow-y: auto;
}
.chat{
  position: absolute;
  right: 0;
  top: 0;
  width: calc(100% - 20rem);
  height: 100%;
  background-color: #313131;
}
.roomListElement{
  position: relative;
  height: 3rem;
  margin-top: 1rem;
  font-size: 1.2rem;
}
.roomListName{
  position: absolute;
  left: 5rem;
}
.noRoomSelected{
  position: absolute;
  width: calc(100% - 20rem);
  top: 5rem;
  left: 20rem;
  text-align: center;
}

/*@media (max-width: 45rem) {
  .roomList{
    width: 4rem;
  }
  .chat{
    width: calc(100% - 4rem);
  }
}*/

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
}
</style>