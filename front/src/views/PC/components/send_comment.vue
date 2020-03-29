<template>
  <div class="replaycon1 send_commemnt_cnpt" >
    <div class="replay_avandar1">
      <img v-lazy="$store.state.userinfo.avatar_thumb" alt />
    </div>
    <div class="replay1_right">
      <div class="counter">{{commentText.length}}/120</div>
      <textarea type="text" class="commemnt_ipt" v-model="commentText"  ></textarea>

      <div class="commemnt_tools">
        <span class="iconfont icon-xiaolian face_btn" @click="showPanle($event)"> <span style="margin-left:10px;color:#373737">表情</span>
          <div class="emojs_conn" v-show="isShowEmojPanle" unselectable="on">
            <img
              v-lazy="'./static/images/face/'+index+'.gif'"
              :title="item"
              unselectable="on"
              v-for="(item,index) in emojs"
              :key="'emojs'+index"
              class="emojs_item"
              @click="chooseFace($event,item,index)"
            />
          </div>
        </span>
        <div class="opration_btns">
          <!-- 添加表情 -->

          <!-- <span class="cancel_btn" :class="{enable:commentText.length}" @click="hide">取消</span> -->
          <span style="margin-right:40px;font-weight: 400;font-size: 18px;color:#373737">最多120个字</span>
          <span class="submit_btn" :class="{enable:commentText.length}" @click="submit">发布评论</span>
        </div>
      </div>
      <div class="faceWrap" @click="isShowEmojPanle=false;" v-show="isShowEmojPanle==true"></div>
    </div>
  </div>
</template>
<script>
import { emojs } from "@/assets/js/utils.js";

export default {
  data() {
    return {
      commentText: "",
      isShowEmojPanle: false,
      emojs
    };
  },
  props: ["isShow"],
  watch: {
    commentText: {
      handler: function(newv, oldv) {
        var str = newv.replace(/\s+/g, " ");
        console.log(str.length)
        if (str.length > 120) {

          str = str.substring(0, 120);
        }
        this.commentText = str;
        // console.log(this.commentText)
      }
    }
  },
  watch: {
    commentText: {
      handler: function(newv, oldv) {
        var str = newv;
        if (str.length > 200) {
          str = str.substring(0, 200);
        }
        this.editStr = str;
      }
    }
  },
  methods: {
    showPanle(e) {
      this.isShowEmojPanle = !this.isShowEmojPanle;
      e.stopPropagation();
    },
    submit() {
      return this.$toast('该功能暂未开放，敬请期待')
      var len = this.commentText.split("\n").length - 1;

      if (this.commentText.length == 0) {
        return this.$toast("请填写评论内容");
      }
      if (len > 10) {
        return this.$toast("您的评论内容换行过多，请重新编辑");
      }
      if (this.commentText.replace(/\s{1,}/g, " ").length > 500) {
        return this.$toast("评论字数限500以内");
      }
      if (
        this.commentText
          .replace(/\r\n/g, "")
          .replace(/\n/g, "")
          .replace(/\s{1,}/g, "").length == 0
      ) {
        return this.$toast("请填写有效的评论内容");
      }

      var str = this.commentText
        .replace(/\r\n+/g, "<br/>")
        .replace(/\n+/g, "<br/>")
        .replace(/\s{1,}/g, " ")
        .replace(/\s/g, "&nbsp;");

      this.$emit("submit", str, () => {
        this.commentText = "";
        this.hide();
      });
    },
    hide() {
      this.$emit("hide");
    },
    show() {
      this.$emit("show");
    },
    chooseFace(e, item, index) {
      this.commentText += item;
      e.stopPropagation();
    }
  }
};
</script>
<style lang="scss" scoped>
.replaycon1 {
  // margin: 50px;
  position: relative;
  .replay_avandar1 {
    float: left;
    img {
      width:100px;
      height: 100px;
      border-radius: 50%;
    }
  }
  .replay1_right {
    margin-left: 110px;
  }
}
.send_commemnt_cnpt {
  position: relative;
  .counter {
    position: absolute;
    right: 20px;
    line-height: 50px;
    font-size:20px;
    color: rgb(161, 159, 159);
    bottom: 80px;
  }
  .commemnt_ipt {
    display: block;
    width: 100%;
    height: 240px;
    font-size: 20px;
    font-weight: 400;
    line-height: 25px;
    padding-right: 80px;
    padding-left: 20px;
        resize: none;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(230, 230, 230, 1);
    outline-style: none;
    &:focus {
      border: 1px solid #fe3845;
    }
  }
  .commemnt_tools {
    margin-top: 10px;
    height: 32px;
  }
  .faceWrap {
    position: fixed;
    // background-color: rgba(15, 15, 15, 0.158);
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
  }
  .opration_btns {
    float: right;
  }
  .submit_btn {
    display: inline-block;
    height: 40px;
    line-height: 40px;
    padding: 0 19px;
    border-radius: 3px;
    font-size: 20px;
    background-color: #fe3845;
    border: 1px solid #fe3845;
    color: white;
    border-radius: 4px;
    cursor: pointer;
  }
  .cancel_btn {
    display: inline-block;
    height: 32px;
    line-height: 32px;
    padding: 0 19px;
    border-radius: 3px;
    background-color: white;
    border: 1px solid rgba(222, 222, 222, 1);
    color: #585858;
    cursor: pointer;
  }
  .face_btn {
    color: #fe3845;
    position: relative;
    float: left;
    // width: 30px;
    height: 30px;
    margin-right: 10px;
    font-weight: 400;
    font-size: 20px;
    position: relative;
    line-height:48px;
    cursor: pointer;
    .emojs_conn {
      border-radius: 5px;

      // border-top: 1px solid #eaeaea;
      // border-left: 1px solid #eaeaea;
      width: 320px;
      position: absolute;
      z-index: 100;
      background: #fff;
      top: 38px;
      left: -40px;
      padding: 20px;
      box-shadow: 0 5px 8px gray;
      &:after {
        content: "";
        width: 10px;
        height: 10px;
        border-top: 1px solid rgba(230, 230, 230, 1);
        border-right: 1px solid rgba(230, 230, 230, 1);
        position: absolute;
        left: 45px;
        top: -6px;
        transform: rotate(-45deg);
        background-color: #fff;
      }
      .emojs_item {
        width: 33px;
        height: 33px;
        padding: 1px;
        box-sizing: content-box;
        // border-bottom: 1px solid #eaeaea;
        // border-right: 1px solid #eaeaea;
        text-align: center;
        overflow: hidden;
        float: left;
        cursor: pointer;
        &:hover {
          background-color: red;
        }
      }
    }
  }
}
</style>

