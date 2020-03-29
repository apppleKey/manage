<template>
  <div class="topic_index_page">
    <div class="topic_index_wrap">
      <div class="nav">
        <div class="nav-item">热门话题</div>
      </div>
      <div class="listTabel">
        <div class="list-title">
          <span class="topic_index">序号</span>
          <span class="topic_title">关键词</span>
          <span></span>
        </div>
        <div class="list-item" v-for="(item,index) in topicList" :key="'topic'+index">
          <span class="topic_index">{{(pageConfig.pageNo-1)*pageConfig.pageSize+index+1}}</span>
          <router-link :to="'/PC/todayTopic/'+item.id">
            <span class="topic_title">{{item.title}}</span>
          </router-link>
          <span class="topic_comment">{{item.view}}</span>
        </div>
          <weloading :loadingStatus="loadingStatus" @loadmore="loadmore"/>
      </div>
      <!-- <div class="pagenation_conn">
        <pagenation
          class="pagenation"
          :pageConfig="pageConfig"
          @changeCurrentPage="changeCurrentPage"
        ></pagenation>
      </div> -->
    </div>
    <loadingflower :loading="showFlower"/>
    <!-- <pagenation :pageSize="pageTotal" v-model="pageNo" @on-jump="jump"/> -->
  </div>
</template>

<script>
import pagenation from "./pagenation.vue";
import weloading from "@/componets/loading.vue";
import loadingflower from "@/componets/flower.vue";

export default {
  components: {
    pagenation: pagenation,
    weloading,
    loadingflower
  },

  data() {
    return {
      loadingStatus: 4,
      topicList: [],
      loading: true,
      pageConfig: {
        pageSize: 20, //一页的数据条数
        pageNo: 1, //当前页的索引
        total: 1, //总的数据条数
        pageTotal: 2
      },
      page:1,
      size:30
    };
  },
  created() {
    // this.$http.get('/index.php?g=Wwapi&m=Topic&a=index').then(function(res){
    //   console.log(res)
    // })
    this.getTopicList(1);
  },
  methods: {
    getTopicList(page) {
      this.loadingStatus = 1;
      this.topicList.length = 0;
      this.showFlower=true;
      this.$http
        .get("/index.php?g=Wwapi&m=Topic&a=topic_hot", {params:{page:this.page-1,size :this.size} })
        .then(res => {
          this.showFlower=false;
          this.loadingStatus = 2;
          var length=res.data.lenth;
          console.log(res.total)
          if (res.data.length == 0) {
            this.loadingStatus = 3;

          }
          if(res.total<=length){
            this.loadingStatus=3
          }
          this.topicList = res.data;
          // this.pageConfig.pageTotal = 1;
          // this.pageConfig.pageNo = 1;
        })
        .catch(err => {
          this.showFlower=false;
          console.log(err);
          this.loadingStatus = 4;
          this.$toast(err);
        });
    },
    loadmore(){
      if(this.loadingStatus==1)return;
      this.loadingStatus=1;
      this.page+=1;
         this.$http
        .get("/index.php?g=Wwapi&m=Topic&a=topic_hot", {params:{page:this.page-1,size :this.size} })
        .then(res => {
          this.loadingStatus = 2;
          this.topicList = this.topicList.concat(res.data);
          var length=this.topicList.length;
      
          if(res.total<=length){
            this.loadingStatus=3
          }
          console.log(res.total,length)
          // this.pageConfig.pageTotal = 1;
          // this.pageConfig.pageNo = 1;
        })
        .catch(err => {
          console.log(err);
          this.loadingStatus = 4;
          this.$toast(err);
        });
    },
    changeCurrentPage(page) {
      console.log(page);
      this.getTopicList(page);
      // this.pageConfig.pageNo=page
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/css/mixin.scss";

.topic_index_page {
  min-height: 100%;
  background-color: #ededed;
  padding: 20px 0;
  box-sizing: border-box;
  .topic_index_wrap {
    background-color: #f9f9f9;
    min-height: 80%;
    width: 1220px;
    margin: 20px auto;
    .nav {
      width: 200px;
      float: left;
      padding-top: 31px;
      .nav-item {
        height: 60px;
        line-height: 60px;
        text-align: center;
        background-color: white;
        color: #333;
        font-size: 16px;
      }
    }
    .listTabel {
      margin-left: 200px;
      padding: 0 32px 20px;
      background-color: #fff;
      min-height: 600px;
      .list-title {
        height: 54px;
        line-height: 54px;
        border-bottom: 1px solid rgba(238, 238, 238, 1);
        color: #5a5a5a;
        border-bottom: 1px solid rgba(238, 238, 238, 1);
        position: relative;
        .topic_index {
          float: left;
          width: 50px;
          text-align: center;
          position: absolute;
          top: 0;
          left: 0;
        }
        .topic_title {
          display: block;
          width: 100%;
          padding-left: 50px;
          padding-right: 100px;
        }
      }
      .loading {
        text-align: center;
        margin-top: 200px;
        color: gray;
        .loading-spinner {
          position: relative;
          width: 28px;
          display: inline-block;
          vertical-align: -8px;
          margin-right: 10px;
          color: #fe5661 !important;
        }
      }
      .list-item {
        height: 54px;
        line-height: 54px;
        border-bottom: 1px solid rgba(238, 238, 238, 1);
        position: relative;
        .topic_index {
          color: #fe5661;
          float: left;
          width: 50px;
          text-align: center;
          position: absolute;
          top: 0;
          left: 0;
        }
        .topic_title {
          display: block;
          color: #7db0ff;
          width: 100%;
          padding-left: 50px;
          padding-right: 100px;
          @include omit(1);
        }
        .topic_comment {
          color: rgba(136, 133, 133, 1);
          width: 100px;
          position: absolute;
          top: 0;
          right: 0;
        }
      }
    }
  }
  .pagenation_conn {
    background-color: #fff;
    height: 40px;
    padding-top: 5px;
    padding-right: 20px;
    .pagenation {
      float: right;
    }
  }
}
</style>