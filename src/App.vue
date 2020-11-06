<template>
  <div id="app">
    <div class="content">
      <router-view />
      <error />
    </div>
  </div>
</template>

<script>
import error from "@/components/error.vue";

export default {
  name: 'App',
  components:{
    error
  }
}
</script>

<style>
body{
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  position: absolute;
  color: #ffffff;
  background-color: #1d1d1d;
  min-height: 100%;
  width: 100%;
}
.content{
  position: absolute;
  top: 0;
  left: calc(50% - 25rem);
  padding: 0;
  min-height: calc(100%);
  width: 50rem;
  min-width: 18rem;
  background-color: #313131;
  box-shadow: 3px 3px 10px #111;
}
@media (max-width: 55rem){
  .content{
    width: calc(100%);
    left: 0;
  }
}
</style>
