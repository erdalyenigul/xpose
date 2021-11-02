import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _37347f79 = () => interopDefault(import('../pages/register.vue' /* webpackChunkName: "pages/register" */))
const _7cc69e02 = () => interopDefault(import('../pages/account/edit.vue' /* webpackChunkName: "pages/account/edit" */))
const _09148fe0 = () => interopDefault(import('../pages/account/myMessages.vue' /* webpackChunkName: "pages/account/myMessages" */))
const _13b88cf9 = () => interopDefault(import('../pages/account/photos.vue' /* webpackChunkName: "pages/account/photos" */))
const _0d13dd3e = () => interopDefault(import('../pages/account/profile.vue' /* webpackChunkName: "pages/account/profile" */))
const _d8c49eca = () => interopDefault(import('../pages/users/list.vue' /* webpackChunkName: "pages/users/list" */))
const _3f04be04 = () => interopDefault(import('../pages/users/messages/_message.vue' /* webpackChunkName: "pages/users/messages/_message" */))
const _1ac0de8d = () => interopDefault(import('../pages/users/photos/_friendPhotos.vue' /* webpackChunkName: "pages/users/photos/_friendPhotos" */))
const _289466eb = () => interopDefault(import('../pages/users/_friendID.vue' /* webpackChunkName: "pages/users/_friendID" */))
const _204ec36c = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/register",
    component: _37347f79,
    name: "register"
  }, {
    path: "/account/edit",
    component: _7cc69e02,
    name: "account-edit"
  }, {
    path: "/account/myMessages",
    component: _09148fe0,
    name: "account-myMessages"
  }, {
    path: "/account/photos",
    component: _13b88cf9,
    name: "account-photos"
  }, {
    path: "/account/profile",
    component: _0d13dd3e,
    name: "account-profile"
  }, {
    path: "/users/list",
    component: _d8c49eca,
    name: "users-list"
  }, {
    path: "/users/messages/:message?",
    component: _3f04be04,
    name: "users-messages-message"
  }, {
    path: "/users/photos/:friendPhotos?",
    component: _1ac0de8d,
    name: "users-photos-friendPhotos"
  }, {
    path: "/users/:friendID?",
    component: _289466eb,
    name: "users-friendID"
  }, {
    path: "/",
    component: _204ec36c,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
