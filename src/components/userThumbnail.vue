<template>
  <img v-if="mxcURL" :src="thumbnailUrl()" class="userThumbnail" />
  <div v-else class="userThumbnail">
    <p>{{username?username.substr(0,2):userId.substr(1,2)}}</p>
  </div>
</template>

<script>
import parseMXC from '@modular-matrix/parse-mxc';
import matrix from '@/matrix.js';

export default {
  name: "userThumbnail.vue",
  props: {
    mxcURL: String,
    username: String,
    userId: String,
    width: Number,
    height: Number,
    resizeMethod: String
  },
  methods: {
    thumbnailUrl(){
      let mxc = parseMXC.parse(this.mxcURL);
      return `${this.homeserver}/_matrix/media/v1/thumbnail/${mxc.homeserver}/${mxc.id}?width=${this.width}&height=${this.height}&method=${this.resizeMethod}`;
    }
  },
  data(){
    return {
      homeserver: matrix.data().session.baseUrl
    }
  }
}
</script>

<style scoped>
.userThumbnail{
  background-color: #42a7b9;
  width: 3rem;
  height: 3rem;
  border-radius: 1.5rem;
}
img.userThumbnail{
  background-color: unset;
}
</style>