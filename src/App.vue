<template>
  <div id="app" class="containerAll">
    <Header />
    <router-view/>
    <Footer />
  </div>
</template>
<script>
import Header from '@/components/header.vue'
import Footer from '@/components/footer.vue'
export default {
  components: { Header, Footer },
}
</script>

<style>
  @import '@/assets/css/reset.css';
  @import '@/assets/css/main.css';
  @import '@/assets/css/formElements.css';
</style>