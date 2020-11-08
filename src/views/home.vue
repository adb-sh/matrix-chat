<template>
  <div>
    <topBannerHome />
    <room roomName="Test" onlineUsers="5" />
    <room roomName="Test2" onlineUsers="5" />
  </div>
</template>
<script>
import topBannerHome from '@/components/topBannerHome'
import room from '@/components/room'

export default {
  name: 'home',
  components: {
    topBannerHome,
    room
  },
  props:{
    roomName: String,
    onlineUsers: String
  }
}
</script>

<style scoped>

</style>
