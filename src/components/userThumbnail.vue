<template>
  <img v-if="mxcURL" :src="thumbnailUrl()" class="userThumbnail image"/>
  <div v-else v-html="getJdenticon()" class="userThumbnail identicon"/>
</template>

<script>
import parseMXC from '@modular-matrix/parse-mxc';
import {matrix} from "@/main";
import {toSvg} from 'jdenticon';

export default {
  name: "userThumbnail.vue",
  components: {
  },
  props: {
    mxcURL: String,
    username: String,
    fallback: String,
    homeserver: String,
    size: Number
  },
  methods: {
    thumbnailUrl(){
      let mxc = parseMXC.parse(this.mxcURL);
      return `${this.homeserver||matrix.baseUrl}/_matrix/media/v1/thumbnail/${
        mxc.homeserver}/${mxc.id}?width=${this.imageSize}&height=${this.imageSize}&method=${this.resizeMethod}`;
    },
    getFontSize(){
      return window.getComputedStyle(document.body,null).fontSize.split("px", 1)||16;
    },
    getJdenticon(){
      return toSvg(this.fallback, this.getFontSize()*this.size);
    }
  },
  data(){
    return {
      resizeMethod: 'scale',
      imageSize: 128
    }
  }
}
</script>

<style scoped lang="scss">
.userThumbnail{
  border-radius: 50%;
  background-color: unset;
}
.identicon {
  clip-path: circle(49% at 50% 50%);
  background-color: #111;
}
</style>