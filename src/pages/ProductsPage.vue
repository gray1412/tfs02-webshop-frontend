<template>
	<b-container>
		<div class="header d-flex justify-content-between py-3">
			<b-breadcrumb class="my-2">
				<b-breadcrumb-item>
					<router-link to="/">Home</router-link>
				</b-breadcrumb-item>
				<b-breadcrumb-item active>{{ this.catOrDog }}</b-breadcrumb-item>

				<b-breadcrumb-item v-if="getPage" active
					>Page {{ getPage }}</b-breadcrumb-item
				>
			</b-breadcrumb>

			<div>
				<b-form-select
					class="my-2"
					v-model="selected"
					:options="options"
					@change="handleSort"
				></b-form-select>
			</div>
		</div>

		<div class="main-wrapper d-flex">
			<!-- Sidebar -->
			<div class="sidebar mx-3 p-2">
				<div class="sidebar-header">Filter</div>
				<div v-if="filter" class="p-2 text-center">
					Active filter: {{ filter }}
				</div>
				<ul class="sidebar-content shadow rounded p-2 text-center">
					<li
						class="m-2"
						v-for="brand in brands"
						:key="brand.id"
						@click="handleFilter(brand.name)"
					>
						{{ brand.name }}
					</li>
					<b-button @click="removeFilter" class="remove-btn my-2"
						>Remove Filter</b-button
					>
				</ul>
			</div>
			<!-- End of Sidebar -->

			<div class="product-container">
				<div class="product-grid" v-if="this.catOrDog == 'Dogs'">
					<Product
						v-for="product in dogs.products"
						:key="product.alias"
						:product="product"
					/>
				</div>

				<div class="product-grid" v-if="this.catOrDog == 'Cats'">
					<Product
						v-for="product in cats.products"
						:key="product.alias"
						:product="product"
					/>
				</div>

				<!-- Pagination -->
				<div class="pagination-wrapper mt-5">
					<b-pagination
						pills
						size="lg"
						align="center"
						v-model="currentPage"
						:total-rows="getTotal"
						:per-page="getPageSize"
						@change="changePage"
					></b-pagination>
					<!-- End Pagination -->
				</div>
			</div>
		</div>
	</b-container>
</template>

<script>
import Product from "../components/ProductCard.vue";
import { mapState, mapActions } from "vuex";
import axios from "axios";

export default {
	name: "Products",
	components: {
		Product,
	},

	async created() {
		this.getItems();

		const res = await axios({
			url: "http://localhost:8081/api/brands",
		});

		this.brands = res.data.data.slice(1, res.data.data.length);

		this.selected = this.getSort;
		this.currentPage = this.getPage;
		this.filter = this.getFilter;
	},
	// mounted() {
	// 	this.currentPage = this.getPage;
	// },

	data() {
		return {
			selected: null,
			options: [
				{ value: null, text: "Default sorting" },
				{ value: "asc", text: "Price: From low to high" },
				{ value: "desc", text: "Price: From high to low" },
			],
			brands: [],
			filter: null,
			currentPage: 1,
		};
	},

	computed: {
		...mapState({
			dogs: (state) => state.products.dogs,
			cats: (state) => state.products.cats,
		}),
		getPage() {
			return this.$route.query.page ? this.$route.query.page : 1;
		},
		catOrDog() {
			return this.$route.name;
		},
		getTotal() {
			return this.catOrDog == "Dogs"
				? this.dogs.total_elements
				: this.cats.total_elements;
		},
		getPageSize() {
			return this.catOrDog == "Dogs"
				? this.dogs.page_size
				: this.cats.page_size;
		},
		getSort() {
			return this.$route.query.sort ? this.$route.query.sort : null;
		},
		getFilter() {
			return this.$route.query.filter ? this.$route.query.filter : null;
		},
	},

	watch: {
		$route(to, from) {
			this.selected = this.getSort;
			this.currentPage = this.getPage;
			this.filter = this.getFilter;

			console.log("route changed");

			if (to.name != from.name) {
				this.currentPage = 1;
			}
			this.getItems();
		},
	},

	methods: {
		...mapActions(["GET_PRODUCTS"]),

		getItems() {
			const category = this.catOrDog == "Dogs" ? "dog" : "cat";

			let url = `http://localhost:8081/api/products?category=${category}&page=${this.getPage}&limit=8`;

			if (this.$route.query.sort) {
				url += `&sort=price&order=${this.$route.query.sort}`;
			}

			if (this.$route.query.filter) {
				url += `&brand=${this.$route.query.filter}`;
			}

			const payload = {
				url,
				category: this.catOrDog.toLowerCase(),
			};
			this.GET_PRODUCTS(payload);
		},

		changePage(e) {
			this.$router.push({
				path: this.$route.path,
				query: Object.assign({}, this.$route.query, { page: e }),
			});
		},

		handleSort() {
			// console.log(this.selected);
			if (!this.selected) {
				let query = Object.assign({}, this.$route.query);
				delete query.sort;
				this.$router.push({ query });
				return;
			}

			if (this.filter) {
				this.$router.push({
					path: this.$route.path,
					query: Object.assign({}, this.$route.query, { sort: this.selected }),
				});
				return;
			}

			this.$router.push({
				path: this.$route.path,
				query: { sort: this.selected },
			});
		},

		handleFilter(brand) {
			if (brand == this.getFilter) {
				return;
			}
			this.filter = brand;

			if (this.selected) {
				this.$router.push({
					path: this.$route.path,
					query: Object.assign({}, this.$route.query, { filter: brand }),
				});
				return;
			}

			this.$router.push({
				path: this.$route.path,
				query: { filter: brand },
			});
		},

		removeFilter() {
			if (!this.filter) {
				return;
			}
			this.filter = null;
			let query = Object.assign({}, this.$route.query);
			delete query.filter;
			delete query.page;
			this.$router.push({ query });
		},
	},
};
</script>

<style lang="scss">
.header {
	ol {
		margin: 0;
	}
	@media (max-width: 575px) {
		flex-direction: column;
		align-items: center;
	}
}

.main-wrapper {
	@media (max-width: 768px) {
		flex-direction: column;
		align-items: center;
	}

	.sidebar {
		width: 20%;
		min-width: 250px;
		margin: 10px 0;
		@media (max-width: 768px) {
			width: 70%;
		}

		.sidebar-header {
			width: 100%;
			background-color: var(--mainColor);
			color: white;
			text-align: center;
			height: 40px;
			line-height: 40px;
			@media (max-width: 768px) {
				height: 35px;
				line-height: 35px;
			}
		}

		.sidebar-content {
			list-style-type: none;
			li {
				cursor: pointer;

				&:hover {
					color: var(--mainColor);
				}
			}

			.remove-btn {
				font-size: 0.9rem;
			}
		}
	}

	.product-container {
		width: 100%;

		.product-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
			grid-gap: 1rem;
			margin: 10px 0;
		}

		.pagination-wrapper {
			.page-link {
				color: var(--mainColor);
			}
			.page-item.active .page-link {
				color: white;
				background-color: var(--mainColor);
				border: none;
			}
			.page-item.disabled .page-link {
				color: #6c757d;
			}
		}
	}
}
</style>
