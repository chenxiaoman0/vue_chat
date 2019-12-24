import Vue from 'vue'
import Router from 'vue-router'
import Chat from '@/pages/Chat'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Home from '@/pages/Home'
import ChooseImg from '@/pages/ChooseImg'
import CreateGroup from '@/pages/CreateGroup'
import {checkUser} from '../network/login'
Vue.use(Router)

import { Toast } from "mint-ui";

import store from "../store/index";

let router =new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        isLogin: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        isLogin: false
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        isLogin: false
      }
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat,
      meta: {
        isLogin: true
      }
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        isLogin: true
      }
    },
    {
      path: '/chooseimg',
      name: 'chooseimg',
      component: ChooseImg,
      meta: {
        isLogin: true
      }
    },
    {
      path: '/creategroup',
      name: 'creategroup',
      component: CreateGroup,
      meta: {
        isLogin: true
      }
    },
  ]
})


//全局导航守卫
router.beforeEach((to, from, next) => {
    if (store.state.isLogin === true) {
     next();
   } else {
     if (to.meta.isLogin) {
           console.log(localStorage.getItem("data"))
       /* 如果没有登录状态且要去往需要权限的路径时跳转登录页并进行提示 */
       if(localStorage.getItem("data")){
         let user = JSON.parse(localStorage.getItem("data"));
         console.log(this.$socket)
        console.log('socket')
         checkUser(user).then(res => {
           if (res.success == "true") {
             let userInfo = {
               id: res.msg.id,
               // socketId: this.$socket.id,
               userName: res.msg.username,
               avatar: res.msg.avatar,
               unReadMessage: res.msg.unReadMessage || []
             };
             store.dispatch("setLogin", true);
             //vuex存储用户信息
             store.dispatch("setUserInfo", userInfo);
             if (res.msg.avatar) {
               next({
                 path: "/home"
               });
             } else {
               next({
                 path: "/chooseimg"
               });
             }
           }
         });
//          next();
       }else{
         Toast({
           message: "请先登录",
           position: "bottom",
           duration: 5000
         });
         next({
           path: "/login"
         });
       }

     } else {
       next();
     }
   }

});

export default router;
