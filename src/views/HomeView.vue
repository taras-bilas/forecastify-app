<script>
import { ref, watchEffect } from 'vue';
import { useFocusStore, useWeatherStore } from '../stores/pinia';
import Header from './../components/Header.vue';
import WeatherInfo from './../components/WeatherInfo.vue';
import WeatherCardList from './../components/WeatherCardList.vue';
import BlankCard from './../components/BlankCard.vue';
import Modal from './../components/Modal.vue';

export default {
  components: {
    Header,
    WeatherInfo,
    WeatherCardList,
    BlankCard,
    Modal,
  },
  setup() {
    const weatherStore = useWeatherStore();
    const focusStore = useFocusStore();

    const weatherInfo = ref(weatherStore.weatherInfo);
    const cities = ref(weatherStore.cities);
    const inputRef = ref(null);

    watchEffect(() => {
      weatherInfo.value = weatherStore.weatherInfo;
      cities.value = weatherStore.cities;
    });

    const setFocus = () => {
      inputRef.value.focus();
    };

    focusStore.setFocusFunction(setFocus);

    return {
      weatherInfo,
      cities,
      inputRef,
    };
  }
};
</script>

<template>
  <Header>
    <template #search-city="{ city, onSearchCity }">
      <div class="search-city">
        <input
          type="text"
          placeholder="Enter your city"
          v-model="city.name"
          ref="inputRef"
          class="search-city__input"
        >

        <img
          src="./../assets/icons/search.svg"
          alt="Search city image"
          class="search-city__image"
          @click="onSearchCity"
        >
      </div>
    </template>
  </Header>

  <WeatherInfo v-if="cities.length > 0" :weatherInfo="weatherInfo" />

  <WeatherCardList :cities="cities">
    <template #delete-icon="{ onDeleteFunction }">
      <img
        src="./../assets/icons/delete.svg"
        alt="Delete icon"
        class="delete-icon"
        @click="onDeleteFunction"
      >
    </template>

    <template #blank-card="{ onAddNewCardFunction, card }">
      <div
        v-if="cities.length < 5 && !card.isLoading"
        @click="onAddNewCardFunction"
        class="card"
      >
        <BlankCard />
      </div>
    </template>
  </WeatherCardList>

  <Modal />
</template>

<style lang="scss" scoped>
@import './../utils/variables';

.search-city {
  display: flex;
  align-items: center;
  position: relative;

  &__input {
    width: 155px;
    height: 30px;
    padding-left: 10px;
    font-family: 'Rubik', sans-serif;
    border-radius: 50px;

    @media (min-width: $tablet-min-width) {
      width: 400px;
      height: 40px;
      padding-left: 15px;
      font-size: 15px;
    }

    @media (min-width: $desktop-min-width) {
      width: 500px;
      height: 50px;
      padding-left: 20px;
      font-size: 20px;
    }

    &:focus {
      outline: none;
    }
  }

  &__image {
    position: absolute;
    right: 5px;
    width: 20px;
    height: 20px;
    cursor: pointer;

    @media (min-width: $tablet-min-width) {
      right: 10px;
      width: 25px;
      height: 25px;
    }

    @media (min-width: $desktop-min-width) {
      width: 30px;
      height: 30px;
    }
  }
}

.delete-icon {
  width: 25px;
  height: 25px;
}
</style>