<script>
import Header from './../components/Header.vue';
import WeatherInfo from './../components/WeatherInfo.vue';
import WeatherCard from './../components/WeatherCard.vue';
import Modal from './../components/Modal.vue';

export default {
  components: {
    Header,
    WeatherInfo,
    WeatherCard,
    Modal,
  },
};
</script>

<template>
  <Header />
  <WeatherInfo />
  <WeatherCard />
  <Modal />
</template>