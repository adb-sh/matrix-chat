<template>
  <popup :on-close="callback">
    <h2>{{title}}</h2>
    <p>{{question}}</p>
    <textbtn :text="action" @click.native="callback(true)"/>
    <textbtn text="Cancel" @click.native="callback(false)" class="outline"/>
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
    action: {
      type: String,
      default: 'Apply'
    }
  }
}
</script>

<style scoped lang="scss">
</style>