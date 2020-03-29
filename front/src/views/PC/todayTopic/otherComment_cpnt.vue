<template>
  <div class="other_comment_component">
    <div class="one_comment_pubnisher_main">
      <div class="avatar">
        <img v-lazy="commentInfo.avatar_thumb" alt />
      </div>
      <div class="one_comment_pubnisher emojHtml">
        <div class="one_comment_anchor">{{commentInfo.user_nicename}}</div>
        <div class="one_comment_content emojHTML" v-html="str2Html(commentInfo.content||'')"></div>
        <div class="media" v-viewer>
          <!-- <img v-lazy /> -->
          <img
            :class="{mediaimg:true,moreone:commentInfo.image.length>1,moretwo:commentInfo.image.length>2}"
            v-lazy="item.url"
            v-for="(item,index) in commentInfo.image"
            alt
            :key="'commentinfo'+commentInfo.comment_id+index"
          />
          <video :src="commentInfo.video" controls v-if="commentInfo.video"></video>
        </div>
        <!-- <div class="video_title" v-if="commentInfo.video_title">视频标题： {{commentInfo.video_title}}</div> -->
        <div class="one_comment_time">
          {{commentInfo.app_time||commentInfo.create_time}}
          <!-- <span style="color:red;margin-left:30px;">评论</span> -->
        </div>
       <viewer :images="commentInfo.images" v-if="commentInfo.images.length"> 
          <img
                v-for="(item,index) in commentInfo.images"
                v-lazy="item.src"
                :key="item.src+index"
              >
        </viewer>
      </div>
    </div>
    <div class="count_comment_info">
      <div class="comment_count" title="评论" @click="dirComment">评论 ({{commentInfo.comment_num||0}})</div>
      <div class="top_count" title="点赞" @click="doAttention(commentInfo)">
        <span
          :class="'top-icon iconfont icon-zan '+(commentInfo.isAttention?'istop':'')"
        > &nbsp;{{commentInfo.praise_num||0}}</span>
      </div>
      <div class="reply" title="回复" @click="isShowReplay1=!isShowReplay1">回复</div>
    </div>
    <!-- 回复一级 -->

    <sendcomment
      class="replay1"
      @submit="replay1"
      :isShow="isShowReplay1"
      @show="showReplay"
      @hide="hideReplay"
    />

    <!-- 二级回复 -->

    <div class="children_comment" v-show="isShowCommentList">
      <div v-for="item in commentInfo.children" :key="item.comment_id">
        <commenttxt :data="item" @submit="replay2" />
      </div>
      <weloading :loadingStatus="loadingStatus1" @loadmore="loadmoreChildren" />
    </div>
  </div>
</template>

<script>
import sendcomment from "./send_comment.vue";
import commenttxt from "./comment_txt_cpnt.vue";
import weloading from "@/componets/loading.vue";

import { emojs } from "@/assets/js/utils.js";
const faceReg = /\[.+?\]/g;
const faceImgReg = /<img class="faceItem".*?(?:>|\/>)/gi;
const faceAlt = /s/;
export default {
  components: { sendcomment, weloading, commenttxt },
  props: {
    data: {
      type: Object
    }
  },

  data() {
    return {
      doAttentionIsFast: false, //防止刷赞
      videoMaxNum: 1,
      emojs,
      isShowCommentList: false,
      loadingStatus1: 0,
      isShowReplay1: false,
      page1: 1,
      size1: 20,
      imageList:[],
      commentInfo:{}
    };
  },
  watch: {
    editStr: {
      handler: function() {}
    }
  },
  created() {
    // console.log(this.$props.data);
    this.commentInfo = JSON.parse(JSON.stringify(this.$props.data));
    this.commentInfo.images=this.commentInfo.images||[]
    this.imageList=this.commentInfo.images.map((item)=>{
        return   
    })
    this.commentInfo.children = [];
  },
  mounted() {},
  methods: {
    showReplay() {
      this.isShowReplay1 = true;
    },
    hideReplay() {
      this.isShowReplay1 = false;
    },
    showPanle(e, panle) {
      this.isShowEmojPanle = false;
      this.isShowImgPanle = false;
      this.isShowVideoPanle = false;
      this[panle] = !this[panle];
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
      return false;
    },

    html2Str(html) {
      return html.replace(faceImgReg, res => {
        // console.log(res);
        var reg = /class="faceItem" alt="\[.+?\]"/;
        var face = "";
        if (reg.test(res)) {
          face = res.match(/\[.+?\]/);
          // console.log(res)
          if (emojs.indexOf(face) == -1) {
            return face;
          } else {
            console.warn(face + " is not system face,analsys fail!");
            return "";
          }
        } else {
          return "";
        }
      });
    },

    //展开评论
    dirComment() {
      this.isShowCommentList = ! this.isShowCommentList;
      if( this.commentInfo.children.length>0)return;
      this.getcomment()
    },
    getcomment(){
        this.loadingStatus1 = 1;
      this.$http({
        method: "GET",
        url: "/index.php?g=Wwapi&m=Topic&a=get_reply_comment_list",
        params: {
          //  to_uid
          comment_id: this.commentInfo.comment_id,
          page: this.page1 - 1,
          size: this.size1
        }
      }).then(res => {
        this.loadingStatus1 = 2;
        this.commentInfo.children = res.data.list;
        this.commentInfo.comment_num = res.data.total;
        if (res.data.total <= this.commentInfo.children.length) {
          this.loadingStatus1 = 3;
        }
        if (res.data.total == 0) {
          this.loadingStatus1 = 4;
        }
        // console.log(this.commentInfo.children);
      });
    },
    //加载更多三级评论
    loadmoreChildren() {
      if (this.loadingStatus1 == 1) return;
      this.loadingStatus1 = 1;
      this.$http({
        method: "GET",
        url: "/index.php?g=Wwapi&m=Topic&a=get_reply_comment_list",
        params: {
          //  to_uid
          comment_id: this.commentInfo.comment_id,
          page: this.page1 - 1,
          size: this.size1
        }
      }).then(res => {
        this.loadingStatus1 = 2;
        this.commentInfo.comment_num = res.data.total;
        this.commentInfo.children = this.commentInfo.children.concat(
          res.data.list
        );
        if (res.data.total <= this.commentInfo.children.length) {
          this.loadingStatus1 = 3;
        }
        if (res.data.total == 0) {
          this.loadingStatus1 = 4;
        }
        // console.log(this.commentInfo.children);
      });
    },

    //点赞
    doAttention(item) {
      // console.log(item);
      if (this.doAttentionIsFast) {
        return this.$toast("操作频繁，请稍后再试~");
      }
      this.doAttentionIsFast = true;
      var timer = setTimeout(() => {
        this.doAttentionIsFast = false;
        clearTimeout(timer);
      }, 2000);
      if (!this.$store.state.userinfo.token) {
        Login && Login.login();
        return;
      }
      var id = this.commentInfo.comment_id;
      this.$http({
        url: "/index.php?g=Wwapi&m=Topic&a=praise",
        method: "POST",
        data: { type: 1, comment_id: id, authorization: true }
      })
        .then(res => {
          // this.$toast(res.msg);
          this.commentInfo.praise_num = res.data;
          if (res.msg === "点赞成功!") {
            this.commentInfo.isAttention = true;
          } else {
            this.commentInfo.isAttention = false;
          }

          this.$forceUpdate();
        })
        .catch(e => {
          this.$toast(e.msg || e);
        });
    },

    //评论一级评论
    replay1(text, cb) {
      this.$http({
        method: "POST",
        url: "/index.php?g=Wwapi&m=Topic&a=reply_comment",
        data: {
          //  to_uid
          authorization: true,
          topic_id: this.commentInfo.topic_id,
          to_uid: this.commentInfo.to_uid,
          comment_id: this.commentInfo.comment_id,
          content: text,
          type: 1 //回复评论
        }
      }).then(() => {
        // this.$toast("评论成功！");
        this.isShowCommentList=true
        this.page1 = 1;
        this.getcomment()
        cb && cb();
      });
    },

    //回复二级评论
    replay2(item, text, cb) {
      this.$http({
        method: "POST",
        url: "/index.php?g=Wwapi&m=Topic&a=reply_comment",
        data: {
          authorization: true,
          topic_id: this.commentInfo.topic_id,
          to_uid: item.uid,
          comment_id: item.comment_id,
          content: text,
          type: 2 //回复回复
        }
      }).then(() => {
        // this.$toast("回复成功！");
        this.isShowCommentList=true
        this.page1 = 1;
        this.getcomment()
        cb && cb();
      });
    },
    //评论字符转化
    str2Html(str) {
      return str.replace(/\[.+?\]/g, res => {
        if (emojs.indexOf(res) == -1) {
          return res;
          console.warn(face + " is not system face,analsys fail!");
        } else {
          return (
            '<img class="faceItem" alt="' +
            res +
            '"  src="./static/imgs/face/' +
            emojs.indexOf(res) +
            '.gif" />'
          );
        }
      }).replace(/\r\n/g,'</br>').replace(/\n/g,'</br>');
    }
  }
};
</script>
</style>

<style lang="scss" scoped>
@import "~@/assets/css/mixin.scss";
.other_comment_component {
  background-color: #ededed;
  box-sizing: border-box;
  background-color: #fff;
  margin: 0 auto;
  margin-top: 20px;
  .one_comment_pubnisher_main {
    display: flex;
    margin: 0 10px;
  }
  .avatar {
    width: 60px;
    height: 60px;
    margin-right: 20px;
    img {
      background-color: rgba(209, 209, 209, 0.76);
      border-radius: 50%;
      width: 100%;
      height: 100%;
    }
  }
  .one_comment_pubnisher {
    flex: 1;
    position: relative;

    .one_comment_anchor {
      font-size: 16px;
      font-weight: 400;
      color: rgba(16, 16, 16, 1);
    }
    .one_comment_content {
      word-break: break-all;
      font-size: 14px;
      color: #676767;
      margin: 10px 0;
    }
    .media {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      .mediaimg {
        cursor: pointer;
        max-width: 80%;
        max-height: 400px;
        &:hover{
          box-shadow: 0 0 10px rgba(128, 128, 128, 0.521);
        }
      }
      .moreone {
        max-width: 40%;
        max-height:400px;
        background-color: rgba(209, 209, 209, 0.438);
        box-shadow: 0 0 10px #e6e6e6;
        margin-bottom: 20px;
        margin-right: 20px;
      }
      .moretwo {
        max-width: 30%;
        max-height: 200px;
        background-color: rgba(209, 209, 209, 0.438);
        box-shadow: 0 0 10px #e6e6e6;
        margin-bottom: 20px;
        margin-right: 20px;
      }
      video {
        background-color: #00000046;
        width: 50%;
      }
    }
    .video_title {
      color: #676767;
      font-size: 14px;
      line-height: 40px;
    }
    .one_comment_time {
      margin: 10px 0;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(145, 145, 145, 1);
      line-height: 24px;
    }
  }
  .count_comment_info {
    display: flex;
    width: 100%;
    text-align: center;
    color: #838383;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    border-top: 1px solid #e6e6e6;
    border-bottom: 1px solid #e6e6e6;
    overflow: hidden;
    .comment_count {
      flex: 1;
      cursor: pointer;
    }
    .top_count {
      flex: 1;
      border-left: 1px solid #e6e6e6;
      border-right: 1px solid #e6e6e6;
      .istop {
        color: #fe3845;
      }
      cursor: pointer;
    }
    .reply {
      flex: 1;
      cursor: pointer;
    }
  }
  .replay1 {
    margin: 20px 10px;
  }
  .children_comment {
    margin: 35px 45px;
    background-color: #f9f9f9;
    padding: 20px;
    .children_comment_item {
      display: flex;
      .children_comment_anchor {
        width: 40px;
        height: 40px;
        margin-right: 20px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .children_comment_conn {
        flex: 1;
        color: #787878;
        .children_name {
          color: #7db0ff;
        }
        .children_comment_other {
          font-size: 14px;
          line-height: 28px;
          .replay {
            cursor: pointer;
            &:hover {
              color: #fe3845;
            }
          }
        }
      }
    }
    .editor {
      background-color: #fff;
      padding: 5px;
      width: 100%;
      height: 120px;
      border: 1px solid rgba(230, 230, 230, 1);
      .faceItem {
        margin-left: 10px;
        margin-right: 10px;
      }
    }
    .editor_tools {
      zoom: 0;
      height: 40px;
      padding-top: 10px;

      .face_btn,
      .image_btn,
      .video_btn {
        float: left;
        width: 30px;
        height: 30px;
        margin-right: 10px;
        font-weight: 400;
        font-size: 20px;
        position: relative;
        line-height: 30px;
        cursor: pointer;
      }

      .face_btn {
        color: #fe3845;
        position: relative;
        .emojs_conn {
          border-radius: 5px;

          width: 320px;
          position: absolute;
          z-index: 9;
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
            width: 26px;
            height: 26px;
            padding: 1px;
            box-sizing: content-box;
            text-align: center;
            overflow: hidden;
            float: left;
            cursor: pointer;
            &:hover {
              background-color: #fe3845;
            }
          }
        }
      }
      .submit_btn {
        float: right;
        width: 70px;
        height: 30px;
        background: rgba(254, 56, 69, 1);
        border-radius: 4px;
        color: white;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
      }
    }
  }
}
</style>


