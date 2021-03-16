<template>
  <img v-if="mxcURL" :src="thumbnailUrl()" class="userThumbnail" />
  <div v-else class="userThumbnail">
    {{username?username.substr(0,2):userId.substr(1,2)}}
  </div>
</template>

<script>
import parseMXC from '@modular-matrix/parse-mxc';
import {matrix} from "@/main";

export default {
  name: "userThumbnail.vue",
  props: {
    mxcURL: String,
    username: String,
    userId: String,
    width: String,
    height: String,
    resizeMethod: String,
    homeserver: String
  },
  methods: {
    thumbnailUrl(){
      let mxc = parseMXC.parse(this.mxcURL);
      return `${this.homeserver||matrix.baseUrl}/_matrix/media/v1/thumbnail/${mxc.homeserver}/${mxc.id}?width=${this.width}&height=${this.height}&method=${this.resizeMethod}`;
    }
  },
  data(){
    return {
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