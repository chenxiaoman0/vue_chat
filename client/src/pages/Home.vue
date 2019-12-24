<template>
  <div class="home">
    <navbar>
      <div slot="navBarcenter">首页</div>
    </navbar>
    <div class="home-tab">
      <tab-control class="tab-control" :title="['在线好友','我的群聊']" @getTabControlIndex="itemClick"></tab-control>
      <!-- <tab-item :currentTabType="currentTabType" :userList="userList"></tab-item>
      -->
      <div class="tab-item">
        <scroll ref="scroll" :probeType="3" class="content">
          <div v-if="currentTabType=='myBuddy'">
            <user-item
              v-for="item in $store.state.userList"
              :key="item.id"
              @click.native="Tochat({userId:item.id})"
              :userdata="item"
              @read="cancel"
            ></user-item>
          </div>
          <div v-else>
            <div class="tab-item-header">
              <span class="count">当前群聊数为：{{groundList}}</span>
              <mt-button type="default" @click.native="TogreateGroup" class="tab-item-header-btn">创建群聊</mt-button>
            </div>
            <!-- 已有的群 -->
            <!-- <scroll ref="scroll" :probeType="3" class="content"> -->
            <div v-if="$store.state.chatGroupList">
              <user-item
                v-for="item in $store.state.chatGroupList"
                :key="item.roomId"
                :groupdata="item"
                @click.native="Tochat({roomId:item.roomId})"
              ></user-item>
            </div>
            <!-- </scroll> -->
          </div>
        </scroll>
      </div>
    </div>
  </div>
</template>
<script>
import Navbar from "../components/common/Navbar";
import TabControl from "../components/content/TabControl";
import TabItem from "../components/content/TabItem";
import Scroll from "../components/common/Scroll";
import UserItem from "../components/content/UserItem";
import { getGroupList } from "../network/chat";
export default {
  components: {
    Navbar,
    TabControl,
    TabItem,
    UserItem,
    Scroll
  },
  data() {
    return {
      currentTabType: "myBuddy",
      userList: [],
      //群聊列表
      chatGroupList: []
    };
  },
  created() {
     this.$store.dispatch("setId",this.$socket.id,);
    if (this.$store.state.chatGroupList.length <= 0) {
      getGroupList(this.$store.state.userinfo.id).then(data => {
        // console.log(data)
        if (data.length > 0) {
          this.$store.dispatch("setGroupList", data);
          console.log(data);
          data.forEach(element => {
            console.log(element);
            this.$socket.emit("joinChatGroup", {
              roomId: element.roomId,
              userName: this.$store.state.userinfo.userName
            });
          });
        }
      });
    }
  },
  mounted() {
    this.setlogin();
    this.$refs.scroll.refresh();
  },
  //发起群聊筛选除了自己的用户列表
  computed: {
    grounduserList() {
      return this.$store.state.userList.filter(
        item => item.id != this.$store.state.userinfo.id
      );
    },
    groundList() {
      return this.$store.state.chatGroupList.length;
    }
  },
  sockets: {
    userList(userList) {
      console.log("ss");
      this.$store.dispatch("setUserList", userList);
    },
    //私聊接收消息
    receiveMsg(data) {
      this.$store.dispatch("addUnReadMessage", data.sendId);
      let msg = {
        id: this.$store.state.userinfo.id,
        unreadMessage: this.$store.state.userinfo.unReadMessage
      };
      this.$socket.emit("setUnReadmsg", msg);
      this.$refs.scroll.refresh()
    },
    //群聊接收消息
    receiveMsgGroup(data) {
      this.$store.dispatch("addUnReadMessage", data.roomId);
      //  this.$socket.emit("setUnReadmsg", msg);
      let msg = {
        id: this.$store.state.userinfo.id,
        unreadMessage: this.$store.state.userinfo.unReadMessage
      };
      this.$socket.emit("setUnReadmsg", msg);
    },
    //获取群聊列表
    chatGroupList(chatGroup) {
      this.$store.dispatch("setGroupList", chatGroup);
    },
    //监听创建群聊
    createChatGroup(data) {
      this.$socket.emit("joinChatGroup", {
        roomId: data.roomId,
        userName: this.$store.state.userinfo.userName
      });
    }
  },
  methods: {
    itemClick(i) {
      switch (i) {
        case 0: {
          this.currentTabType = "myBuddy";
          break;
        }
        case 1: {
          this.currentTabType = "myGroup";
          break;
        }
      }
      this.$refs.scroll.refresh();
    },
    //发送登录信息
    setlogin() {
      const {id,socketId,userName,avatar}=this.$store.state.userinfo
      let userInfo = {
        id: id,
        socketId: socketId,
        userName: userName,
        avatar: avatar
      };
      this.$socket.emit("login", userInfo);
    },
    //进去聊天
    Tochat(data) {
      // console.log(data)
      if (data.roomId) {
        this.$router.push({
          path: "/chat",
          query: {
            roomId: data.roomId
          }
        });
      } else {
        this.$router.push({
          path: "/chat",
          query: {
            userId: data.userId
          }
        });
      }
    },
    TogreateGroup() {
      this.$router.push({
        path: "/creategroup"
      });
    },
    cancel() {
      console.log("sss");
      this.activedId = null;
    }
  }
};
</script>
<style lang="scss" scoped>

.tab-item {
  &-header {
    padding: 0px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-btn{
      height: 30px;
      line-height: 30px;
      font-size: 16px;
      color:#fff;
      background: #bac0dc;
    }
  }
  .content {
  // height: 100%;
  background: #fff;
  height: calc(100vh - 40px - 44px);
  overflow: hidden;
  position: relative;
  z-index: 999;
}
}
</style>