import Vue from "vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import Toasted from "vue-toasted";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.use(IconsPlugin);
Vue.use(BootstrapVue);
Vue.use(Toasted);

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app");
