<template>
  <div class>
    <div class="top">
      <div class="logo">碧蓝</div>
    </div>

    <div class="left">
      <div
        class="nav1"
        v-for=" item in navs"
        :key="item.id"
        :class="{active:item.path==$route.path}"
      >
        <a   @click="addTab(item)">{{item.label}}</a>
        <!-- <router-link :to="item.path">{{item.label}}</router-link> -->
      </div>
    </div>
    <div class="main">
      <el-tabs v-model="editableTabsValue" type="card" @tab-click="tabClick" closable @tab-remove="removeTab">
        <el-tab-pane
          v-for="(item) in editableTabs"
          :key="item.name"
          :label="item.label"
          :name="item.name"
        ></el-tab-pane>
      </el-tabs>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navs: [
        { id: "100", label: "体温", path: "/index/health" },
        { id: "200", label: "任务汇报", path: "/index/work" },
        { id: "300", label: "新单", path: "/index/task" },
        { id: "400", label: "会议记录", path: "/index/meeting" },
        { id: "500", label: "备忘", path: "/index/note" },
        { id: "600", label: "用户", path: "/index/user" }
      ],
      editableTabsValue: "2",
      editableTabs: [
        // { id: "100", label: "体温", path: "/index/health" },
      ],
      tabIndex: 2
    };
  },
  methods: {
    addTab(item) {
      this.$router.push({ path: item.path });
      // this.editableTabs.push(item)
      // this.editableTabsValue=this.editableTabs.length-1+'';
    },
    removeTab(){},
    tabClick(){
      console.log(this.editableTabsValue);
      var index=this.editableTabsValue
      this.$router.push({ path: this.editableTabs[index].path })
    }
  }
};
</script>

<style lang='scss' scoped>
@import "~@/assets/css/mixin.scss";
.top {
  height: 80px;
  background-color: $white;
  // border-bottom: 1px solid rgb(247, 38, 38);
  line-height: 80px;
  color: $main;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 0 40px;
  border-bottom: 2px solid $main;
  .logo {
    font-size: 24px;
    font-weight: 400;
  }
}
.left {
  top: 80px;
  position: fixed;
  bottom: 0;
  min-width: 100px;
  background-color: #0099ff10;
  overflow: auto;
  .nav1 {
    padding: 5px 10px;
    line-height: 40px;
    a{
      cursor: pointer;
    }
    &.active {
      background-color: $main;
    }
    &.active > a {
      color: $white;
    }
    &:hover {
      color: $main;
      background-color: $main;
    }
    &:hover > a {
      color: $white;
    }
    a {
      color: #2b2b2b;
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
.main {
  background-color: #fff;
  position: fixed;
  left: 120px;
  top: 80px;
  right: 0;
  // padding-top: 40px;
  overflow: auto;
  bottom: 0;
  overflow: auto;
  .main-title {
    background-color: $main;
    color: $white;
    padding: 0 20px;
    font-size: 12px;
    position: absolute;
    line-height: 40px;
    top: 0;
    left: 0;
    right: 0;
  }
}
</style>