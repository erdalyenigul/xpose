<template>
  <div class="container">
    <div class="modalWrap" v-if="showBigPPModal">
      <div class="modalContent">
        <a class="modalCloseBtn" @click="showBigPPModal = false ">kapat</a>
        <div class="showBigPPModal">
          <img :src="account.pPhoto" :alt="account.name">
        </div>
      </div>
    </div>
    <div class="profileWrap" v-if="setData">
      <div class="profileInfoHead">
        <div class="profilPhoto">
          <img v-if="account.pPhoto" :src="account.pPhoto" :alt="account.name" @click="showBigPP">
        </div>
        <ul>
          <li class="fullName">{{ account.name }} {{ account.surname }}</li>
          <li class="email">{{ account.email }}</li>
          <li class="complateProfileBtn">
            <router-link to="/account/edit" class="primaryBtn">Edit profile</router-link>
            <router-link to="/account/photos">Photos</router-link>
          </li>
        </ul>
      </div>
      <div class="profileDetail">
        <div class="pdLine textarea">
          <div class="pdHead">Biography :</div>
          <span class="textareaWrap">
            <textarea disabled v-model="account.person.biography"></textarea>
          </span>
        </div>        
        <div class="pdLine">
          <div class="uiLineLeft">Gender</div>
          <div class="uiLineRight">{{ account.person.gender }}</div>
        </div>
        <div class="pdLine">
          <div class="uiLineLeft">Date of birth</div>
          <div class="uiLineRight">{{ account.person.birthday }}</div>
        </div>
        <div class="pdLine">
          <div class="uiLineLeft">Age</div>
          <div class="uiLineRight">{{ account.person.age }}</div>
        </div>
        <div class="pdLine">
          <div class="uiLineLeft">City</div>
          <div class="uiLineRight">{{ account.person.city }}</div>
        </div>
        <div class="pdLine">
          <div class="uiLineLeft">Job</div>
          <div class="uiLineRight">{{ account.other.job }}</div>
        </div>
        <div class="pdLine">
          <div class="uiLineLeft">Education</div>
          <div class="uiLineRight">{{ account.other.education }}</div>
        </div>
        <div class="pdLine longMB">
          <div class="uiLineLeft">Zodiac Sign</div>
          <div class="uiLineRight">{{ account.other.zodiac_sign }}</div>
        </div>
        <div class="pdLine textarea">
          <div class="pdHead">Interest :</div>
          <span class="textareaWrap">
            <textarea disabled v-model="account.other.interest"></textarea>
          </span>
        </div>
        <div class="pdLine textarea">
          <div class="pdHead">Favorite movies :</div>
          <span class="textareaWrap">
            <textarea disabled v-model="account.other.movies"></textarea>
          </span>
        </div>
        <div class="pdLine textarea">
          <div class="pdHead">Favorite bands/artists :</div>
          <span class="textareaWrap">
            <textarea disabled v-model="account.other.music"></textarea>
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
      user: '',
      ppImageFile: '',
      userID: '',
      setData: true,
      firstTouch: true,
      admin: false,
      showBigPPModal: false,

      account: {
        pPhoto:'',
        name: '',
        surname: '',
        email: '',
        person : {
          biography: '',
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
      }
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
          self.userID = user.uid;
          if(user.emailVerified) {
            firebase.firestore().collection("profiles").where("uid", "==", self.userID).get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                self.account = doc.data().account;
              });
              self.setData = true;
              self.firstTouch = false
              let getAgeFromtBirthday = self.account.person.birthday;
              let ageSet = getAgeFromtBirthday.split('.').reverse()[0];
              let fullDate = new Date();
              let year = fullDate.getFullYear();
              var age = year - ageSet;
              self.account.person.age = age;
            });
            
            firebase.storage().ref('profiles/' + self.userID).getDownloadURL()
            .then(function(url) {
              self.ppImage = url;
            })
            .catch(function(error) {
              console.log(error.message);
            });
          }
        }
      });
    },
    showBigPP() {
      this.showBigPPModal = true;
    }
  }
}
</script>