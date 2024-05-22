<script>
import { ref, onMounted, watchEffect, reactive } from 'vue';
import { useWeatherStore, useModalStore, useLoaderStore } from './../stores/pinia';
import { getCityCoordinates, getWeatherInfo } from './../api';

export default {
  setup() {
    const weatherStore = useWeatherStore();
    const modalStore = useModalStore();
    const loaderStore = useLoaderStore();

    const weatherInfo = ref({});
    const cities = ref([]);
    const isLoadingCard = ref(false);

    const city = reactive({
      name: 'Lviv',
      latitude: 0,
      longitude: 0,
    });

    const modal = reactive({
      isOpen: false,
      text: '',
    });

    const isTheCityInTheList = (currentWeatherInfo) => {
      return cities.value
        .some(cityWeather => cityWeather.name === currentWeatherInfo.name);
    };

    const getDefaultCity = async () => {
      if ('geolocation' in navigator) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          city.latitude = position.coords.latitude;
          city.longitude = position.coords.longitude;
          isLoadingCard.value = true;

          loaderStore.setIsLoadingCard(isLoadingCard.value);

          await getWeatherInfo(city.latitude, city.longitude)
            .then(response => {
              weatherInfo.value = response.data;
              city.name = weatherInfo.value.name;

              if (!isTheCityInTheList(weatherInfo.value)) {
                cities.value.push(weatherInfo.value);
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

          await getCityCoordinates(city.name)
            .then(response => {
              city.latitude = response.data[0].lat;
              city.longitude = response.data[0].lon;
            })
            .catch(error => {
              console.error(error);
            })

          isLoadingCard.value = true;
          loaderStore.setIsLoadingCard(isLoadingCard.value);

          await getWeatherInfo(city.latitude, city.longitude)
            .then(response => {
              weatherInfo.value = response.data;

              if (!isTheCityInTheList(weatherInfo.value)) {
                cities.value.push(weatherInfo.value);
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

        weatherStore.setCityName(city.name);
        weatherStore.setWeatherInfo(weatherInfo.value);
        weatherStore.setCities(cities.value);

        city.name = '';
      }
    };

    watchEffect(() => {
      cities.value = weatherStore.cities;
      modal.isOpen = modalStore.isModalOpen;
      modal.text = modalStore.modalText;
    });

    const onSearchCity = async () => {
      await getCityCoordinates(city.name)
        .then(response => {
          city.latitude = response.data[0].lat;
          city.longitude = response.data[0].lon;
        })
        .catch(error => {
          console.error(error);
        })

      isLoadingCard.value = true;
      loaderStore.setIsLoadingCard(isLoadingCard.value);

      await getWeatherInfo(city.latitude, city.longitude)
        .then(response => {
          weatherInfo.value = response.data;

          if (cities.value.length < 5) {
            if (!isTheCityInTheList(weatherInfo.value)) {
              cities.value.push(weatherInfo.value);
            } else {
              modal.isOpen = true;
              modal.text = 'You cannot add a card with this city name because such a card already exists in your list. Try entering a different city name.';
            }
          } else {
            modal.isOpen = true;
            modal.text = 'The maximum number of weather cards with different cities that you can add is 5. You can remove a card from the list and add a new one.';
          }
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          isLoadingCard.value = false;
          loaderStore.setIsLoadingCard(isLoadingCard.value);
        })

      weatherStore.setCityName(city.name);
      city.name = '';

      weatherStore.setWeatherInfo(weatherInfo.value);
      weatherStore.setCities(cities.value);
      modalStore.setIsModalOpen(modal.isOpen);
      modalStore.setModalText(modal.text);
    };

    onMounted(() => {
      getDefaultCity();
    });

    return {
      city,
      onSearchCity,
    };
  }
}
</script>

<template>
  <header class="header">
    <div class="header__content">
      <div class="logo">
        <router-link to="/" class="logo__link">
          <img src="./../assets/icons/logo.png" alt="Logo image" class="logo__image">
        </router-link>
      </div>

      <slot name="search-city" :city="city" :onSearchCity="onSearchCity"></slot>

      <div class="favorites">
        <router-link to="/favorites" class="favorites__link">
          <img src="./../assets/icons/favorites.svg" alt="Favorites image" class="favorites__image">
        </router-link>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@import './../utils/variables';

.header {
  background-color: $header-bc;
  padding: 15px 10px;

  @media (min-width: $tablet-min-width) {
    padding: 15px 20px;
  }

  @media (min-width: $desktop-min-width) {
    padding: 20px 40px;
  }

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.logo {
  display: flex;
  align-items: center;

  &__link {
    width: 135px;
    height: 30px;

    @media (min-width: $tablet-min-width) {
      width: 200px;
      height: 50px;
    }

    @media (min-width: $desktop-min-width) {
      width: 400px;
      height: 80px;
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

  &__link {
    height: 30px;

    @media (min-width: $tablet-min-width) {
      height: 50px;
    }

    @media (min-width: $desktop-min-width) {
      height: 80px;
    }
  }

  &__image {
    width: 100%;
    height: 100%;
  }
}
</style>