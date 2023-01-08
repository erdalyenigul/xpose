import Vue from 'vue'
import App from './App.vue'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

import ImageUploader from 'vue-image-upload-resize'
Vue.use(ImageUploader);

import router from './router'

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "AIzaSyD_igojw8cEEFIo9G1GBV-5SZdqWZyNWvo",
  authDomain: "xposev2-080123.firebaseapp.com",
  projectId: "xposev2-080123",
  storageBucket: "xposev2-080123.appspot.com",
  messagingSenderId: "871518624733",
  appId: "1:871518624733:web:c55a003e165152d50db434"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth, db };

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
