<template>
  <div class="welcome">
    <div class="welcomeForm">
      <div class="formHead">Free New Subscription</div>
      <form @submit.prevent="register">
        <span class="formW100">
          <span class="formW50"><input required type="text" placeholder="Name" v-model="account.name" /></span>
          <span class="formW50"><input required type="text" placeholder="Lastname" v-model="account.surname" /></span>
        </span>
        <span class="formW100">
          <input required type="email" placeholder="E-Mail" v-model="account.email" />
        </span>
        <span class="formW100">
          <div class="gender">
            <span class="formW50">
              <span class="inputHead">Gender</span>
              <div class="form-radio">
                <div class="radio">
                  <label>
                    <input required v-model="account.person.gender" value="Male" type="radio" name="gender" /><i class="helper"></i> Male
                  </label>
                </div>
                <div class="radio">
                  <label>
                    <input required v-model="account.person.gender" value="Woman" type="radio" name="gender" /><i class="helper"></i> Woman
                  </label>
                </div>
              </div>
            </span>
            <span class="formW50">
              <span class="inputHead">Your date of birth</span>
              <div class="dateInput">
                <datepicker></datepicker>
              </div>
            </span>
          </div>
        </span>
        <span class="formW100 passWrap">
          <a class="showPassRegister" @click="showPass">Show password</a>
          <span class="formW100">
            <span class="formW50"><input id="password" required type="password" placeholder="Password" v-model="account.password" /></span>
            <span class="formW50"><input id="rePassword" required type="password" placeholder="Password Confirm" v-model="passwordAgain" /></span>
          </span>
        </span>
        <span class="formW100">
          <span class="formW50"><div v-if="errorPass" class="errorMsg">Passwords must be the same!</div></span>
          <span class="formW50"><div v-if="errorServer" class="errorMsg">{{ errorServerMsg }}</div></span>
        </span>
        <button type="submit" class="button primaryBtn">SIGN UP</button>
      </form>
    </div>
    <div class="welcomeBottom">
      <span>Are you a member?</span>
      <button class="button bottomBtn" @click="$router.push('/')">LOGIN</button>
    </div>
    <div class="overlayBg"></div>
  </div>
</template>

<script>
import firebase from 'firebase/compat/app'

import Datepicker from 'vuejs-datepicker';

export default {
  components: {
    Datepicker
  },
  data() {
    return {
      chatList: [],
      notificationList: [],
      account: {
        pPhoto: '',
        name: '',
        surname: '',
        email: '',
        password: '',
        person : {
          biography: null,
          gender:'',
          age:'',
          birthday:'',
          city:'',
        },
        other: {
          interest: '',
          job: '',
          education: '',
          zodiac_sign: '',
          movies: '',
          music: '',
        }
      },
      passwordAgain: '',
      errorPass: '',
      errorServer: false,
      errorServerMsg: '',
      showPassToggle: false,
    }
  },
  created() {
        
  },
  methods: {
    showPass() {
      this.showPassToggle = !this.showPassToggle;
      var pass = document.querySelector("#password");
      var repass = document.querySelector("#rePassword");
      if(this.showPassToggle) {
        pass.type = "text";
        repass.type = "text";
      } else {
        pass.type = "password";
        repass.type = "password";
      }
    },
    register() {
      let birthdayLongDate = new Date(this.account.person.birthday);
      this.account.person.birthday = birthdayLongDate.toLocaleDateString("tr-TR");

      let getAgeFromtBirthday = this.account.person.birthday;
      let userBirthYear = getAgeFromtBirthday.split('.').reverse()[0];
      let currentDate = new Date();
      let currentYear = currentDate.getFullYear();
      var userAge = currentYear - userBirthYear;
      this.account.person.age = userAge;

      let self = this;
      if(this.account.password == this.passwordAgain) {
        firebase.auth().createUserWithEmailAndPassword(this.account.email, this.account.password)
        .then((userData) => {
          userData.user.sendEmailVerification();
          self.setUser();
        })
        .catch(function(error) {
          self.errorServer = true;
          self.errorServerMsg = error.message;
          setTimeout(() => {
            self.errorServer = false;
          }, 5000);
        });
      } else {
        this.errorPass = true;
        setTimeout(() => {
          this.errorPass = false;
        }, 5000);
      }
    },
    setUser() {
      let self = this;
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          localStorage.setItem('uid', user.uid);
          firebase.firestore().collection('profiles').doc(user.uid).set({
            account: self.account,
            chatList: self.chatList,
            notificationList: self.notificationList,
            uid: user.uid,
          }).then(() => {
            self.$router.push('/account/profile');
          })
          console.log('user kaydedildi');
        } else {
          console.log('user kaydedilmedi');
        }
      });
    }
  }
};
</script>

