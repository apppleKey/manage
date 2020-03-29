import {
  getStore,
  setStore,
  appInterface,
  getAgent
} from "@/assets/js/utils.js";

import store from '@/store/index.js'
const newVue = new Vue()
const router = new VueRouter({
  // mode: 'history',
  routes: [{
      path: '/',
      redirect: 'index'
    },
    {
      path: "/index",
      name: "h5_index",
      component: resolve => require(['@/views/home.vue'], resolve),
      meta: {
        needLogin: false,
        needHeaderFooter: true,
        keepAlive: true

      },
      children: [{
        path: "health",
        name: "health",
        component: resolve => require(['@/views/index/health.vue'], resolve),
        meta: {
          needLogin: false,
          needHeaderFooter: true,
          keepAlive: true

        }
      }, {
        path: "work",
        name: "work",
        component: resolve => require(['@/views/index/work.vue'], resolve),
        meta: {
          needLogin: false,
          needHeaderFooter: true,
          keepAlive: true

        }
      }, {
        path: "user",
        name: "user",
        component: resolve => require(['@/views/index/user.vue'], resolve),
        meta: {
          needLogin: false,
          needHeaderFooter: true,
          keepAlive: true

        }

      }, {
        path: "note",
        name: "note",
        component: resolve => require(['@/views/index/note.vue'], resolve),
        meta: {
          needLogin: false,
          needHeaderFooter: true,
          keepAlive: true

        },
        
      },{
        path: "task",
        name: "task",
        component: resolve => require(['@/views/index/task.vue'], resolve),
        meta: {
          needLogin: false,
          needHeaderFooter: true,
          keepAlive: true

        }},{
          path: "meeting",
          name: "meeting",
          component: resolve => require(['@/views/index/meeting.vue'], resolve),
          meta: {
            needLogin: false,
            needHeaderFooter: true,
            keepAlive: true
  
          }}
      ]


    },
    {
      path: '*',
      component: resolve => require(['@/views/notFound.vue'], resolve),

    },
  ]
})

router.beforeEach((to, from, next) => {
  // if(getAgent()==='H5'&&/PC/.test(to.path)){
  //   return router.replace(to.path.replace('PC','H5'))
  // }else if(getAgent()==='PC'&&/H5/.test(to.path)){
  //   return router.replace(to.path.replace('H5','PC'))
  // }
  if (to.meta.needLogin) {
    const token = store.state.userinfo.token || '';

    // console.log(store);
    if (!token) {
      store.dispatch('freshToken').then((res) => {
        // console.log(store.state.userData.uid, store.state.userData.token);
        // newVue.$toast('登录成功')
        next();
      }).catch(err => {
        console.log('router', err);
        setStore('lastpage', to.path);
        newVue.$toast('请先登录')
        // next();
      })
    } else {
      next();
    }
  } else {
    next();
  }

});
export default router
