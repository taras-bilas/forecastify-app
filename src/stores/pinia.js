import { defineStore } from 'pinia';

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    cityName: '',
    weatherInfo: {},
    citiesWeather: [],
    favorites: [],
    favoriteWeatherInfo: {},
    cardIndex: null,
    cardIsBeingDeleted: false,
  }),
  actions: {
    setCityName(cityName) {
      this.cityName = cityName;
    },
    setWeatherInfo(weatherInfo) {
      this.weatherInfo = weatherInfo;
    },
    setCitiesWeather(citiesWeather) {
      this.citiesWeather = citiesWeather;
    },
    setFavorites(favorites) {
      this.favorites = favorites;
    },
    setFavoriteWeatherInfo(favoriteWeatherInfo) {
      this.favoriteWeatherInfo = favoriteWeatherInfo;
    },
    setCardIndex(cardIndex) {
      this.cardIndex = cardIndex;
    },
    setCardIsBeingDeleted(cardIsBeingDeleted) {
      this.cardIsBeingDeleted = cardIsBeingDeleted;
    },
  },
});

export const useFocusStore = defineStore('focus', {
  state: () => ({
    setFocus: null,
  }),
  actions: {
    setFocusFunction(setFocus) {
      this.setFocus = setFocus;
    },
    callSetFocus() {
      if (this.setFocus) {
        this.setFocus();
      } else {
        console.error('setFocus function is not available yet');
      }
    },
  },
});

export const useModalStore = defineStore('modal', {
  state: () => ({
    isModalOpen: false,
    modalText: "",
  }),
  actions: {
    setIsModalOpen(isModalOpen) {
      this.isModalOpen = isModalOpen;
    },
    setModalText(modalText) {
      this.modalText = modalText;
    },
  },
});

export const useLoaderStore = defineStore('loader', {
  state: () => ({
    isLoadingCard: false,
  }),
  actions: {
    setIsLoadingCard(isLoadingCard) {
      this.isLoadingCard = isLoadingCard;
    },
  },
});
