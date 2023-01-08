<template>
  <div class="container">
    <div class="errorMsg emailVerified" v-if="email_verified">
      Your e-mail address has not been confirmed, please go to your e-mail and confirm. <br> Refresh the page after confirming.
    </div>
    <div class="modalWrap" v-if="showBigPPModal">
      <div class="modalContent">
        <a class="modalCloseBtn" @click="showBigPPModal = false ">kapat</a>
        <div class="showBigPPModal">
          <img :src="account.pPhoto" :alt="account.name">
        </div>
      </div>
    </div>
    <div class="profileWrap" v-if="!email_verified && setData">
      <div class="profileInfoHead">
        <div v-if="loading" class="loadingBar"><img src="@/assets/images/loading.gif" alt=""> Photo is loading, please wait...</div>
        <div class="profilPhoto">
          <img v-if="account.pPhoto" :src="account.pPhoto" :alt="account.name" @click="showBigPP">
        </div>
        <ul>
          <li class="fullName">{{ account.name }} {{ account.surname }}</li>
          <li class="email">{{ account.email }}</li>
          <li class="complateProfileBtn">
            <image-uploader :preview=false outputFormat="blob" :maxWidth="512" :quality="0.7" @input="setImage">
              <label for="fileInput" class="button primaryBtn imageUploaderBtn" slot="upload-label">
                <span class="upload-caption">{{
                  hasImage ? "Upload profile photo" : "Upload profile photo"
                }}</span>
              </label>
            </image-uploader>
            <router-link to="profile" class="button">
              Show my profile
            </router-link>
          </li>
          <li v-if="account.pPhoto">
            <a class="removePphoto" @click="removePphoto">Delete my profile photo</a>
          </li>
        </ul>
      </div>
      <form @submit.prevent="saveProfile">
        <div class="profileDetail">
          <div class="pdLine textarea">
            <div class="pdHead">Biography*</div>
            <span class="textareaWrap">
              <textarea v-model="account.person.biography" placeholder="At least 80 characters"></textarea>
            </span>
          </div>
          <div class="pdLine mb40">
            <div class="uiLineLeft">City*</div>
            <div class="uiLineRight"><input required v-model="account.person.city" type="text" name="" placeholder="City"></div>
          </div> 
          <div class="pdLine">
            <div class="uiLineLeft">Job</div>
            <div class="uiLineRight">
              <input v-model="account.other.job" type="text" name="" placeholder="Job">
            </div>
          </div>
          <div class="pdLine">
            <div class="uiLineLeft">Education</div>
            <div class="uiLineRight">
              <input v-model="account.other.education" type="text" name="" placeholder="Education">
            </div>
          </div>
          <div class="pdLine longMB">
            <div class="uiLineLeft">Zodiac sign</div>
            <div class="uiLineRight">
              <input v-model="account.other.zodiac_sign" type="text" name="" placeholder="Zodiac sign">
            </div>
          </div>
          <div class="pdLine textarea">
            <div class="pdHead">Interest</div>
            <span class="textareaWrap">
              <textarea v-model="account.other.interest"></textarea>
            </span>
          </div>
          <div class="pdLine textarea">
            <div class="pdHead">Favorite movies</div>
            <span class="textareaWrap">
              <textarea v-model="account.other.movies"></textarea>
            </span>
          </div>
          <div class="pdLine textarea">
            <div class="pdHead">Favorite bands/artists</div>
            <span class="textareaWrap">
              <textarea v-model="account.other.music"></textarea>
            </span>
          </div>
          <div class="notify success" v-if="notify">
            <span>{{ notifyMsg }}</span>
          </div>
        </div>
        <div class="bottomBtns">
          <button class="button primaryBtn saveBtn" type="submit">Save</button>
          <router-link to="profile" class="button secondaryBtn backToProfile">
            Cancel 
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/compat/app';

export default {
  data() {
    return {
      lang: {
        formatLocale: {
          firstDayOfWeek: 1,
          months: ['Ocak', 'Şubat', 'March', 'April', 'May', 'Haziran', 'July', 'August', 'September', 'October', 'November', 'December'],
        },
      },
      emailVerified: false,
      user: '',
      email_verified: false,     
      ppImage: false,
      ppImageFile: '',
      userID: '',
      notify: false,
      notifyMsg: '',
      notifyIcon: '',
      setData: true,
      showBigPPModal: false,
      checkUserPP: '',
      loading: false,
      image: '',
      hasImage: '',

      account: {
        pPhoto: '',
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
  created() {
    this.userGetAccount();
  },
  methods: {
    async userGetAccount(){
      let self = this;
      await firebase.auth().onAuthStateChanged(user => {
        console.log(user)
        if (user) {
          self.userID = user.uid;
          if(user.emailVerified) {
            self.email_verified = false;
            firebase.firestore().collection("profiles").where("uid", "==", self.userID).get()
            .then(querySnapshot => {
              console.log('querySnapshot')
              console.log(querySnapshot)
              querySnapshot.forEach(doc => {
                self.account = doc.data().account;
              });
              self.checkUserPP = firebase.storage().ref('profiles/' + this.userID).name;
              self.setData = true;
            });

            firebase.storage().ref('profiles/' + self.userID).getDownloadURL()
            .then(function(url) {
              self.ppImage = url;
            })
            .catch(function(error) {
              console.log(error.message);
            });
          } else {
            this.email_verified = true;
          }
        }
      });
    },
    saveProfile() {
      let self = this;
      firebase.firestore().collection("profiles").doc(self.userID).set({
          account: self.account
        }, { merge: true })
        .then(function() {
          self.notify = true;
          self.notifyMsg = 'Profil başarıyla güncellendi';
          self.notifyIcon = 'check';
          setTimeout(() => {
            self.notify = false;
          }, 5000);
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
    },
    setImage(blob) {
      self.loading = true;
      this.hasImage = true;
      this.image = blob;
      this.updatePP();
    },
    async updatePP() {
      var self = this;
      console.log('self.userID')
      console.log(self.userID)

      let storageRef = firebase.storage().ref('profiles/' + self.userID);
      if(storageRef){
        storageRef.delete().then(function() {}).catch(function(error) {});
      }
      
      let uploadTask = storageRef.put(this.image);
      await uploadTask.then(function() {        

        firebase.storage().ref('profiles/' + self.userID).getDownloadURL()
        .then(function(url) {
          self.account.pPhoto = url;
          firebase.firestore().collection("profiles").doc(self.userID).set({
            account: {
              pPhoto: url
            }
          }, { merge: true })
          .then(function() {
            self.loading = false;
            self.notify = true;
            self.notifyMsg = 'Profil fotoğrafı yüklendi';
            self.notifyIcon = 'check';
            setTimeout(() => {
              self.notify = false;
            }, 5000);
          })
          .catch(function(error) {
            console.error("Error writing document: ", error);
          });

        })
        .catch(function(error) {
          console.log(error.message);
        });
      },error => {
        console.log(error.message);
      });
    },
    showBigPP() {
      this.showBigPPModal = true;
    },
    removePphoto() {
      var self = this;

      firebase.storage().ref('profiles/' + self.userID).delete().then(function() {
        self.account.pPhoto = false;

        firebase.firestore().collection('profiles').doc(self.userID).set({
          account: {
            pPhoto: self.account.pPhoto
          }
        }, { merge: true })
        .then(function() {
          self.notify = true;
          self.notifyMsg = 'Profil fotoğrafı silindi';
          self.notifyIcon = 'check';
          setTimeout(() => {
            self.notify = false;
          }, 5000);
        }).catch(function(error) {
          console.log(error)
        });
        
        
      }).catch(function(error) {
        console.log(error)
      });
    }
  }
}
</script>