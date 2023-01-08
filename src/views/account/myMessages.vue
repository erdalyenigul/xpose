<template>
  <div class="container">
    <div v-if="setData" class="chatWithWho">
      <div class="headline">Message box</div>
      <div v-if="!chatList">Your inbox is empty</div>
      <div class="chatCard" v-for="(person, index) in chatWithWho" :key="index">
        <router-link :to="{ name: 'SendMessage', params: { accountId: person.friendId} }">
          <div class="ccImg"><img :src="person.pPhoto" alt=""></div>
          <div class="ccInfo">
            <span>{{ person.name }} {{ person.surname }}</span>
            <span class="newMessage" v-if="person.notify">New message</span>
            <button class="button primaryBtn">Send message</button>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/compat/app';

export default {
  data() {
    return {
      setData: false,
      chatList: [],
      chatWithWho: [],
      notificationList: [],
    }
  },
  mounted() {
    this.userGetAccount();
  },
  methods: {
    async userGetAccount(){
      let self = this;
      await firebase.auth().onAuthStateChanged(user => {
        if (user) {
          if(user.uid == localStorage.getItem('uid')) {
            this.admin = true;
          } else {
            console.log('!admin')
          }
          firebase.firestore().collection("profiles").where("uid", "==", user.uid).get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              self.chatList = doc.data().chatList;
              self.notificationList = doc.data().notificationList;
            });
            self.checkMessages();
            self.setData = true;
          });
        }
      });
    },
    checkMessages() {
      let self = this;
      if(self.chatList){
        var item = {};
        for(var i = 0; i < self.chatList.length; i++) {
          if ( Object.values(self.notificationList).includes(self.chatList[i]) ) {
            firebase.firestore().collection("profiles").where("uid", "==", self.chatList[i]).onSnapshot((querySnapshot) => {
              querySnapshot.forEach(doc => {
                item = {};
                item.name = doc.data().account.name;
                item.surname = doc.data().account.surname;
                item.pPhoto = doc.data().account.pPhoto;
                item.friendId = doc.data().uid;
                item.notify = 'yeni mesaj';
                self.chatWithWho.push(item);
              });
            });
          } else {
            firebase.firestore().collection("profiles").where("uid", "==", self.chatList[i]).onSnapshot((querySnapshot) => {
              querySnapshot.forEach(doc => {
                item = {};
                item.name = doc.data().account.name;
                item.surname = doc.data().account.surname;
                item.pPhoto = doc.data().account.pPhoto;
                item.friendId = doc.data().uid;
                self.chatWithWho.push(item);
              });
            });
          }
        }
      }
    }
  }
}
</script>