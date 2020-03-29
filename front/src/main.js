// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill" ; //es6语法
import 'proto-polyfill'  ; //Ie的__proto__不支持报错
// import Vue from 'vue'
import App from './App.vue';
  // import {editorOption} from '@/assets/js/conf.js'
import router from '@/router/index';

// import store from './store'
import conf from "@/assets/js/conf.js";

import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI,{size:'small',zIndex:3000} );


// import './element-variables.scss';
// import "./assets/main.css"
// import "./assets/nomalize.css"
import "./assets/css/common.scss";
import store from './store/index.js';
import http from "./assets/js/httpRequest.js";
Vue.prototype.$http = http;
Vue.prototype.$proxy = {imgcdn:'http://images.wushuowei.com'};
Vue.prototype.$proxy = {imgcdn:'.'};

// import VueLazyload from "vue-lazyload";
import formatTime from './filter/index'
Vue.filter("formatTime",formatTime);

import VueHtml5Editor from 'vue-html5-editor'
// import 'font-awesome/css/font-awesome.min.css'
import 'font-awesome/css/font-awesome.css'
Vue.use(VueHtml5Editor,conf.editorOption);
 
//图片预览插件
// import 'viewerjs/dist/viewer.css'
// import Viewer from 'v-viewer'
// Vue.use(Viewer)
// Viewer.setDefaults({
//   Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
// })
// Vue.use(VueLazyload, {
//   preLoad: 1.3,
//   error: './static/images/ddefault.jpg',//这个是请求失败后显示的图片
//   loading: './static/images/loading.gif',//这个是加载的loading过渡效果
//   try: 1 // 这个是加载图片数量
// })
Vue.config.productionTip = false;




new Vue({
  el: '#app',
  router,
  store,
  template: '<app/>',
  components: {
    App
  }
});
