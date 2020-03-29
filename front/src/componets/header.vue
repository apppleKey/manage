<template>
  <div class="head">
    <div class="top">
      <div class="logo" @click="goToOrigin">
        <img :src="'./static/imgs/logo1.png'" />
      </div>
      <!-- <p class="to_login" v-if="!userid"><span> 登录 </span> <span> 注册 </span></p> -->
      <p v-if="!$store.state.userinfo.token" class="to_login"><span @click="linkTo('login')">登 录</span></p>
      <div class="search" v-else @click="goSearch">
        <span class="search_hold">主播/赛事/球队</span>
        <span class="search_ico"><svg t="1572502204620" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2017" width="100%" height="100%"><path d="M441.202561 155.004283c38.164205 0 75.16798 7.467065 109.983927 22.192442 33.646308 14.231119 63.87068 34.611286 89.834005 60.57461 25.963325 25.963325 46.343491 56.187697 60.57461 89.834005 14.7264 34.815947 22.192442 71.819722 22.192442 109.983927 0 38.164205-7.467065 75.169003-22.192442 109.98495-14.231119 33.645284-34.611286 63.869656-60.57461 89.834005-25.963325 25.963325-56.187697 46.343491-89.834005 60.57461-34.815947 14.725376-71.819722 22.192442-109.983927 22.192442s-75.16798-7.467065-109.983927-22.192442c-33.645284-14.231119-63.869656-34.611286-89.834005-60.57461-25.963325-25.963325-46.343491-56.187697-60.57461-89.834005-14.7264-34.815947-22.192442-71.819722-22.192442-109.98495 0-38.164205 7.466042-75.16798 22.192442-109.983927 14.231119-33.646308 34.611286-63.87068 60.57461-89.834005s56.187697-46.344514 89.834005-60.57461C366.034581 162.471348 403.038356 155.004283 441.202561 155.004283M441.202561 119.6818c-175.574784 0-317.90849 142.332682-317.90849 317.90849 0 175.576831 142.332682 317.90849 317.90849 317.90849S759.111051 613.167121 759.111051 437.589266C759.111051 262.014482 616.777345 119.6818 441.202561 119.6818L441.202561 119.6818z" p-id="2018" fill="#ff3456"></path><path d="M718.874651 706.431248c1.669012 0 4.106528 0.448208 6.244214 2.585895l137.374764 137.374764c3.443425 3.443425 3.443425 9.045003 0 12.488429-2.137687 2.137687-4.576225 2.585895-6.245238 2.585895s-4.107551-0.448208-6.244214-2.585895L712.629413 721.504548c-2.137687-2.137687-2.585895-4.574179-2.585895-6.243191 0-1.667989 0.448208-4.105504 2.587941-6.244214C714.768123 706.880479 717.206662 706.431248 718.874651 706.431248M718.874651 671.108764c-11.299347 0-22.599717 4.311189-31.221072 12.932544-17.244756 17.242709-17.244756 45.199435 0 62.442144l137.373741 137.374764c8.621355 8.621355 19.921725 12.932544 31.222095 12.932544 11.30037 0 22.600741-4.311189 31.222095-12.932544 17.242709-17.242709 17.242709-45.199435 0-62.442144L750.095723 684.041308C741.474368 675.41893 730.175021 671.108764 718.874651 671.108764L718.874651 671.108764z" p-id="2019" fill="#ff3456"></path></svg></span>
      </div>
    </div>
    <div class="nav swiper-container" id="navMenu">
      <div class="swiper-wrapper">
        <a :href="locations + '/index.php?g=H5&m=NewIndex&a=index'" target="_self" class="nav_tab swiper-slide">首页</a>
        <a :href="locations + '/index.php?g=h5&amp;m=index&amp;a=recommend'" target="_self" class="nav_tab swiper-slide">推荐</a>
        <a :href="locations + '/index.php?g=h5&m=anchor&a=index'" target="_self" class="nav_tab swiper-slide">体育</a>
        <a :href="locations + '/H5/paylist/'" target="_self" class="nav_tab swiper-slide">娱乐</a>
        <a :href="locations + '/coor/docs/index.html#/h5/live'" target="_self" class="nav_tab swiper-slide active">综合</a>
        <a :href="locations + '/H5/page/#/'" target="_self" class="nav_tab swiper-slide ">资讯</a>
        <a :href="locations + '/topic/H5/index'" target="_self" class="nav_tab swiper-slide">风采</a>
      </div>
    </div>
  </div>
</template>
<script>
import Swiper from "swiper";
export default {
  data() {
    return {
      locations: window.location.origin,
      menu: {}
    }
  },
  created(){
  if(!this.$store.state.userinfo.token){
      this.$store.dispatch('freshToken').then(res=>{
        this.$forceUpdate()
      })
    }
    // setInterval(() => {
      
    
    //   console.log(this.$store.state.userinfo.token)
    // },1000)
  },

  mounted() {
    this.menu = new Swiper("#navMenu", {
      slidesPerView: 6.2,
      spaceBetween: 0,
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      },

      roundLengths: true
    })
    // console.log(menu)
  },
  methods: {
    goToOrigin() {
      window.location.href = window.location.origin;
    },
    linkTo(type){
      let url = window.location.origin + (type === 'login' ? '/index.php?g=h5&m=user&a=login&url=' : '/index.php?g=h5&m=user&a=regist&url=') + btoa(encodeURI(window.location.href))
      window.location.href = url
    },
    goSearch(){
      window.location.href = window.location.origin + '/coor/docs/index.html#/h5/search'
    }
  },
  destroyed() {
    this.menu.destroy();
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/css/mixin.scss";
.head {
  
  color: #fff;
  font-size: p2r(50);
  border-bottom: 1px solid #d0d0d0;
  .top {
    background: #ff3441;
    position: relative;
    @include wh(100%, 2.4rem);
    @include fs;
    padding: 0 0.61rem;
    box-sizing: border-box;
    .logo {
      position: relative;
      img {
        width: 7rem;
        display: block;
      }
    }
    .to_login {
      position: relative;
      @include wh(auto, auto);
      color: #fff;
      font-size: p2r(24);
      span{
        display: block;
        width: 4rem;
        height: 1.3rem;
        background: #fff;
        color: #ff303e;
        font-size: 0.8rem;
        font-weight: 600;
        text-align: center;
        line-height: 1.3rem;
        box-shadow: 0 0 10px #661f24;
        border-radius: 4px;
      }
    }
    .search{
      position: relative;
      @include wh(6.6rem,1.3rem);
      border-radius: 4px;
      background: #fff;
      overflow: hidden;
      box-shadow: 0 0 3px #ccc;
      @include fs;
      padding: 0 p2r(15);
      .search_hold{
        font-size: p2r(25);
        color: #666;
        line-height: 1.3rem;
      }
      .search_ico{
        @include rwh(38,38);
        @include fc;
      }
    }
  }
  .nav {
    position: relative;
    @include wh(100%, 2rem);
    background: #FFF;
    .nav_tab {
      position: relative;
      text-align: center;
      line-height: 2rem;
      font-size: p2r(32);
      color: #333;
      &.active {
        color: #ff3441;
        font-weight: 600;
        border-bottom: 2px solid #ff3441;
      }
    }
  }
}
</style>
