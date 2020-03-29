
var typeList=[
    { "name": "全部", "index": 0, "icon": "1.png" },
    { "name": "足球", "index": 2, "icon": "1.png" },
    { "name": "篮球", "index": 1, "icon": "5.png" },
{ "name": "电竞", "index": 3, "icon": "9.png" },
{ "name": "排球", "index": 4, "icon": "7.png" },
{ "name": "网球", "index": 5, "icon": "4.png" },
{ "name": "斯诺克", "index": 6, "icon": "3.png" },
{ "name": "羽毛球", "index": 7, "icon": "8.png" },
{ "name": "橄榄球", "index": 8, "icon": "6.png" },
{ "name": "棒球", "index": 9, "icon": "2.png" },
{ "name": "其他", "index": 10, "icon": "10.png" }];

var typeMapIcon={};
typeList.map(v=>{
    typeMapIcon[v.name]=v.icon;
})
var typeMapName={};
typeList.map(v=>{
    typeMapName[v.index]=v.name;
})
var cooperate = {
    'bojiu': {
      id:'bojiu',
      token: '3cdfb1cb9b61ebbbf07b6acfe85c5558',
      name: '博9',
      anthorList: [
        { uid: 23210, user_nicename: "哈儿" },
        { uid: 23209, user_nicename: "小筑" },
        { uid: 23208, user_nicename: "安娜" },
        { uid: 23874, user_nicename: "安安" },
        { uid: 24055, user_nicename: "星儿" },
        { uid: 26887, user_nicename: "白白" },
        { uid: 26888, user_nicename: "麦麦" },
        { uid: 29449, user_nicename: "Wayne" },
        { uid: 30933, user_nicename: "BeeBee" }
      ]
    },
    '109': {
      id:'109',
      token: '83f33bdc5f2aa47ca8a86f85a53412b8',
      name:'109',
      anthorList:[
        { uid:30175,user_nicename: '拳打幼儿园'},
        { uid:30176,user_nicename: '白雪公主'},
        { uid:30177,user_nicename: '蛋爷'},
        { uid:30178,user_nicename: '小马宝莉'},
        { uid:30179,user_nicename: '熊二赞'},
        { uid:30180,user_nicename: '光头强'},
        { uid:30181,user_nicename: '苏菲亚'},
        { uid:30182,user_nicename: '我是一杯水'},
        { uid:30183,user_nicename: '木之本樱'},
        { uid:30185,user_nicename: '总有美人想害朕丶'}
      ]
    }, //109
  }
const editorOption={
 // 全局组件名称，使用new VueHtml5Editor(options)时该选项无效 
    // global component name
    name: "vue-html5-editor",
    // 是否显示模块名称，开启的话会在工具栏的图标后台直接显示名称
    // if set true,will append module name to toolbar after icon
    showModuleName: false,
    // 自定义各个图标的class，默认使用的是font-awesome提供的图标
    // custom icon class of built-in modules,default using font-awesome
    icons: {
        text: "fa fa-pencil",
        color: "fa fa-paint-brush",
        font: "fa fa-font",
        align: "fa fa-align-justify",
        list: "fa fa-list",
        link: "fa fa-chain",
        unlink: "fa fa-chain-broken",
        tabulation: "fa fa-table",
        image: "fa fa-file-image-o",
        hr: "fa fa-minus",
        eraser: "fa fa-eraser",
        undo: "fa-undo fa",
        "full-screen": "fa fa-arrows-alt",
        info: "fa fa-info",
    },
    // 配置图片模块
    // config image module
    image: {
        // 文件最大体积，单位字节  max file size
        sizeLimit: 512 * 1024,
        // 上传参数,默认把图片转为base64而不上传
        // upload config,default null and convert image to base64
        upload: {
            url: '/api/upload/img',
            headers: {},
            params: {},
            fieldName: 'file'
        },
        // 压缩参数,默认使用localResizeIMG进行压缩,设置为null禁止压缩
        // compression config,default resize image by localResizeIMG (https://github.com/think2011/localResizeIMG)
        // set null to disable compression
        compress: {
            width: 1600,
            height: 1600,
            quality: 80
        },
        // 响应数据处理,最终返回图片链接
        // handle response data，return image url
        uploadHandler(responseText){
            //default accept json data like  {ok:false,msg:"unexpected"} or {ok:true,data:"image url"}
            var json = JSON.parse(responseText)
            if (json.code!=0) {
                alert(json.msg)
            } else {
                return json.data
            }
        }
    },
    // 语言，内建的有英文（en-us）和中文（zh-cn）
    //default en-us, en-us and zh-cn are built-in
    language: "zh-cn",
    // 自定义语言
    i18n: {
        //specify your language here
        "zh-cn": {
            "align": "对齐方式",
            "image": "图片",
            "list": "列表",
            "link": "链接",
            "unlink": "去除链接",
            "table": "表格",
            "font": "文字",
            "full screen": "全屏",
            "text": "排版",
            "eraser": "格式清除",
            "info": "关于",
            "color": "颜色",
            "please enter a url": "请输入地址",
            "create link": "创建链接",
            "bold": "加粗",
            "italic": "倾斜",
            "underline": "下划线",
            "strike through": "删除线",
            "subscript": "上标",
            "superscript": "下标",
            "heading": "标题",
            "font name": "字体",
            "font size": "文字大小",
            "left justify": "左对齐",
            "center justify": "居中",
            "right justify": "右对齐",
            "ordered list": "有序列表",
            "unordered list": "无序列表",
            "fore color": "前景色",
            "background color": "背景色",
            "row count": "行数",
            "column count": "列数",
            "save": "确定",
            "upload": "上传",
            "progress": "进度",
            "unknown": "未知",
            "please wait": "请稍等",
            "error": "错误",
            "abort": "中断",
            "reset": "重置"
        }
    },
    // 隐藏不想要显示出来的模块
    // the modules you don't want
    hiddenModules: [],
    // 自定义要显示的模块，并控制顺序
    // keep only the modules you want and customize the order.
    // can be used with hiddenModules together
    visibleModules: [
        "text",
        "color",
        "font",
        "align",
        "list",
        "link",
        "unlink",
        "tabulation",
        "image",
        "hr",
        "eraser",
        "undo",
        "full-screen",
        "info",
    ],
}

const user={
  userid:'USERID',
  token:'TOKEN'
}
export default {
    typeList,
    typeMapIcon,
    typeMapName,
    cooperate,
    user,
    editorOption,//编辑器的配置
}

