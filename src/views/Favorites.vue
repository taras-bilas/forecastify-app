<script>
import FavoritesHeader from './../components/FavoritesHeader.vue';
import FavoritesWeatherInfo from './../components/FavoritesWeatherInfo.vue';
import FavoritesWeatherCard from './../components/FavoritesWeatherCard.vue';
import Modal from './../components/Modal.vue';
import { useWeatherStore } from './../stores/pinia';
import { ref, watchEffect } from 'vue';

export default {
  components: {
    FavoritesHeader,
    FavoritesWeatherInfo,
    FavoritesWeatherCard,
    Modal,
  },
  setup() {
    const weatherStore = useWeatherStore();

    const favoriteWeatherInfo = ref(weatherStore.favoriteWeatherInfo);

    watchEffect(() => {
      favoriteWeatherInfo.value = weatherStore.favoriteWeatherInfo;
    });

    return {
      favoriteWeatherInfo,
    }
  }
};
</script>

<template>
  <FavoritesHeader />
  <div class="favorites-title">
    <h1 class="favorites-title__title">Favorites</h1>
  </div>
  <FavoritesWeatherInfo v-if="favoriteWeatherInfo && Object.keys(favoriteWeatherInfo).length > 0"/>
  <FavoritesWeatherCard />
  <Modal />
</template>

<style lang="scss">
.favorites-title {
  margin-top: 30px;

  @media (max-width: 1199px) {
    display: flex;
    justify-content: center;
  }

  @media (min-width: 1200px) {
    margin-left: 200px;
  }

  &__title {
    font-size: 50px;
    color: #bbb;
  }
}
</style>
