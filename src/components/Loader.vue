<template>
  <div class="loader"></div>
</template>

<style lang="scss" scoped>
.loader {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid #ccc;
  border-top-color: #333;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>