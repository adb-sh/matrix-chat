<template>
  <div class="userSearch">
    <div v-if="userSearch" class="box">
      <div class="results">
        <user-list-element
          v-for="user in matrix.client.getUsers()
          .filter(prop=>matchResults(prop.displayName, userSearch)||matchResults(prop.userId, userSearch))
          .filter(filter)
          .slice(0,16)"
          :user="user" :key="user.userId"
          @click.native="callback(user); userSearch='';"
          :compact="true"
        />
      </div>
      <div class="filler"></div>
    </div>
    <input v-model="userSearch" type="text" placeholder="search" class="input">
  </div>
</template>

<script>
import userListElement from '@/components/matrix/userListElement';
import {matrix} from '@/main';

export default {
  name: 'userSearch',
  components:{
    userListElement
  },
  props:{
    callback: Function,
    filter: Function
  },
  methods:{
    matchResults(prop, search){
      return prop.toLowerCase().includes(search.toLowerCase().trim());
    }
  },
  data(){
    return {
      matrix,
      userSearch: ''
    }
  }
}
</script>

<style scoped>
.userSearch{
  position: relative;
  background-color: #1d1d1d;
  height: 2.2rem;
  width: 14rem;
  margin: 0.2rem;
}
.input{
  position: absolute;
  width: 13rem;
  margin: 0;
}
.filler{
  height: 2.5rem;
}
.box{
  position: absolute;
  bottom: -0.4rem;
  left: -0.4rem;
  background-color: var(--grey500);
  box-shadow: var(--shadow200);
  width: calc(100% + 0.8rem);
  border-radius: 0.6rem;
}
.results{
  max-height: 10.5rem;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>