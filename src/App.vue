<template>
  <div id="app">
    <div class="">
      <b-nav tabs>
        <b-nav-item to="kakezan" active-class="active">掛け算</b-nav-item>
        <b-nav-item to="warizan" active-class="active">割り算</b-nav-item>
        <b-nav-item to="bunsu" active-class="active">分数</b-nav-item>
      </b-nav>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
