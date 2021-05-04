<template>
  <img v-if="mxcURL" :src="getPreviewUrl(mxcURL)" class="userThumbnail image"/>
  <div v-else v-html="getJdenticon()" class="userThumbnail identicon"/>
</template>

<script>
import {toSvg} from 'jdenticon';
import {getPreviewUrl} from '@/lib/getMxc';

export default {
  name: 'userThumbnail.vue',
  components: {
  },
  props: {
    mxcURL: String,
    username: String,
    fallback: String,
    size: Number
  },
  methods: {
    getFontSize(){
      return window.getComputedStyle(document.body,null).fontSize.split('px', 1)||16;
    },
    getJdenticon(){
      return toSvg(this.fallback, this.getFontSize()*this.size);
    },
    getPreviewUrl
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