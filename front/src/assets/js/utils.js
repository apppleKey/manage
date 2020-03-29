
export const checkIsNum = (num)=> { 
  // 正整数
  var isNum = true;
  var r = /^\+?[1-9][0-9]*$/; 
  // 如果判断不符合正则，则不是正整数不能提交
  if(!r.test(num)){
    isNum = false;
  }
  return isNum;
}

// 获取浏览器url参数
export const getQueryString=(name)=> {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }


  /**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
      content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
}

  /**
 * 格式化时间戳
 * 
 * @param 时间戳
 *        传入日期
 * @return 08月17日 16:32
 */
export const  dateFormatCustom=(date)=> {
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
    return M + "月" + d + "日 " + h + ":" + m;
  }
  /**
 * 格式化时间戳
 * 
 * @param 时间戳
 *        传入日期
 * @return 2018-08-17 16:32:27
 */
export const  dateFormat=(date)=> {
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
    return y + "-" + M + "-" + d + " " + h + ":" + m + ":" + s;
  }
/**
* 获取localStorage
*/
export const getStore = name => {
  if (!name) {
      return false;
  } else {
      return window.localStorage.getItem(name);
  }
}

/**
* 删除localStorage
*/
export const removeStore = name => {
  if (!name) return;
  window.localStorage.removeItem(name);
}

/**
* 解码
*/
export const deCode = (val) => {
  return JSON.parse(unescape(atob(val)));
}
/**
* 混淆
*/
export const enCode = (val) => {
  return btoa(escape(JSON.stringify(val)));
}

/**
* 获取style样式
*/
export const getStyle = (element, attr, NumberMode = 'int') => {
  let target;
  // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
  if (attr === 'scrollTop') {
      target = element.scrollTop;
  } else if (element.currentStyle) {
      target = element.currentStyle[attr];
  } else {
      target = document.defaultView.getComputedStyle(element, null)[attr];
  }
  //在获取 opactiy 时需要获取小数 parseFloat
  return NumberMode == 'float' ? parseFloat(target) : parseInt(target);
}

export const Keys={
    token:'token',
    uid:'uid',
    isDebug:'isDebug',
    isMock:'isMock'
}

export const emojs=
    ["[爱你]", "[偷笑]", "[泪]", "[哈哈]", "[太阳]", "[疑问]", "[太开心]", "[汗]]", "[礼物]", "[怒]", "[来电]", "[吐口水]", "[伤心]", "[心]", "[啤酒饮料]", "[耶]", "[红酒]", "[哼]", "[举手]", "[下雨]", "[音乐]", "[抓狂]", "[色]", "[吃惊]", "[奋斗]", "[睡]", "[衰]", "[挤眼]", "[酷]", "[可怜]", "[气球]", "[彩虹]", "[菜刀]", "[嘘]", "[鄙视]", "[握手]", "[星星]", "[咖啡]", "[委屈]", "[蛋糕]", "[羡慕]", "[害羞]", "[调皮]", "[失望]", "[黑线]", "[蜗牛]", "[屎]", "[拜拜]", "[电灯泡]", "[晕]", "[鼓掌]", "[嘻嘻]", "[NO]", "[OK]", "[笑哭]", "[微笑]", "[来]", "[哈欠]", "[亲亲]", "[白眼]", "[挖鼻]", "[困]", "[闭嘴]", "[吐]", "[左哼哼]", "[右哼哼]", "[阴险]", "[GOOD]", "[BAD]", "[抱抱]", "[生病]", "[怒骂]"]
  ;
export const appInterface = (function(window){
  var isMock=getStore(Keys.isMock)?true:false;
  if (window.hasOwnProperty("app")) {
      window.app.env = 'andriod';
      window.app.isApp = true;
      window.app.isMock = isMock;
      
    } else if (navigator.userAgent.includes("kinglive-ios")) {
        window.app = {
            env: 'ios',
            isApp:true,
            isMock : isMock,
            jsShowDialog: function (opt1, opt2) {
                if (!opt2) opt2 = null
                //房间  roomId   视频类型   videoType （1 代表有主播直播,2,代表无主播直播,3,代表回放视频或者短视频）
                window.webkit.messageHandlers.jsShowDialog.postMessage(
                    opt1, opt2
              )
          },
          jsPlay: function (opt1) {
              window.webkit.messageHandlers.jsPlay.postMessage(opt1)
          },
          jsNewActivity: function (opt1) {
              window.webkit.messageHandlers.jsNewActivity.postMessage(opt1)
          },
          jsScrollChanged: function (opt1, opt2) {
              window.webkit.messageHandlers.jsScrollChanged.postMessage(opt1, opt2)
          },
          jsLogin: function () {
              window.webkit.messageHandlers.jsLogin.postMessage()
          },
          jsIsLogin: function () {
              window.webkit.messageHandlers.jsIsLogin.postMessage()
          },
          //跳到外部浏览器
          jsOpenBrower:function(opt1){
            window.webkit.messageHandlers.jsOpenBrower.postMessage(opt1);
          },
          jsBetting: function (opt1) {
              window.webkit.messageHandlers.jsBetting.postMessage(opt1)
          }
          ,

      
        jsShowDialogAndKickUser: function(opt1,opt2){
            if(!opt2) opt2 = null;
            window.webkit.messageHandlers.jsShowDialogAndKickUser.postMessage(opt1,opt2);
        },
       
        jsLogin: function(){
            window.webkit.messageHandlers.jsLogin.postMessage();
        },
        jsIsLogin: function(){
            window.webkit.messageHandlers.jsIsLogin.postMessage();
        },
        jsBetting: function(opt1){
            window.webkit.messageHandlers.jsBetting.postMessage(opt1);
        },
        jsAnimationList:function(opt1){
            window.webkit.messageHandlers.jsAnimationList.postMessage(opt1);
        },
        jsKickUser:function(){
            window.webkit.messageHandlers.jsKickUser.postMessage({});
        },
        jsJumpToBrowser:function(opt1){
            window.webkit.messageHandlers.jsJumpToBrowser.postMessage(opt1);
        }
      
        
      }
  } else {
      return {
          env: 'browser',
          isApp:false,
          isMock : isMock,
      }
  }
  return window.app;


})(window)

export const getAgent= ()=>{
  if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    return 'H5'
  } else {
    return "PC"
  }
}
