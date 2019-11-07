import Vue from 'vue'
import Vrouter from 'vue-router'
Vue.use(Vrouter)
import Dog from '@/components/Dog'
import Cat from '@/components/Cat'

import Cata from '@/components/Cata'
import Catb from '@/components/Catb'

var router = new Vrouter({
  mode:"history",
  routes:[
    {
      path:'/',
      redirect:"/Dog"
    },
    {
      name:"mydog",
      path:'/Dog',
      component:Dog,
      alias:'/dogs'
    },
    {
      // path:'/Cat/:color/:sex',
      name:"mycat",
      path:"/Cat",
      component:Cat,
      //别名
      alias:'/test',
      children:[
        {
          path:'Cata',
          component:Cata
        },
        {
          path:'Catb',
          component:Catb
        }
      ]
    }

  ],
  linkActiveClass:'active'
})
export default router;

