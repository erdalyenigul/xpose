<template>
  <header>
      <div class="headLeft">
        <router-link v-if="!loggedIn" to="/" class="logo">xPose <span>Friend Zone</span></router-link>
        <router-link v-if="loggedIn" :to="{ name: 'UserList' }" class="logo">xPose <span>Friend Zone</span></router-link>
      </div>
      <div class="headRightWelcome" v-if="showHeadBtns && !loggedIn">
        <button v-if="!loggedIn" class="button loginBtn" @click="$router.push('/')">Sign In</button>
        <button v-if="!loggedIn" class="button registerBtn" @click="$router.push('/register')">Register</button>
      </div>
      <div class="headRight" v-if="showHeadBtns && loggedIn">
        <div class="headLinks">
          <a @click="$router.push('/user/list')"> Members</a>
          <a @click="$router.push('/account/profile')"> Profile</a>
          <a @click="$router.push('/account/my-messages')"> Messages <span class="notifyCounter" v-if="notificationList.length > 0">{{ notificationList.length }} new</span></a>
          <a @click="$router.push('/account/photos')"> Photos</a>
          <a @click="logout">Sign Out</a>
        </div>
        <div class="headAccount">
          <a @click="$router.push('/account/profile')">
            <span class="accountFullName">{{ account.name }} {{ account.surname }}</span>
            <span class="accountPP">
              <img v-if="account.pPhoto" :src="account.pPhoto" :alt="account.name">
              <img v-if="!account.pPhoto" src="@/assets/images/ppPlaceholder.jpg">
            </span>
          </a>
        </div>

        <a class="newMessageIcon" v-if="notificationList.length > 0" @click="$router.push('/account/myMessages')">
          
          <span class="counter">{{ notificationList.length }}</span>
        </a>
        <a class="sideMenuOpenBtn" @click="sideMenuShow = true"><i class="fa-solid fa-bars"></i></a>
        <div class="sideMenu" v-if="sideMenuShow">
          <a class="sideMenuCloseBtn" @click="sideMenuShow = false"><i class="fa-solid fa-bars"></i></a>
          <div class="sideMenuContent">
            <ul>
              <li class="accountInfo">
                 <a @click="$router.push('/account/profile'), sideMenuShow = false">
                  <img v-if="account.pPhoto" :src="account.pPhoto" :alt="account.name">
                  <img v-if="!account.pPhoto" src="@/assets/images/ppPlaceholder.jpg" :alt="account.name">
                  <span>{{ account.name }} {{ account.surname }}</span>
                </a>
              </li>
              <li><button class="button primaryBtn" @click="$router.push('/user/list'), sideMenuShow = false">Members</button></li>
              <li><button class="button primaryBtn" @click="$router.push('/account/profile'), sideMenuShow = false">Profile</button></li>
              <li class="messageInfo"><button class="button primaryBtn" @click="$router.push('/account/myMessages'), sideMenuShow = false">Messages <span class="notifyCounter" v-if="notificationList.length > 0">{{ notificationList.length }} New</span></button></li>
              <li><button class="button primaryBtn" @click="$router.push('/account/photos'), sideMenuShow = false">Photos</button></li>
              <li><button class="button primaryBtn" @click="logout">Sign Out</button></li>
            </ul>
          </div>
          <div class="sideMenuOverlay" @click="sideMenuShow = false"></div>
        </div>
      </div>
    </header>
</template>

<script>
import firebase from 'firebase/compat/app';

export default {
  data() {
    return {
      loggedIn: false,
      showHeadBtns: false,
      sideMenuShow: false,
      userId: '',
      account: [],
      notificationList: [],
    }
  },
  created() {
    this.setUser();
  },
  watch: {
    $route() {
      this.sideMenuShow = false;
    }
  },
  methods: {
    logout() {
      firebase.auth().signOut().then(() => {
        this.loggedIn = false;
        this.$router.push("/");
      });
    },
    async setUser() {
      let self = this;

      await firebase.auth().onAuthStateChanged(user => {
        if (user) {
          self.userId = user.uid;
          firebase.auth().currentUser.getIdToken(true)
          .then(token => {
            
          });

          firebase.firestore().collection("profiles").where("uid", "==", self.userId)
          .onSnapshot((querySnapshot) => {
            querySnapshot.forEach(doc => {
              self.account = doc.data().account;
              self.notificationList = doc.data().notificationList;
            });
          });
          this.loggedIn = true;
          this.showHeadBtns = true;
        } else {
          this.loggedIn = false;
          this.showHeadBtns = true;
        }
      });      
    }
  },
}
</script>