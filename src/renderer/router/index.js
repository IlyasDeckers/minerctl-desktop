import Vue from 'vue'
import axios from 'axios'
import Router from 'vue-router'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: require('@/components/Dashboard').default
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: require('@/components/Wallet/Wallet').default
    },
    {
      path: '/wallet/create',
      name: 'GenerateWallet',
      component: require('@/components/Wallet/GenerateWallet').default
    },
    {
      path: '/mining',
      name: 'mining',
      component: require('@/components/Mining/Mining').default
    },
    {
      path: '/settings',
      name: 'settings',
      component: require('@/components/Settings').default
    },
    {
      path: '/system',
      name: 'system',
      component: require('@/components/System').default
    },
    {
      path: '/login',
      name: 'login',
      component: require('@/components/Login').default
    },
    {
      path: '/logout',
      name: 'logout',
      component: require('@/components/Logout').default
    },
    {
      path: '/connection-error',
      name: 'ConnectionError',
      component: require('@/components/Errors/ConnectionError').default
    },
    {
      path: '*',
      redirect: '/login'
    }
  ]
})

router.beforeEach((to, from, next) => {
  const config = require('electron-config-env')
  const r = axios.create({
    baseURL: config.config.HOME_URL + 'api/',
    timeout: 25000,
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('apiKey'),
      'X-Requested-With': 'XMLHttpRequest'
    }
  })

  if (to.name !== 'login') {
    r.get('user').then(response => {
      localStorage.setItem('userId', response.data.id)
      next()
    }).catch(error => {
      error = false
      if (localStorage.apiKey === 'undefined') console.log('login redirect'); next({name: 'login'})
      next({name: 'login'})
    })
  } else next()
})

export default router
