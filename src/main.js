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
  apiKey: "AIzaSyCsXB-mROyUznWeCfg15W_rqvGUJmKS6AQ",
  authDomain: "xposeus00.firebaseapp.com",
  projectId: "xposeus00",
  storageBucket: "xposeus00.appspot.com",
  messagingSenderId: "250565650007",
  appId: "1:250565650007:web:db6aad7983a0edd5d4e512"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth, db };


let app;

firebaseApp.auth().onAuthStateChanged(user => {
    if (!app) {
    app = new Vue({
      router,
      render: h => h(App)
    }).$mount("#app");
  }
});
