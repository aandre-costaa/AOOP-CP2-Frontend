<script setup>

</script>

<template>
  <footer>
    <div class="footer-inner">
      <router-link class="logo" to="/">
        <img alt="App logo" class="logo" src="../assets/logo.svg" width="96" height="96" />
      </router-link>
      <p>Desenvolvido por: André Costa Nº27638</p>
      <p>M Flix Movies &reg;</p>
    </div>
  </footer>
</template>

<style scoped>
  footer {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 160px;
  }

  footer .footer-inner {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: space-evenly;
    background: rgb(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 4px 0 rgba(34, 34, 34, 0.25);
    width: 100%;
    margin: 16px;
    height: 128px;
    border-radius: 32px;
    padding: 16px;
    color: black;
  }

  footer .footer-inner .logo {
    display: flex;
    align-items: center;
    padding: 0;
  }

  footer .footer-inner .logo .logo:hover {
    cursor: pointer;
  }

  footer .footer-inner .logo h1 {
    color: black;
  }
</style>