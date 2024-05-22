import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
  state: () => ({}),
  actions: {
    roundValue(value) {
      return Math.round(value);
    },
    getHours() {
      return `${new Date().getHours()}`.padStart(2, '0');
    },
    getMinutes() {
      return `${new Date().getMinutes()}`.padStart(2, '0');
    },
    getCurrentTime() {
      return `${this.getHours()}:${this.getMinutes()}`;
    },
  },
  getters: {
    currentTime() {
      return this.getCurrentTime();
    },
  },
});

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    cityName: '',
    weatherInfo: {},
    cities: [],
    favoriteCities: [],
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
    setCities(cities) {
      this.cities = cities;
    },
    setFavoriteCities(favoriteCities) {
      this.favoriteCities = favoriteCities;
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
    modalText: '',
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
