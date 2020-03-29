<template>
  <div class="header_blank">
    <div class="header">
      <div class="nav">
        <a href="/" target="_self">
          <img class="logo" src="@/assets/imgs/logo.png" alt />
        </a>
        <div class="userlogin">
          登录 | 注册
          <img class="loginlogo" :src="'./static/images/login.png'" alt />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.header_blank {
  height: 143px;
  .header {
    height: 143px;
    // position: fixed;
    // left: 0;
    // top: 0;
    // right: 0;
    // z-index: 5000;
     background: #181818;
    .nav {
      height: 143px;
      width: 1180px;
      margin: 0 auto;
      background: #181818 url("../../../../static/images/lang.png") no-repeat
        450px top / 607px 158px;
      .logo {
        margin-top: 41px;
        width: 466px;
        height: 67px;
      }
      .userlogin {
        float: right;
        width: 230px;
        height: 50px;
        background: rgba(70, 70, 70, 1);
        text-align: center;
        line-height: 50px;
        font-size: 19px;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        cursor: pointer;
        .loginlogo {
          width: 20px;
          height: 20px;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>