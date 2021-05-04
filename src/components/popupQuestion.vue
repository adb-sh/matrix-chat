<template>
  <div class="questionBox">
    <p class="text">{{question}}</p>
    <textbtn text="yes" @click.native="callback(true)"/>
    <textbtn text="no" @click.native="callback(false)"/>
  </div>
</template>

<script>
import textbtn from '@/components/textbtn';
export default {
  name: 'popupQuestion',
  components: {textbtn},
  props:{
    question: String,
    callback: Function
  }
}
</script>

<style scoped lang="scss">
.questionBox{
  position: absolute;
  width: auto;
  background-color: #1d1d1d;
  box-shadow: 6px 6px 10px #111;
  border-radius: 1.5rem;
  .text{
    position: relative;
    width: 100%;
    text-align: center;
  }
}
</style>