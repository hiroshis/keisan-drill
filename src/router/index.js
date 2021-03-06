import Vue from 'vue'
import Router from 'vue-router'
import Kakezan from '@/components/Kakezan'
import Warizan from '@/components/Warizan'
import Bunsu from '@/components/Bunsu'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/kakezan'
    },
    {
      path: '/kakezan',
      name: 'Kakezan',
      component: Kakezan
    },
    {
      path: '/warizan',
      name: 'Warizan',
      component: Warizan
    },
    {
      path: '/bunsu',
      name: 'Bunsu',
      component: Bunsu
    }
  ]
})
