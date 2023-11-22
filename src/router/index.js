import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Favorites from '../views/Favorites.vue';

const routes = [
  { path: "/", component: Home },
  { path: "/favorites", component: Favorites },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
