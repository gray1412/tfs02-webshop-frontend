<template>
	<div class="topbar d-flex align-items-center">
		<b-container
			class="d-flex align-items-center justify-content-between topbar-inner"
		>
			<div class="search-wrapper d-flex align-items-center d-none d-sm-flex">
				<b-form class="search-form" @submit.prevent="handleSearch">
					<b-form-input
						class="search text-center"
						size="sm"
						placeholder="What do you want to find?"
						v-model="searchTerm"
					/>
				</b-form>
				<b-icon icon="search" />
			</div>
			<div class="login-cart-wrapper d-flex justify-content-between ">
				<div @click="handleClickCart" class="cart-wrapper">
					Cart
					<b-icon icon="cart-fill" variant="light" />
					<span v-if="this.cart.length > 0" id="badge">{{
						this.cart.length
					}}</span>

					<!-- Cart dropdown -->
					<div class="shopping-cart" v-if="isDropdown">
						<div class="shopping-cart-header d-flex justify-content-between">
							<router-link to="/cart">VIEW CART</router-link>
							<span>{{
								this.cart.length > 0
									? `Total: $${this.GET_CART_TOTAL}`
									: "No items in cart!"
							}}</span>
						</div>

						<ul>
							<li v-for="item in this.cart" :key="item.variant.id">
								<div class="cart-item-outer">
									<img :src="item.image" />
									<div
										class="cart-item-inner d-flex flex-column justify-content-evenly"
									>
										<div>{{ item.name }}</div>
										<div class="d-flex justify-content-between">
											<span>Quantity: {{ item.quantity }}</span>
											<span>Price: ${{ item.variant.price }}</span>
										</div>
									</div>
								</div>
							</li>
						</ul>
					</div>
					<!--end dropdown -->
				</div>

				<div
					@click="loginStatus ? handleLogout() : showLoginModal()"
					class="topbar-login d-none d-sm-flex"
				>
					{{ loginStatus ? "Logout" : "Login" }}
				</div>
			</div>
		</b-container>
	</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
	name: "TopBar",
	created() {
		window.addEventListener("click", this.close);
	},
	beforeDestroy() {
		window.removeEventListener("click", this.close);
	},
	computed: {
		...mapState({
			loginStatus: (state) => state.login.status,
			cart: (state) => state.cart.items,
		}),
		...mapGetters(["GET_CART_TOTAL"]),
	},
	data() {
		return {
			isDropdown: false,
			searchTerm: "",
		};
	},

	methods: {
		...mapActions(["SET_LOGIN", "SEARCH_PRODUCTS"]),
		showLoginModal() {
			this.$bvModal.show("login-modal");
			this.isDropdown = false;
		},
		handleLogout() {
			if (confirm("Are you sure?")) {
				localStorage.removeItem("token");
				this.SET_LOGIN(false);
			}
		},
		handleClickCart() {
			console.log("cart clicked", this.cart);
			this.toggleDropdown();
		},
		toggleDropdown() {
			this.isDropdown = !this.isDropdown;
		},

		close(e) {
			if (!this.$el.contains(e.target)) {
				this.isDropdown = false;
			}
		},

		handleSearch() {
			if (!this.searchTerm) {
				return;
			}
			console.log(encodeURIComponent(this.searchTerm));
			this.SEARCH_PRODUCTS(
				`http://localhost:8081/api/products?name=${this.searchTerm}`
			);
			this.$router.push({ path: "/search", query: { s: this.searchTerm } });
			this.searchTerm = "";
		},
	},
};
</script>

<style lang="scss" scoped>
.topbar {
	height: 50px;
	background-color: var(--mainColor);
	color: white;

	// Disable text highlight
	user-select: none;

	.topbar-login {
		padding-left: 15px;
		border-left: 1px white solid;
		cursor: pointer;
	}

	.cart-wrapper {
		position: relative;
		cursor: pointer;
		padding-right: 15px;
		#badge {
			display: inline-block;
			position: absolute;
			border-radius: 50%;
			background-color: red;
			width: 15px;
			height: 15px;
			right: 6px;
			bottom: 9px;
			text-align: center;
			font-size: 0.6rem;
			font-weight: bold;
		}
	}

	.search-wrapper {
		width: 35%;
		min-width: 250px;
		.search-form {
			width: 100%;
		}
	}

	.b-icon[aria-label="search"] {
		position: relative;
		right: 25px;
		color: var(--mainColor);
	}

	@media (max-width: 575px) {
		.topbar-inner,
		.login-cart-wrapper {
			justify-content: flex-end !important;
		}
	}
}

.modal-login-button {
	background-color: var(--mainColor);
	border: var(--mainColor);
}
.modal-footer-inner {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
	opacity: 0;
}

.shopping-cart {
	position: absolute;
	right: -13px;
	top: 50px;
	background: var(--mainColor);
	z-index: 9999;
	max-width: 320px;

	width: 50vw;
	border-radius: 5px;
	padding: 10px;
	transition: all 0.5s;

	&:after {
		content: "";
		bottom: 100%;
		left: 89%;
		border: solid transparent;
		position: absolute;
		pointer-events: none;
		border-bottom-color: var(--mainColor);
		border-width: 8px;
		margin-left: -8px;
	}

	.shopping-cart-header {
		border-bottom: 1px solid #e8e8e8;
		padding-bottom: 15px;

		.shopping-cart-total {
			text-align: right;
		}
	}

	@media (max-width: 575px) {
		right: -7px;
	}

	img {
		padding: 10px;
		display: block;
		margin: auto;
		max-height: 100%;
		max-width: 100%;
	}

	ul {
		max-height: 500px;
		overflow: auto;
		padding: 10px;
		list-style-type: none;
		font-size: 0.8rem;

		.cart-item-outer {
			display: grid;
			grid-template-columns: 1fr 2fr;

			.cart-item-inner {
				padding: 10px;
			}
		}
	}
}
</style>
