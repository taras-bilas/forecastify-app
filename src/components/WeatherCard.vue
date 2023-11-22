<script>
import { ref, watchEffect } from 'vue';
import { useWeatherStore, useFocusStore, useModalStore, useLoaderStore } from './../stores/pinia';
import Loader from './../components/Loader.vue';

export default {
  components: {
    Loader,
  },
  setup() {
    const weatherStore = useWeatherStore();
    const focusStore = useFocusStore();
    const modalStore = useModalStore();
    const loaderStore = useLoaderStore();

    const cityName = ref(weatherStore.cityName);
    const weatherInfo = ref(weatherStore.weatherInfo);
    const citiesWeather = ref(weatherStore.citiesWeather);
    const favorites = ref([]);
    const cardIndex = ref(null);
    const cardIsBeingDeleted = ref(false);
    const isModalOpen = ref(false);
    const modalText = ref('');
    const isLoadingCard = ref(loaderStore.isLoadingCard);

    watchEffect(() => {
      cityName.value = weatherStore.cityName;
      citiesWeather.value = weatherStore.citiesWeather;
      favorites.value = weatherStore.favorites;
      cardIndex.value = weatherStore.cardIndex;
      cardIsBeingDeleted.value = weatherStore.cardIsBeingDeleted;
      isModalOpen.value = modalStore.isModalOpen;
      modalText.value = modalStore.modalText;
      isLoadingCard.value = loaderStore.isLoadingCard;
    });

    const onCard = (cityWeather) => {
      cityName.value = cityWeather.name;
      weatherInfo.value = cityWeather;

      weatherStore.setCityName(cityName.value);
      weatherStore.setWeatherInfo(weatherInfo.value);
    };

    const onFavorites = (cityWeather) => {
      const selectedFavoriteIndex = favorites.value
        .findIndex(favorite => favorite.name === cityWeather.name);

      if (selectedFavoriteIndex === -1) {
        if (favorites.value.length < 5) {
          cityWeather.isAddedToFavorites = true;
          favorites.value.push(cityWeather);
          isModalOpen.value = true;
          modalText.value = 'The card has been added to favorites. To see a list of all your favorite cards, please navigate to the favorites';
        } else {
          isModalOpen.value = true;
          modalText.value = 'The maximum number of weather cards with different cities that you can add to favorites is 5. You can remove a card from the list and add a new one.';
        }
      } else {
        cityWeather.isAddedToFavorites = false;
        favorites.value.splice(selectedFavoriteIndex, 1);
        isModalOpen.value = true;
        modalText.value = 'The card has been deleted from the list of favorites. You can add a new one.';
      }

      weatherStore.setFavorites(favorites.value);
      weatherStore.setFavoriteWeatherInfo(favorites.value[0]);
      modalStore.setIsModalOpen(isModalOpen.value);
      modalStore.setModalText(modalText.value);
    };

    const onDelete = (index) => {
      cardIndex.value = index;
      cardIsBeingDeleted.value = true;
      isModalOpen.value = true;
      modalText.value = 'Are you sure you want to delete this card\? After deleting, you can add it again by entering the name of the city.';

      weatherStore.setCardIndex(cardIndex.value);
      weatherStore.setCardIsBeingDeleted(cardIsBeingDeleted.value);
      modalStore.setIsModalOpen(isModalOpen.value);
      modalStore.setModalText(modalText.value);
    };

    const onAddNewCard = () => {
      focusStore.callSetFocus();
    };

    return {
      citiesWeather,
      favorites,
      isLoadingCard,
      onCard,
      onFavorites,
      onDelete,
      onAddNewCard,
    };
  },
};
</script>

<template>
  <div class="weather__cards cards">
    <div class="cards__container">
      <div
        v-if="!isLoadingCard"
        v-for="cityWeather, index in citiesWeather"
        class="cards__card card"
        @click="onCard(cityWeather)"
      >
        <div class="card__container">
          <div class="card__top">
            <div class="card__text-container">
              <h1 class="card__city-name">{{ cityWeather.name }}</h1>
              <h2 class="card__today">
                Today, {{ String(new Date().getHours()).padStart(2, '0') }}:{{ String(new Date().getMinutes()).padStart(2,
                  '0') }}
              </h2>
              <div class="card__weather weather">
                <p class="weather__temperature">{{ Math.round(cityWeather.main.temp) }}&deg;C {{
                  cityWeather.weather[0].main
                }}</p>
                <p class="weather__feels-like">Feels like: {{ Math.round(cityWeather.main.feels_like) }}&deg;C</p>
              </div>
            </div>
            <div class="card__image-container">
              <img
                :src="`https://openweathermap.org/img/w/${cityWeather.weather[0].icon}.png`"
                alt="Weather image"
                class="card__image"
              >
            </div>
          </div>
          <div class="card__buttons buttons">
            <button class="buttons__favorite-button favorite-button" @click="onFavorites(cityWeather)">
              <img
                src="./../assets/icons/favorites-yellow.svg"
                alt="Added to favorites image"
                class="favorite-button__image"
                v-if="cityWeather.isAddedToFavorites"
              >
              <img
                src="./../assets/icons/favorites-black.svg"
                alt="Add to favorites image"
                class="favorite-button__image"
                v-else
              >
            </button>
            <button class="buttons__delete-button delete-button" @click="onDelete(index)">
              <img
                src="./../assets/icons/delete.svg"
                alt="Delete image"
                class="delete-button__image"
              >
            </button>
          </div>
        </div>
      </div>
      <Loader v-else/>
      <div
        class="cards__card card" 
        v-if="citiesWeather.length < 5 && !isLoadingCard" @click="onAddNewCard"
      >
        <div class="card__add-card add-card">
          <img
            src="./../assets/icons/plus.svg"
            alt="Add card image"
            class="add-card__image"
          >
          <p class="add-card__text">
            To add a new weather card for your city, enter the name of the city in the input.
          </p>
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
  min-height: 175px;
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

.add-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;

  &__image {
    width: 40px;
    height: 40px;
  }

  &__text {
    margin-top: 20px;
    text-align: center;
    font-size: 18px;
  }
}

.buttons {
  position: absolute;
  right: 10px;
  top: 10px;
  display: flex;
  justify-content: space-between;
  width: 60px;
}

.favorite-button,
.delete-button {
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