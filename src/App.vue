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
input{
  padding: 0 2rem 0 2rem;
  height: 2.5rem;
  color: #fff;
  background-color: #1d1d1d;
  border-radius: 1.25rem;
  border: 0.1rem solid #fff;
  text-align: center;
  font-size: 1.1rem;
  margin: 0.5rem;
  appearance: none;
  outline: none;
}
input:focus{
  color: #000;
  background-color: #fff;
}
*{
  scrollbar-width: thin;
  scrollbar-color: #42b983 #2220;
}
*::-webkit-scrollbar {
  width: 0.5rem;
  height: 0.5rem;
}
*::-webkit-scrollbar-track {
  background: none;
}
*::-webkit-scrollbar-thumb {
  background-color: #42b983;
  border-radius: 0.25rem;
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
  left: calc(50% - 35rem);
  padding: 0;
  min-height: 100%;
  width: 70rem;
  min-width: 18rem;
  background-color: #313131;
  box-shadow: 3px 3px 10px #111;
}
@media (max-width: 75rem){
  .content{
    width: 100%;
    left: 0;
  }
}
</style>
