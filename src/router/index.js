import { createRouter, createWebHistory } from 'vue-router'
import SignInView from '../views/SignInView.vue'
import store from '../store/index'

const routes = [
  {
    path: '/',
    name: 'signIn',
    component: SignInView
  },
  {
    path: '/home',
    name: 'home',
    beforeEnter: guard,
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/add-partner',
    name: 'addPartner',
    beforeEnter: guard,
    component: () => import('../views/AddPartnerView.vue')
  },
  {
    path: '/sign-up',
    name: 'signUp',
    component: () => import('../views/SignUpView.vue')
  }
]

// Para proteger /home de usuarioso no autenticados.
function guard(to, from, next){
  if(store.state.user.id) {
    next();  
  } else {
    next('/');
  }
}

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
