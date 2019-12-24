import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //   登录状态保存
    isLogin: false,
    //总的捐赠信息
    userinfo: {
      userName: '', // 当前登录用户名;
      id: '',
      avatar: '', // 用户头像
      socketId: '', // 用户socketId   每个客户端有一个自己的socket.id  通过此id可以实现私聊
      // messageJson : [],// 好友消息列表
      // msgGroupJson : [], // 群聊消息列表,
      unReadMessage: [],
    },
    //未读消息
    unReadMessage: [],
    userList: [],
    //群聊数据
    chatGroupList: []
  },
  mutations: {
    //存储登录状态
    SET_USERINFO(state, payload) {
      state.userinfo = payload;
    },
    SET_Id(state, payload){
      state.userinfo.socketId = payload;
    },
    SET_LOGIN(state, payload) {
      state.isLogin = payload
    },
    SET_Avatar(state, payload){
      state.userinfo.avatar= payload.avatar
    },
    SET_UserList(state, payload) {
      state.userList = payload
    },
    SET_GroupListList(state, payload) {
     if(payload.length>=1){
      state.chatGroupList.push(...payload)
     }else{
      state.chatGroupList.push(payload)
     }
      
    },
    //添加未读消息
    ADD_UnReadMessage(state, payload) {
      if (state.userinfo.unReadMessage) {
        let index = state.userinfo.unReadMessage.findIndex((value, index, arr) => {
          return value.id == payload
        })
        if (index != -1) {
          if(state.userinfo.unReadMessage[index].count>=99){
            state.userinfo.unReadMessage[index].count=99
          }else{
            state.userinfo.unReadMessage[index].count++
          }
        } else {
          let msg = {}
          msg.count = 1
          msg.id = payload
          state.userinfo.unReadMessage.push(msg)
        }
      } else {
        let msg = {}
        msg.count = 1
        msg.id = payload
        state.userinfo.unReadMessage.push(msg)
      }

    },
    Clear_Unread(state, payload) {
      if (state.userinfo.unReadMessage) {
        let index = state.userinfo.unReadMessage.findIndex((value, index, arr) => {
          return value.id == payload
        })
        state.userinfo.unReadMessage.splice(index, 1)
      }

    }
  },
  actions: {
    //设置id
    setId({ commit }, payload){
      commit('SET_Id', payload);
    },
    //记录登录信息
    setUserInfo({ commit }, payload) {
      commit('SET_USERINFO', payload);
    },
    setLogin({ commit }, payload) {
      commit('SET_LOGIN', payload);
    },
    //设置头像
    setAvatar({ commit }, payload) {
      commit('SET_Avatar', payload);
    },
    // 存储在线用户列表
    setUserList({ commit }, payload) {
      commit('SET_UserList', payload);
    }
    ,
    //存储群聊列表
    setGroupList({ commit }, payload) {
      commit('SET_GroupListList', payload);
    },
    //记录未读消息
    addUnReadMessage({ commit }, payload) {
      commit('ADD_UnReadMessage', payload);
    },
    //清除未读记录
    clearUnread({ commit }, payload) {
      commit('Clear_Unread', payload);
    }
  }
});
