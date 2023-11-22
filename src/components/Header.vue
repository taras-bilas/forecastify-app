<script>
import { ref, onMounted, watchEffect } from 'vue';
import { useWeatherStore, useFocusStore, useModalStore, useLoaderStore } from './../stores/pinia';
import { getCityCoordinates, getWeatherInfo } from './../api';

export default {
  setup() {
    const weatherStore = useWeatherStore();
    const focusStore = useFocusStore();
    const modalStore = useModalStore();
    const loaderStore = useLoaderStore();

    const cityName = ref('Lviv');
    const cityLatitude = ref(0);
    const cityLongitude = ref(0);
    const weatherInfo = ref({});
    const citiesWeather = ref([]);
    const isModalOpen = ref(false);
    const modalText = ref('');
    const inputRef = ref(null);
    const isLoadingCard = ref(false);

    const getDefaultCity = async () => {
      if ('geolocation' in navigator) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          cityLatitude.value = position.coords.latitude;
          cityLongitude.value = position.coords.longitude;
          isLoadingCard.value = true;

          loaderStore.setIsLoadingCard(isLoadingCard.value);

          await getWeatherInfo(cityLatitude.value, cityLongitude.value)
            .then(response => {
              weatherInfo.value = response.data;
              cityName.value = weatherInfo.value.name;

              const isTheCityInTheList = citiesWeather.value
                .some(cityWeather => cityWeather.name === weatherInfo.value.name);

              if (!isTheCityInTheList) {
                citiesWeather.value.push(weatherInfo.value);
              }
            })
            .catch(error => {
              console.error(error);
            })
            .finally(() => {
              isLoadingCard.value = false;
              loaderStore.setIsLoadingCard(isLoadingCard.value);
            })
        }
        catch (error) {
          console.error('Geolocation is not allowed or not available', error);

          await getCityCoordinates(cityName.value)
            .then(response => {
              cityLatitude.value = response.data[0].lat;
              cityLongitude.value = response.data[0].lon;
            })
            .catch(error => {
              console.error(error);
            })

          isLoadingCard.value = true;
          loaderStore.setIsLoadingCard(isLoadingCard.value);

          await getWeatherInfo(cityLatitude.value, cityLongitude.value)
            .then(response => {
              weatherInfo.value = response.data;

              const isTheCityInTheList = citiesWeather.value
                .some(cityWeather => cityWeather.name === weatherInfo.value.name);

              if (!isTheCityInTheList) {
                citiesWeather.value.push(weatherInfo.value);
                isLoadingCard.value = true;
                loaderStore.setIsLoadingCard(isLoadingCard.value);
              }
            })
            .catch(error => {
              console.error(error);
            })
            .finally(() => {
              isLoadingCard.value = false;
              loaderStore.setIsLoadingCard(isLoadingCard.value);
            })
        }

        weatherStore.setCityName(cityName.value);
        weatherStore.setWeatherInfo(weatherInfo.value);
        weatherStore.setCitiesWeather(citiesWeather.value);

        cityName.value = '';
      }
    };

    onMounted(() => {
      getDefaultCity();
    });

    watchEffect(() => {
      citiesWeather.value = weatherStore.citiesWeather;
      isModalOpen.value = modalStore.isModalOpen;
      modalText.value = modalStore.modalText;
    });

    const onSearchCity = async () => {
      await getCityCoordinates(cityName.value)
        .then(response => {
          cityLatitude.value = response.data[0].lat;
          cityLongitude.value = response.data[0].lon;
        })
        .catch(error => {
          console.error(error);
        })

      isLoadingCard.value = true;
      loaderStore.setIsLoadingCard(isLoadingCard.value);

      await getWeatherInfo(cityLatitude.value, cityLongitude.value)
        .then(response => {
          weatherInfo.value = response.data;

          if (citiesWeather.value.length < 5) {
            const isTheCityInTheList = citiesWeather.value
              .some(cityWeather => cityWeather.name === weatherInfo.value.name);

            if (!isTheCityInTheList) {
              citiesWeather.value.push(weatherInfo.value);
            } else {
              isModalOpen.value = true;
              modalText.value = 'You cannot add a card with this city name because such a card already exists in your list. Try entering a different city name.';
            }
          } else {
            isModalOpen.value = true;
            modalText.value = 'The maximum number of weather cards with different cities that you can add is 5. You can remove a card from the list and add a new one.';
          }
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          isLoadingCard.value = false;
          loaderStore.setIsLoadingCard(isLoadingCard.value);
        })

      weatherStore.setCityName(cityName.value);
      cityName.value = '';

      weatherStore.setWeatherInfo(weatherInfo.value);
      weatherStore.setCitiesWeather(citiesWeather.value);
      modalStore.setIsModalOpen(isModalOpen.value);
      modalStore.setModalText(modalText.value);
    };

    const setFocus = () => {
      inputRef.value.focus();
    };

    focusStore.setFocusFunction(setFocus);

    return {
      cityName,
      inputRef,
      onSearchCity,
    };
  }
}
</script>

<template>
  <header class="header">
    <div class="header__logo logo">
      <router-link to="/" class="logo__link">
        <img
          src="./../assets/icons/logo.png"
          alt="Logo image"
          class="logo__image"
        >
      </router-link>
    </div>
    <div class="header__search-city search-city">
      <input
        class="search-city__input"
        type="text"
        placeholder="Enter your city"
        v-model="cityName"
        ref="inputRef"
      >
      <button class="search-city__button" @click="onSearchCity">
        <img
          src="./../assets/icons/search.svg"
          alt="Search city image"
          class="search-city__image"
        >
      </button>
    </div>
    <div class="header__favorites favorites">
      <router-link to="/favorites" class="favorites__link">
        <img
          src="./../assets/icons/favorites.svg"
          alt="Favorites image"
          class="favorites__image"
        >
      </router-link>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  background-color: #212121;

  @media (max-width: 767px) {
    height: 60px;
  }

  @media (min-width: 768px) and (max-width: 1199px) {
    height: 80px;
  }

  @media (min-width: 1200px) {
    height: 120px;
  }
}

.logo {
  display: flex;
  align-items: center;

  @media (max-width: 767px) {
    margin-left: 10px;
  }

  @media (min-width: 768px) and (max-width: 1199px) {
    margin-left: 20px;
  }

  @media (min-width: 1200px) {
    margin-left: 40px;
  }

  &__link {
    @media (max-width: 767px) {
      width: 135px;
      height: 30px;
    }

    @media (min-width: 768px) and (max-width: 1199px) {
      width: 200px;
      height: 45px;
    }

    @media (min-width: 1200px) {
      width: 400px;
      height: 80px;
    }
  }

  &__image {
    width: 100%;
    height: 100%;
  }
}

.search-city {
  display: flex;
  align-items: center;
  position: relative;

  &__input {
    font-family: 'Rubik', sans-serif;
    border-radius: 50px;

    @media (max-width: 767px) {
      width: 155px;
      height: 30px;
      padding-left: 10px;
    }

    @media (min-width: 768px) and (max-width: 1199px) {
      width: 400px;
      height: 40px;
      font-size: 15px;
      padding-left: 15px;
    }

    @media (min-width: 1200px) {
      width: 500px;
      height: 50px;
      font-size: 20px;
      padding-left: 20px;
    }

    &:focus {
      outline: none;
    }
  }

  &__button {
    position: absolute;
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;

    @media (max-width: 767px) {
      right: 5px;
      width: 20px;
      height: 20px;
    }

    @media (min-width: 768px) and (max-width: 1199px) {
      right: 10px;
      width: 25px;
      height: 25px;
    }

    @media (min-width: 1200px) {
      right: 10px;
      width: 30px;
      height: 30px;
    }
  }

  &__image {
    width: 100%;
    height: 100%;
  }
}

.favorites {
  display: flex;
  align-items: center;

  @media (max-width: 767px) {
    margin-right: 10px;
  }

  @media (min-width: 768px) and (max-width: 1199px) {
    margin-right: 20px;
  }

  @media (min-width: 1200px) {
    margin-right: 40px;
  }

  &__link {
    @media (max-width: 767px) {
      height: 30px;
    }

    @media (min-width: 768px) and (max-width: 1199px) {
      height: 45px;
    }

    @media (min-width: 1200px) {
      height: 80px;
    }
  }

  &__image {
    width: 100%;
    height: 100%;
  }
}
</style>