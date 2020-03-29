<template>
  <div class="we-loading-component">
    <div v-if="loadingStatus==1" class="loadingStatus">
      <mt-spinner :type="3" class="loading-spinner"></mt-spinner>
      <span class="loading_text">加载中...</span>
    </div>
    <div v-if="loadingStatus==2" class="loadingStatus" @click="loadmore">
      <span class="loading_text">加载更多...</span>
    </div>
    <div v-if="loadingStatus==3" class="loadingStatus">
      <span class="loading_text">没有更多啦~</span>
    </div>
    <div v-if="loadingStatus==4" class="loadingStatus nodata">
      <span class="loading_text">{{text||'暂无数据'}}</span>
    </div>
    <div v-if="loadingStatus==10" class="loadingStatus nodata" @click="loadmore">
      <span class="loading_text">{{text||'加载错误'}}</span>
    </div>
  </div>
</template>
<script>
const status = {
  loadedAll: 0,
  text: "隐藏",
  loading: 1,
  text: "加载中...",
  loaded: 2,
  text: "下拉加载",
  loadedAll: 3,
  text: "没有更多"
};
export default {
  props: ["loadingStatus", "text"],
  data() {
    return {};
  },
  methods: {
    loadmore() {
      console.log("loadmore");
      this.$emit("loadmore");
    }
  }
};
</script>

<style lang="scss" scoped>
.we-loading-component {
  cursor: pointer;
  user-select: none;
  .loadingStatus {
    text-align: center;
    width: 100%;
    height: 60px;
    line-height:60px;
    font-size: 20px;
    font-weight: 400;
    color: rgba(50, 50, 50, 1);
    border: 2px solid rgba(238, 238, 238, 1);
    background: rgba(255, 255, 255, 1);
    &.nodata {
      color: gray;
      border: none;
      .loading_text {
        color: gray;
      }
    }
  }

  .loading-spinner {
    display: inline-block;
    // vertical-align: -7px;
    transform: scale(1.5);
    margin-right: 10px;
  }
  .loading_text {
    line-height: 60px;
    // font-size: 12px;
    color: #323232;
  }
}
</style>

