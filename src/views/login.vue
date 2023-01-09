<template>
  <div class="welcome" v-if="userLogin">
    <div class="welcomeLine">
      <span>START MEETING NEW PEOPLE!</span>
      <span>MAKE THE FIRST MOVE</span>
    </div>
    <div class="welcomeForm">
      <div class="formHead">
        <h1>Sign In</h1>
      </div>
      <form @submit.prevent="login">
        <span class="formW100"><input type="email" placeholder="E-Mail" v-model="email" /></span>
        <span class="formW100">
          <a class="showPassLogin" @click="showPass"><i class="fa-solid fa-eye"></i></a>
          <input id="password" type="password" placeholder="Password" v-model="password" />
          </span>
        <div v-if="errorShow" class="errorMsg">{{ errorMsg }}</div>
        <button type="submit" class="button primaryBtn">SIGN IN</button>
      </form>
    </div>
    <div class="welcomeBottom">
      <span>Not a Member? <br>Become a member and make new friends.</span>
      <button class="button bottomBtn" @click="$router.push('/register')">JOIN NOW FOR FREE</button>
    </div>
    <div class="overlayBg"></div>
  </div>
</template>

<script>
import firebase from 'firebase/compat/app';

export default {
  data() {
    return {
      email: "",
      password: "",
      errorShow: false,
      errorMsg: "",
      userId: "",
      showPassToggle: false,
      userLogin: false,
    };
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    }
  },
  methods: {
    checkUserLogin() {
      let self = this;
      firebase.auth().onAuthStateChanged(function (user) {
        if(user != null) {
          self.$router.push('/user/list');
        } else {
          self.userLogin = true;
        }
      });
    },
    showPass() {
      this.showPassToggle = !this.showPassToggle;
      var pass = document.querySelector("#password");
      if(this.showPassToggle) {
        pass.type = "text";
      } else {
        pass.type = "password";
      }
    },
    login() {
      let self = this;
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
      .then(userData => {
        localStorage.setItem('uid' , userData.user.uid);
        self.$router.push('/user/list');
      })
      .catch(function(error) {
        self.errorShow = true;
        self.errorMsg = error.message;
      });
    }
  },
  created() {
    this.checkUserLogin();
  }
};
</script>

