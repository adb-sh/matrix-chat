<template>
  <div v-if="content.msgtype==='m.text'" v-html="parseMessage(content.body)" :class="getEmojiClass(content)"/>
  <div v-else-if="content.msgtype==='m.notice'" class="notice" v-html="parseMessage(content.body)"/>
  <image-viewer v-else-if="content.msgtype==='m.image'" :alt="content.body" class="image" :class="compact?'compact':''">
    <img :src="getSource(content.url)" :alt="content.body" :class="compact?'compact':''"/><br>
    {{content.body}}
  </image-viewer>
  <div v-else-if="content.msgtype==='m.file'" :class="`file ${compact?'compact':''}`">
    <a :href="getSource(content.url)" target="_blank">
      <div class="fileContent">
        <icon title="file" ic="./sym/ic_attach_file_white.svg" class="download"/>
        <div class="filename">{{content.filename || getSource(content.url)}}</div>
      </div>
    </a>
    <div class="text">{{content.body}}</div>
  </div>
  <div v-else-if="content.msgtype==='m.audio'" :class="`audio ${compact?'compact':''}`">
    <audio controls :class="`${compact?'compact':''}`">
      <source :src="getSource(content.url)" :type="content.mimetype">
      your browser doesn't support audio
    </audio><br>
    {{content.body}}
  </div>
  <div v-else-if="content.msgtype==='m.video'" :class="`video ${compact?'compact':''}`">
    <video controls :class="`${compact?'compact':''}`">
      <source :src="getSource(content.url)" :type="content.mimetype">
      your browser doesn't support video
    </video><br>
    {{content.body}}
  </div>
  <div v-else-if="content.msgtype" class="italic">unsupported message type: {{content.msgtype}}</div>
  <div v-else class="italic">deleted message</div>
</template>

<script>
import {getMediaUrl} from '@/lib/getMxc';
import {parseMessage} from '@/lib/eventUtils';
import Icon from '@/components/layout/icon';
import imageViewer from '@/components/layout/imageViewer';

export default {
  name: 'eventContent',
  components: {
    Icon,
    imageViewer
  },
  props: {
    content: Object,
    compact: {
      type: Boolean,
      default: false
    },
    onUpdate: {
      type: Function,
      default: ()=>{}
    }
  },
  methods: {
    getSource(url){
      return url.includes('mxc')?getMediaUrl(url):url;
    },
    getEmojiContentLength(content){
      return content.body.match(/^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])+$/)
          && content.body.match(/\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]/g).length
          || 0;
    },
    getEmojiClass(content){
      let emojiLength = this.getEmojiContentLength(content);
      if (emojiLength > 1) return 'emoji';
      if (emojiLength === 1) return 'bigEmoji';
      return '';
    },
    parseMessage
  },
  updated() {
    this.onUpdate();
  }
}
</script>

<style scoped lang="scss">
.emoji{
  font-size: 2rem;
}
.bigEmoji{
  font-size: 3rem;
}
.file{
  max-width: 30rem;
  .fileContent{
    position: relative;
    background-color: #1d1d1d;
    padding: 0.5rem;
    border-radius: 0.5rem;
    min-height: 3rem;
    .filename{
      display: inline-block;
      position: relative;
      margin-left: 4rem;
      top: 0;
      height: 100%;
    }
    .download{
      position: absolute;
    }
  }
  .compact{
    max-width: 20rem;
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
  .compact{
    max-width: 8rem;
    max-height: 8rem;
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
  .compact{
    max-width: 8rem;
    max-height: 8rem;
  }
}
.audio{
  audio{
    max-width: 100%;
  }
  .compact{
    max-width: 16rem;
    max-height: 8rem;
  }
}
.italic{
  font-style: italic;
}
</style>