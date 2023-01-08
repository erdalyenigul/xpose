<template>
  <div class="container">
    <div v-if="setData" class="usersWrap">
      <div class="headline">Members</div>
      <div class="userCard" v-for="(user, index) in users" :key="index" >
        <router-link :to="{ name: 'friendID', params: { friendID: user.uid} }" v-if="author.uid != user.uid">
          <div class="ucContent">
            <div class="userImage">
              <img v-if="user.account.pPhoto" :src="user.account.pPhoto" :alt="`${user.account.name} ${user.account.surname}`">
              <img v-if="!user.account.pPhoto" src="@/assets/images/ppPlaceholder.jpg">
            </div>
            <div class="userInfo">
              <div class="uName">{{ user.account.name }} {{ user.account.surname }}</div>
              <div class="uCity"><strong>City:</strong> {{ user.account.person.city }}</div>
              <div v-if="user.account.person.age" class="uCity"><strong>Age:</strong> {{ user.account.person.age }}</div>
              <div v-if="!user.account.person.age" class="uCity"><strong>Age:</strong> - </div>
            </div>
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
      author: [],
      users: [],
      setData: false
    }
  },
  created() {
    this.getUsers();
  },
  methods: {
    async getUsers(){
      let self = this;
      await firebase.firestore().collection("profiles").orderBy("uid", "desc").get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          self.users.push(doc.data())
        });
        self.setData = true;
      });
    },
  }
}
</script>