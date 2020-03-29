<template>
    <div class="loading" v-show="loading">
    <!-- <div class="loading" :class="loading?'show':''"> -->
      <!-- <mt-spinner :type="3" class="loading-spinner" ></mt-spinner> -->
    </div>
</template>
<script>
export default {
    props:['loading']
}
</script>


<style lang="scss" scoped>
@import "~@/assets/css/mixin.scss";

.loading {
  // position: fixed;
  // left: 0;
  // top: 0;
  // bottom: 0;
  // right: 0;
  // display: none;
  // z-index: 3000;
  // text-align: center;
  // vertical-align: middle;
  // color: white;
  // transition: all 1s;
  // transform: scale(1.5);
  // transition: all 1s;
  // font-size: 0.12rem;
  // color: gray;
  //  transform: scale(3);
  // span {
  //   // margin-top: 300px;
  //   position: absolute;
  //   top: 50%;
  //   left: 50%;
  //   transform: translate(-50%, -50%);
  // }
  // &.show {
  //   display: block;
  //   background: rgba(255, 255, 255, 0.1);
   
  // }

}
//新加载层
.loading{
  position: fixed;
  left: 50%;
  top: 50%;
  @include wh(70px,70px);
  margin-left: -35px;
  margin-top: -35px;
  background-image: url("../../static/imgs/new_loading.png");
  background-repeat: no-repeat;
  background-size: 2000% 100%;
  -webkit-animation:changload steps(20) 1.5s infinite;
  animation:changload steps(20) 1.5s infinite;
  z-index: 2000;
  .load_text{
    position: absolute;
    left: 50%;
    bottom: p2r(-72);
    @include wh(120px,auto);
    margin-left: -60px;
    background: rgba($color: #000000, $alpha: 0.6);
    color: #FFF;
    font-size: p2r(28);
    line-height: p2r(54);
    padding: 0 p2r(20);
    text-align: center;
    word-break: break-all;
  }
}
@-webkit-keyframes changload{
  0%{
    background-position: 0 0;
  }
  100%{
    background-position: -1400px - 0;
  }
}
@keyframes changload{
  0%{
    background-position: 0 0;
  }
  100%{
    background-position: -1400px 0;
  }
}

</style>

