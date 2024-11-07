<template>
  <div>

    <tawk-header></tawk-header>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './components/Header.vue';

export default {
  components: {
    'tawk-header': Header
  }
};
</script>

<style lang="scss">
@use '@/scss/_variables' as *;

* {
  font-family: $font-family;
}

.search-button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #45a049;
}


.article-count {
  font-size: 14px;
  color: #03a84e;
  margin: 1rem 0 0 0;
}

.last-updated {
  font-size: 12px;
  color: #777;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

h3 {
  font-size: 18px;
}

h4 {
  font-size: 16px;
  font-weight: bold;
}
</style>