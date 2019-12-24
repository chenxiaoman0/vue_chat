<template>
  <div class="chat">
    <navbar>
      <back slot="navBarLeft" @click.native="backTo"></back>
      <div slot="navBarcenter">{{chatName}}</div>
    </navbar>
    <div class="chat-msg" ref="msg-box">
      <!-- 刷新提示信息 -->
      <div class="top-tip">
        <span class="refresh-hook">{{pulldownMsg}}</span>
      </div>
      <scroll
        ref="scroll"
        :probeType="3"
        class="content"
        :pullingDown="true"
        :scrollToEndFlag="true"
        @pullingDown="pullingDown"
      >
        <div
          v-for="(item,index) in list"
          :key="index"
          class="msg"
          
        >
          <p v-if="item.roomId" class="msg-userName">{{item.userName}}</p>
          <!-- <span >{{item.userName}}</span> -->
          <!-- <div class="msg-content"> -->
          <div class="msg-content" :class="item.sendId ==$store.state.userinfo.id?'right':'left'">
            <div class="msg-user-head">
              <img :src="item.avatar" alt />
            </div>
            <div class="msg-user-content">
              <img class="msg-user-content-image" :src="item.chatMes" alt v-if="item.type==1" />
              <span v-else v-text="item.chatMes"></span>
            </div>
          </div>

          <!-- </div> -->
        </div>
      </scroll>
    </div>
    <div class="chat-input">
      <input type="text" ref="sendMsg" v-model="contentText" @keyup.enter="sendText()" />
      <div class="btn" :class="{['btn-active']:contentText}" @click="sendText()">发送</div>
      <label for="inputId" class="chat-input-icon">
        <img src="../assets/img/icon/addimage.svg" alt />
      </label>
      <input
        type="file"
        accept="image/*"
        id="inputId"
        @change="changeImage($event)"
        style="display:none"
      />
    </div>
  </div>
</template>
 
<script>
import Navbar from "../components/common/Navbar";
import Back from "../components/common/Back";
import Scroll from "../components/common/Scroll";
import { Toast, Loadmore } from "mint-ui";
// import { Loadmore } from 'mint-ui';
import { formatDate } from "../common/utils";
// encodeHtml;
import {
  addRecord,
  getRecord,
  getGroupRecord,
  uploadImg
} from "../network/chat";

export default {
  name: "chat",
  components: {
    userName: "",
    Navbar,
    Scroll,
    Back
  },
  data() {
    return {
      count: 0,
      page: 1,
      list: [], //聊天记录的数组
      contentText: "", //,input输入的值，
      maxImageCount: 1, //最大上传图片数量,，
      pulldownMsg: "",
      totalCount: 0,
      topStatus: ""
    };
  },
  created() {
    this.$nextTick(() => {
      //请求获取历史记录
      this.getHistory(this.page);
      //消除未读消息
      this.clearUnread();
    });
  },
  mounted() {
    if (this.$route.query.roomId) {
      console.log("有用户进入");
      this.$socket.emit("joinChatGroup", {
        roomId: this.$route.query.roomId,
        userName: this.$store.state.userinfo.userName
      });
    }
    setTimeout(() => {
      console.log("滚动到底部");
      this.$refs.scroll.ScrollToEndFlag();
    }, 50);
  },
  sockets: {
    getName(data) {
      this.userName = data.userName;
    },
    //监听好友上线
    userList(userList) {
      console.log("ss");
      this.$store.dispatch("setUserList", userList);
    },
    //好友退出
    quit(userList) {
      this.$store.dispatch("setUserList", userList);
    },
    //私聊接收消息
    receiveMsg(data) {
      // 判断此条消息的sendId(发送者id) 是不是当前正在聊天的对象
      // true 页面绘制聊天消息
      if (data.sendId === this.$route.query.userId) {
        this.list.push(data);
      } else {
        this.$store.dispatch("addUnReadMessage", data.sendId);
        let msg = {
          id: this.$store.state.userinfo.id,
          unreadMessage: this.$store.state.userinfo.unReadMessage
        };
        this.$socket.emit("setUnReadmsg", msg);
      }
      setTimeout(() => {
        this.$refs.scroll.ScrollToEndFlag(500);
      }, 100);
      // this.$refs.scroll.ScrollToEndFlag(500);
    },
    //群聊接收消息
    receiveMsgGroup(data) {
      // 判断此条消息的sendId(发送者id) 是不是当前正在聊天的房间
      if (data.roomId == this.$route.query.roomId) {
        this.list.push(data);
      } else {
        this.$store.dispatch("addUnReadMessage", data.roomId);
        let msg = {
          id: this.$store.state.userinfo.id,
          unreadMessage: this.$store.state.userinfo.unReadMessage
        };
        this.$socket.emit("setUnReadmsg", msg);
      }
      setTimeout(() => {
        this.$refs.scroll.ScrollToEndFlag(500);
      }, 100);
      // this.$refs.scroll.ScrollToEndFlag(500);
    },
    //有用户加入群聊
    chatGrSystemNotice(data) {
      console.log(data);
    },
    //有新建群消息
    //获取群聊列表
    chatGroupList(chatGroup) {
      this.$store.dispatch("setGroupList", chatGroup);
    }
  },
  methods: {
    loadTop() {
      // 加载更多数据
      this.pullingDown();
      // this.$refs.loadmore.onTopLoaded();
    },
    //滚动条到底部
    scrollBottm() {
      this.$refs.scroll.ScrollToEndFlag();
    },
    //发送聊天信息
    sendText(imgsrc = "", type = 0) {
      const { avatar, userName, id } = this.$store.state.userinfo;
      //判断是否私聊 是则
      if (this.$route.query.userId) {
        let info = {
          sendId: id, // 发送者id
          toId: this.$route.query.userId, // 接收者id
          userName: userName, // 发送者用户名
          avatar: avatar, // 发送者头像
          chatMes: imgsrc || this.contentText, // 发送内容,
          type: type
        };
        this.list.push(info);
        this.$socket.emit("sendMsg", info);
      } else {
        let info = {
          sendId: id, // 发送者id
          roomId: this.$route.query.roomId, // 房间Id
          userName: userName, // 发送者用户名
          avatar: avatar, // 发送者头像
          chatMes: imgsrc || this.contentText, // 发送内容
          type: type
        };
        this.list.push(info);
        this.$socket.emit("sendMsgGroup", info);
      }
      //移动滚动条到底部
      setTimeout(() => {
        this.$refs.scroll.ScrollToEndFlag(500);
      }, 100);
      this.contentText = "";
    },
    //获取历史记录
    getHistory(page) {
      // 获取聊天记录
      let sendId = this.$store.state.userinfo.id;
      if (this.$route.query.userId) {
        //判断是否第一次访问 是则将消息存储到vuex里面
        let toId = this.$route.query.userId;
        getRecord(toId, sendId, page).then(res => {
          if (page == 1) {
            this.totalCount = res.totalCount;
          }
          res.data.reverse();
          this.list.unshift(...res.data);
          this.$refs.scroll.refresh();
        });
      } else {
        let roomId = this.$route.query.roomId;
        getGroupRecord(roomId, sendId, page).then(res => {
          if (page == 1) {
            this.totalCount = res.totalCount;
          }
          res.data.reverse();
          this.list.unshift(...res.data);
          this.$refs.scroll.refresh();
        });
      }
    },
    clearUnread() {
      if (this.$route.query.userId) {
        this.$store.dispatch("clearUnread", this.$route.query.userId);
        let msg = {
          id: this.$store.state.userinfo.id,
          unreadMessage: this.$store.state.userinfo.unReadMessage
        };
        this.$socket.emit("setUnReadmsg", msg);
      } else {
        // let roomId = this.$route.query.roomId;
        this.$store.dispatch("clearUnread", this.$route.query.roomId);
        let msg = {
          id: this.$store.state.userinfo.id,
          unreadMessage: this.$store.state.userinfo.unReadMessage
        };
        this.$socket.emit("setUnReadmsg", msg);
      }
    },
    backTo() {
      this.$router.go(-1);
    },

    //上传图片
    changeImage(e) {
      // 上传图片事件
      const { socketId, avatar, userName, id } = this.$store.state.userinfo;
      if (e.target.files > this.maxImageCount) {
        Toast("最多只能上传" + this.maxImageCount + "张图片！");
        return;
      }
      let file = e.target.files[0];
      console.log(file.type);
      // if((file.type!="image/jpeg")||(file.type!="image/png")||(file.type!="image/jpg")){
      //    Toast("图片格式不正确，请上传jpg或png格式");
      //    return
      // }
      if (file.size / 1024 > 10) {
        Toast("图片过大，请发送10KB以下的图片");
        return;
      }
      let data = new FormData();
      data.append("file", e.target.files[0]);
      uploadImg(data).then(res => {
        if (res) {
          let imgsrc = res.imgsrc;
          let type = 1;
          this.sendText(imgsrc, type);
        } else {
          Toast("上传失败");
        }
      });
    },
    //上拉加载更多
    pullingDown() {
      let totalPage = Math.ceil(this.totalCount / 10);
      console.log(totalPage);
      console.log(this.page);
      if (totalPage > this.page) {
        this.page++;
        this.getHistory(this.page);
      }
      setTimeout(() => {
        this.$refs.scroll.refresh();
      }, 100);
    },
    getDateTime(addTime) {
      // console.log(addTime)
        return formatDate(new Date(addTime))
    }
  },
  computed: {
    chatName() {
      let obj = {};
      if (this.$route.query.userId) {
        obj = this.$store.state.userList.find((value, index) => {
          return value.id == this.$route.query.userId;
        });
        return obj.userName;
      } else {
        obj = this.$store.state.chatGroupList.find((value, index) => {
          return value.roomId == this.$route.query.roomId;
        });
        return obj.chatGroupName;
      }
      // return obj.userName || obj.chatGroupName;
    }
  }
};
</script>
 
<style lang="scss" scoped>
.chat {
  background: #fafafa;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &-msg {
    .content {
      background: #fff;
      height: calc(100vh - 40px - 50px);
      overflow: hidden;
      position: relative;
      z-index: 999;
      // display: flex;
    }
    // .scrollcontent {
    //   // overflow: scroll;
    //   height: 100%;
    //   background: #fff;
    //   height: calc(100vh - 40px - 50px);
    //   overflow: hidden;
    //   position: relative;
    //   z-index: 999;
    // }
    .msg {
      padding: 10px;
      box-sizing: border-box;
      // display: flex;
      // align-items: flex-start;
      background: white;
      &-content {
        display: flex;
        .msg-user {
          &-head {
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: 50px;
              height: 50px;
            }
          }
          &-content {
            border-radius: 10px;
            padding: 7px 7px;
            margin: 0 10px;
            line-height: 30px;
            text-align: left;
            &-image {
              width: 100px;
              height: 100px;
            }
          }
        }
      }

      &-userName {
        text-align: left;
      }
    }
    .left {
      justify-content: flex-start;
      animation: toLeft 0.5s ease both 1;
    }
    .right {
      color: white;
      flex-direction: row-reverse;
      animation: toright 0.5s ease both 1;
      .msg-user-content {
        background: rgba(158, 234, 106, 1);
      }
    }
  }
  &-input {
    box-sizing: border-box;
    width: 100%;
    height: 40px;
    background: #fafafa;
    box-shadow: 0 0 5px #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    padding: 0 8px;
    &-icon {
      img {
        width: 40px;
        height: 40px;
      }
    }
    input {
      height: 30px;
      display: inline-block;
      flex: 1;
      border: none;
      border-radius: 5px;
    }
    .btn {
      width: 19%;
      background: #e0e0e0;
      padding: 5px;
      color: white;
      text-align: center;
      border-radius: 5px;
      margin-left: 10px;
      transition: 0.5s;
    }
    .btn-active {
      background: #409eff;
    }
  }
}
</style>