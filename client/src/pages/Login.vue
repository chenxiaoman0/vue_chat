<template>
  <div class="cont">
    <navbar>
      <div slot="navBarcenter">登录</div>
    </navbar>
    <div class="box">
      <div class="login-box">
        <mt-field placeholder="请输入手机号" type="tel" v-model="phone"></mt-field>
        <mt-field placeholder="请输入密码" type="password" v-model="password"></mt-field>
        <div class="login-btn" @click="login">登录</div>
        <div class="login-btn" @click="register">快速注册</div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/common/Navbar";
import { checkUser } from "../network/login";
import { Toast, MessageBox } from "mint-ui";
export default {
  components: {
    Navbar
  },
  data() {
    return {
      phone: null,
      password: null
    };
  },
  created() {
    // let user = JSON.parse(localStorage.getItem("data"));
    // checkUser(user).then(res => {
    //   if (res.success == "true") {
    //       let userInfo = {
    //         id: res.msg.id,
    //         socketId: this.$socket.id,
    //         userName: res.msg.username,
    //         avatar: res.msg.avatar,
    //         unReadMessage: res.msg.unReadMessage || []
    //       };
    //       //localStorage存储登录状态
    //       // localStorage.setItem("data", JSON.stringify(user));
    //       // console.log(JSON.parse(localStorage.getItem("data")));
    //       //vuex存储登录状态信息
    //       this.$store.dispatch("setLogin", true);
    //       //vuex存储用户信息
    //       this.$store.dispatch("setUserInfo", userInfo);
    //       if (res.msg.avatar) {
    //         this.$router.push({
    //           path: "/home"
    //         });
    //       } else {
    //         this.$router.push({
    //           path: "/chooseimg",
    //           query: {
    //             id: res.msg.id
    //           }
    //         });
    //       }
    //   }
    // });
  },
  methods: {
    //手机号验证
    isPhoneNo(phone) {
      var pattern = /^1[34578]\d{9}$/;
      return pattern.test(phone);
    },
    //密码验证
    verifyPassword(pwd) {
      let pattern = /^[A-Za-z_0-9]{6,16}$/;
      return pattern.test(pwd);
    },
    //登录验证
    login() {
      if (!!!this.phone) {
        Toast("手机号不能为空");
        return;
      }
      if (!this.isPhoneNo(this.phone)) {
        Toast("手机号格式不正确");
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
      let user = {
        phone: this.phone,
        password: this.password
      };
      checkUser(user).then(res => {
        if (res.success == "true") {
          let instance = Toast("登录成功");
          setTimeout(() => {
            instance.close();
            let userInfo = {
              id: res.msg.id,
              socketId: this.$socket.id,
              userName: res.msg.username,
              avatar: res.msg.avatar,
              unReadMessage: res.msg.unReadMessage || []
            };
            //localStorage存储登录状态
            localStorage.setItem("data", JSON.stringify(user));
            // console.log(JSON.parse(localStorage.getItem("data")));
            //vuex存储登录状态信息
            this.$store.dispatch("setLogin", true);
            //vuex存储用户信息
            this.$store.dispatch("setUserInfo", userInfo);
            if (res.msg.avatar) {
              this.$router.push({
                path: "/home"
              });
            } else {
              this.$router.push({
                path: "/chooseimg",
                query: {
                  id: res.msg.id
                }
              });
            }
          }, 1000);
        } else {
          Toast(res.msg);
        }
      });
    },
    //注册
    register() {
      this.$router.push({
        path: "/register"
      });
    }
  }
};
</script>

<style scoped>
.cont {
  height: 100vh;
  background-color: #ffffff;
  position: relative;
  z-index: 999;
  overflow: hidden;
}
.box {
  font-size: 16px;
}
.box .login-box {
  padding: 0 10px 15px;
}
.box .login-box .login-btn {
  margin-top: 10px;
  text-align: center;
  color: #fff;
  padding: 10px 0;
  border-radius: 5px;
  background-color: #609ef4;
}
.methods {
  margin-top: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.methods a {
  display: flex;
  align-items: center;
}
.methods a > img {
  margin-right: 2px;
  width: 12x;
  height: 12px;
}
.methods .m-msg a > img {
  width: 14px;
  height: 14px;
}
</style>