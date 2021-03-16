<template>
  <img v-if="mxcURL" :src="thumbnailUrl()" class="image"/>
  <Identicon v-else :value="fallback" :theme="'jdenticon'" :size="this.getFontSize()*this.size" class="identicon"/>
</template>

<script>
import parseMXC from '@modular-matrix/parse-mxc';
import {matrix} from "@/main";
import Identicon from '@vue-polkadot/vue-identicon';

export default {
  name: "userThumbnail.vue",
  components: {
    Identicon
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
  border-radius: 1.5rem;
  .image{
    border-radius: 10rem;
    background-color: unset;
  }
}
</style>