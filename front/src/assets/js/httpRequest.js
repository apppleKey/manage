// 请求头响应头拦截，暴露一个改良版的axios实例
// import axios from "axios"
import store from "@/store/index.js"
import Qs from 'qs'
// console.log("Qs",Qs)
if (!Promise) {
  var Promise = require("bluebird");
  Promise.config({
    longStackTraces: true,
    warnings: true
  })
}
const http = axios.create({
  timeout: 3000 * 10,
  withCredentials: true,
  // transformRequest: [
  //   function (data) {
  //     data = Qs.stringify(data);
  //     return data;
  //   }
  // ],
  // headers: {
  //   "Content-type": "application/x-www-form-urlencoded"
  // },
})

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  // Vue.cookie.get('token')&&(config.headers['token'] = Vue.cookie.get('token')) // 请求头带上token

   if(config.method=='post') {
     if(config.data&&config.data.authorization){
      config.data.authorization=null;
      config.data.uid=store.state.userinfo.uid
      config.data.token=store.state.userinfo.token
     }
    //  console.log(config.data)
     config.data=Qs.stringify({...config.data});
   
   }
    config.params = {
      _t: new Date() * 1,
      ...config.params
    }
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  // able通过Jeffrey代理数据会更加深一层
//  var  ableList =['/index.php?g=Wwapi&m=LiveApi&a=dataStatics']
  // console.log(response.config.url,response.data.data)

 
    // console.log(1,response.data)
    if (response.data && response.data.status ==200||response.data.code==200||response.data.code==0||response.data.state=='success'||response.data.code=='success') { 
      // debugger
      return response.data;
    }else{
      return Promise.reject({msg:(response.data.message||response.data.msg),code:response.data.code||response.data.status})
    }
 

}, err => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '请求错误';
        break;

      case 401:
        err.message = '未授权，请登录';
        break;

      case 403:
        err.message = '拒绝访问';
        break;

      case 404:
        err.message = `请求地址出错: ${err.response.config.url}`;
        break;

      case 408:
        err.message = '请求超时';
        break;

      case 500:
        err.message = '服务器内部错误';
        break;

      case 501:
        err.message = '服务未实现';
        break;

      case 502:
        err.message = '网络错误';
        break;

      case 503:
        err.message = '服务不可用';
        break;

      case 504:
        err.message = '网络超时';
        break;

      case 505:
        err.message = 'HTTP版本不受支持';
        break;

      default:
    }

      err.code=err.response.status
  }

  return Promise.reject(err)

})

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.mixUrl = (actionName, type) => {
  console.log(process.env.NODE_ENV)
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (process.env.NODE_ENV !== 'production' ? '/api' : '') + actionName
}

export default http
