<template>
  <header class="favorites-header">
    <div class="favorites-header__logo logo">
      <router-link to="/" class="logo__link">
        <img
          src="./../assets/icons/logo.png"
          alt="Logo image"
          class="logo__image"
        >
      </router-link>
    </div>
    <div class="favorites-header__favorites favorites">
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

.favorites-header {
  display: flex;
  justify-content: space-around;
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