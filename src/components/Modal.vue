<script>
import { useModalStore, useWeatherStore } from './../stores/pinia';
import { reactive, ref, watchEffect } from 'vue';

export default {
  setup() {
    const modalStore = useModalStore();
    const weatherStore = useWeatherStore();

    const cities = ref(weatherStore.cities);

    const modal = reactive({
      isOpen: modalStore.isModalOpen,
      text: modalStore.modalText,
    });

    const card = reactive({
      index: weatherStore.cardIndex,
      isBeingDeleted: weatherStore.cardIsBeingDeleted,
    });

    watchEffect(() => {
      cities.value = weatherStore.cities;
      modal.isOpen = modalStore.isModalOpen;
      modal.text = modalStore.modalText;
      card.index = weatherStore.cardIndex;
      card.isBeingDeleted = weatherStore.cardIsBeingDeleted;
    });

    const onConfirmDeletion = () => {
      cities.value.splice(card.index, 1);
      card.isBeingDeleted = false;
      modal.isOpen = false;
      modal.text = '';

      weatherStore.setCities(cities.value);
      weatherStore.setCardIsBeingDeleted(card.isBeingDeleted);
      modalStore.setIsModalOpen(modal.isOpen);
      modalStore.setModalText(modal.text);
    };

    const onCloseModal = () => {
      card.isBeingDeleted = false;
      modal.isOpen = false;
      modal.text = '';

      weatherStore.setCardIsBeingDeleted(card.isBeingDeleted);
      modalStore.setIsModalOpen(modal.isOpen);
      modalStore.setModalText(modal.text);
    };

    return {
      card,
      modal,
      onConfirmDeletion,
      onCloseModal,
    }
  }
}
</script>

<template>
  <div class="modal" v-if="modal.isOpen">
    <div class="modal__overlay">
      <div class="modal__window">
        <img
          @click="onCloseModal"
          src="./../assets/icons/close-modal.svg"
          alt="Close modal icon"
          class="modal__close-icon"
        >

        <div class="modal__content">
          <p class="modal__text">{{ modal.text }}</p>
          <div class="buttons" v-if="card.isBeingDeleted">
            <button class="buttons__cancel-button" @click="onCloseModal">
              Cancel
            </button>
            <button class="buttons__delete-button" @click="onConfirmDeletion">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './../utils/variables';

.modal {
  &__overlay {
    position: fixed;
    top: 0;
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
    max-width: 80%;
    padding: 20px;
    background-color: $window-color;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

    @media (min-width: $tablet-min-width) {
      padding: 25px;
    }
  }

  &__close-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 20px;
    cursor: pointer;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 30px;
    text-align: center;
    font-size: 18px;
    line-height: 1.5;
  }

  &__text {
    margin-right: 10px;
  }
}

.buttons {
  display: flex;
  justify-content: space-evenly;

  &__cancel-button {
    background-color: $cancel-button-bc;

    &:hover {
      background-color: $cancel-button-bc-hover;
    }
  }

  &__delete-button {
    background-color: $delete-button-bc;

    &:hover {
      background-color: $delete-button-bc-hover;
    }
  }

  &__cancel-button,
  &__delete-button {
    width: 100px;
    height: 40px;
    font-family: 'Rubik', sans-serif;
    font-size: 15px;
    color: $window-color;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    @media (min-width: $tablet-min-width) {
      width: 200px;
    }

    @media (min-width: $desktop-min-width) {
      width: 270px;
      height: 35px;
    }
  }
}
</style>