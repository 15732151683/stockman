import Vue from 'vue'
import Router from 'vue-router'
import Summary from '@/components/Summary'
import Completion from '@/components/Completion'
import OutIn from '@/components/OutIn'
import Output from '@/components/Output'
import Dashboard from '@/components/Dashboard'
import PerCapita from '@/components/PerCapita'
import Weight from '@/components/Weight'
import Setting from '@/components/Setting'
import Wait from '@/components/Wait'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Output
    },
    {
      path: '/summary',
      name: 'Summary',
      component: Summary
    },
    {
      path: '/completion',
      name: 'Completion',
      component: Completion
    },
    {
      path: '/outIn',
      name: 'OutIn',
      component: OutIn
    },
    {
      path: '/output',
      name: 'Output',
      component: Output
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/perCapita',
      name: 'PerCapita',
      component: PerCapita
    },
    {
      path: '/weight',
      name: 'Weight',
      component: Weight
    },
    {
      path: '/setting',
      name: 'Setting',
      component: Setting
    },
    {
      path: '/wait',
      name: 'Wait',
      component: Wait
    }
  ]
})
