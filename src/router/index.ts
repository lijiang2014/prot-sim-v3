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
    path: '/predict', redirect: '/predict/structure/', meta: { hidden: false, title: 'Structure Prediction'},
    component: Layout,
    children:[
      // 结构预测
      { 
        path: '/predict/structure/',
        meta: { title: 'Submit' },
        component: () => import('@/views/structure/prediction.vue')
      },
      { 
        path: '/predict/structure/queue/',
        meta: { title: 'Queue' },
        component: About
      },
      { 
        path: '/predict/structure/example/',
        meta: { title: 'Example' },
        component: About
      },
    ]
  },
  // Structure Similarly
  {
    path: '/structure_similarity', redirect: '/structure_similarity/submit', meta: { hidden: false, title: 'Structure Similarly'},
    component: Layout,
    children:[
      // 结构相似性
      { 
        path: '/structure_similarity/submit',
        meta: { title: 'Submit' },
        component: About
      },{ 
        path: '/structure_similarity/search',
        meta: { title: 'search', hidden: true },
        component: About
      },{ 
        path: '/structure_similarity/DUF', 
        meta: { title: 'DUF'},
        component: About},
      { path: '/structure_similarity/results', component: About},
      { path: '/structure_similarity/plot/', component: About},
    ]
  },
  // Queue
  {
    path: '/queue', redirect: '/queue/all', meta: { hidden: false, title: 'Queue'},
    component: Layout,
    children:[
      // 结构预测
      { 
        path: '/queue/all',
        meta: { title: 'Queue' },
        component: About
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
      { path: '/sequence/blast/queue', component: About},
      { path: '/sequence/blast/res', component: About},
      { path: '/sequence/blast/res/jackhmmer', component: About},
      { path: '/sequence/blast/cdd_searchSave', component: About},
      { path: '/sequence/blast/cdd_searchSave_result', component: About},
      { path: '/phylogenetic/plot/', component: About},      
    ]
  },
  // Test
  {
    path: '/test',   meta: { hidden: false, title: 'TEST'},
    component: Layout,
    children:[
      { path: '/test/pdbe-molstar', component: About, meta: { hidden: false, title: 'pdbe-molstar'}},
      { path: '/test/svg-msa', component: About, meta: { hidden: false, title: 'svg-msa'}},
      { 
        path: '/test/graph-ppis', 
        meta: { hidden: false, title: 'graph-ppis'},
        component: () => import('@/views/graph-ppis/form.vue')},
    ]
  },
  // About
  { path: '/about', component: About, meta: { hidden: false, title: 'ABOUT'} },
  // Hidden
  {
    path: '/hide',
    name: 'Hide',
    component: Layout,
    meta: {title: 'hidden', hidden: true},
    children: [
      { path: '/welcome',
        component: () => import('@/views/Welcome.vue'),
      },
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
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "About" */ '../components/About.vue'),
  },
  {
    path:'/404',
    name:'404',
    component:()=>import(/* webpackChunkName: "About" */ '../components/About.vue'),
  },
  {
    path: '/:currentPath(.*)*', // 路由未匹配到，进入这个
    redirect: (_) => {
      return { path: '/404' , component: import('@/components/notfound.vue')}
    },
  },
]
const router = createRouter({
  history: createWebHistory(''),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return {
      el: '#app',
      top: 0,
      behavior: 'smooth',
    }
  },
})
export default router