<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
//   import Pullup from 'better-scroll/pull-up'

//   BScroll.use(Pullup)

export default {
  name: "Scroll",
  data() {
    return {
      scroll: null
    };
  },
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    //下拉
    pullingDown: {
      type: Boolean,
      default: false
    },
    //上拉
    pullUpLoad: {
      type: Boolean,
      default: false
    },
    scrollToEndFlag: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.scroll = new BScroll(".wrapper", {
      click: true,
      probeType: this.probeType,
      pullDownRefresh:this.pullingDown,
      pullUpLoad: {
         threshold: -10 
      }
    });
    this.scroll.on("pullingDown", () => {
      console.log('下拉加载')

       this.$emit("pullingDown");
       setTimeout(() => {
        // this.$refs.scroll.refresh();
        // this.$refs.scroll.finishPullDown();
        this.scroll.refresh()
        this.scroll.finishPullDown()
      }, 100);
    });
    // this.ScrollToEndFlag();
  },
  methods: {
    refresh() {
      console.log('刷新')
      this.scroll && this.scroll.refresh();
    },
    ScrollToEndFlag(delay = 0) {
      // this.refresh();
      if (this.scrollToEndFlag) {
        this.scroll.scrollTo(0, this.scroll.maxScrollY, delay);
      }
      console.log("执行" + this.scroll.maxScrollY);
    },
  }
};
</script>

<style scoped>
</style>
