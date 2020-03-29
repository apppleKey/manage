<template>
  <div class="slideInfo">
    <div class="slideHeader">
      <h1 class="slideName">本场热门主播</h1>
      <ul class="anchorList">
        <template v-if="userInfoList.length > 0">
          <li v-for="(item,index) in userInfoList" :key="'hotAnchor'+index">
            <a class="itemAvatar" :href="'/index.php?g=Front&m=Show&a=index&roomnum=' + item.uid" target="_blank">
              <img :src="item.avatar" />
              <b v-if="item.isLive">LIVE</b>
            </a>
            <a class="itemUserName" :href="'/anchor/#' + item.uid" target="_blank">{{item.username}}</a>
          </li>
        </template>
          <!-- <img src="/coor/docs/static/imgs/nodata.png" class="nodata" /> -->
        <span style="color:gray;" class='nodata' v-else-if="hasLoadedOtherData">暂无相关主播~</span> 

      </ul>
    </div>
    <div class="slideRecomend">
      <h1 class="slideName">本场推单</h1>
      <ul class="recomendList">
        <template v-if="planList.length > 0">
          <li v-for="(item,index) in planList" :key="'tuidanitem'+index">
            <div class="anchorInfo">
              <a class="itemAvatar" :href="'/anchor/#' + item.userInfo.id" target="_blank">
                <img :src="item.userInfo.avatar" />
              </a>
              <a class="itemUserName" :href="'/anchor/#' + item.userInfo.id" target="_blank">{{item.userInfo.username}}</a>
            </div>
            <div class="eventInfo">
              <a class="itemTitle" :href="'/topic/PC/recommendEvents/details.html?planId=' + item.planId" target="_blank">{{item.planTitle}}</a>
              <strong class="itemOther">
                <template v-if="item.playType == 1">
                  <b class="itemEventTag itemEventTag_1">{{item.playTypeContent}}</b>
                </template>
                <template v-if="item.playType == 2">
                  <b class="itemEventTag itemEventTag_2">{{item.playTypeContent}}</b>
                </template>
                <template v-if="item.playType == 3">
                  <b class="itemEventTag itemEventTag_3">{{item.playTypeContent}}</b>
                </template>
                <template v-if="item.playType == 4">
                  <b class="itemEventTag itemEventTag_5">{{item.playTypeContent}}</b>
                </template>
                <template v-if="item.playType == 6">
                  <b class="itemEventTag itemEventTag_6">{{item.playTypeContent}}</b>
                </template>
                <template v-if="item.playType == 7">
                  <b class="itemEventTag itemEventTag_7">{{item.playTypeContent}}</b>
                </template>
                <template v-if="item.playType == 8">
                  <b class="itemEventTag itemEventTag_8">{{item.playTypeContent}}</b>
                </template>
              </strong>
              <span class="itemTimer">{{formatDate(item.createTimestamp)}}</span>
            </div>
          </li>
        </template>
        <span style="color:gray;text-align:center;" class='nodata'  v-else-if="hasLoadedOtherData">暂无相关推单~</span> 

      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: ["leisuId","startTime"],
  data() {
    return {
      planList:[],
      userInfoList:[]
      ,
      hasLoadedOtherData:false
    };
  },
  created(){
    
  },
  mounted(){
    this.getList()
  },
  methods: {
    getList(){
      let that = this;
      this.$http.get('/live/api/schedule/plan/get_plan_by_event?dataId='+that.leisuId + '&beginTime='+that.startTime)
      .then(function (res) {
        that.hasLoadedOtherData=true;
        that.planList = res.data.planList;
        that.userInfoList = res.data.userInfoList;
        // console.log(11111,res)

      })
      .catch(function (error) {
        that.hasLoadedOtherData=true;
        console.log(error)
      });
    },
    formatDate(date){
      var timer = date != null ? new Date(date) : new Date();
      var y = timer.getFullYear();
      var M = timer.getMonth() + 1;
      var d = timer.getDate();
      var h = timer.getHours();
      var m = timer.getMinutes();
      var s = timer.getSeconds();
      M = M < 10 ? "0" + M : M;
      d = d < 10 ? "0" + d : d;
      h = h < 10 ? "0" + h : h;
      m = m < 10 ? "0" + m : m;
      s = s < 10 ? "0" + s : s;
      return y + "年" + M + "月" + d + "日 " + h + ":" + m;
    }
  }
};
</script>

<style lang="scss" scope>
  .slideInfo{
    height:auto;
    min-height: 535px;
    overflow:hidden;
    .slideName{
      font-size:14px;
      font-weight:normal;
      padding-top:5px;
      color:#333;
      display:inline-block;
      border-bottom:2px solid #FF454F;
      overflow:hidden;
    }
    .slideHeader{
      background:#fff;
      margin-bottom:10px;
      overflow:hidden;
      padding:0 10px;
      .anchorList{
        padding-top:15px;
        overflow:hidden;
        .nodata{
          display:block;
           font-size: 12px;
          width:100%;
          text-align: center;
          padding:100px 0;
          margin:0 auto;
        }
        li{
          width:51px;
          float:left;
          margin-right:25px;
          margin-bottom:15px;
          overflow:hidden;
          .itemAvatar{
            width:51px;
            height:51px;
            display:block;
            overflow:hidden;
            position:relative;
            img{
              width:51px;
              height:51px;
              border-radius:50%;
              display:block;
              overflow:hidden;
            }
            b{
              width:40px;
              height:14px;
              line-height:14px;
              text-align:center;
              color:#fff;
              font-size:12px;
              border-radius:20px;
              background:#FF454F;
              font-weight:normal;
              display:block;
              position:absolute;
              bottom:0;
              left:0;
              right:0;
              margin:0 auto;
              overflow:hidden;
            }
          }
          .itemUserName{
            text-overflow:ellipsis;
            white-space:nowrap;
            overflow:hidden;
            color:#333333;
            text-align:center;
            font-size:12px;
            &:hover{
              color:#FF454F;
            }
          }
        }
        li:nth-of-type(4n+4){
          margin-right:0;
        }
      }
    }
    .slideRecomend{
      background:#fff;
      margin-bottom:10px;
      overflow:hidden;
      padding:0 10px 10px;
      .recomendList{
        overflow:hidden;
        .nodata{
          font-size: 12px;
          display:block;
          width:100%;
          text-align: center;
          padding:100px 0;
          margin:0 auto;
        }
        li{
          padding:15px 0;
          border-bottom:1px dotted #E5E5E5;
          overflow:hidden;
          .anchorInfo{
            float:left;
            width:51px;
            overflow:hidden;
            .itemAvatar{
              width:51px;
              height:51px;
              display:block;
              overflow:hidden;
              position:relative;
              img{
                width:51px;
                height:51px;
                border-radius:50%;
                display:block;
                overflow:hidden;
              }
            }
            .itemUserName{
              text-overflow:ellipsis;
              white-space:nowrap;
              overflow:hidden;
              color:#333333;
              text-align:center;
              font-size:12px;
              &:hover{
                color:#FF454F;
              }
            }
          }
          .eventInfo{
            float:right;
            width:210px;
            overflow:hidden;
            .itemTitle{
              text-overflow:ellipsis;
              white-space:nowrap;
              overflow:hidden;
              color:#333333;
              text-align:left;
              font-size:18px;
              display:block;
              &:hover{
                color:#FF454F;
              }
            }
            .itemOther{
              display:block;
              font-weight:normal;
              overflow:hidden;
              margin:5px 0;
              .itemEventTag{
                border:1px solid #ddd;
                height:18px;
                line-height:18px;
                padding:0 10px;
                color:#6A62FF;
                display:block;
                float:left;
                font-weight:normal;
                border-radius:20px;
                font-size:12px;
                margin-right:10px;
              }
              .itemEventTag_1{color:#58C14B;}
              .itemEventTag_2{color:#6A62FF;}
              .itemEventTag_3{color:#FBA423;}
              .itemEventTag_4{color:#9FA1BF;}
              .itemEventTag_5{color:#6935FF;}
              .itemEventTag_6{color:#FF2D84;}
              .itemEventTag_7{color:#614AA9;}
              .itemEventTag_8{color:#6A62FF;}
            }
            .itemTimer{
              font-size:16px;
              color:#6A6A6A;
              display:block;
              overflow:hidden;
            }
          }
        }
      }
    }
    
  }
</style>

