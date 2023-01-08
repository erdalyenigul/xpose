import firebase from 'firebase/compat/app';
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/register.vue')
  },
  {
    path: '/user/list',
    name: 'UserList',
    component: () => import('../views/user/list.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/account/profile',
    name: 'Profile',
    component: () => import('../views/account/profile.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/account/edit',
    name: 'UserEdit',
    component: () => import('../views/account/edit.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/account/photos',
    name: 'Photos',
    component: () => import('../views/account/photos.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/account/my-messages',
    name: 'MyMessages',
    component: () => import('../views/account/myMessages.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/user/:friendID',
    name: 'friendID',
    component: () => import('../views/user/friendID.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/user/photos/:friendPhotos',
    name: 'friendPhotos',
    component: () => import('../views/user/photos/friendPhotos.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/user/message/:accountId',
    name: 'SendMessage',
    component: () => import('../views/user/message/sendMessage.vue'),
    meta: {
      requireAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// router.beforeEach((to, from, next) => {
//   console.log('route name', to.name)
//   const currentUser = firebase.auth().currentUser;
//   console.log('currentUser', currentUser)

//   const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
//   console.log('requiresAuth', requiresAuth)

//   if (!requiresAuth && !currentUser) next('/');
//   else if (requiresAuth && currentUser) next('/user/list');
//   else next();
  
// });

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;

  const requireAuth = to.matched.some(record => record.meta.requireAuth);

  if(requireAuth && !currentUser){
      next({ name: 'Login'});
  }
  else if(!requireAuth && currentUser){
      next({ name: 'UserList'}); 
  }
  else {
      next();
  }
});

export default router
