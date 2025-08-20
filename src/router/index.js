import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '../store/index'

const routes = [
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    beforeEnter: guard
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/sign-up',
    name: 'signUp',
    component: () => import('../views/SignUpView.vue')
  },
  {
    path: '/',
    name: 'signIn',
    component: () => import('../views/SignInView.vue')
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
