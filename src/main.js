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
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: "pichosfilms.firebaseapp.com",
  projectId: "pichosfilms",
  storageBucket: "pichosfilms.firebasestorage.app",
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID
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
