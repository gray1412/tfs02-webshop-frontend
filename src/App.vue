<template>
	<div>
		<TopBar />
		<Navbar />

		<router-view />

		<Footer />
		<LoginModal />
	</div>
</template>

<script>
import TopBar from "./components/TopBar.vue";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import LoginModal from "./components/LoginModal.vue";

import { mapActions } from "vuex";

import "./assets/main.css";

export default {
	name: "App",
	components: {
		TopBar,
		Navbar,
		Footer,
		LoginModal,
	},
	created() {
		// Check cart status on app load
		const localCart = JSON.parse(localStorage.getItem("cart"));
		if (localCart) {
			this.SET_CART(localCart); // Set the cart state
		}

		// this.GET_HOME_PRODUCTS();

		// Check login status
		const token = localStorage.getItem("token");
		if (token) {
			this.SET_LOGIN(true);
		}
	},

	methods: {
		...mapActions(["SET_LOGIN", "SET_CART"]),
	},
};
</script>
