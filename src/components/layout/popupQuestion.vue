<template>
  <popup :on-close="onReject">
    <h2>{{title}}</h2>
    <p>{{question}}</p>
    <textbtn :text="action" @click.native="callback()"/>
    <textbtn :text="reject" @click.native="onReject()" class="outline"/>
  </popup>
</template>

<script>
import textbtn from '@/components/layout/textbtn';
import popup from '@/components/layout/popup';

export default {
  name: 'popupQuestion',
  components: {
    textbtn,
    popup
  },
  props:{
    title: String,
    question: String,
    callback: Function,
    onReject: Function,
    action: {
      type: String,
      default: 'Apply'
    },
    reject: {
      type: String,
      default: 'Cancel'
    }
  }
}
</script>

<style scoped lang="scss">
</style>