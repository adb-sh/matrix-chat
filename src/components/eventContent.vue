<template>
  <div v-if="content.msgtype==='m.text'" v-html="parseMessage(content.body)"/>
  <div v-else-if="content.msgtype==='m.notice'" class="notice" v-html="parseMessage(content.body)"/>
  <div v-else-if="content.msgtype==='m.image'" class="image">
    <img :src="getSource(content.url)" :alt="content.body"/><br>
    {{content.body}}
  </div>
  <div v-else-if="content.msgtype==='m.file'" class="file">
    <icon
      title="file"
      ic="./sym/ic_attach_file_white.svg"
    />
    <div class="text">
      <a :href="getSource(content.url)">
        {{content.filename || getSource(content.url)}}
      </a><br>{{content.body}}
    </div>
  </div>
  <div v-else-if="content.msgtype==='m.audio'" class="audio">
    <audio controls>
      <source :src="getSource(content.url)" :type="content.mimetype">
      your browser doesn't support audio
    </audio><br>
    {{content.body}}
  </div>
  <div v-else-if="content.msgtype==='m.video'" class="video">
    <video controls>
      <source :src="getSource(content.url)" :type="content.mimetype">
      your browser doesn't support video
    </video><br>
    {{content.body}}
  </div>
  <div v-else class="italic">unsupported message type {{content.msgtype}}</div>
</template>

<script>
import {getMediaUrl} from '@/lib/getMxc';
import {parseMessage} from '@/lib/eventUtils';
import Icon from '@/components/icon';

export default {
  name: 'eventContent',
  components: {Icon},
  props: {
    content: Object
  },
  methods: {
    getSource(url){
      return url.includes('mxc')?getMediaUrl(url):url;
    },
    parseMessage
  }
}
</script>

<style scoped lang="scss">
.file{
  .text{
    position: relative;
    left: 4rem;
    top: 0;
    width: 100%;
  }
}
.image{
  width: 100%;
  img{
    max-width: 100%;
    height: auto;
    max-height: 35rem;
    border-radius: 0.5rem;
  }
}
.video{
  width: 100%;
  video{
    max-width: 100%;
    height: auto;
    max-height: 35rem;
    border-radius: 0.5rem;
  }
}
.audio{
  audio{
    max-width: 100%;
  }
}
.italic{
  font-style: italic;
}
</style>