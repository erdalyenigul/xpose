<template>
  <div class="container">
    <div class="profileWrap" v-if="setData">
      <div class="modalWrap" v-if="showBigPPModal">
        <div class="modalContent">
          <a class="modalCloseBtn" @click="showBigPPModal = false "><i class="fa-solid fa-xmark"></i></a>
          <div class="showBigPPModal">
            <img :src="account.account.pPhoto" :alt="account.name">
          </div>
        </div>
      </div>
      <div class="profileInfoHead">
        <div class="profilPhoto">
          <img v-if="account.account.pPhoto" :src="account.account.pPhoto" :alt="account.name" @click="showBigPP">
        </div>
        <ul>
          <li class="fullName">{{ account.account.name }} {{ account.account.surname }}</li>
          <li class="complateProfileBtn">
            <router-link v-if="!admin" :to="{ name: 'SendMessage', params: {accountId: account.uid} }" class="primaryBtn messageBtn">
              Send Message <i class="fa-solid fa-message"></i>
            </router-link>
            <router-link :to="{ name: 'friendPhotos', params: {friendPhotos: account.uid} }" class="primaryBtn messageBtn">
              Photos <i class="fa-solid fa-image"></i>
            </router-link>
          </li>
        </ul>
      </div>
      <div class="profileDetail">
        <div class="pdLine textarea">
          <div class="pdHead">Biyografi :</div>
          <span class="textareaWrap">
            <textarea disabled v-model="account.account.person.biography"></textarea>
          </span>
        </div>        
        <div class="pdLine">
          <div class="uiLineLeft">Cinsiyet</div>
          <div class="uiLineRight">{{ account.account.person.gender }}</div>
        </div>
        <div class="pdLine">
          <div class="uiLineLeft">Doğum tarihi</div>
          <div class="uiLineRight">{{ account.account.person.birthday }}</div>
        </div>
        <div class="pdLine">
          <div class="uiLineLeft">Yaş</div>
          <div class="uiLineRight">{{ account.account.person.age }}</div>
        </div>
        <div class="pdLine">
          <div class="uiLineLeft">Şehir</div>
          <div class="uiLineRight">{{ account.account.person.city }}</div>
        </div>
        <div class="pdLine">
          <div class="uiLineLeft">İş</div>
          <div class="uiLineRight">{{ account.account.other.job }}</div>
        </div>
        <div class="pdLine">
          <div class="uiLineLeft">Eğitim</div>
          <div class="uiLineRight">{{ account.account.other.education }}</div>
        </div>
        <div class="pdLine longMB">
          <div class="uiLineLeft">Burç</div>
          <div class="uiLineRight">{{ account.account.other.zodiac_sign }}</div>
        </div>
        <div class="pdLine textarea">
          <div class="pdHead">İlgi alanları :</div>
          <span class="textareaWrap">
            <textarea disabled v-model="account.account.other.interest"></textarea>
          </span>
        </div>
        <div class="pdLine textarea">
          <div class="pdHead">Favori filmler :</div>
          <span class="textareaWrap">
            <textarea disabled v-model="account.account.other.movies"></textarea>
          </span>
        </div>
        <div class="pdLine textarea">
          <div class="pdHead">Sevdiği müzik grupları/sanatçıları :</div>
          <span class="textareaWrap">
            <textarea disabled v-model="account.account.other.music"></textarea>
          </span>
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
      user: [],
      account: [],
      setData: false,
      admin: false,
      adminID: '',
      showBigPPModal: false,
    }
  },
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.adminID = user.uid;
      }
    });

    this.setUser();
  },
  methods: {
    async setUser() {
      let self = this;
      await firebase.firestore().collection("profiles").where("uid", "==", self.$route.params.friendID).get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          self.account = doc.data();
          if(self.account.uid == self.adminID) {
            self.admin = true;
          }
          self.setData = true;
        });
      });
    },
    showBigPP() {
      this.showBigPPModal = true;
    }
  }
}
</script>