import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import routes from './router'
import { makeServer } from './server'

Vue.config.productionTip = false

Vue.use(VueRouter);

Vue.prototype.API_URL = process.env.VUE_APP_API_URL;
Vue.prototype.APP_DOMAIN = process.env.VUE_APP_DOMAIN;

if (process.env.NODE_ENV === "development") {
  makeServer();
  Vue.prototype.APP_DOMAIN = '';
}

const router = new VueRouter({
  routes
});


new Vue({
  render: h => h(App),
  router
}).$mount('#app')
