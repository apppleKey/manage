<template>
  <div class="chat-pc-cpt">
    <div class="msg-shower">
      <div class="msg-item" v-for="(item,index) in msg" :key="'hismsg'+index">
        <span class="hisname" :class="{yellow:item.type==2,red:item.type==1}">{{item.anchor}}：</span>
        <span class="his-text">{{item.text}}</span>
      </div>
    </div>
    <div class="msg-editor">
      <div class="msg-input-con">
        <input type="text" placeholder="吐个槽呗~" v-model="text" />
      </div>
      <div class="send_btn" @click="sendMsg"></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      text: "",
      msg: [
        {
          type: 1,
          anchor: "直播间消息",
          text:
            "直播内容包含任何低俗、暴露和涉黄内容，账号会被封禁；安全部门会24小时巡查哦~"
        },
        {
          type: 1,
          anchor: "直播间消息",
          text: "欢迎来到直播间~"
        }
      ]
    };
  },
  methods: {
    sendMsg() {
      if (!this.text) {
        return;
      }
      if (!this.$store.state.userinfo.token) {
        // this.$toast("请先登录");
        let url =
          window.location.origin +
          "/index.php?g=h5&m=user&a=login&url=" +
          btoa(encodeURI(window.location.href));
        window.location.href = url;
        return;
      } else {
        this.msg.push({
          type: 2,
          anchor: "我",
          text: this.text
        });
        this.$nextTick(() => {
          $(".msg-shower").scrollTop(10000);
        });
        this.text = "";
      }
    }
  }
};
</script>

<style lang="scss" scope>
.chat-pc-cpt {
  height: 100%;
  width: 100%;
  padding-bottom: 2.6rem;
  position: relative;
  .msg-shower {
    width: 100%;
    height: 100%;
    background-color: #fff;
    overflow: auto;
    text-align: left;
    padding: 5px;
    font-size: 12px;
    .msg-item {
      color: #4b4b4b;
      word-wrap: break-word;
      word-break: break-all;
      line-height: 24px;
      font-size: 14px;
      unicode-bidi: bidi-override;
      padding: 2px 0;
    }
    .yellow {
      color: #ffd350;
    }
    .red {
      color: #fe5d67;
    }
  }
  .msg-editor {
    border-top: 1px solid #eee;
    background-color: #fff;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    padding: 5px 10px;
    align-items: center;

    .msg-input-con {
      flex: 1;
      margin-right: 20px;
    }
    input {
      display: inline-block;
      height: 30px;
      line-height: 30px;
      width: 100%;
      background: #f7f7f7;
      padding: 0 13px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      outline-style: none;
    }
    .send_btn {
      background: #ff3846;
      width: 1.6rem;
      height: 1.6rem;
      margin: 0 0.5rem;
      background: url(../../static/imgs/sendbg.png) no-repeat center/cover;
    }
  }
}
</style>

