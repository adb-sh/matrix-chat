<template>
  <div>
    <topBannerHome />
    <router-link to="/chat"><room roomName="Test" onlineUsers="5" /></router-link>
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
