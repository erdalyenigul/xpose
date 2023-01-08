<template>
  <div id="app" class="containerAll">
    <Header />
    <router-view/>
  </div>
</template>
<script>
import Header from '@/components/header.vue'
export default {
  components: { Header },
}
</script>

<style>
  @import '@/assets/css/reset.css';
  @import '@/assets/css/main.css';
  @import '@/assets/css/formElements.css';
</style>