<template>
  <div class="overlay">
    <throbber :text="text" class="throbber"/>
  </div>
</template>

<script>
import throbber from "@/components/throbber";
export default {
  name: "throbberOverlay",
  components:{
    throbber
  },
  props: {
    text: String
  }
}
</script>

<style scoped>
.throbber{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.overlay{
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #111d;
  user-select: none;
}
</style>