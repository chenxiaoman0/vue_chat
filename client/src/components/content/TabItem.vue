<template>
  <div class="tab-item">
    <div v-if="currentTabType=='myBuddy'">
      <!-- <user-item @click.native="Tochat"></user-item> -->
      <user-item 
      v-for="item in userList" 
      :key="item.id" 
      @click.native="Tochat(item.id)" 
      :userdata="item"></user-item>
      <!-- <user-item></user-item> -->
    </div>
    <div v-else>
      <div class="tab-item-header">
        <span class="count">当前群聊数为：{{count}}</span>
        <mt-button type="default">创建群聊</mt-button>
      </div>
      <user-item></user-item>
    </div>
  </div>
</template>
<script>
import UserItem from "./UserItem";
export default {
  components: {
    UserItem
  },
  data() {
    return {
      count: 0
    };
  },
  props: {
    userList: {
      type: Array,
      default() {
        return [];
      }
    },
    currentTabType: {
      type: String,
      default: ""
    }
  },
  methods: {
   
  }
};
</script>
<style scoped lang='scss'>

</style>