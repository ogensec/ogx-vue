import { createRouter, createWebHistory } from 'vue-router'

import {
  ROUTE_HOME,
  ROUTE_AUTH,
  ROUTE_AUTH_CALLBACK,
  ROUTE_ERROR
} from '@app-routes'

//DevNote : Create a function later that will automaticall create the router.

const routes = [
  {
    ...ROUTE_HOME,
  },
  {
    ...ROUTE_AUTH,
    children: [ ROUTE_AUTH_CALLBACK ]
  },
  {
    ...ROUTE_ERROR
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
