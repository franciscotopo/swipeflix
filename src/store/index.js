import { createStore } from 'vuex'
import user from './modules/user'
import VuexPersist from 'vuex-persist'

//Almacena la store en el almacenamiento local del navegador
//y lo vuelve a mapear a la store cuando se recarga la página. 

const vuexPersist = new VuexPersist({
  key: 'swipeflix', 
  storage: window.localStorage,
})

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user
  },
  plugins: [vuexPersist.plugin],
})
