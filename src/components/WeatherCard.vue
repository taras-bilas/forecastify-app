<script>
import { reactive, ref, watchEffect } from 'vue';
import { useMainStore, useModalStore, useWeatherStore } from '../stores/pinia';

export default {
  props: {
    currentCityWeather: {
      type: Object,
    },
    currentCardIndex: {
      type: Number,
    },
  },
  setup(props) {
    const mainStore = useMainStore();
    const weatherStore = useWeatherStore();
    const modalStore = useModalStore();

    const currentTime = ref(mainStore.currentTime);
    const roundValue = ref(mainStore.roundValue);
    const favoriteCities = ref([]);

    const card = reactive({
      isBeingDeleted: false,
      index: null,
    });

    const modal = reactive({
      isOpen: false,
      text: '',
    });

    watchEffect(() => {
      favoriteCities.value = weatherStore.favoriteCities;
      modal.isOpen = modalStore.isModalOpen;
      modal.text = modalStore.modalText;
    })

    const onFavorites = () => {
      const selectedFavoriteIndex = favoriteCities.value
        .findIndex(favoriteCity => favoriteCity.name === props.currentCityWeather.name);

      if (selectedFavoriteIndex === -1) {
        if (favoriteCities.value.length < 5) {
          props.currentCityWeather.isAddedToFavorites = true;
          favoriteCities.value.push(props.currentCityWeather);
          modal.isOpen = true;
          modal.text = 'The card has been added to favorites. To see a list of all your favorite cards, please navigate to the favorites';
        } else {
          modal.isOpen = true;
          modal.text = 'The maximum number of weather cards with different cities that you can add to favorites is 5. You can remove a card from the list and add a new one.';
        }
      } else {
        props.currentCityWeather.isAddedToFavorites = false;
        favoriteCities.value.splice(selectedFavoriteIndex, 1);
        modal.isOpen = true;
        modal.text = 'The card has been deleted from the list of favorites. You can add a new one.';
      }

      weatherStore.setFavoriteCities(favoriteCities.value);
      weatherStore.setFavoriteWeatherInfo(favoriteCities.value[0]);
      modalStore.setIsModalOpen(modal.isOpen);
      modalStore.setModalText(modal.text);
    };

    const onDelete = () => {
      card.isBeingDeleted = true;
      card.index = props.currentCardIndex;
      modal.isOpen = true;
      modal.text = 'Are you sure you want to delete this card? After deleting, you can add it again by entering the name of the city.';

      weatherStore.setCardIsBeingDeleted(card.isBeingDeleted);
      weatherStore.setCardIndex(card.index);
      modalStore.setIsModalOpen(modal.isOpen);
      modalStore.setModalText(modal.text);
    };

    return {
      currentTime,
      roundValue,
      onFavorites,
      onDelete,
    };
  }
};
</script>

<template>
  <div class="weather-card">
    <div class="weather-card__content">
      <div class="weather-card__text-container">
        <h1 class="weather-card__city-name">
          {{ currentCityWeather.name }}
        </h1>

        <h2 class="weather-card__today">
          {{ currentTime }}
        </h2>

        <p class="weather-card__temperature">
          {{ roundValue(currentCityWeather.main.temp) }}&deg;C {{ currentCityWeather.weather[0].main }}
        </p>

        <p class="weather-card__feels-like">
          Feels like: {{ roundValue(currentCityWeather.main.feels_like) }}&deg;C
        </p>
      </div>

      <img :src="`https://openweathermap.org/img/w/${currentCityWeather.weather[0].icon}.png`" alt="Weather image"
        class="weather-card__image">
    </div>

    <div class="icons">
      <img src="./../assets/icons/favorites-yellow.svg" alt="Added to favorites icon" class="icons__favorite-icon"
        v-if="currentCityWeather.isAddedToFavorites" @click="onFavorites">

      <img @click="onFavorites" src="./../assets/icons/favorites-black.svg" alt="Add to favorites icon"
        class="icons__favorite-icon" v-else>

      <slot name="delete-icon" :onDeleteFunction="onDelete"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './../utils/variables.scss';

.weather-card {
  position: relative;

  &__content {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  &__city-name {
    font-weight: 500;
    font-size: 25px;

    @media (min-width: $tablet-min-width) {
      font-size: 30px;
    }
  }

  &__today {
    margin-bottom: 25px;
    font-weight: 400;
    font-size: 20px;

    @media (min-width: $tablet-min-width) {
      font-size: 25px;
    }
  }

  &__temperature {
    font-weight: 500;
    font-size: 25px;

    @media (min-width: $tablet-min-width) {
      font-size: 30px;
    }
  }

  &__feels-like {
    font-weight: 400;
    font-size: 20px;

    @media (min-width: $tablet-min-width) {
      font-size: 25px;
    }
  }

  &__image {
    width: 120px;
    height: 120px;
  }
}

.icons {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 10px;

  &__favorite-icon {
    width: 25px;
    height: 25px;
  }
}
</style>