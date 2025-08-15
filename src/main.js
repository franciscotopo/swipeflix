import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

// Firebase v9 modular
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

loadFonts()

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCm6j9pOP36GEo2VAe5TxRqL9RYGB9WN3U",
  authDomain: "pichosfilms.firebaseapp.com",
  projectId: "pichosfilms",
  storageBucket: "pichosfilms.firebasestorage.app",
  messagingSenderId: "141695518371",
  appId: "1:141695518371:web:1943ce5aca345b603e6116"
};

// Inicializa Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Inicializa Firestore
export const db = getFirestore(firebaseApp);

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .mount('#app')
