
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  }, 
  {
    path: '/home',
    component: () => import('layouts/HomeLayout.vue'),
    // children: [
    //   { path: '', component: () => import('pages/Home.vue') }
    // ]
  },
  {
    path: '/roles',
    component: () => import('layouts/HomeLayout.vue'),
    children: [
      { path: '', component: () => import('pages/roles.vue') }
    ]
  }, 
   {
    path: '/projects',
    component: () => import('layouts/HomeLayout.vue'),
    children: [
      { path: '', component: () => import('pages/projects.vue') }
    ]
  },  
  {
    path: '/users',
    component: () => import('layouts/HomeLayout.vue'),
    children: [
      { path: '', component: () => import('pages/users.vue') }
    ]
  }, 
  {
    path: '/addroles',
    component: () => import('layouts/HomeLayout.vue'),
    children: [
      { path: '', component: () => import('pages/addRoles.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
