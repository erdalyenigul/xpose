<template>
  <footer>
    <div class="footerContent">
      <span>xPose | {{ currentYear }}</span>
      <span>Contact: <a href="mailto:erdalyenigul@gmail.com">erdalyenigul@gmail.com</a></span>
    </div>
  </footer>
</template>

<script>
  export default {
    data() {
      return {
        currentYear: null
      }
    },
    methods: {
      getCurrentYear() {
        let date = new Date;
        let year = date.getFullYear();
        this.currentYear = year;
      }
    },
    created() {
      this.getCurrentYear();
    }
  }
</script>
