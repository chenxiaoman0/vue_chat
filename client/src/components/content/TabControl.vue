<template>
    <div class="tab-control">
        <div class="tab-control-item">
            <div v-for="(value,index) in title" :key="index" @click="itemClick(index)" :class="{active:index==currentIndex}">
            <span>{{value}}</span>
            </div>     
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            currentIndex:0
        }
    },
    props:{
        title:{
            type:Array,
            default(){
                return []
            }
        }
    },
    methods:{
        itemClick(i){
             this.currentIndex=i;
             this.$emit('getTabControlIndex',i)
        }
    }
}
</script>
<style scoped>
.tab-control{
    width: 100%;
    height: 40px;
    line-height: 40px;
    /* background: silver; */
    text-align: center;
    z-index: 998;
}
.tab-control-item{
    display: flex;
}
.tab-control-item div{
    flex: 1;
}
.tab-control-item div span{
    font-size: 15px;
    padding: 6px;
    margin: 0 auto;
}
.active{
    color: #609ef4;
}
.active span{
 border-bottom: 1px solid #609ef4;
}
</style>