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
        <input type="text" placeholder="和大家聊会天？" v-model="text" />
      </div>
      <div class="send_btn" @click="sendMsg">发送</div>
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
        }
      ]
    };
  },
  created(){
    
  },
  methods: {
    sendMsg() {
      if (!this.text) {
        return;
      }
      if (!this.$store.state.userinfo.token) {
            // this.$toast("请先登录");
            window.Login&&window.Login.login();
      } else {
        this.msg.push({
          type: 2,
          anchor: "我",
          text: this.text
        });
        this.$nextTick(()=>{
          $('.msg-shower').scrollTop(10000)
        })
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
  padding-bottom: 20px;
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
    background-color: rgb(245, 245, 245);
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
      border-radius: 18px;
      background: #e0dfdf;
      padding: 0 13px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      outline-style: none;
    }
    .send_btn {
      width: 60px;
      height: 30px;
      line-height: 30px;
      color: #fff;
      text-align: center;
      cursor: pointer;
      border-radius: 5px;
      background: #ff3846;
      font-size: 14px;
      user-select: none;
    }
  }
}
</style>

