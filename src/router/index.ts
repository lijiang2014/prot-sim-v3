import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import About from '@/components/About.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () =>
    import(/* webpackChunkName: "Login" */ '../views/Login.vue'), 
  },
  { path: '/',redirect: '/home'},
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/Home.vue'),
    redirect: '/welcome',
    children: [
      { path: '/welcome',
        component: () => import('@/views/Welcome/Welcome.vue'),
      },
      // 结构预测
      { path: '/predict/structure/', component: () => import('@/views/structure/prediction.vue')},
      { path: '/predict/structure/result/', component: About},
      { path: '/predict/structure/queue/', component: About},
      // 结构相似性
      { path: '/structure_similarity/submit', component: ()=>import('@/views/similarity/structureSimilarity.vue')},
      { path: '/structure_similarity/search', component: About},
      { path: '/structure_similarity/DUF', component: About},
      { path: '/structure_similarity/results', component: About},
      { path: '/structure_similarity/plot/', component: About},
      // 序列相似性 blast
      { path: '/sequence/blast', component: About},
      { path: '/sequence/blast/queue', component: About},
      { path: '/sequence/blast/res', component: About},
      { path: '/sequence/blast/res/jackhmmer', component: About},
      { path: '/sequence/blast/cdd_searchSave', component: About},
      { path: '/sequence/blast/cdd_searchSave_result', component: About},
      { path: '/phylogenetic/plot/', component: About},
      { path: '/test/pdbe-molstar', component: About},
      { path: '/test/svg-msa', component: About},
      // 队列
      { path: '/queue', component: About},
      // About
      { path: '/About', component: About},
      // Help
      { path: '/help', component: About, 
        children: [
          { path: '/sequence/blast/doc/psiblast', component: About},
          { path: '/sequence/blast/doc/jackhmmer', component: About},          
        ]
      },
      // molstar
      { path: '/molstar', component: About, },
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
      return { path: '/404' }
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