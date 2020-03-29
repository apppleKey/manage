<template>
  <div class="plan_details_page ">
    <Header></Header>
    <div class="banxin" v-if="loaded">
    <h1 class="recommendTitle">{{planInfo.planTitle}}</h1>
			<strong class="recommendTimer">发布时间：{{dateFormat(planInfo.createTimestamp)}}</strong>
			<div class="recommendContant ">
				<div class="recommendOther">
					<strong :class="'itemEventTag itemEventTag_'+planInfo.playType" v-show='planInfo.playTypeContent'>{{planInfo.playTypeContent}}</strong>
					<span class="itemEventName">{{planInfo.leagueMatch}}</span>
					<b class="itemEventTimer">{{dateFormatCustom(planInfo.startTimestamp)}}</b>
				</div>
				<dl class="recommendTeam">
					<dd>
						<img v-lazy="planInfo.homeTeamLogoUrl"/>
						<strong>{{planInfo.homeTeam}}</strong>
					</dd>
					<dt>
						<b>V</b>
						<i>S</i>
					</dt>
					<dd>
						<img v-lazy="planInfo.awayTeamLogoUrl" />
						<strong>{{planInfo.awayTeam}}</strong>
					</dd>
				</dl>
			</div>
			<div class="recommendBox">
				<img class="recommendIcon" :src="'./static/images/recommendIcon.png'"  />
				{{ planInfo.planContent}}
				<img v-if="planInfo.planStatus == 'win'" class="recommendStamp" :src="'./static/images/win.png'"  />
				<img v-if="planInfo.planStatus == 'lose'" class="recommendStamp" :src="'./static/images/lose.png'"  />
				<img v-if="planInfo.planStatus == 'draw'" class="recommendStamp" :src="'./static/images/draw.png'"  />
				<img v-if="planInfo.planStatus == 'processing'" class="recommendStamp" :src="'./static/images/processing.png'"  />
			
			</div>
			<dl class="recommendReason">
				<dt><strong>推荐理由</strong></dt>
				<dd v-if="planInfo.planAnalysis&&planInfo.planAnalysis.length > 0" v-html='planInfo.planAnalysis'>
				</dd>
				<dd style="text-align:center;" v-else-if="loaded">
					暂无推荐理由..
				</dd>
			</dl>
    <div class="comment_list_conn banxin" v-if="loaded" >
      <h2 class="ltitle" >评论 ( {{commentList.length}} )</h2>
      <div class="comment_list" v-if='commentList.length'>
        <div class="comment_item" v-for="item in commentList" :key="item.id">
          <img class="item_avatar" v-lazy="item.avatar" />
          <div class="item_info">
            <div>
              <span class="item_name">{{item.user_nicename}}</span>
              <span class="item_time">{{item.createtime}}</span>
            </div>
            <div class="item_txt" v-html='item.content'></div>
          </div>
        </div>
      </div>
    </div>
    <div class="data_err" v-if="loadedErr">抱歉，该内容不存在~</div>
    <Comment class="banxin plan_comment" @submit="submitComent" v-if="loaded" />
    </div>
    <Footer v-if="loaded"> </Footer>
  </div>
</template>
<script>
import Header from "@/views/PC/components/header.vue";
import Footer from "@/views/PC/components/footer.vue";
import Comment from "@/views/PC/components/send_comment.vue";
import {dateFormatCustom,dateFormat} from "@/assets/js/utils.js";
export default {
  components: {
    Comment,
    Header,
    Footer
  },
  data() {
    return {
      title: "",
      planInfo: {},
      commentList: [],
      anchorInfo:{},
      loaded:false,
      loadedErr:false,
      
    };
  },
  created() {
    this.$indicator.open();
    this.$http
      .get("/live/api/schedule/plan/get_plan_info", {
        params: { planId: this.$route.params.id }
      })
      .then(res => {
        console.log(res.data);
this.$indicator.close();
        // this.title = res.data.siteSeoTitle;
         this.planInfo =(res.data.anchorPlanDetailsInfo||{}).planDetailsInfo || {};
         this.anchorInfo =(res.data.anchorPlanDetailsInfo||{}).anchorInfo || {};
        // this.commentList = res.data.commentList || [];
        this.loaded=true;
      }).catch(err=>{
          this.loadedErr=true;
          this.$indicator.close();
          console.log(err)
      });
  },
  methods: {
    dateFormat,
    dateFormatCustom,
    submitComent(text) {
      this.$toast("此功能暂未开放，敬请期待");
    }
  }
};
</script>
<style lang="scss" scoped>
.plan_details_page {
  padding-bottom: 60px;
  &.banxin {
    width: 1080px;
    margin: 0 auto;
  }
  .banxin {
    width: 1080px;
    margin: 0 auto;
  }
  .recommendMain{width:877px;min-height:650px;height:auto;background:#fff;padding:20px;float:left;overflow:hidden;}
.recommendTitle{font-size:32px;text-align: center; height:48px;line-height:48px;font-weight:normal;margin-bottom:4px;text-overflow:ellipsis;white-space:nowrap;color:#333;overflow:hidden;}
.recommendTimer{margin:5px 0;text-align: center; font-size:18px;color:#6A6A6A;overflow:hidden;font-weight:400;display:block;}
.recommendContant{background:#F1F1F1;border-radius:4px;padding:10px;overflow:hidden;margin: 20px 0;}
.recommendOther{overflow:hidden;margin-bottom:5px;line-height: 40px;font-size: 20px;}
.itemEventTag{border:1px solid #ddd;height:40px;line-height:40px;padding:0 10px;display:block;float:left;font-weight:normal;
border-radius:20px;margin-right:20px;}
.itemEventTag_1{color:#58C14B;}
.itemEventTag_2{color:#6A62FF;}
.itemEventTag_3{color:#FBA423;}
.itemEventTag_4{color:#9FA1BF;}
.itemEventTag_5{color:#6935FF;}
.itemEventTag_6{color:#FF2D84;}
.itemEventTag_7{color:#614AA9;}
.itemEventTag_8{color:#6A62FF;}
.itemEventName{color:#0099FF;margin-right:20px;overflow:hidden;display:block;float:left;}
.itemEventTimer{display:block;color:#6A6A6A;float:left;overflow:hidden;font-weight:normal;}

.recommendTeam{width:600px;height:auto;margin:10px auto 0;overflow:hidden;position:relative;display:flex;align-content:center;justify-content:center;}
.recommendTeam dd{overflow:hidden;text-align:center;margin: 0;}
.recommendTeam dd img{display:block;width:99px;height:99px;margin:0 auto 20px;overflow:hidden;}
.recommendTeam dd strong{overflow:hidden;font-weight:normal;text-align:center;color:#333;font-size:20px;}
.recommendTeam dt{display:block;user-select: none; width:110px;position:relative;overflow:hidden;margin:0 60px;}
.recommendTeam dt b{width:99px;height:99px;line-height:99px;font-size:99px;opacity:0.8;color:#F76C35;font-weight:bold;font-style:normal;position:absolute;}
.recommendTeam dt i{width:99px;height:99px;line-height:99px;font-size:99px;opacity:0.8;color:#439DFF;font-weight:bold;font-style:normal;position:absolute;left:50px;}
.recommendBox{border:1px solid #F1F1F1;text-align:center;border-radius:4px;margin-top:10px;height:68px;line-height:68px;font-size:36px;color:#FF454F;font-weight:normal;position:relative;padding:0 78px;}
.recommendBox .recommendIcon{position:absolute;top:0;left:0;display:block;width: 68px;}
.recommendBox .recommendStamp{position:absolute;top:0;right:0;display:block;}
.recommendReason{overflow:hidden;margin:15px auto 0;min-height: 600px}
.recommendReason dt{overflow:hidden;text-align:center;position:relative;width:720px;margin:0 auto 15px;}
.recommendReason dt strong{font-weight:normal;font-size: 30px; display:block;margin:0 auto;background:#fff;color:rgba(99,99,99,.8);; width:200px;height:46px;line-height:46px;overflow:hidden;position:relative;z-index:9;}
.recommendReason dt:after{content:'';height:1px;width:100%;position:absolute;top:0;left:0;right:0;bottom:0;border-bottom:2px dashed #e5e5e5;margin:auto;overflow:hidden;}
.recommendReason dd{overflow:hidden;font-size:18px;color:#6A6A6A;
line-height:24px;
img {
          max-width: 100% !important;
        }
        video {
          max-width: 100% !important;
        }
        iframe {
          max-width: 100% !important;
        }
}
  .plan_comment {
    padding: 0px 0 40px;
  }
  .comment_list_conn {
    .ltitle {
      font-size: 24px;
      font-weight: 400;
      }
    .comment_list {
      .comment_item {
        width: 100%;
        overflow: hidden;
    margin-bottom: 40px;
        .item_avatar {
          width: 100px;
          height: 100px;
          float: left;
        }
        .item_info {
          padding-left: 130px;
          .item_name {
            line-height: 48px;
            font-size: 32px;
          }
          .item_time {
            float: right;
            line-height: 48px;
            font-size: 24px;
            color: rgb(155, 154, 154);
          }
          .item_txt {
            font-size: 24px;
            line-height: 48px;
            color: rgb(119, 119, 119);

          }
        }
      }
    }
  }
  .data_err{
      font-size: 32px;
      line-height: 300px;
      text-align: center;
  }
}
</style>