<template>
  <div class="blank-card">
    <img
      src="./../assets/icons/plus.svg"
      alt="Blank card icon"
      class="blank-card__icon"
    >

    <p class="blank-card__text">
      Add a new weather card
    </p>
  </div>
</template>

<style lang="scss" scoped>
.blank-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;

  &__icon {
    width: 40px;
    height: 40px;
  }

  &__text {
    text-align: center;
    font-size: 18px;
  }
}
</style>