<template>
  <div class="chat_box" @touchmove="autoMsg($event)" ref="chatBox">
    <div class="chat_list" @click="showMorePanel(0)">
      <transition name="slide-fade">
      <ul class="chat_content" v-if="!socketLoad">
        <template v-for="(item,i) in chatData">
        <li class="chat_item wel" v-if="item.msgtype == '0'" :key="i">欢迎<span>{{item.username}}</span>光临本直播间，祝您玩得开心！</li>
        <li class="chat_item" v-else-if="item.msgtype == '1'" :key="i"><span class="level_ico" :class="'level' + item.level"></span><span class="nickname">{{item.username}}</span> 赠送 {{item.giftname}}<img class="gifticon" :src="item.gifticon" :alt="item.giftname"><span class="giftcount">x{{item.giftcount}}</span></li>
        <li class="chat_item" v-else-if="item.msgtype == '2'" :key="i"><span class="level_ico" :class="'level' + item.level"></span><span class="nickname">{{item.uname}}：</span><span v-html="item.ct"></span></li>
        <li class="chat_item" v-else-if="item.msgtype == '00'" :key="i"><span class="anchor_info">直播间消息</span><span v-html="item.ct"></span></li>
        <li class="chat_item" v-else-if="item.msgtype == '11'" :key="i"><span class="level_ico" :class="'level' + item.level"></span><span class="nickname">{{item.uname}}[我]：</span><span v-html="item.ct"></span></li>
        <li class="chat_item" v-else-if="item.msgtype == '22'" :key="i"><p class="xt"><span class="system">系统消息</span><span class="xtxx" v-html="item.ct"></span></p></li>
        <li class="chat_item wel" v-else-if="item.msgtype == '33'" :key="i"><span>{{item.username}}</span>离开了房间</li>
        </template>
      </ul>
      </transition>
      <transition name="fade">
      <div class="load" v-if="socketLoad" @click="socketConn('again')">
        <div class="load_ani">
          <div class="k-line k-line2-1"></div>
          <div class="k-line k-line2-2"></div>
          <div class="k-line k-line2-3"></div>
        </div>
        <p>{{socketLoadText}}</p>
      </div>
      </transition>
    </div>
    <transition name="slide-fade">
    <div class="new_msg" v-if="!auto && moreMsg" @click="showMoreMsg">底部有新消息</div>
    </transition>
    <div class="send_panel">
      <div class="input_panel">
        <span class="gift" @click="showMorePanel(1)" v-show="false"></span>
        <form class="send" @submit.prevent="pushMsg">
          <input type="text" placeholder="吐个槽吧" ref="sendBox" @blur="getSelectPoint($event)" @focus="showMorePanel(0)" v-model="content">
        </form>
        <span class="emoji" @click="showMorePanel(2)"></span>
        <input class="submit" type="button" :class="content != '' || giftCount > 0  ? 'active' : ''" value="发送" @click="pushMsg">
      </div>
      <div class="gift_list swiper-container" v-show="show == 1" id="giftList">
        <ul class="swiper-wrapper">
          <li class="swiper-slide" v-for="(item, i) in giftList" :key="'slide' + i">
            <div class="gift_item" v-for="(items, ii) in item" :key="'item' + ii" @click="addGift(items.id,items.needcoin,items.giftname)">
                <span v-if="showGiftCount == 'gift' + items.id" class="gift_num">{{giftCount}}</span>
                <img :src="items.gifticon" alt="" class="gift_ico">
                <p class="gift_name">{{items.giftname}}</p>
                <p class="gift_cost"><span class="diamond"></span>{{items.needcoin}}</p>
            </div>
          </li>
        </ul>
        <div class="swiper-pagination"></div>
        <div class="balance"><span class="balance_ico"></span><span class="count">？</span><span class="clear_gifts" @click="clearGift">清除</span></div>
      </div>
      <div class="emoji_list swiper-container" v-show="show == 2" id="emojiList">
        <ul class="swiper-wrapper">
          <template v-for="(item,index) in emojiPic">
            <li class="swiper-slide" :key="'emoji' + index">
              <template v-for="items in item">
                <div class="emoji_item" :key="items" @click="addEmoji(items)">
                  <img :src="'/public/front/images/face/'+ items +'.gif'" class="emoji_ico">
                </div>
              </template>
            </li>
          </template>
        </ul>
        <div class="swiper-pagination"></div>
      </div>
    </div>
  </div>
</template>
<script>
import Swiper from 'swiper'
import io from "socket.io-client"
import {getCookie} from '@/config/unit'
import { setTimeout } from 'timers';
export default {
  props:['tabIndex','uids','tokens'],
  data() {
    return {
      url: "",
      user: {},
      userInfo:{},
      swiperPanel:null,
      emojiText:["[微笑]", "[嘻嘻]", "[哈哈]", "[可爱]", "[可怜]", "[挖鼻]", "[吃惊]", "[害羞]", "[挤眼]", "[闭嘴]", "[鄙视]", "[爱你]", "[泪]", "[偷笑]", "[亲亲]", "[生病]", "[太开心]", "[白眼]", "[右哼哼]", "[左哼哼]", "[嘘]", "[衰]", "[委屈]", "[吐]", "[哈欠]", "[抱抱]", "[怒]", "[疑问]", "[馋嘴]", "[拜拜]", "[思考]", "[汗]", "[困]", "[睡]", "[钱]", "[失望]", "[酷]", "[色]", "[哼]", "[鼓掌]", "[晕]", "[悲伤]", "[抓狂]", "[黑线]", "[阴险]", "[怒骂]", "[互粉]", "[心]", "[伤心]", "[猪头]", "[熊猫]", "[兔子]", "[ok]", "[耶]", "[good]", "[NO]", "[赞]", "[来]", "[弱]", "[草泥马]", "[神马]", "[囧]", "[浮云]", "[给力]", "[围观]", "[威武]", "[奥特曼]", "[礼物]", "[钟]", "[话筒]", "[蜡烛]", "[蛋糕]"],
      emojiPic:[[],[]],
      show:0,
      content:'',
      selectStart:0,
      chatData:[],
      face:{},
      faceReg:/\[.+?\]/g,
      auto:true,
      moreMsg:false,
      socket: new Object(),
      socketLoad:true,
      socketLoadText:'聊天加载中',
      giftList:[],
      giftCount:0,
      giftid:'',
      showGiftCount:'',
      giftCoin:0,
      giftName:'',
      users:{}
    }
  },
  watch:{
    $route(){
      this.getQuizData()
      this.socketConn()
    },
    tabIndex(){
      if(this.tabIndex === 0){
        this.showMoreMsg()
      }
    }
  },
  mounted() {
    //表情数据
    this.emojiText.forEach((item,index) => {
      this.face[item] = '<img class="h5bq" src="/public/front/images/face/'+ index +'.gif" alt="'+ item +'" />'
      if(index < 45){
        this.emojiPic[0].push(index)
      }else{
        this.emojiPic[1].push(index)
      }
    })
    //获取用户登陆token
    this.users.uid = getCookie('AJ1sOD_uid')
    this.users.token = getCookie('AJ1sOD_token')
    //获取nodeinfo信息并连接socket
    this.socketConn()

    //获取礼物列表，暂时屏蔽
    // this.getGiftList()
  },
  beforeDestroy(){
    if(this.swiperPanel != null) this.swiperPanel.destroy(false)
  },
  methods:{
    getUserInfo(){
      this.$ajax({
        url:'/index.php?g=Wwapi&m=User&a=index',
        method:'GET',
        params:{
          uid:this.users.uid,
          token:this.users.token
        }
      }).then(res => {
        if(res.status === 200){
          //console.log(res)
          this.user = {
            currentChannel:'anchor',
            equipment:'h5',
            nickname:res.data.data.user_nicename ? res.data.data.user_nicename : '',
            roomnum:this.$route.query.id,
            token:res.data.data.token ? res.data.data.token : '',
            uid:this.users.uid || '',
            stream:this.$route.query.id + '_1',
            votestotal:res.data.data.votestotal || ''
          }
          this.linkToSocket()
        }
      })
    },
    socketConn(type){
      if(type && this.socketLoadText == '连接失败，点击重新连接'){
        this.socketLoadText = '弹幕重新连接请稍后'
      }else if(type && this.socketLoadText != '连接失败，点击重新连接'){
        return
      }
      // console.log(111111111111111111)
      let _this = this
      _this.setNodeInfo(function(infos){
        _this.getSocketAdd(function(sAdd){
          _this.socket = io(sAdd,{ transports: ['websocket'],sid:['gTHBXOVuv-64VxkHAUIx']})
          //判断连接状态socket
          _this.socketStatus()
          //系统消息
          _this.systemMsg()
          //接收消息
          _this.pullMsg()
          //连接socket
          _this.socket.emit('conn', {
            currentChannel:'anchor',
            equipment:'h5',
            nickname:infos.user_nicename,
            roomnum:infos.roomnum,
            stream:infos.stream,
            token:infos.token,
            uid:infos.id
          })
        })
      })
    },
    getSocketAdd(callback){
      // let _this = this
      this.$ajax({
        url:'/index.php?g=Wwapi&m=Anchor&a=getInfoOfChatRoom',
        method:'GET',
      }).then(res => {
        // console.log('getSocketAdd',res)
        if(res.status === 200 && res.data.data.config.chatserver != ''){
          callback(res.data.data.config.chatserver)
        }
      })
    },
    setNodeInfo(callback){
      this.$ajax({
        url:'/index.php?g=front&m=show&a=setNodeInfo',
        method:'GET',
        params:{
          uid:this.users.uid || '0',
          token:this.users.token || '0',
          showid:this.$route.query.id,
          stream:this.$route.query.id + '_' + this.$route.query.id,
        }
      }).then(res => {
        // console.log('setNodeInfo',res)
        if(res.data.error === 0){
          callback(res.data.userinfo)
        }
        // callback()
      })
    },
    showMorePanel(i){//显示隐藏礼物表情面版
      if(i === 1 && this.giftList == []){
        this.tip('礼物列表获取中，请稍后！！！')
        return
      }
      if(i == 0){
        this.show = 0
        if(this.swiperPanel != null) this.swiperPanel.destroy(false)
        this.clearGift()
        return
      }
      if(this.show == i){
        this.show = 0
        this.swiperPanel.destroy(false)
        return
      }
      this.show = i
      if(this.swiperPanel != null) this.swiperPanel.destroy(false)
      let _this = this
      setTimeout(()=>{
        _this.swiperPanel = new Swiper(i == 1 ? '#giftList' : '#emojiList',{
          pagination: {
            el: '.swiper-pagination',
          },
        })
      })
    },
    addEmoji(i){//输入表情
      // this.$refs.sendBox.addEventListener('keyup',e => {
      //   //console.log(e.target.selectionStart)
      // })
      this.content += this.emojiText[i]
    },
    addGift(id,coin,name){//添加礼物
      if(this.giftid == id){
        this.giftCount += 1
      }else{
        this.giftid = id
        this.giftCount = 1
        this.showGiftCount = 'gift' + id
      }
      this.giftCoin = Number(coin) * this.giftCount
      this.giftName = name
    },
    clearGift(){
      this.giftCount = 0
      this.giftid = ''
      this.showGiftCount = ''
    },
    getSelectPoint(e){//获取光标位置
      // //console.log(e)
      this.selectStart = e.target.selectionStart
    },
    formatChatContent(data){//格式化消息内容
      let _this = this
      data.msg.forEach((item,index,arr) => {
        if(_this.chatData.length > 200) _this.chatData.splice(0,_this.chatData.length - 200)
        switch(item.msgtype){
          case '0':
            if(arr.length > 1){break}
            _this.chatData.push({
              msgtype: '0',
              username: item.ct.user_nicename,
            })
            break
          case '1':
            _this.chatData.push({
              msgtype: '1',
              username: item.ct.uname,
              gifticon: item.ct.gifticon,
              giftname: item.ct.giftname,
              giftcount: item.ct.giftcount,
              level: item.ct.level,
            })
            break
          case '2':
            if(item.ct.indexOf('[') > -1){
              item.ct = item.ct.replace(_this.faceReg,(a) => {
                return _this.face[a]
              })
            }
            if(item.uid === _this.user.roomnum){
              item.msgtype = '00'
            }else if(item.uid === _this.user.uid){
              item.msgtype = '11'
            }
            // //console.log(item)
            _this.chatData.push(item)
            break
          case '4':
            if(data.msg.length === 1 && Object.prototype.toString.call(item.ct) ==="[object String]"){
              _this.tip(item.ct)
            }
            break
        }
      })
      if(_this.auto){
        _this.autoMsgFunc()
      }else{
        _this.moreMsg = true
      }
    },
    autoMsg(){//消息滚动
      if(this.tabIndex != 0) return
      if(document.documentElement.scrollTop + 50 < document.documentElement.offsetHeight - document.documentElement.clientHeight){
        this.auto = false
      }else{
        this.auto = true
      }
    },
    showMoreMsg(){//显示底部消息
      if(this.tabIndex != 0) return
      document.documentElement.scrollTop = document.body.scrollTop = document.documentElement.offsetHeight - document.documentElement.clientHeight
      this.auto = true
      this.moreMsg = false
    },
    autoMsgFunc(){//第一次加载滚动到底部
      if(this.tabIndex != 0) return
      setTimeout(()=>{
        document.documentElement.scrollTop = document.body.scrollTop = document.documentElement.offsetHeight - document.documentElement.clientHeight
      })
    },
    getGiftList(){
      let _this = this
      _this.$ajax({
        url:'/api/public/?service=Live.getGiftList',
        method:'GET'
      }).then(res => {
        // //console.log('giftList',res)
        if(res.status == 200){
          let data = res.data.data.info[0].giftlist
          let step = Math.ceil(data.length / 10)
          for(var i = 0; i < step; i++){
            // //console.log('------------------------')
            if(data.length >= 10){
              _this.giftList[i] = data.splice(0,10)
              // //console.log('data',data)
            }else{
              _this.giftList[i] = data
            }
          }
          // //console.log(_this.giftList)
        }
      })
    },
    //socket相关
    socketStatus(){//判断连接状态socket
      let _this = this
      _this.socket.on('conn', function (data) {
        console.log('conn',data)
        if(data[0] != 'ok'){
          _this.socketLoad = true
          _this.socketLoadText = '连接失败，点击重新连接'
          _this.tip('聊天连接失败！！！')
        }else{
          _this.socketLoad = false
          _this.userInfo = JSON.parse(data[1])
        }
      })
    },
    systemMsg(){//系统消息
      let _this = this
      _this.socket.on('broadcastingListen', function (data) {
        // //console.log('broadcastingListen',data)
        data = JSON.parse(data[0])
        if(data.retmsg === 'OK'){
          if(data.msg[0].msgtype === '4'){
            _this.chatData.push({
              ct:data.msg[0].ct,
              msgtype:'22'
            })
          }else if(data.msg[0].msgtype === '0'){
            _this.chatData.push({
              username:data.msg[0].ct.user_nicename,
              msgtype:'33'
            })
          }
        }
        //console.log('broadcastingListen',data)
      })
    },
    pullMsg(){//接收消息
      let _this = this
      _this.socket.on('loadhistory', function (data) {
        data = JSON.parse(data)
        //console.log('loadhistory',data)
        _this.formatChatContent(data)
      })
    },
    pushMsg(){//发送消息
      let _this = this
      if(_this.users.token){
        if(_this.content == ''){
          _this.tip('消息不能为空！')
          return
        }
        _this.socket.emit('broadcast','{"currentChannel":"anchor","msg":[{"_method_":"SendMsg","action":0,"ct":"'+ _this.content +'","msgtype":"2","tougood":"","touid":"","touname":"","ugood":"'+ _this.user.uid +'","uid":"'+ _this.user.uid +'","uname":"'+ _this.userInfo.user_nicename +'","level":"'+ _this.userInfo.level +'"}],"retcode":"000000","retmsg":"OK"}')
        _this.content = ''
        if(_this.show != 0){
          _this.showMorePanel(0)
        }else{
          _this.$refs.sendBox.blur()
        }
      }else{
        _this.confirm('登录后才能与主播互动哦！是否跳转到登录页？',function(back){
          // console.log(back)
          if (!back) return
          let url ='/index.php?g=h5&m=user&a=login&url='
          url += btoa(encodeURI(location.href))
          location.href = url
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/style/mixin';
.chat_box{
  position: relative;
  @include wh(100%,auto);
  overflow-x: hidden;
  .chat_list{
    position: relative;
    @include wh(100%,auto);
    padding-bottom: p2r(102);
    .chat_content{
      position: relative;
      @include wh(100%,auto);
    }
    .chat_item{
      position: relative;
      @include wh(100%,auto);
      font-size: p2r(28);
      color: #999;
      line-height: p2r(42);
      padding: p2r(5) p2r(30);
      text-align: left;
      word-break: break-all;
      &.wel{
        color: #999;
        span{
          color: #fcb2d7;
          margin: 0 p2r(5);
        }
      }
      .xt{
        position: relative;
        @include wh(100%,auto);
        margin: 0 auto;
        background: #eee;
        border-radius: 4px;
        font-size: p2r(24);
        line-height: p2r(42);
        padding: p2r(10);
        margin-top: p2r(20);
        .system{
          color: #999;
          margin-right: p2r(10);
        }
        .xtxx{
          color: #333;
        }
      }
      .gifticon{
        @include wh(auto,p2r(42));
        vertical-align: middle;
        margin: 0 p2r(10);
      }
      .giftcount{
        color: #ff3456;
      }
      .anchor_info{
        display: inline-block;
        @include wh(auto,p2r(42));
        line-height: p2r(42);
        padding: 0 p2r(15);
        margin-right: p2r(15);
        color: #FFF;
        background: #ff3456;
        vertical-align: middle;
      }
      .level_ico{
        display: inline-block;
        vertical-align: middle;
        @include rwh(58,29);
        background-image: url('data:image/png;base64,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');
        background-size: 1000% 100%;
        background-position-y: 0;
        margin-right: p2r(5);
        &.level1{
          background-position-x: 0;
        }
        &.level2{
          background-position-x: p2r(-58);
        }
        &.level3{
          background-position-x: p2r(-116);
        }
        &.level4{
          background-position-x: p2r(-174);
        }
        &.level5{
          background-position-x: p2r(-232);
        }
        &.level6{
          background-position-x: p2r(-290);
        }
        &.level7{
          background-position-x: p2r(-348);
        }
        &.level8{
          background-position-x: p2r(-406);
        }
        &.level9{
          background-position-x: p2r(-464);
        }
        &.level10{
          background-position-x: p2r(-522);
        }
      }
      .nickname{
        color: #ff3456;
      }
    }
    .load{
      position: relative;
      @include wh(8rem,3.5rem);
      margin: 0 auto;
      margin-top: 4rem;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      p{
        position: relative;
        @include wh(auto,auto);
        font-size: p2r(24);
        color: #999;
        text-align: center;
        line-height: p2r(50);
      }
    }
  }
  .send_panel{
    position: fixed;
    left: 0;
    bottom: 0;
    @include wh(100%,auto);
    z-index: 1000;
    .input_panel{
      position: relative;
      @include wh(100%,p2r(96));
      @include fs;
      padding: 0 p2r(20);
      background: #FFF;
      box-shadow: 0 -1px 5px #EEE;
      .gift,.emoji{
        @include rwh(60,60);
        background-image: url('~@/images/chatbtn.png');
        background-size: 100% 200%;
        background-position-x: 0;
      }
      .gift{
        background-position-y: 0;
      }
      .emoji{
        background-position-y: p2r(-61);
      }
      .send{
        position: relative;
        @include rwh(480,60);
        input{
          display: block;
          @include wh(100%,100%);
          background: #F2F2F2;
          font-size: p2r(28);
          padding: 0 p2r(10);
          color: #333;
        }
      }
      .submit{
        position: relative;
        @include rwh(108,60);
        background: #CCC;
        font-size: p2r(28);
        padding: 0 p2r(10);
        color: #FFF;
        &.active{
          background: #ff3456;
        }
      }
    }
    .gift_list,.emoji_list{
      position: relative;
      @include wh(100%,p2r(470));
      background: linear-gradient(-90deg,#121317,#323b42);
      &.emoji_list{
        background: linear-gradient(90deg,#f0eff0,#DDD);
        .swiper-slide {
          justify-items: flex-start;
          align-content: flex-start;
          .emoji_item{
            @include rwh(60,60);
            margin: p2r(9);
            @include fc;
            img{
              display: block;
              @include wh(auto,auto);
            }
          }
        }
      }
      .swiper-slide{
        @include wh(100%,p2r(470));
        @include fs;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;
        padding: p2r(20) p2r(20) p2r(60) p2r(20);
        .gift_item{
          position: relative;
          @include wh(20%,50%);
          @include fc;
          flex-direction: column;
          @include noSelect;
          border-radius: 4px;
          &:active{
            background: #333;
          }
          .gift_num{
            position: absolute;
            left: 0;
            top: 0;
            @include wh(auto,p2r(24));
            padding: 0 p2r(8);
            font-size: p2r(24);
            line-height: p2r(24);
            color: #FFF;
            background: #ff3456;
            border-radius: p2r(12);
            // display: none;
          }
          .gift_ico{
            display: block;
            @include wh(p2r(120),p2r(120));
            border-radius: 2px;
          }
          .gift_name,.gift_cost{
            @include wh(100%,p2r(36));
            line-height: p2r(36);
            vertical-align: middle;
            color: #CCC;
            font-size: p2r(22);
            .diamond{
              display: inline-block;
              @include wh(p2r(20),p2r(20));
              background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAC+ElEQVQ4T62UTWgTQRTH/28yid0irYoI7UWoFDQ5JN1smyKIlB48tAo5CK3fIgoqgl5EpMXqwY+DH6B4EISCIliq4AeIolAUQq27W6wUlAqiXgSNWBO7lU3myZSmxDaNIi4MzM577/f+8+bNEP7zR8W8wcHBqkAgsEsIsZmZ4/PlIiIG8AzAZWa+bVmWX/CdAWpYIpHI2LbdQUSnACwvJ56I3jLzmWAweNfzvMnm5ubv2n8KaNt2G4Be7aSU6s5mswNVVVUWgKWloEKIr57nDYdCoT0AugF8CgaD66PR6DuybfsEgK4CfCoL0S0p5T7f97cysyIiPfJ6DkDPHzPzcQCbihJ+BtBKqVRqSSgU2glgL4AV08BLSqk3RHSxlEKdkJmvAHg4bR8VQhxraGi4Q47jbAaQNk3zkW3b64QQ+4joeD6fP01ErfPUMZ/L5VZJKbXK+4Zh9E9MTGwVQvyksbGxBePj408BLARwPpPJXG9paZns6+sL1NXVCcMwqLKyUqTTaZHJZERNTQ1ls1m97oXD4ZzjOPoQewC8NU2zbepQXNetVUq9AFAL4INhGBHP827qQ2FmQUTab2bof9/326WUZ3Qdieh9RUWFGYlEvs60jW3bCQADACqI6DAzLwFwpNSWmTkVCAR2K6VeAchJKdfEYrGhmbYpBA0PD2/P5/O9AL7kcrm1UsqXAGQJ6A4A6wB0EtGBeDx+aU5jFxYcxznHzIeIqIuZowA2zgJ+0+0BYIiZ+xsbGzuK7b9dPW1g5oDjOA8AWES0jZnv/RZApNUsYmbLMIzGSCSSLQvUxpGRkcW+72sFNwC0AzALQUKIjUqpq1LK1bFYbHR2OeYoLDi4rhtWSj0UQpxXSp2dXn8O4LUQ4olpmtdKNn25B8B13Q1KqbVEtIWZlwHQj0a1ZVn7532JygG1zXGcgwBWMnMngJPV1dUX6uvrf/4zkJnJdd2kUirJzEebmpo+lhMxbw2Lg3p6ekQymTSi0eiPP+3or4B/ghTbfwHbyCx3NGGUiwAAAABJRU5ErkJggg==") no-repeat center center/100% 100%;
              margin-right: p2r(5);
              vertical-align: middle;
            }
          }
        }
      }
      .balance{
        position: absolute;
        left: p2r(30);
        bottom: p2r(20);
        @include wh(auto,p2r(33));
        line-height: p2r(33);
        vertical-align: middle;
        z-index: 999999999;
        color: #CCC;
        .balance_ico{
          display: inline-block;
          @include wh(p2r(30),p2r(30));
          background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAC+ElEQVQ4T62UTWgTQRTH/28yid0irYoI7UWoFDQ5JN1smyKIlB48tAo5CK3fIgoqgl5EpMXqwY+DH6B4EISCIliq4AeIolAUQq27W6wUlAqiXgSNWBO7lU3myZSmxDaNIi4MzM577/f+8+bNEP7zR8W8wcHBqkAgsEsIsZmZ4/PlIiIG8AzAZWa+bVmWX/CdAWpYIpHI2LbdQUSnACwvJ56I3jLzmWAweNfzvMnm5ubv2n8KaNt2G4Be7aSU6s5mswNVVVUWgKWloEKIr57nDYdCoT0AugF8CgaD66PR6DuybfsEgK4CfCoL0S0p5T7f97cysyIiPfJ6DkDPHzPzcQCbihJ+BtBKqVRqSSgU2glgL4AV08BLSqk3RHSxlEKdkJmvAHg4bR8VQhxraGi4Q47jbAaQNk3zkW3b64QQ+4joeD6fP01ErfPUMZ/L5VZJKbXK+4Zh9E9MTGwVQvyksbGxBePj408BLARwPpPJXG9paZns6+sL1NXVCcMwqLKyUqTTaZHJZERNTQ1ls1m97oXD4ZzjOPoQewC8NU2zbepQXNetVUq9AFAL4INhGBHP827qQ2FmQUTab2bof9/326WUZ3Qdieh9RUWFGYlEvs60jW3bCQADACqI6DAzLwFwpNSWmTkVCAR2K6VeAchJKdfEYrGhmbYpBA0PD2/P5/O9AL7kcrm1UsqXAGQJ6A4A6wB0EtGBeDx+aU5jFxYcxznHzIeIqIuZowA2zgJ+0+0BYIiZ+xsbGzuK7b9dPW1g5oDjOA8AWES0jZnv/RZApNUsYmbLMIzGSCSSLQvUxpGRkcW+72sFNwC0AzALQUKIjUqpq1LK1bFYbHR2OeYoLDi4rhtWSj0UQpxXSp2dXn8O4LUQ4olpmtdKNn25B8B13Q1KqbVEtIWZlwHQj0a1ZVn7532JygG1zXGcgwBWMnMngJPV1dUX6uvrf/4zkJnJdd2kUirJzEebmpo+lhMxbw2Lg3p6ekQymTSi0eiPP+3or4B/ghTbfwHbyCx3NGGUiwAAAABJRU5ErkJggg==") no-repeat center center/100% 100%;
          margin-right: p2r(10);
          vertical-align: middle;
        }
        .count{
          color: #CCC;
          font-size: p2r(24);
        }
        .clear_gifts{
          display: inline-block;
          @include wh(auto,100%);
          padding: 0 p2r(20);
          color: #FFF;
          background: #ff3456;
          font-size: p2r(22);
          line-height: p2r(33);
          border-radius: p2r(16.5);
          margin-left: 0.333333333rem;
        }
      }
    }
  }
  .new_msg{
    position: fixed;
    bottom: p2r(120);
    left: p2r(225);
    @include rwh(300,50);
    background: #ff3456;
    border-radius: 4px;
    font-size: p2r(28);
    color: #FFF;
    line-height: p2r(50);
    text-align: center;
    z-index: 999;
  }
}
</style>