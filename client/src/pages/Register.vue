<template>
  <div class="cont">
    <navbar>
      <back slot="navBarLeft" @click.native="backTo"></back>
      <div slot="navBarcenter">注册</div>
    </navbar>
    <div class="box">
      <div class="register-box">
        <mt-field placeholder="请输入手机号" type="tel" v-model="phone"></mt-field>
        <mt-field placeholder="请输入用户昵称" type="text" v-model="username"></mt-field>
        <mt-field placeholder="请输入密码" type="password" v-model="password"></mt-field>
        <div class="register-btn" @click="sendRegister">注册</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import Navbar from "../components/common/Navbar";
import Back from "../components/common/Back";
import { isPhoneNo, timeOut } from "../common/utils";
import { register } from "../network/login";
import { MessageBox } from "mint-ui";
export default {
  components: {
    Navbar,
    Back
  },
  data() {
    return {
      phone: null,
      password: null,
      username: ""
    };
  },
  methods: {
    //点击返回上一页面
    backTo() {
      this.$router.back();
    },
    sendRegister() {
      //注册
      if (!!!this.phone) {
        Toast("手机号不能为空");
        return;
      }
      if (!isPhoneNo(this.phone)) {
        Toast("手机号格式不正确");
        return;
      }
      if (!!!this.username) {
        Toast("用户名不能为空");
        return;
      }
      if (!!!this.password) {
        Toast("密码不能为空");
        return;
      }
      if (this.password.length < 6 || this.password.length > 12) {
        Toast("密码的长度在6-12位之间");
        return;
      }
      const user = {};
      user.phone = this.phone;
      user.username = this.username;
      user.password = this.password;
      register(user).then(res => {
        if (res.success == "true") {
          MessageBox({
            title: "提示",
            message: "注册成功！将前往选择头像",
          }).then(() => {
              let userInfo = {
                id: res.msg.id,
                socketId: this.$socket.id,
                userName: res.msg.username,
                avatar: res.msg.avatar,
                unReadMessage: res.msg.unReadMessage || []
              };
              //vuex存储登录状态信息
              this.$store.dispatch("setLogin", true);
              //vuex存储用户信息
              this.$store.dispatch("setUserInfo", userInfo);
              this.$router.push({
                path: "/chooseimg",
                query: {
                  id: res.msg.id
                }
              });
            
          });
        } else if (res.success == "false") {
          MessageBox({
            title: "提示",
            message: "该用户名已被注册",
            showCancelButton: true
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.disabled_btn {
  pointer-events: none;
  color: gainsboro;
  border-color: gainsboro;
}
.cont {
  height: 100vh;
  position: relative;
  z-index: 999;
  overflow: hidden;
  background-color: #ffffff;
}
.code {
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.code .seconds,
.code .seconding {
  height: 33px;
  width: 88px;
  text-align: center;
  line-height: 33px;
  margin-top: 10px;
  border-radius: 5px;
}
.code .seconding img {
  width: 100%;
  height: 100%;
}
.code .seconds {
  color: #a9a9a9;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  pointer-events: none;
}
.code .seconding {
  color: #609ef4;
  border: 1px solid #609ef4;
}
.code .seconding > img {
  vertical-align: inherit;
  border-radius: 5px;
}
/* .code a {
    width: 7.5rem !important;
  } */
.box {
  font-size: 14px;
}
.box .register-box {
  padding: 0 10px 15px;
}
.box .register {
  height: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.box .register > img {
  margin: 0 auto;
  width: 5rem;
  height: 3.3rem;
}
.box .register-box .register-btn {
  margin-top: 10px;
  text-align: center;
  color: #fff;
  padding: 10px 0;
  border-radius: 5px;
  background-color: #609ef4;
}
</style>