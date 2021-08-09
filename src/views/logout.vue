<template>
  <div class="logout">
    <popup class="center" :onClose="()=>$router.go(-1)">
      <h2>Logout</h2>
      <p>Delete all local data? <input v-model="deleteData" type="checkbox"></p>
      <textbtn text="Logout" class="redBtn" @click.native="logout()"/>
      <textbtn text="Cancel" class="outline" @click.native="()=>$router.go(-1)"/>
    </popup>
    <overlay v-if="loading"><throbber :text="loading"/></overlay>
  </div>
</template>

<script>
import overlay from '@/components/layout/overlay';
import popup from '@/components/layout/popup';
import textbtn from '@/components/layout/textbtn';
import throbber from '@/components/layout/throbber';
import {matrix} from '@/main';
import {DataStore} from '@/lib/DataStore';

export default {
  name: 'logout',
  components:{
    overlay,
    popup,
    textbtn,
    throbber
  },
  data(){
    return{
      deleteData: true,
      loading: false
    }
  },
  methods:{
    async logout(){
      this.loading = 'logging out';
      await matrix.logout();
      this.loading = 'removing data';
      await new DataStore().set('login', {});
      if (this.deleteData) await matrix.deleteAllData();
      this.loading = false;
      this.$router.push('/login')
    },
  },
  created(){
    if (matrix.client === undefined) this.$router.push('/login');
  }
}
</script>

<style scoped lang="scss">
.logout{
  position: absolute;
  height: 100%;
  width: 100%;
}
.redBtn{
  background-color: var(--red);
}
</style>