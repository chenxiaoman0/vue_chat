<template>
    <div class="nav-bar">
      <div class="left">
        <slot name="navBarLeft"></slot>
      </div>
      <div class="center">
         <slot name="navBarcenter"></slot>
      </div>
      <div class="right">
         <slot name="navBarRight"></slot>
      </div>
    </div>    
</template>
<script>
export default {
    data(){
      return {
        
      }
    }
}
</script>
<style scoped>
.nav-bar{
height: 44px;
line-height: 44px;
background:#609ef4;
color: #fff;
display: flex;
text-align: center;
/* position: fixed; */
top:0;
left: 0;
right: 0;
z-index: 999;
}
.left,.right{
    width: 50px;
    height: 44px;
}
.center{
    flex: 1;
}
</style>