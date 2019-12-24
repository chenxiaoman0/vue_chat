<template>
  <div class="creategroup">
    <navbar>
      <back slot="navBarLeft" @click.native="backTo"></back>
      <div slot="navBarcenter">创建群聊</div>
    </navbar>
    <div class="creategroup-box">
      <!-- 发起聊天 -->
      <!-- <div>当前选中：{{getmemberList}}</div> -->
      <mt-field label="群聊名" placeholder="请输入群聊名" v-model="chatGroupName"></mt-field>
      <div class="creategroup-box-row">
        <span>当前选中：{{getmemberList}}</span>
        <mt-button type="primary" @click.native="ToCreateGroup" class="creatbtn">创建群聊</mt-button>
      </div>
      <scroll ref="scroll" :probeType="3" class="content">
        <div class="grounduserList">
          <user-item
            v-for="item in grounduserList"
            :key="item.id"
            :selected="selected"
            @click.native="selectUser(item)"
            :userdata="item"
            :checkFlag="checkFlag[item.id]?true:false"
            :isShow="false"
          ></user-item>
        </div>
      </scroll>
    </div>
  </div>
</template>
<script>
import Navbar from "../components/common/Navbar";
import UserItem from "../components/content/UserItem";
import Back from "../components/common/Back";
import Scroll from "../components/common/Scroll";
import { Toast } from "mint-ui";
export default {
  components: {
    Navbar,
    UserItem,
    Back,
    Scroll
  },
  data() {
    return {
      currentTabType: "myBuddy",
      userList: [],
      activedId: "",
      count: 0,
      //true表示显示群聊,fasle表示显示用户列表
      selected: false,
      //选中的成员数组
      member: [],
      chatGroupName: "",
      checkFlag: {}
    };
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.$refs.scroll.refresh();
    });
  },
  //发起群聊筛选除了自己的用户列表
  computed: {
    grounduserList() {
      return this.$store.state.userList.filter(
        item => item.id != this.$store.state.userinfo.id
      );
    },
    getmemberList() {
      return this.member.length;
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
    },
    //群聊接收消息
    receiveMsgGroup(data) {
      console.log(data);
      this.$store.dispatch("addUnReadMessage", data.roomId);
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
    backTo() {
      this.$router.back();
    },
    //选择用户发起群聊
    selectUser(user) {
      let index = this.member.findIndex(item => {
        return item.id == user.id;
      });
      if (index == -1) {
        this.member.push(user);
        this.checkFlag[user.id] = true;
      } else {
        this.member.splice(index, 1);
        this.checkFlag[user.id] = false;
      }
    },
    ToCreateGroup() {
      if (this.chatGroupName) {
        const { userName, id, socketId } = this.$store.state.userinfo;
        if (this.member.length <= 1) {
          Toast("请选择两个及以上的用户");
        } else {
          //发起群聊
          this.member.push(this.$store.state.userinfo);
          let data = {
            masterId: id, // 创建者id
            masterName: userName, // 创建者用户名
            // 房间id：可以自己设置房间id拼接规则  这个和用户的socketid不同
            // 用户socketid是socket.id 拿到的， 房间id是自己自定义拼接的，只要保证不重复就可
            roomId: id + Date.now(),
            chatGroupName: this.chatGroupName, // 群名
            member: this.member // 群成员，包含创建者
          };
          this.$store.dispatch("setGroupList", data);
          this.$socket.emit("createChatGroup", data);
          this.$router.replace({
            path: "/chat",
            query: {
              roomId: data.roomId
            }
          });
        }
      } else {
        Toast("请填写完整的房间名");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.creategroup {
  &-box {
    padding: 5px;
    &-row {
      padding: 0 10px;
      display: flex;
      justify-content: space-between;
    }
    .creatbtn {
      height: 30px;
      font-size: 16px;
      background: #609ef4;
    }
    .content {
      // height: 100%;
      background: #fff;
      height: calc(100vh - 44px - 5px - 48px - 30px);
      overflow: hidden;
      position: relative;
      z-index: 999;
    }
  }
}
</style>