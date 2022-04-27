import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import About from '@/components/About.vue'
import Layout from '@/Layout.vue'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    meta: { hidden: true, title: 'login'},
    component: () =>
    import(/* webpackChunkName: "Login" */ '../views/Login.vue'), 
  },
  {
    path: '/', redirect: '/welcome', meta: { hidden: false, title: 'Home'},
    component: Layout,
    children:[
      // 结构预测
      { 
        path: '/welcome',
        meta: { title: 'Home' },
        component: () => import('@/views/applist/index.vue')
      },
    ]
  },
  // Structure Prediction
  {
    path: '/app', meta: { hidden: false, title: '应用列表'},
    component: Layout,
    children:[
      // 结构预测
      { 
        path: '/predict/structure/',
        meta: { title: '结构预测' },
        component: () => import('@/views/structure/prediction.vue')
      },
      { 
        path: '/predict/structure/queue/',
        meta: { title: '相似性计算' },
        component: ()=>import('@/views/similarity/structureSimilarity.vue')
      },
    ]
  },
  // Queue
  {
    path: '/queue', meta: { hidden: false, title: 'Jobs'},
    component: Layout,
    children:[
      // 结构预测
      { 
        path: '/queue/all',
        meta: { title: 'Queue' },
        component: ()=>import('@/views/jobs/index.vue')
      },
    ]
  },
  // BLAST
  {
    path: '/blast', redirect: '/blast/submit', meta: { hidden: false, title: 'BLAST'},
    component: Layout,
    children:[
      // 序列相似性 blast
      { path: '/blast/submit', component: About, meta: { hidden: false, title: 'BLAST'}},
    ]
  },
  // About
  {
    path: '/about', redirect: '/about/about', meta: { hidden: false, title: 'About'},
    component: Layout,
    children:[
      { path: '/about/about', component: About, meta: { hidden: false, title: 'About'}},
    ]
  },
  // ...
  {
    path: '/later', meta: { hidden: false, title: 'Tests'},
    component: Layout,
    children:[
      // { 
      //   path: '/later/dataset',
      //   meta: { title: 'dataset' },
      //   component: About
      // },
      // { 
      //   path: '/later/Papers',
      //   meta: { title: 'Papers' },
      //   component: About
      // },
      { 
        path: '/later/graph-ppis', 
        meta: { hidden: false, title: 'graph-ppis'},
        component: () => import('@/views/app/graph-ppis/form.vue')
      },
      {
        path: '/later/graph-ppis/result/example', 
        meta: { hidden: false, title: 'graph-ppis-result'},
        component: () => import('@/views/app/graph-ppis/result.vue')
      },
      {
        path: '/later/graph-ppis/result/:id', 
        meta: { hidden: true, title: 'graph-ppis-result'},
        component: () => import('@/views/app/graph-ppis/result.vue')
      },
      // {
      //   path: '/later/Contacts',
      //   meta: { title: 'Contacts' },
      //   component: About
      // },
    ]
  },
  // Hidden
  {
    path: '/hide',
    name: 'Hide',
    component: Layout,
    meta: {title: 'hidden', hidden: true},
    children: [
      // 测试页面
      // 队列
      { path: '/queue', component: About},
      // Help
      { path: '/help', component: About, 
        children: [
          { path: '/sequence/blast/doc/psiblast', component: About},
          { path: '/sequence/blast/doc/jackhmmer', component: About},          
        ]
      },
      // molstar
      { path: '/molstar', component: About},
    ]
  },
  // Debug Direct without layout
  {
    path: '/debug',
    name: 'debug',
    component: ()=>import('@/views/jobs/index.vue'),
    meta: {title: 'hidden', hidden: true},
  },
  {
    path:'/404',
    name:'404',
    component:()=>import('@/components/notfound.vue'),
  },
]
const router = createRouter({
  history: createWebHistory(''),
  routes,
  // scrollBehavior(to, from, savedPosition) {
  //   return {
  //     el: '#app',
  //     top: 0,
  //     behavior: 'smooth',
  //   }
  // },
})
export default router