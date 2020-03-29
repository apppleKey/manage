<template>
  <div class="comment_component">
    <div class="avatar">
       <img :src="$store.state.userinfo.avatar_thumb" alt />
    </div>
    <div class="edit_containner">
      <div
        class="editor emojHTML"
        id="editor"
        contenteditable="true"
        @blur="editHTMLChange"
        @input="editHTMLChange"
      ></div>

      <div class="editor_tools">
        <!-- 添加表情 -->
        <span
          class="iconfont icon-xiaolian face_btn"
          unselectable="on"
          onmousedown="return false;"
          @click="showPanle($event,'isShowEmojPanle')"
        >
          <div class="emojs_conn" v-show="isShowEmojPanle" unselectable="on">
            <img
              v-lazy="'/public/front/images/face/'+index+'.gif'"
              :title="item"
              unselectable="on"
              v-for="(item,index) in emojs"
              :key="'emojs'+index"
              class="emojs_item"
              @click="chooseFace($event,item,index)"
            />
          </div>
        </span>

        <!-- 上传图片 -->

        <span class="iconfont icon-tupian image_btn" @click="showPanle($event,'isShowImgPanle')">
          <div class="img_conn" v-show="isShowImgPanle">
            <div class="title">上传图片</div>
            <div
              class="upload_info"
            >已上传{{uploadImgList.length}}张，还可以上传{{imgMaxNum-uploadImgList.length}}张</div>
            <div class="imgList">
              <div
                class="add_img_item"
                v-for="(item,index) in uploadImgList"
                :key="'my_upload_img'+index"
              >
                <img v-lazy="item" alt />
                <div class="img_del iconfont icon-ashbin" @click="removeImg(index)"></div>
              </div>
              <label for="imgFile" class="add_img_btn" v-if="uploadImgList.length<imgMaxNum">+</label>
            </div>
            <input
              style="display: none"
              id="imgFile"
              ref="input"
              type="file"
              accept="image/gif, image/jpeg, image/jpg, image/png, image/svg"
              multiple="multiple"
              @change="imgFileChange"
            />
          </div>
        </span>

        <!-- 上传视频 -->
        <span class="iconfont icon-shipin video_btn" @click="showPanle($event,'isShowVideoPanle')">
          <div class="img_conn" v-show="isShowVideoPanle">
            <div class="title">上传视频</div>
            <div class="upload_info">请上传100mb以下的视频，请勿上传色情，反动等违法视频</div>
            <div class="progress">
              <div class="pregress-red"></div>
            </div>
            <div class="upload_status">已上传：15%</div>
            <div class="form">
              <div class="form-item">
                <div class="form-item-lable">标题</div>
                <div class="form-item-input">
                  <input type="text" placeholder="请填写标题" />
                </div>
              </div>
              <div class="form-item">
                <div class="form-item-lable">封面</div>
                <div class="form-item-input">
                  <div
                    class="myloadVideo"
                    v-for="(item,index) in uploadVideoList"
                    :key="'uploadvideoImg'+index"
                  >
                    <video
                      style="width:100%;visibility: hidden;"
                      v-if="item.url"
                      :src="item.url"
                      controls
                      @loadeddata="onVideoLoaded($event,item)"
                    ></video>
                    <img class="poster" style="width:100%;height:100%;" v-lazy="item.poster" />
                    <div class="img_del iconfont icon-ashbin" @click="removeVideo(index)"></div>
                  </div>
                  <label
                    for="videoFile"
                    class="add_video_btn"
                    v-if="uploadVideoList.length<videoMaxNum"
                  >+</label>
                </div>
              </div>
            </div>

            <input
              style="display: none;"
              id="videoFile"
              ref="input"
              type="file"
              accept="video/mp4"
              @change="videoFileChange"
            />
            <div class="line"></div>
            <div class="submit_btn" style="margin:0 auto;float:none;">完成</div>
          </div>
        </span>
        <div class="submit_btn" @click="sendComment">发送</div>
      </div>
    </div>
    <!-- <textarea
      name
      id
      cols="30"
      rows="10"
      style="width:100%;position:fixed;top:0;background:pink;z-index:10;"
      v-model="editHTML"
    ></textarea>
    <textarea
      name
      id
      cols="30"
      rows="10"
      style="width:100%;position:fixed;bottom:0;background:pink;z-index:10;"
      v-model="editStr"
    ></textarea>-->
  </div>
</template>

<script>
import { emojs } from "@/assets/js/utils.js";
const faceReg = /\[.+?\]/g;
const faceImgReg = /<img class="faceItem".*?(?:>|\/>)/gi;
const faceAlt = /s/;
export default {
  data() {
    return {
      isShowEmojPanle: false,
      isShowImgPanle: false,
      isShowVideoPanle: false,
      uploadImgList: [],
      imgMaxSize: 2, //单张图片大小限制（单位：M）
      imgMaxNum: 9, //最大图片数量
      uploadVideoList: [],
      vidoeMaxSize: 100,
      videoMaxNum: 1,
      emojs,
      selectionStart: null,
      selectionEnd: null,
      editStr: "",
      editHTML: ""
    };
  },
  watch: {
    editStr: {
      handler: function() {}
    }
  },
  created() {
    this.editStr = "";
    this.editHTML = this.str2Html(this.editStr);
  },
  mounted() {
    var that = this;
    this.insertText(this.editHTML);

    $(document).on("click", function() {
      that.isShowEmojPanle = false;
      that.isShowImgPanle = false;
      that.isShowVideoPanle = false;
    });
  },
  methods: {
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

    str2Html(str) {
      return str.replace(/\[.+?\]/g, res => {
        // console.log(emojs.indexOf(res) == -1);
        if (emojs.indexOf(res) == -1) {
          return "";
          console.warn(face + " is not system face,analsys fail!");
        } else {
          return (
            '<img class="faceItem" alt="' +
            res +
            '"  src="/public/front/images/face/' +
            emojs.indexOf(res) +
            '.gif" />'
          );
        }
      });
    },

    chooseFace: function(e, face, index) {
      let html =
        '&nbsp;<img class="faceItem" alt="' +
        face +
        '"  src="/public/front/images/face/' +
        index +
        '.gif" />&nbsp;';
      this.insertText(html, () => {
        this.$nextTick(() => {
          this.editHTMLChange(document.getElementById("editor").innerHTML);
        });
      });
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
    },

    insertText: function(html, callBack) {
      let that = this;
      let dom = document.getElementById("editor");
      if (dom != document.activeElement) {
        // 如果dom没有获取到焦点，追加
        dom.innerHTML = dom.innerHTML + html;
        // that.getMessage();
        setTimeout(function() {
          if (window.getSelection) {
            //ie11 10 9 ff safari
            dom.focus(); //解决ff不获取焦点无法定位问题
            let range = window.getSelection(); //创建range
            range.selectAllChildren(dom); //range 选择obj下所有子内容
            range.collapseToEnd(); //光标移至最后
          }
        });
        callBack && callBack();
        return;
      }

      let frag = document.createDocumentFragment(),
        sel,
        range,
        node,
        lastNode;
      if (window.getSelection) {
        // 兼容 IE9 或 非IE浏览器
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
          range.deleteContents();
          let el = document.createElement("div");
          el.innerHTML = html;
          while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node);
          }
          range.insertNode(frag);
          if (lastNode) {
            range = range.cloneRange();
            if (html == "<br class='brItem'>&nbsp;") {
              range.setStartBefore(lastNode);
            } else {
              range.setStartAfter(lastNode);
            }
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      }
      callBack && callBack();
    },
    editHTMLChange(e) {
      // console.log('editHTMLChange',e)
      // console.log(e.target.innerHTML)
      if (e.target) {
        this.editHTML = e.target.innerHTML;
      } else {
        this.editHTML = e;
      }
      this.editStr = this.html2Str(this.editHTML);
    },
    sendComment() {
      console.log(this.editStr);
      var str =this.editStr.replace(/\s{1,}/g,' ');
      if(str.length===0){
        this.$toast('请填写评论内容')
        return
      }
      this.$emit('submit',str,()=>{
        this.$toast('发表成功')
          this.editHTMLChange('');
      })
    
    },
    imgFileChange(e) {
      var files = e.target.files;
      if (
        files.length > this.imgMaxNum &&
        this.uploadImgList.length + files.length > this.imgMaxNum
      ) {
        this.$toast(`一次最多只能上传${this.imgMaxNum}张图片`);
      }
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let size = Math.floor(file.size / 1024 / 1024);
        if (size > this.imgMaxSize) {
          // console.log(size)
          this.$toast(`单个图片不能超过${this.imgMaxSize}M`);
        }
        var reader = new FileReader();
        reader.onload = e => {
          if (this.uploadImgList.length < this.imgMaxNum) {
            this.uploadImgList.push(e.currentTarget.result);
          }
        };
        reader.readAsDataURL(file);
      }
    },
    removeImg(index) {
      this.uploadImgList.splice(index, 1);
    },
    removeVideo(index) {
      this.uploadVideoList.splice(index, 1);
    },
    videoFileChange(e) {
      var files = e.target.files;
      if (
        files.length > this.videoMaxNum &&
        this.uploadImgList.length + files.length > this.videoMaxNum
      ) {
        this.$toast(`一次最多只能上传${this.videoMaxNum}个视频`);
      }
      this.uploadVideoList = [];
      this.$forceUpdate();

      for (var i = 0; i < 1; i++) {
        let file = files[i];
        let size = Math.floor(file.size / 1024 / 1024);
        if (size > this.vidoeMaxSize) {
          // console.log(size)
          this.$toast(`单个视频不能超过${this.vidoeMaxSize}M`);
          return;
        }
        var url = URL.createObjectURL(file);
        this.uploadVideoList[0] = { url };
        this.$forceUpdate();
      }
    },
    onVideoLoaded(e, item) {
      var video = e.target;
      video.play();
      setTimeout(() => {
        console.log(video);
        video.setAttribute("crossOrigin", "anonymous");
        var canvas = document.createElement("canvas");
        canvas.width = video.clientWidth;
        canvas.height = video.clientHeight;
        canvas
          .getContext("2d")
          .drawImage(video, 0, 0, canvas.width, canvas.height);
        var dataURL = canvas.toDataURL("image/png");
        item.poster = dataURL;
        this.$forceUpdate();
        video.pause();
      }, 500);
    }
  }
};
</script>
<style lang='scss'>
.emojHTML {
  .faceItem {
    // padding-left: 5px;
    // padding-right: 5px;
    vertical-align: -5px;
  }
}
</style>

<style lang="scss" scoped>
@import "~@/assets/css/mixin.scss";

.comment_component {
  background-color: #ededed;
  // padding: 20px 0;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  margin: 0 auto;
  .avatar {
    width: 60px;
    height: 60px;
    margin-right: 20px;
    img {
      background-color: rgba(209, 209, 209, 0.76);
      border-radius: 50%;
      // overflow: hidden;
      width: 100%;
      height: 100%;
    }
  }
  .edit_containner {
    width: 796px;
    // height: 120px;
    // background-color:rgb(172, 170, 170);
    position: relative;

    &:after {
      content: "";
      width: 10px;
      height: 10px;
      border-top: 1px solid rgba(230, 230, 230, 1);
      border-right: 1px solid rgba(230, 230, 230, 1);
      position: absolute;
      left: -6px;
      top: 25px;
      transform: rotate(-135deg);
      background-color: #fff;
    }
    .editor {
      background-color: #fff;
      padding: 5px;
      width: 100%;
      height: 120px;
      border: 1px solid rgba(230, 230, 230, 1);
      outline: none;
       &:focus{
    border: 1px solid #fe3845;
        
    }
      .faceItem {
        margin-left: 10px;
        margin-right: 10px;
      }
    }
    .editor_tools {
      // background-color: red;
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

          // border-top: 1px solid #eaeaea;
          // border-left: 1px solid #eaeaea;
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
            // border-bottom: 1px solid #eaeaea;
            // border-right: 1px solid #eaeaea;
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
      .image_btn {
        color: #84c002;
        position: relative;
        .img_conn {
          width: 330px;
          border-radius: 5px;

          position: absolute;
          z-index: 9;
          background: #fff;
          top: 38px;
          left: -40px;
          box-shadow: 0 5px 8px gray;
          padding: 23px;
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
          .title {
            font-size: 18px;
            color: black;
            line-height: 25px;
          }
          .upload_info {
            font-size: 16px;
            color: #787878;
            line-height: 20px;
          }

          .imgList {
            display: flex;
            // align-items: flex-start;
            flex-flow: row wrap;
            align-content: flex-start;
            & > div {
              &:nth-child(3n) {
                margin-right: 0;
              }
            }
            .add_img_item {
              width: 80px;
              height: 80px;
              background: rgba(253, 253, 253, 1);
              border: 2px dashed rgba(170, 170, 170, 0.8);
              line-height: 70px;
              color: rgba(170, 170, 170, 0.8);
              text-align: center;
              font-size: 40px;
              margin-top: 20px;
              margin-right: 20px;
              cursor: pointer;
              position: relative;
              .img_del {
                display: none;
              }
              &:hover .img_del {
                display: block;
                width: 30px;
                height: 30px;
                position: absolute;
                right: 0;
                top: 0;
                font-size: 30px;
                color: red;
              }
              img {
                max-width: 100%;
                max-height: 100%;
              }
            }

            .add_img_btn {
              &:hover {
                border-color: red;
                color: red;
              }
              width: 80px;
              height: 80px;
              background: rgba(253, 253, 253, 1);
              border: 2px dashed rgba(170, 170, 170, 0.8);
              line-height: 70px;
              color: rgba(170, 170, 170, 0.8);
              text-align: center;
              font-size: 40px;
              margin-top: 20px;
              user-select: none;
              cursor: pointer;
            }
          }
        }
      }
      .video_btn {
        color: #54a8e9;
        position: relative;
        .img_conn {
          width: 330px;
          border-radius: 5px;

          position: absolute;
          z-index: 9;
          background: #fff;
          top: 38px;
          left: -40px;
          box-shadow: 0 5px 8px gray;
          padding: 23px;
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
          .title {
            font-size: 18px;
            color: black;
            line-height: 25px;
          }
          .upload_info {
            font-size: 16px;
            color: #787878;
            line-height: 20px;
          }
          .form {
            width: 100%;
            height: auto;

            .form-item {
              margin-bottom: 20px;
            }
            .form-item-lable {
              width: 50px;
              float: left;
              color: #787878;
              font-size: 16px;
            }
            .form-item-input {
              margin-left: 50px;
              position: relative;
              input {
                line-height: 26px;
                text-indent: 0.5em;
              }
            }
          }
          .myloadVideo {
            position: relative;
            .img_del {
              display: none;
            }
            &:hover .img_del {
              display: block;
              width: 30px;
              height: 30px;
              position: absolute;
              right: 0;
              top: 0;
              font-size: 30px;
              color: red;
              z-index: 10;
            }
            .poster {
              position: absolute;
              top: 0;
              left: 0;
              max-width: 100%;
              max-height: 100%;
            }
          }
          .line {
            height: 1px;
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(227, 227, 227, 1);
            margin: 20px 0;
          }
          .add_video_btn {
            &:hover {
              border-color: red;
              color: red;
            }
            display: block;
            width: 80px;
            height: 80px;
            background: rgba(253, 253, 253, 1);
            border: 2px dashed rgba(170, 170, 170, 0.8);
            line-height: 70px;
            color: rgba(170, 170, 170, 0.8);
            text-align: center;
            font-size: 40px;
            margin-top: 20px;
            cursor: pointer;
            user-select: none;
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


