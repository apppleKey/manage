import Vue from 'vue'
import Vuex from 'vuex'
import {
    getStore,
    setStore,
    appInterface,
    Keys
} from "@/assets/js/utils.js";

// import { resolve } from 'q';import Vue from 'vue';
Vue.use(Vuex);
var newVue=new Vue();
export default new Vuex.Store({
    state: {
        userinfo: {}
    },
    tabs:[{title:1,path:"./note",}],
    mutations: {
        setState(state, opt) {
            for (let [key, val] of Object.entries(opt)) {
                state[key] = val;
            }
        },
        setUserData(state, info) {
            for (var key in info) {
                state.userinfo[key] = info[key]
            }
        }
    },
    actions: {
        freshToken(context) {
            // console.log('ismock',appInterface.isMock)
            return new Promise((resolve, reject) => {
                if(appInterface.isMock){
                    var uid = getStore(Keys.uid) || "";
                    var token = getStore(Keys.token) || "";
                    console.log('mockc成功');
                    console.log('uid',uid);
                    console.log('token',token);
                    // var uid = getStore('uid') || "8198";
                    // var token = getStore('token') || "2f246beb85ca1026db9d5456d71e2627";
                    // var uid =  "22192";
                    // var token = "3540daf653c14e72d3116f740759ce71";
                    context.commit('setUserData', {
                        uid,
                        token
                    })
                   return resolve()

                }
                if (appInterface.isApp == false) {
                    newVue.$http.get(
                            "/index.php?g=Wwapi&m=User&a=getLoginStatus&timeStamp=" +
                            new Date().getTime()
                        )
                        .then(res => {
                            // console.log(res)
                            if (res.status == 200) {
                                var uid = res.data.uid;
                                var token = res.data.token;
                                // console.log(uid,token)
                                context.commit('setUserData', {
                                    uid,
                                    token
                                })
                                resolve();
                            } else {
                                reject('登录信息获取失败');
                                return;
                            }
                        }).catch(err => {
                            reject(err)
                        })
                } else {
                    // var uid = getStore('uid') || "";
                    // var token = getStore('token') || "";
                    // var uid = getStore('uid') || "8198";
                    // var token = getStore('token') || "2f246beb85ca1026db9d5456d71e2627";
                    // var uid =  "22192";
                    // var token = "3540daf653c14e72d3116f740759ce71";
                    
                    context.commit('setUserData', {
                        uid,
                        token
                    })
                    resolve()
                }
                win.appGetUserInfo

            })
        }
    },

})