<template>
  <div id="login">
    <h1 class="title">short your url</h1>
    <div class="input-field" id="longurl">
      <label for="longurl-input"></label>
      <input class="input" id="longurl-input" type="text" autocomplete="off" maxlength="20" placeholder="chose nickname">
    </div>
    <input type="hidden" value="search" name="login">
    <textbtn text="login" />
  </div>
</template>

<script>
import textbtn from '@/components/textbtn';

export default {
  name: "login.vue",
  components: {
    textbtn
  }
}
</script>

<style scoped>
#login{
  text-align: center;
}
</style>