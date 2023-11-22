<script>
import { useModalStore, useWeatherStore } from './../stores/pinia';
import { ref, watchEffect } from 'vue';

export default {
  setup() {
    const modalStore = useModalStore();
    const weatherStore = useWeatherStore();

    const isModalOpen = ref(modalStore.isModalOpen);
    const modalText = ref(modalStore.modalText);
    const citiesWeather = ref(weatherStore.citiesWeather);
    const cardIndex = ref(weatherStore.cardIndex);
    const cardIsBeingDeleted = ref(weatherStore.cardIsBeingDeleted);

    watchEffect(() => {
      isModalOpen.value = modalStore.isModalOpen;
      modalText.value = modalStore.modalText;
      citiesWeather.value = weatherStore.citiesWeather;
      cardIndex.value = weatherStore.cardIndex;
      cardIsBeingDeleted.value = weatherStore.cardIsBeingDeleted;
    });

    const onConfirmDeletion = () => {
      citiesWeather.value.splice(cardIndex.value, 1);
      cardIsBeingDeleted.value = false;
      isModalOpen.value = false;
      modalText.value = '';

      weatherStore.setCitiesWeather(citiesWeather.value);
      weatherStore.setCardIsBeingDeleted(cardIsBeingDeleted.value);
      modalStore.setIsModalOpen(isModalOpen.value);
      modalStore.setModalText(modalText.value);
    }

    const onCloseModal = () => {
      cardIsBeingDeleted.value = false;
      isModalOpen.value = false;
      modalText.value = '';

      weatherStore.setCardIsBeingDeleted(cardIsBeingDeleted.value);
      modalStore.setIsModalOpen(isModalOpen.value);
      modalStore.setModalText(modalText.value);
    }

    return {
      cardIsBeingDeleted,
      isModalOpen,
      modalText,
      onConfirmDeletion,
      onCloseModal,
    }
  }
}
</script>

<template>
  <div class="modal" v-if="isModalOpen">
    <div class="modal__overlay">
      <div class="modal__window">
        <button class="modal__close-button close-button" @click="onCloseModal">
          <img
            src="./../assets/icons/delete.svg" 
            alt="Close modal image" 
            class="close-button__image"
          >
        </button>
        <div class="modal__content">
          <p>{{ modalText }}</p>
          <div class="modal__buttons buttons" v-if="cardIsBeingDeleted">
            <button class="buttons__delete-button" @click="onConfirmDeletion">Delete</button>
            <button class="buttons__cancel-button" @click="onCloseModal">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal {
  &__overlay {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }

  &__window {
    position: relative;
    padding: 30px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

    @media (max-width: 767px) {
      max-width: 80%;
    }

    @media (min-width: 768px) {
      max-width: 50%;
    }
  }

  &__content {
    text-align: center;
    font-size: 18px;
    line-height: 1.5;
  }
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  height: 25px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;

  &__image {
    width: 25px;
    height: 25px;
  }
}

.buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 30px;

  &__delete-button,
  &__cancel-button {
    font-family: 'Rubik', sans-serif;
    font-size: 17px;
    border: none;
    border-radius: 10px;
    background-color: #3498db;
    cursor: pointer;
    transition: background-color 0.3s ease;

    @media (max-width: 767px) {
      width: 100px;
      height: 40px;
    }

    @media (min-width: 768px) and (max-width: 1199px) {
      width: 120px;
      height: 40px;
    }

    @media (min-width: 1200px) {
      width: 200px;
      height: 40px;
    }

    &:hover {
      background-color: #5da9e9;
    }
  }
}
</style>