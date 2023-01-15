<template>
  <div class="container">
    <div v-if="setData" class="chatWithWho">
      <div class="headline">Message box</div>
      <div v-if="!chatList">Your inbox is empty</div>
      <div class="chatCard" v-for="(person, index) in chatWithWho" :key="index">
        <div class="user">
          <div class="ccImg"><img :src="person.pPhoto" alt=""></div>
          <div class="ccInfo">
            <span>{{ person.name }} {{ person.surname }}</span>
            <span class="newMessage" v-if="person.notify">New message</span>
            <router-link class="button primaryBtn" :to="{ name: 'SendMessage', params: { accountId: person.friendId} }">Send message</router-link>
          </div>
        </div>
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
    pushChatWithWho(chatId, newMsg) {
      let self = this;
      var item = {};
      firebase.firestore().collection("profiles").where("uid", "==", chatId).onSnapshot((querySnapshot) => {
        querySnapshot.forEach(doc => {
          item = {};
          item.name = doc.data().account.name;
          item.surname = doc.data().account.surname;
          item.pPhoto = doc.data().account.pPhoto;
          item.friendId = doc.data().uid;
          if(newMsg){
            item.notify = newMsg;
          }
          self.chatWithWho.push(item);
        });
      });
    },
    checkMessages() {
      let self = this;
      if(self.chatList){
        var item = {};
        for(var i = 0; i < self.chatList.length; i++) {
          if ( Object.values(self.notificationList).includes(self.chatList[i]) ) {
            this.pushChatWithWho(self.chatList[i], true);
          } else {
            this.pushChatWithWho(self.chatList[i]);
          }
        }
      }
    }
  }
}
</script>