<script>
import { ref, watchEffect } from 'vue';
import { useWeatherStore } from './../stores/pinia';
import Header from './../components/Header.vue';
import WeatherInfo from '../components/WeatherInfo.vue';
import WeatherCardList from '../components/WeatherCardList.vue';
import Modal from './../components/Modal.vue';

export default {
  components: {
    Header,
    WeatherInfo,
    WeatherCardList,
    Modal,
  },
  setup() {
    const weatherStore = useWeatherStore();

    const favoriteWeatherInfo = ref(weatherStore.favoriteWeatherInfo);
    const favoriteCities = ref(weatherStore.favoriteCities);

    watchEffect(() => {
      favoriteWeatherInfo.value = weatherStore.favoriteWeatherInfo;
      favoriteCities.value = weatherStore.favoriteCities;
    });

    return {
      favoriteWeatherInfo,
      favoriteCities,
    }
  }
};
</script>

<template>
  <Header />

  <div class="favorites">
    <div class="favorites__content">
      <h1 class="favorites__title">Favorites</h1>

      <div v-if="favoriteCities.length > 0">
        <WeatherInfo :weatherInfo="favoriteWeatherInfo" />
        <WeatherCardList :cities="favoriteCities" />
      </div>

      <p class="favorites__empty" v-else>
        Press 💛 to add items to favorites
      </p>
    </div>
  </div>

  <Modal />
</template>

<style lang="scss" scoped>
@import './../utils/variables';

.favorites {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  color: $main-color;

  &__content {
    width: 70%;
  }

  &__title {
    font-size: 50px;
  }

  &__empty {
    margin-top: 20px;
  }
}
</style>