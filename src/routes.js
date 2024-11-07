import VueRouter from 'vue-router';
import Home from './components/Home.vue';   
import Categories from './components/Categories.vue';   

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/categories/:id',
    name: 'categories',
    component: Categories,
    props: true,
  }
];

const router = new VueRouter({
  routes,
  mode: 'history', // Optional: removes the hash (#) from the URL
});

export default router;  // Export the VueRouter instance