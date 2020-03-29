<template>

      <div class="router">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive" />
    </div>
   
</template>
<script>
import Header from "@/views/PC/components/header.vue";
import Footer from "@/views/PC/components/footer.vue";

export default {
  components:{Header,Footer},
  data() {
    return {
      isNext:false,
      isShowHeader:false,
      isShowFooter:false
    };
  },
  created() {
    // debugger
      // this.$store.dispatch("freshToken")
  },
  mounted() {
    // if (this.$route.meta.needHeaderFooter) {
    //   $(".router").css({
    //     "padding-top": "169px",
    //     'min-height': "900px"
    //   });
    //   this.isShowHeader=true;
    //   this.isShowFooter=true;
    // }else{
    //     this.isNext=true
    // }
  }
};
</script>
<style lang="scss" scoped>

</style>


