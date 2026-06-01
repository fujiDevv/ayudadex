import { createRouter, createWebHistory } from 'vue-router'
import DirectoryView from '../views/DirectoryView.vue'
import WizardView from '../views/WizardView.vue'
import SavedView from '../views/SavedView.vue'
import HotlinesView from '../views/HotlinesView.vue'
import ProgramDetailView from '../views/ProgramDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'directory', component: DirectoryView },
    { path: '/wizard', name: 'wizard', component: WizardView },
    { path: '/shortlist', name: 'shortlist', component: SavedView },
    { path: '/hotlines', name: 'hotlines', component: HotlinesView },
    {
      path: '/program/:id',
      name: 'program-detail',
      component: ProgramDetailView,
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
