<template>
  <div class="useritem">
    <img v-if="userdata.avatar" :src="userdata.avatar" class="useritem-avatar" alt />
    <img class="useritem-avatar" src="../../assets/img/group.jpg" v-else alt />
    <div class="useritem-box">
      <div class="useritem-box-left">
        <p>{{userdata.userName||groupdata.chatGroupName}}</p>
      </div>
      <div class="useritem-box-right">
        <div v-show="isShow">
            <slot name="icon">
              <div class="tips" v-if="getTips">{{getTips}}</div>
            </slot>
        </div>

        <img v-if="checkFlag" src="../../assets/img/icon/xuanzhong-active.svg" alt />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    userdata: {
      type: Object,
      default() {
        return {};
      }
    },
    groupdata: {
      type: Object,
      default() {
        return {};
      }
    },
    checkFlag: {
      type: Boolean,
      default: false
    },
    isShow:{
      type:Boolean,
      default:true
    }
  },
  computed: {
    getTips() {
      let unReadMessage = this.$store.state.userinfo.unReadMessage;
      if (unReadMessage) {
        let obj = unReadMessage.find((value, index) => {
          if (this.userdata.id) {
            return value.id == this.userdata.id;
          } else {
            return value.id == this.groupdata.roomId;
          }
        });
        if (obj) {
          return obj.count;
        } else {
          return null;
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.useritem {
  display: flex;
  justify-content: flex-start;
  padding: 10px;
  &-avatar {
    width: 70px;
    height: 70px;
    vertical-align: baseline;
  }
  &-box {
    padding: 0px 10px;
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    &-right {
      img {
        width: 50px;
        height: 50px;
      }
      .tips {
        width: 30px;
        height: 30px;
        line-height: 30px;
        background: #f36868;
        color: #fff;
        border-radius: 50%;
      }
    }
  }
}
</style>