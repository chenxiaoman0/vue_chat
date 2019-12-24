<template>
  <div id="app">
    <!-- <keep-alive exclude="chat"> -->
        <router-view></router-view>
    <!-- </keep-alive> -->
  </div>
</template>

<script>
export default {
  name: 'App',
  sockets:{
    //好友退出
    quit(userList) {
      this.$store.dispatch("setUserList", userList);      
    },

  }
}
</script>

<style>
@import './assets/css/base.css';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
