<script>
import { useModalStore, useWeatherStore } from './../stores/pinia';
import { ref, watchEffect } from 'vue';

export default {
  setup() {
    const weatherStore = useWeatherStore();
    const modalStore = useModalStore();

    const cityName = ref(weatherStore.cityName);
    const citiesWeather = ref(weatherStore.citiesWeather);
    const favorites = ref(weatherStore.favorites);
    const favoriteWeatherInfo = ref({});
    const isModalOpen = ref(false);
    const modalText = ref('');

    watchEffect(() => {
      cityName.value = weatherStore.cityName;
      citiesWeather.value = weatherStore.citiesWeather;
      favorites.value = weatherStore.favorites;
      favoriteWeatherInfo.value = weatherStore.favoriteWeatherInfo;
      isModalOpen.value = modalStore.isModalOpen;
      modalText.value = modalStore.modalText;
    });

    const onCard = (favorite) => {
      if (favorites.value.length !== 0) {
        favoriteWeatherInfo.value = favorite;
      }

      if (favorites.value.length === 1) {
        favoriteWeatherInfo.value = favorites.value[0];
      }
      
      cityName.value = favorite.name;

      weatherStore.setFavoriteWeatherInfo(favoriteWeatherInfo.value);
      weatherStore.setCityName(cityName.value);
    };

    const onFavorites = (favorite) => {
      const selectedFavoriteIndex = favorites.value
        .findIndex(element => element.name === favorite.name);

      if (selectedFavoriteIndex !== -1) {
        favorite.isAddedToFavorites = false;
        favorites.value.splice(selectedFavoriteIndex, 1);
        isModalOpen.value = true;
        modalText.value = 'The card has been deleted from the list of favorites. You can add a new one.';
      }

      if (favorites.value.length === 0) {
        favoriteWeatherInfo.value = {};
        weatherStore.setFavoriteWeatherInfo(favoriteWeatherInfo.value);
      }

      weatherStore.setFavorites(favorites.value);
      modalStore.setIsModalOpen(isModalOpen.value);
      modalStore.setModalText(modalText.value);
    };

    return {
      favorites,
      onCard,
      onFavorites,
    };
  },
};
</script>

<template>
  <div class="weather__cards cards">
    <div class="cards__container">
      <div
        v-for="favorite, index in favorites"
        class="cards__card card"
        @click="onCard(favorite)"
      >
        <div class="card__container">
          <div class="card__top">
            <div class="card__text-container">
              <h1 class="card__city-name">{{ favorite.name }}</h1>
              <h2 class="card__today">
                Today, {{ String(new Date().getHours()).padStart(2, '0') }}:{{ String(new Date().getMinutes()).padStart(2,
                  '0') }}
              </h2>
              <div class="card__weather weather">
                <p class="weather__temperature">
                  {{ Math.round(favorite.main.temp) }}&deg;C {{ favorite.weather[0].main }}
                </p>
                <p class="weather__feels-like">Feels like: {{ Math.round(favorite.main.feels_like) }}&deg;C</p>
              </div>
            </div>
            <div class="card__image-container">
              <img
                :src="`https://openweathermap.org/img/w/${favorite.weather[0].icon}.png`"
                alt="Weather image"
                class="card__image"
              >
            </div>
          </div>
          <div class="card__buttons buttons">
            <button class="buttons__favorite-button favorite-button" @click="onFavorites(favorite)">
              <img
                src="./../assets/icons/favorites-yellow.svg"
                alt="Added to favorites image"
                class="favorite-button__image"
                v-if="favorite.isAddedToFavorites"
              >
              <img
                src="./../assets/icons/favorites-black.svg"
                alt="Add to favorites image"
                class="favorite-button__image"
                v-else
              >
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './../utils/variables';

.cards {
  display: flex;
  justify-content: center;

  @media (max-width: 767px) {
    margin-bottom: 60px;
  }

  @media (min-width: 768px) and (max-width: 1199px) {
    margin-bottom: 80px;
  }

  @media (min-width: 1200px) {
    margin-bottom: 120px;
  }

  &__container {
    display: grid;

    @media (max-width: 767px) {
      grid-template-columns: repeat(1, $mobile-card-width);
      width: $mobile-card-width;
      gap: 20px;
    }

    @media (min-width: 768px) and (max-width: 1199px) {
      grid-template-columns: repeat(2, $tablet-card-width);
      width: calc($tablet-card-width * 2 + 30px);
      gap: 30px;
    }

    @media (min-width: 1200px) {
      grid-template-columns: repeat(3, $desktop-card-width);
      width: calc($desktop-card-width * 3 + 60px);
      gap: 30px;
    }
  }
}

.card {
  border-radius: 10px;
  cursor: pointer;
  color: #232323;
  background-color: #8E8E8E;
  transition: transform 0.5s ease;

  @media (max-width: 767px) {
    width: $mobile-card-width;
  }

  @media (min-width: 768px) and (max-width: 1199px) {
    width: $tablet-card-width;
  }

  @media (min-width: 1200px) {
    width: $desktop-card-width;
  }

  &:hover {
    transform: scale(1.1);
  }

  &__container {
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 10px;
  }

  &__top {
    display: flex;
  }

  &__city-name {
    font-weight: 500;

    @media (max-width: 767px) {
      font-size: 25px;
    }

    @media (min-width: 768px) {
      font-size: 30px;
    }
  }

  &__today {
    margin-bottom: 25px;
    font-weight: 400;

    @media (max-width: 767px) {
      font-size: 20px;
    }

    @media (min-width: 768px) {
      font-size: 25px;
    }
  }

  &__image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 15px;
  }

  &__image {
    width: 120px;
    height: 120px;
  }
}

.buttons {
  position: absolute;
  right: 10px;
  top: 10px;
  display: flex;
  justify-content: space-between;
}

.favorite-button {
  height: 25px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;

  &__image {
    width: 25px;
    height: 25px;
  }
}

.weather {
  &__temperature {
    font-weight: 500;

    @media (max-width: 767px) {
      font-size: 25px;
    }

    @media (min-width: 768px) {
      font-size: 30px;
    }
  }

  &__feels-like {
    font-weight: 400;

    @media (max-width: 767px) {
      font-size: 20px;
    }

    @media (min-width: 768px) {
      font-size: 25px;
    }
  }
}
</style>