<template>
  <div class="container">
    <div class="notify success" v-if="notify">
      <span>{{ notifyMsg }}</span>      
    </div>
    <div class="modalWrap" v-if="accountPhotoBigModal">
      <div class="modalContent">
        <a class="modalCloseBtn" @click="accountPhotoBigModal = false "><i class="fa-solid fa-xmark"></i></a>
        <div class="showBigPPModal">
          <img :src="accountPhotoBigUrl">
        </div>
      </div>
    </div>
    <div class="uploadAccountPhotoWrap">
      <div class="uploadPhotosWrap">
        <div class="uploadBtn" v-if="!loading" >
          <image-uploader class="imageUploaderWrap" outputFormat="blob" :maxWidth="512" :quality="0.7" :preview=false @input="setImage">
            <label for="fileInput" class="button primaryBtn imageUploaderBtn" slot="upload-label">
              <span class="upload-caption">Upload Photo <i class="fa-solid fa-cloud-arrow-up"></i></span>
            </label>
          </image-uploader>
        </div>
        <div v-else class="loadingBar"><img src="@/assets/images/loading.gif" alt=""> Photo is loading, please wait...</div>
      </div>
      <div class="accountPhotos">
        <div class="accountUploaded" v-if="accountPhotos.length > 0">Photo album</div>
        <div class="imgsLine">
          <div class="imgWrap" v-for="(photo, index) in accountPhotos" :key="index">
            <div class="imgContent">
              <a class="removePhoto" @click="removePhoto(photo.name)"><i class="fa-solid fa-trash-can"></i></a>
              <img :src="photo.url" @click="accountPhotoBig(photo.url)">
            </div>
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
      imageFile: '',
      imageFileName: '',
      uploadPreviewPhoto: '',
      userId: '',
      notify: false,
      notifyMsg: '',
      notifyIcon: '',
      accountPhotos: [],
      accountPhotoBigModal: false,
      accountPhotoBigUrl: false,
      loading: false,
      image: '',
      imageName: '',
      inputWatch: ''
    }
  },
  mounted() {
    this.userGetAccount();
  },
  methods: {
    userGetAccount(){
      let self = this;
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          self.userId = user.uid;
          self.getPhotos();
        }
      })
    },
    async getPhotos() {
      this.accountPhotos = [];
      let self = this;
      let storageRef = firebase.storage().ref(self.userId)
      await storageRef.listAll().then(function(result) {
        result.items.forEach(function(imageRef) {
          self.displayImage(imageRef)
        });
      });
    },
    async displayImage(imageRef) {
      let self = this;
      await imageRef.getDownloadURL().then((url)=> {
        var item = {};
        item.url = url;
        item.name = imageRef.name;
        self.accountPhotos.push(item);
        self.accountPhotos.sort((a, b) => b.name.localeCompare(a.name))
      });
    },
    setImage(blob) {
      this.loading = true;
      this.image = blob;
      this.imageName = document.querySelector('#fileInput').value;
      this.imageName = this.imageName.replace(/.*[\/\\]/, '');
      this.updatePhoto();
    },
    async updatePhoto() {
      var today = new Date();
      var date = `${today.getFullYear()}-${(today.getMonth()+1)}-${today.getDate()}`
      var time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
      var dateTime = `${date}_${time}`

      var self = this;
      let storageRef = firebase.storage().ref(self.userId).child(`${dateTime}_:_${self.imageName}`)
      let uploadTask = storageRef.put(this.image);
      await uploadTask.then(function() {
        self.notify = true;
        self.notifyMsg = 'Photo uploaded successfully.';
        self.notifyIcon = 'check';
        setTimeout(() => {
          self.notify = false;
        }, 5000);
        self.image = false;
        self.loading = false;
        self.getPhotos();
      });
    },
    accountPhotoBig(photoUrl) {
      this.accountPhotoBigModal = true;
      this.accountPhotoBigUrl = photoUrl
    },
    removePhoto(photo) {
      var self = this;
      let storageRef = firebase.storage().ref(self.userId).child(photo)
      storageRef.delete().then(function() {
        self.getPhotos();
      });
    }
  }
}
</script>