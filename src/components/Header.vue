<script setup>
</script>

<template>
  <header>
    <div class="header-inner">
      <router-link class="logo" to="/">
        <img alt="App logo" src="../assets/logo.svg" width="96" height="96" />
        <h1>M Flix movies</h1>
      </router-link>
    </div>
  </header>
</template>

<style scoped>
  header {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 160px;
    position: fixed;
    z-index: 1000;
  }

  header .header-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgb(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 4px 0 rgba(34, 34, 34, 0.25);
    width: 100%;
    margin: 16px;
    height: 128px;
    border-radius: 32px;
    padding: 16px;
  }

  header .header-inner .logo {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 0;
  }

  header .header-inner .logo:hover {
    cursor: pointer;
  }

  header .header-inner .logo h1 {
    color: black;
  }
</style>