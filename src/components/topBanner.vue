<template>
  <div class="topBanner">
    <div>
      <div id = "icon-arrow"><img id="arrow-Top-Left" src="../sym/arrow_back-24px.svg"></div>
      <div id = "point-point"></div>
      <div id = "chatName"> OpenChat</div>
    </div>
  </div>
</template>

<script>
export default {
name: "topBanner"
}
</script>

<style scoped>
#icon-arrow{
  position: absolute;
  top: 0.3rem;
  left: 1rem;
  width: 100%;
  height: 100%;
  max-height: 2.3rem;
  max-width: 2.3rem;
  border-radius: 1.5rem;
  border: #ededed solid 2px;
  text-align: center;
}
#arrow-Top-Left{
  margin-top: 0.4rem;
}
 .topBanner{
   position: absolute;
   width: 100%;
   height: 3rem;
   background-color: #1d1d1d;

 }
</style>