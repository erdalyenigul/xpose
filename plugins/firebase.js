import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCsXB-mROyUznWeCfg15W_rqvGUJmKS6AQ",
    authDomain: "xposeus00.firebaseapp.com",
    projectId: "xposeus00",
    storageBucket: "xposeus00.appspot.com",
    messagingSenderId: "250565650007",
    appId: "1:250565650007:web:db6aad7983a0edd5d4e512"
};

// Initialize Firebase
export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

