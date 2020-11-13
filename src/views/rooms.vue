<template>
  <div>
    <div class="roomList" v-for="room in rooms" :key="room.name">
      <router-link :to="'/chat/'+room.roomId">
        <div class="roomListName">{{room.name}}</div>
      </router-link>
    </div>
    <textbtn @click.native="getRooms()" text="update" />
  </div>
</template>

<script>
import matrix from '@/matrix.js';
import textbtn from "@/components/textbtn";

export default {
  name: "rooms",
  components:{
    textbtn
  },
  methods:{
    getRooms(){
      this.rooms = matrix.methods.getRooms()
      console.log(matrix.methods.getRooms())
    }
  },
  data(){
    return {
      rooms: matrix.rooms
    }
  }
}
</script>

<style scoped>
.roomList{
  position: relative;
  height: 3rem;
  margin-top: 1rem;
  font-size: 1.2rem;
}
.roomListName{
  position: absolute;
  left: 5rem;
}
</style>