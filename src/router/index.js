import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Users from '@/components/Users'
import {sessionData} from '../utils'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: 'users',
          name: 'Users',
          component: Users
        },
        {
          path: 'authlist',
          name: 'AuthList',
          component: () => import('../components/AuthList')
        },
        {
          path: 'rolelist',
          name: 'RoleList',
          component: () => import('../components/RoleList')
        },
        {
          path: 'goodscat',
          name: 'GoodsCat',
          component: () => import('../components/GoodsCat')
        },
        {
          path: 'catclassify',
          name: 'CatClassify',
          component: () => import('../components/CatClassify')
        },
        {
          path: 'goodslist',
          name: 'GoodsList',
          component: () => import('../components/GoodsList')
        },
        {
          path: 'addgoods',
          name: 'GoodsAdd',
          component: () => import('../components/GoodsAdd')
        },
        {
          path: 'orderlist',
          name: 'OrderList',
          component: () => import('../components/OrderList')
        }
      ],
      beforeEnter: (to, from, next) => {
        // 路由独享守卫
        next()
      }
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && !sessionData('get', 'token')) {
    next({
      path: '/login',
      replace: true
    })
  } else {
    if (to.path === '/login' && sessionData('get', 'token')) {
      next('/')
    } else {
      next()
    }
  }
})
router.beforeResolve((to, from, next) => {
  next()
})
router.afterEach((to, from) => {

})
export default router
