
<template>
  <router-view />
</template>

<script>
export default {
  created() {
    if (localStorage.getItem("isDebug")) {
     
      var debuger = document.createElement("script");
      debuger.src = "./static/js/vconsole.js";
      debuger.onload = function() {
        var vConsole = new VConsole();
      };
      document.body.append(debuger);
    }
    // debugger
    //ie浏览器vue路由兼容
    function checkIE() {
      return "-ms-scroll-limit" in document.documentElement.style;
    }
    if (checkIE()) {
      window.addEventListener(
        "hashchange",
        () => {
          var currentPath = window.location.hash.slice(1);
          if (this.$route.path !== currentPath) {
            this.$router.push(currentPath);
          }
        },
        false
      );
    }

  }
};
</script>

<style  lang="scss">

#app {
  font-family: "FZLTZHK--GBK1-0", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
}
html,body{
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
*{
  box-sizing: border-box;
}
</style>
