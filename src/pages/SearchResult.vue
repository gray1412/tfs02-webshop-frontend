<template>
	<b-container>
		<div class="header d-flex justify-content-between py-3">
			<b-breadcrumb class="my-2">
				<b-breadcrumb-item>
					<router-link to="/">Home</router-link>
				</b-breadcrumb-item>
				<b-breadcrumb-item active>Search</b-breadcrumb-item>
			</b-breadcrumb>

			<!-- <div>
				<b-form-select
					class="my-2"
					v-model="selected"
					:options="options"
					@change="handleSort"
				></b-form-select>
			</div> -->
		</div>

		<div class="main-wrapper d-flex">
			<!-- Sidebar -->
			<!-- <div class="sidebar mx-3 p-2">
				<div class="sidebar-header">Category</div>
				<ul class="sidebar-content shadow rounded p-2 text-center">
					<li class="m-2">Dogs</li>
					<li class="m-2">Cats</li>
					<b-button @click="removeFilter" class="remove-btn my-2"
						>Remove Filter</b-button
					>
				</ul>
			</div> -->
			<!-- End of Sidebar -->

			<div class="product-container">
				<!-- <h1 v-else>Showing {{ results.total_elements }} results!</h1> -->
				<div class="product-grid" v-if="this.results">
					<Product
						v-for="product in results.products"
						:key="product.alias"
						:product="product"
					/>
				</div>
				<h1 class="text-center" v-else>No results to show!</h1>
				<!-- Pagination -->
				<!-- <div class="pagination-wrapper mt-5" v-if="this.results">
					<b-pagination
						pills
						size="lg"
						align="center"
						v-model="currentPage"
						:total-rows="getTotal"
						:per-page="getPageSize"
						@change="changePage"
					></b-pagination> -->
				<!-- </div> -->
				<!-- End Pagination -->
			</div>
		</div>
	</b-container>
</template>

<script>
import Product from "../components/ProductCard.vue";
// import axios from "axios";
import { mapState, mapActions } from "vuex";

export default {
	name: "Search",
	components: {
		Product,
	},

	created() {
		this.searchTerm = this.getSearchTerm;

		this.getItems();

		console.log(this.results);

		// this.selected = this.getSort;
		// this.filter = this.getFilter;
		// this.currentPage = this.getPage;
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
			// currentPage: 1,
			// filter: null,
			searchTerm: "",
		};
	},
	computed: {
		...mapState({
			results: (state) => state.products.results,
		}),
		getSearchTerm() {
			return encodeURIComponent(this.$route.query.s);
		},
		// getPage() {
		// 	return this.$route.query.page ? this.$route.query.page : 1;
		// },
		// getSort() {
		// 	return this.$route.query.sort ? this.$route.query.sort : null;
		// },
		// getTotal() {
		// 	return this.results.total_elements;
		// },
		// getPageSize() {
		// 	return this.results.page_size;
		// },
		// getFilter() {
		// 	return this.$route.query.filter ? this.$route.query.filter : null;
		// },
	},

	methods: {
		...mapActions(["SEARCH_PRODUCTS"]),
		getItems() {
			let url = `http://localhost:8081/api/products?name=${this.searchTerm}&limit=99`;

			// if (this.$route.query.sort) {
			// 	url += `&sort=price&order=${this.$route.query.sort}`;
			// }

			// if (this.$route.query.filter) {
			// 	url += `&category=${this.$route.query.filter}`;
			// }

			this.SEARCH_PRODUCTS(url);
		},

		// changePage(e) {
		// 	this.$router.push({
		// 		path: this.$route.path,
		// 		query: Object.assign({}, this.$route.query, { page: e }),
		// 	});
		// 	this.getItems();
		// },

		// handleSort() {
		// 	// console.log(this.selected);
		// 	if (!this.selected) {
		// 		let query = Object.assign({}, this.$route.query);
		// 		delete query.sort;
		// 		this.$router.push({ query });
		// 		return;
		// 	}

		// 	if (this.filter) {
		// 		this.$router.push({
		// 			path: this.$route.path,
		// 			query: Object.assign({}, this.$route.query, { sort: this.selected }),
		// 		});
		// 		return;
		// 	}

		// 	this.$router.push({
		// 		path: this.$route.path,
		// 		query: { sort: this.selected },
		// 	});
		// },

		// handleFilter(filter) {
		// 	if (filter == this.getFilter) {
		// 		return;
		// 	}
		// 	this.filter = filter;

		// 	if (this.selected) {
		// 		this.$router.push({
		// 			path: this.$route.path,
		// 			query: Object.assign({}, this.$route.query, { filter: filter }),
		// 		});
		// 		return;
		// 	}

		// 	this.$router.push({
		// 		path: this.$route.path,
		// 		query: { filter: filter },
		// 	});
		// },

		// removeFilter() {
		// 	if (!this.filter) {
		// 		return;
		// 	}
		// 	this.filter = null;
		// 	let query = Object.assign({}, this.$route.query);
		// 	delete query.filter;
		// 	delete query.page;
		// 	this.$router.push({ query });
		// },
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
