<template>
  <div class="choose-Img">
    <navbar>
      <div slot="navBarcenter">请选择头像</div>
    </navbar>
    <div class="choose-Img-box">
      <div class="choose-Img-box-item" v-for="(item,index) in avatarList" :key="index">
        <img :src="item.src" @click="selectImg" alt />
      </div>
      <mt-button size="large" type="primary" class="btn" @click.native="Tochat">确定</mt-button>
    </div>
  </div>
</template>
<script>
import Navbar from "../components/common/Navbar";
import { getAvatar, setAvatar } from "../network/chooseimg";
import { Toast } from "mint-ui";
export default {
  components: {
    Navbar
  },
  data() {
    return {
      avatarList: [],
      avatar: ""
    };
  },
  created() {
    getAvatar().then(res => {
      this.avatarList = res;
    });
  },
  methods: {
    selectImg(e) {
      this.avatar = e.target.src;
    },
    Tochat() {
      let data = {
        id: this.$route.query.id,
        avatar: this.avatar
      };
      setAvatar(data)
        .then(res => {
          console.log(res);
          if (res.success == "true") {
            Toast("设置头像成功");
            setTimeout(() => {
              //vuex存储设置头像
              this.$store.dispatch("setAvatar", data);
              this.$router.push({
                path: "/home"
              });
            }, 500);
          }
        })
        .catch(() => {
          Toast("设置头像失败");
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.choose-Img {
  &-box {
    display: flex;
    flex-wrap: wrap;
    padding: 5px;
    box-sizing: border-box;
    &-item {
      width: 30%;
      margin: 0 auto;
      img {
        width: 100%;
      }
    }
    .btn {
      margin-top: 20px;
    }
  }
}
</style>