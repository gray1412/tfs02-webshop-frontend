<template>
	<div>
		<HeroBanner />
		<b-container>
			<div class="py-3">
				<div class="d-flex align-items-center justify-content-between">
					<h2>New for Dogs</h2>
					<router-link to="/dogs"> See all »</router-link>
				</div>
				<div class="product-container ">
					<Product
						v-for="product in dogs.products"
						:key="product.id"
						:product="product"
					/>
				</div>
			</div>
			<hr />
			<div class="py-3">
				<div class="d-flex align-items-center justify-content-between">
					<h2>New for Cats</h2>
					<router-link to="/cats"> See all »</router-link>
				</div>
				<div class="product-container ">
					<Product
						v-for="product in cats.products"
						:key="product.id"
						:product="product"
					/>
				</div>
			</div>
		</b-container>
	</div>
</template>

<script>
import HeroBanner from "../components/HeroBanner.vue";
import Product from "../components/ProductCard.vue";
import { mapState, mapActions } from "vuex";

// import axios from "axios";

export default {
	components: {
		HeroBanner,
		Product,
	},
	created() {
		this.GET_HOME_PRODUCTS();
	},
	computed: mapState({
		cats: (state) => state.products.cats,
		dogs: (state) => state.products.dogs,
	}),
	methods: {
		...mapActions(["GET_HOME_PRODUCTS"]),
	},
};
</script>

<style scoped>
.product-container {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	grid-gap: 1rem;
}
</style>
