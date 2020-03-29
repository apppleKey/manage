<template>
  <div class="replaycon2 send_commemnt_cnpt">
    <div class="replay_avandar2">
      <img v-lazy="data.avatar_thumb" alt />
    </div>
    <div class="replay2_right">
      <div class="span">
        <span class="commenter_name">{{data.user_nicename}}</span>
        <span v-if="data.type=='2'">回复</span>
        <span v-if="data.type=='2'" class="commenter_name">{{data.to_nicename}}</span>
        :
        <span v-html="str2Html(data.content)"></span>
      </div>
      <div class="replay_time">
        {{data.app_time}}
        <span class="fr" @click="isShowEditor=!isShowEditor">回复</span>
      </div>
    </div>
    <commenteditor
      ref="commenteditor"
      @submit="replay"
      @show="showReplay"
      @hide="hideReplay"
      class="commenteditor"
      :isShow="isShowEditor"
    />
  </div>
</template>
<script>
import { emojs } from "@/assets/js/utils.js";
import commenteditor from "./send_comment.vue";

export default {
  components: { commenteditor },
  props: ["data"],
  data() {
    return {
      commentText: "",
      isShowEmojPanle: false,
      emojs,
      isShowEditor: false
    };
  },
  watch: {
    commentText: {
      handler: function(newv, oldv) {
        var str = newv.replace(/\s+/g, " ");
        if (str.length > 200) {
          str = str.substring(0, 200);
        }
        this.commentText = str;
        // console.log(this.commentText)
      }
    }
  },
  created() {
    console.log(this.data);
  },
  methods: {
    showPanle(e) {
      this.isShowEmojPanle = !this.isShowEmojPanle;
      e.stopPropagation();
    },

    showReplay() {
      this.isShowEditor = true;
    },
    hideReplay() {
      this.isShowEditor = false;
    },
    str2Html(str) {
     
      return str.replace(/\[.+?\]/g, res => {
        // console.log(emojs.indexOf(res) == -1);
        if (emojs.indexOf(res) == -1) {
          return res;
          console.warn(face + " is not system face,analsys fail!");
        } else {
          return (
            '<img class="faceItem" style="vertical-align:bottom" alt="' +
            res +
            '"  src="./static/imgs/face/' +
            emojs.indexOf(res) +
            '.gif" />'
          );
        }
      });
    },
    replay(text, cb) {
      this.$emit("submit",this.data, text, cb);
    }
  }
};
</script>
<style lang="scss" scoped>
.replaycon2 {
  border-bottom: 1px solid rgba(224, 224, 224, 0.685);
  padding: 20px 0;
  position: relative;
  .replay_avandar2 {
    float: left;
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
 
  .replay2_right {
    word-break: break-all;
    margin-left: 60px;
    .commenter_name {
      color: #7db0ff;
    }
    .fr {
      float: right;
      cursor: pointer;
      &:hover {
        color: #fe3845;
      }
    }
    .replay_time {
      color: #787878;
    }
  }
}
.commenteditor {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(224, 224, 224, 0.685);
}
</style>

