import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'directory', component: () => import('../views/DirectoryView.vue') },
    { path: '/wizard', name: 'wizard', component: () => import('../views/WizardView.vue') },
    { path: '/shortlist', name: 'shortlist', component: () => import('../views/SavedView.vue') },
    { path: '/hotlines', name: 'hotlines', component: () => import('../views/HotlinesView.vue') },
    {
      path: '/program/:id',
      name: 'program-detail',
      component: () => import('../views/ProgramDetailView.vue'),
      props: true
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
