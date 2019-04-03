import Vue from 'vue'
import Router from 'vue-router'
import Warizan from '@/components/Warizan'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Warizan',
      component: Warizan
    }
  ]
})
