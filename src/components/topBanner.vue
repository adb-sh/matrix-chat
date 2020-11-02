<template>
  <div class="topBanner">
    <div>
      <div id = "icon-arrow"><img alt="arrow" class="arrow-Top-Left" src="../sym/arrow_back-24px.svg"></div>
      <div id = "picTop"><img alt="Bild" id="picTopPic" src="../sym/placeholder.png"></div>
      <div id="container">
        <div id = "chatName"> OpenChat</div>
        <div id = "users">9 Mitglieder</div>
      </div>
      <div id = "icon-menu"><img alt="menu" class="menu-Top-Right" src="../sym/menu-24px.svg"></div>
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
  top: 0.24rem;
  left: 1rem;
  width: 100%;
  height: 100%;
  max-height: 2.3rem;
  max-width: 2.3rem;
  border-radius: 1.5rem;
  border: #ededed solid 2px;
  text-align: center;
  background-color: #3a8d9c;
}
.arrow-Top-Left{
  margin-top: 0.2rem;
  height: 2rem;
  width: 2rem;
}
#picTop{
  top: 0.24rem;
  position: absolute;
  fill: #42a7b9;
  left: 4rem;
}
#picTopPic{
  width: 2.3rem;
  height: 2.3rem;
  border-radius: 1.5rem;
  border: #ededed solid 2px;
  background-color: #3a8d9c;
}
#container{
  position: absolute;
  top: 0.55rem;
  left: 7.5rem;
}
#chatName{
  font-size: medium;
  color: #ededed;
}
#users{
  font-size: x-small;
  color: #9c9c9c;
}
#icon-menu{
  position: absolute;
  top: 0.24rem;
  right: 1rem;
  width: 100%;
  height: 100%;
  max-height: 2.3rem;
  max-width: 2.3rem;
  border-radius: 1.5rem;
  border: #ededed solid 2px;
  text-align: center;
  background-color: #3a8d9c;
}
.menu-Top-Right {
  margin-top: 0.2rem;
  height: 2rem;
  width: 2rem;
}
 .topBanner{
   position: absolute;
   width: 100%;
   height: 3rem;
   background-color: #1d1d1d;
 }
</style>