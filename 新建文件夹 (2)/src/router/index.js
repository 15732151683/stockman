import Vue from 'vue'
import Router from 'vue-router'
// import Login from '@/components/Login'
// import Platform from '@/components/Platform'
// import Summary from '@/components/Summary'
// import Completion from '@/components/Completion'
// import OutIn from '@/components/OutIn'
// import Output from '@/components/Output'
// import Dashboard from '@/components/Dashboard'
// import PerCapita from '@/components/PerCapita'
// import Weight from '@/components/Weight'
// import Setting from '@/components/Setting'
// import Wait from '@/components/Wait'
// import ManageTarget from '@/components/ManageTarget'
// import WriteInd from '@/components/WriteInd'
// import WriteInd2 from '@/components/WriteInd2'
// import College from '@/components/College'
// import ManageUser from '@/components/ManageUser'
// import IndAnalysis from '@/components/IndAnalysis'
// import Evaluation from '@/components/Evaluation'
// import TrendAnalysis from '@/components/trendAnalysis'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: (resolve) => require(['@/components/Login'], resolve)
    },
    {
      path: '/login',
      name: 'login',
      component: (resolve) => require(['@/components/Login'], resolve)
    }
    // {
    //   path: '/platform',
    //   name: 'Platform',
    //   component: (resolve) => require(['@/components/Platform'], resolve),
    //   children: [
    //     {
    //       path: '/dashboard',
    //       name: 'Dashboard',
    //       component: (resolve) => require(['@/components/Dashboard'], resolve)
    //     },
    //     {
    //       path: '/output',
    //       name: 'Output',
    //       component: (resolve) => require(['@/components/Output'], resolve)
    //     },
    //     {
    //       path: '/outIn',
    //       name: 'OutIn',
    //       component: (resolve) => require(['@/components/OutIn'], resolve)
    //     },
    //     {
    //       path: '/perCapita',
    //       name: 'PerCapita',
    //       component: (resolve) => require(['@/components/PerCapita'], resolve)
    //     },
    //     {
    //       path: '/completion',
    //       name: 'Completion',
    //       component: (resolve) => require(['@/components/Completion'], resolve)
    //     },
    //     {
    //       path: '/indAnalysis',
    //       name: 'IndAnalysis',
    //       component: (resolve) => require(['@/components/IndAnalysis'], resolve)
    //     },
    //     {
    //       path: '/trendAnalysis',
    //       name: 'TrendAnalysis',
    //       component: (resolve) => require(['@/components/TrendAnalysis'], resolve)
    //     },
    //     {
    //       path: '/manageTarget',
    //       name: 'ManageTarget',
    //       component: (resolve) => require(['@/components/ManageTarget'], resolve)
    //     },
    //     {
    //       path: '/writeInd',
    //       name: 'WriteInd',
    //       component: (resolve) => require(['@/components/WriteInd'], resolve)
    //     },
    //     {
    //       path: '/writeInd2',
    //       name: 'WriteInd2',
    //       component: (resolve) => require(['@/components/WriteInd2'], resolve)
    //     },
    //     {
    //       path: '/weight',
    //       name: 'Weight',
    //       component: (resolve) => require(['@/components/Weight'], resolve)
    //     },
    //     {
    //       path: '/evaluation',
    //       name: 'Evaluation',
    //       component: (resolve) => require(['@/components/Evaluation'], resolve)
    //     },
    //     {
    //       path: '/setting',
    //       name: 'Setting',
    //       component: (resolve) => require(['@/components/Setting'], resolve)
    //     },
    //     {
    //       path: '/college',
    //       name: 'College',
    //       component: (resolve) => require(['@/components/College'], resolve)
    //     },
    //     {
    //       path: '/manageUser',
    //       name: 'ManageUser',
    //       component: (resolve) => require(['@/components/ManageUser'], resolve)
    //     },
    //     {
    //       path: '/wait',
    //       name: 'Wait',
    //       component: (resolve) => require(['@/components/Wait'], resolve)
    //     }
    //   ]
    // }
  ]
})
