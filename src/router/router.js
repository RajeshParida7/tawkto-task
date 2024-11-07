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
    path: '/cat',
    name: 'categories',
    component: Categories
  }
];

const router = new VueRouter({
  routes,
  mode: 'history',
});

export default router;  
