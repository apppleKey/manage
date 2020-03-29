<template>
  <div class="today_topic_details">
    <!-- details-{{$route.params.id}} -->
    <div class="today_topic_details_wrap">
      <div class="left">
        <div class="header">
          <div class="topic_info">
            <div class="logo">
              <img v-lazy="topicInfo.img" alt />
            </div>
            <div class="topic_info_details">
              <h3 :title="topicInfo.topic_title">#{{topicInfo.topic_title}}#</h3>
              <p>阅读 {{topicInfo.view}} &nbsp;&nbsp;&nbsp;&nbsp; 讨论 {{topicInfo.comment_num}}</p>
            </div>
          </div>
          <div class="tab_header">
            <div class="tab_header_item" :class="{curr:type==0}" @click="changeType(0)">综合</div>
            <div class="tab_header_item" :class="{curr:type==1}" @click="changeType(1)">热门</div>
            <div class="tab_header_item" :class="{curr:type==3}" @click="changeType(3)">视频</div>
            <div class="tab_header_item" :class="{curr:type==2}" @click="changeType(2)">图片</div>
          </div>
        </div>
        <div class="comment_content">
          <div class="firstword">
            <span class="label">导语：</span>
            {{topicInfo.topic}}
          </div>
          <comment class="my_comment" :placeholder="topicInfo.topic_title||''" @submit="replayTopic" />
          <other-comment
            class="other_comment"
            :data="item"
            v-for="item in commentList"
            :key="'topic_other'+item.comment_id"
          />
          <loading :loadingStatus="loadingStatus" @loadmore="loadmore" class="outloding" />
        </div>
      </div>
      <div class="right">
        <div class="hot_topic_header">
          热门话题
          <router-link to="/PC/todayTopic" class="more">更多&gt;</router-link>
        </div>
        <div class="hot_topic_body">
          <div
            class="hot_topic_item"
            v-for="(item ,index) in hotList"
            :key="'hot'+index"
            @click="$router.push({path:'/PC/todayTopic/'+item.id})"
          >
            <span class="topic_item_index">{{index+1}}</span>
            <span class="topic_item_title" :title="item.title">{{item.title}}</span>
            <span class="topic_item_count">{{item.view}}</span>
          </div>
        </div>
      </div>
    </div>
    <flower :loading="flowerLoading" />
  </div>
</template>

<script>
import comment from "./comment_cpnt.vue";
import otherComment from "./otherComment_cpnt.vue";
import loading from "@/componets/loading.vue";
import flower from "@/componets/flower.vue";
export default {
  components: {
    comment,
    otherComment,
    flower,
    loading
  },
  data() {
    return {
      hotList: [],
      topicInfo: {},
      commentList: [],
      flowerLoading: false,
      topic_id: this.$route.params.id,
      page: 1,
      size: 20,
      type: 0, //0综合 1 热门 2图片 3视频
      loadingStatus: 0
    };
  },
  watch: {
    $route: {
      handler: function(newv) {
        console.log(newv);
        this.topic_id = this.$route.params.id;
        this.page = 1;
        //热门
        this.getHot();
        //话题信息
        this.getTopicInfo();
        //话题评论
        this.getTopicComments();
      },
      deep: true
    }
  },
  created() {
    // this.$store.dispatch("freshToken");
    //热门
    this.getHot();
    //话题信息
    this.getTopicInfo();
    //话题评论
    this.getTopicComments();
  },
  methods: {
    //切换卡类型
    changeType(type) {
      this.type = type;
      this.page = 1;
      this.getTopicComments();
    },
    //热门列表
    getHot() {
      this.$http
        .get("/index.php?g=Wwapi&m=Topic&a=topic_hot", {
          params: { page: 0, size: 10 }
        })
        .then(res => {
          // console.log(res)
          this.hotList = res.data;
        });
    },
    // 当前话题信息
    getTopicInfo() {
      this.$http
        .get("/index.php?g=Wwapi&m=Topic&a=detail", {
          params: { topic_id: this.topic_id }
        })
        .then(res => {
          // console.log(res)
          this.topicInfo = res.data;
          this.$store.commit("setUserData", res.data.user_info);
          this.$forceUpdate();
        });
    },
    // 当前话题一级评论列表
    getTopicComments() {
      this.loadingStatus = 1;
      this.$http
        .get("/index.php?g=Wwapi&m=Topic&a=get_comment_list", {
          params: {
            type: this.type,
            topic_id: this.topic_id,
            page: this.page - 1,
            size: this.size
          }
        })
        .then(res => {
          res.data.list.map(v => {
            v.topic_id = this.topic_id;
            v.children = [];
          });
          this.commentList = res.data.list;

          this.loadingStatus = 2;
          this.topicInfo.comment_num = res.data.total;
          if (res.data.total <= this.commentList.length) {
            this.loadingStatus = 3;
          }
          if (res.data.total == 0) {
            this.loadingStatus = 4;
          }
        })
        .catch(err => {
          this.loadingStatus = 0;
        });
    },

    //加载更多一级评论
    loadmore() {
      if (this.loadingStatus == 1) {
        return;
      }
      this.page += 1;
      this.loadingStatus = 1;
      this.$http
        .get("/index.php?g=Wwapi&m=Topic&a=get_comment_list", {
          params: {
            type: this.type,
            topic_id: this.topic_id,
            page: this.page - 1,
            size: this.size
          }
        })
        .then(res => {
          res.data.list = res.data.list || [];
          res.data.list.map(v => {
            v.topic_id = this.topic_id;
            v.children = [];
          });
          this.loadingStatus = 2;
          var total = parseInt(res.data.total) || 0;
          this.topicInfo.comment_num = res.data.total;
          this.commentList = this.commentList.concat(res.data.list);
          if (total <= this.commentList.length) {
            this.loadingStatus = 3;
          }
          if (total == 0) {
            this.loadingStatus = 4;
          }
        })
        .catch(err => {
          this.loadingStatus = 0;
        });
    },
    replayTopic(text, imgs, videos, cb) {
      if (!this.$store.state.userinfo.token) {
        return Login && Login.login();
      }
      // debugger
      const data = new FormData();
      data.append("content", text);
      data.append("topic_id", this.topic_id);
      data.append("uid", this.$store.state.userinfo.uid);
      data.append("token", this.$store.state.userinfo.token);
      if (imgs.length) {
        imgs.forEach((item, index) => {
          data.append(index, item.file);
        });
      } else if (videos.length >= 1 && videos[0]) {
        data.append("0", videos[0].file);
        data.append("video_title", videos[0].title);
      }
      let config = {
        headers: {
          //添加请求头
          "Content-Type": "multipart/form-data"
        }
      };
      this.flowerLoading = true;
      axios
        .post("/index.php?g=Wwapi&m=Topic&a=comment", data, config)
        .then(res => {
          this.flowerLoading = false;

          this.page = 1;
          this.type=0;
          this.getTopicComments();
          cb && cb();
        })
        .catch(err => {
          this.flowerLoading = false;

          console.log(err);
          this.$toast((err.msg || err.message || err) + "(" + err.code + ")");
        });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/css/mixin.scss";

.today_topic_details {
  // height: 100%;
  background-color: #ededed;
  padding: 20px 0;
  box-sizing: border-box;
  .today_topic_details_wrap {
    width: 1220px;
    padding-right: 300px;
    position: relative;
    margin: 0 auto;
    // height: 100%;
    // overflow: hidden;
    // background-color: #fff;
    .left {
      width: 900px;
      // margin-right: 300px;
      // float: left;
      .header {
        background-color: #fff;
        .topic_info {
          padding: 20px;
          display: flex;
          border-bottom: 1px solid #eee;
          .logo {
            width: 80px;
            height: 80px;
            margin-right: 10px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .topic_info_details {
            flex: 1;

            h3 {
              //   height: 25px;
              //   padding: 0;
              margin: 0;
              color: #010101;
              line-height: 50px;
              @include omit(1);
            }
            p {
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(99, 99, 99, 1);
            }
          }
        }
        .tab_header {
          display: flex;
          justify-content: space-around;
          .tab_header_item {
            height: 50px;
            width: 70px;
            line-height: 50px;
            text-align: center;
            color: #6b6b6b;
            cursor: pointer;
            &:hover {
              color: #ff3442;
            }
            &.curr {
              color: #2a2a2a;
              position: relative;
              &:after {
                content: "";
                position: absolute;
                width: 100%;
                height: 4px;
                background-color: #ff3442;
                bottom: 0;
                left: 0;
              }
            }
          }
        }
      }
      .comment_content {
        background-color: #fff;
        margin-top: 20px;
        padding-bottom: 20px;
        min-height: 400px;
        .firstword {
          min-height: 50px;
          line-height: 30px;
          padding: 10px 20px;
          color: rgba(120, 119, 119, 1);
          border-bottom: 1px solid rgba(238, 238, 238, 1);
          // @include omit(1);
          .label {
            color: #161616;
            font-weight: 600;
          }
        }
        .my_comment {
          margin: 10px;
        }
        .other_comment {
        }
      }
    }
    .right {
      width: 300px;
      position: absolute;
      right: 0;
      top: 0;
      background-color: #fff;
      .hot_topic_header {
        padding: 0 14px 0 20px;
        border-bottom: 1px solid rgba(238, 238, 238, 1);
        height: 40px;
        line-height: 40px;
        .more {
          float: right;
          font-size: 12px;
          color: rgba(120, 119, 119, 1);
          &:hover {
            color: #fe5661;
          }
        }
      }
      .hot_topic_body {
        min-height: 279px;
        padding: 14px;
        position: relative;
        color: #888585;
        .hot_topic_item {
          display: flex;
          height: 24px;
          line-height: 24px;
          justify-content: space-between;
          font-size: 14px;
          cursor: pointer;
          &:hover {
            color: #ff3442;
          }
          .topic_item_index {
            color: #fe5661;
            text-align: center;
            width: 20px;
            margin-right: 10px;
          }
          .topic_item_title {
            text-align: left;
            width: 160px;
            @include omit(1);
          }
          .topic_item_count {
            flex: 1;
            text-align: right;
            @include omit(1);
            margin-left: 10px;
          }
        }
      }
    }
  }
  .outloding {
    width: 99%;
    margin: 20px auto;
    border: 1px solid #ccc9c9;
  }
}
</style>


