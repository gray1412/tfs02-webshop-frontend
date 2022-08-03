<template>
	<b-container>
		<b-breadcrumb class="my-2 py-3">
			<b-breadcrumb-item>
				<router-link to="/">Home</router-link>
			</b-breadcrumb-item>
			<b-breadcrumb-item active>Shopping Cart</b-breadcrumb-item>
		</b-breadcrumb>

		<div v-if="this.cart.length > 0" class="d-flex my-3 main-wrapper">
			<table class="cart-products mx-2">
				<thead class="head">
					<tr>
						<th colspan="3">
							<div>Product</div>
						</th>
						<th>
							<div>Price</div>
						</th>
						<th>
							<div>Quantity</div>
						</th>
						<th colspan="2">
							<div>Total</div>
						</th>
					</tr>
				</thead>
				<tbody>
					<CartItem
						v-for="item in this.cart"
						:key="item.variant.id"
						:item="item"
						@plus="plus"
						@minus="minus"
						@remove="remove"
					/>
				</tbody>
			</table>
			<div class="cart-total">
				<div class="p-2">
					<div class="head">
						<h4>Cart Totals</h4>
					</div>
					<div class="summary p-3">
						<div class="d-flex justify-content-between">
							<p>Subtotal:</p>
							<p class="bold">${{ this.GET_CART_TOTAL }}</p>
						</div>
						<div v-if="discount > 0" class="d-flex justify-content-between">
							<p>Discount:</p>
							<p>- ${{ discount }}</p>
						</div>
						<div class="d-flex justify-content-between">
							<p>Total:</p>
							<p class="bold">${{ total }}</p>
						</div>
					</div>
					<button type="button" class="btn btn-danger" @click="checkCart">
						PROCEED TO CHECKOUT
					</button>
				</div>

				<div class="p-2">
					<div class="head">
						<h5>Coupon</h5>
					</div>
					<b-form-input
						class="input"
						type="text"
						placeholder="Enter coupon code"
						v-model="vouchercode"
					>
					</b-form-input>
					<ErrorMessage :message="this.error.message" />
					<button
						@click="checkVoucher"
						type="button"
						class="btn btn-outline-secondary"
					>
						Apply coupon
					</button>
				</div>
			</div>
		</div>
		<div class="my-3 text-center" v-else>
			<h1>You have no items in cart, please buy something..</h1>
			<div class="my-3">
				<router-link to="/">Return home</router-link>
			</div>
		</div>
	</b-container>
</template>

<script>
import CartItem from "./CartItem.vue";
import ErrorMessage from "./ErrorMessage.vue";
import { mapState, mapActions, mapGetters } from "vuex";
import axios from "axios";
export default {
	name: "Cart",
	components: {
		CartItem,
		ErrorMessage,
	},
	computed: {
		...mapState({
			cart: (state) => state.cart.items,
		}),
		...mapGetters(["GET_CART_TOTAL"]),

		total() {
			let sum = this.GET_CART_TOTAL - this.discount;
			if (sum < 0) return 0;
			return sum;
		},
	},
	data() {
		return {
			vouchercode: "",
			finalCode: "",
			discount: 0,
			error: {
				message: "",
			},
		};
	},
	methods: {
		...mapActions(["ADD_QUANTITY", "REMOVE_ITEM", "SET_LOGIN", "REMOVE_CART"]),
		async checkCart() {
			// ktra gio hang
			let cart = {};
			try {
				cart = JSON.parse(localStorage.getItem("cart"));
				if (cart == null) {
					alert("Cart is empty, please add product to cart...");
					return;
				}
			} catch (error) {
				localStorage.removeItem("cart");
				this.REMOVE_CART();
				alert("Cart Shopping cart has been changed");
				return;
			}

			//lấy token từ local, ktra
			const token = localStorage.getItem("token");
			if (token == null) {
				this.SET_LOGIN(false);
				alert("Please login to purchase...");
				return;
			}
			// goi api
			try {
				const res = await axios({
					method: "POST",
					url: "http://localhost:8081/api/orders/cart",
					data: {
						total: this.GET_CART_TOTAL,
						discount_amount: this.discount,
						total_bill: this.total,
						voucher_code: this.finalCode,
						cart: cart,
					},
					headers: {
						"Access-Control-Allow-Origin": "*",
						Authorization: "Bearer " + token,
					},
				});
				let cartTotal = {
					subtotal: this.GET_CART_TOTAL,
					total: this.total,
					discount: this.discount,
					vouchercode: this.finalCode,
				};
				//mã hóa state sử dụng base64 và endcode url
				let state = btoa(JSON.stringify(cartTotal));
				state = encodeURI(state);
				if (res.data.success == 1) {
					this.$router.push(`/checkout?state=${state}`);
				}
			} catch (err) {
				if (err.response.status == 401) {
					this.SET_LOGIN(false);
					alert("Login session expired, please login again");
					return;
				}
				const data = err.response.data;
				switch (data.message) {
					case "voucher_not_exists":
						this.discount = 0;
						this.vouchercode = "";
						this.finalCode = "";
						alert("voucher not exists");
						break;
					case "voucher_expired":
						this.discount = 0;
						this.vouchercode = "";
						this.finalCode = "";
						alert("voucher_expired");
						break;
					case "error_product_changed":
						this.discount = 0;
						this.vouchercode = "";
						this.finalCode = "";
						//xóa sản phẩm khỏi giỏ hàng
						this.remove(data.data);
						alert("Shopping cart has been changed");
						break;
					case "invalid_calculate_total":
						this.discount = 0;
						this.vouchercode = "";
						this.finalCode = "";
						alert("Invalid Calculate Total");
						break;
					default:
						alert("Bad request");
						break;
				}
			}
			//set data
		},
		async checkVoucher() {
			if (this.vouchercode == "") {
				this.error.message = "Please enter code";
				return;
			}
			try {
				const { data } = await axios({
					url: `http://localhost:8081/api/orders/voucher/${this.vouchercode}`,
				});
				this.error.message = data.message;
				if (data.success == 1) {
					this.finalCode = data.data.code;
					let sale = data.data.discount;
					let unit = data.data.unit;
					let maxSaleAmount = data.data.max_sale_amount;
					switch (unit) {
						case "percent":
							this.discount = (this.GET_CART_TOTAL * sale) / 100;
							if (this.discount > maxSaleAmount) {
								this.discount = maxSaleAmount;
							}
							break;
						default:
							this.discount = sale;
					}
				}
			} catch (error) {
				this.error.message = error.response.data.message;
			}
		},
		plus(i) {
			// const item = this.cart.find((item) => item.variant.id === i.variant.id);
			let index = this.cart.indexOf(i);
			let quantity = i.quantity + 1;
			if (quantity >= i.stock) {
				quantity = i.stock;
			}
			const payload = {
				index: index,
				quantity: quantity,
			};

			this.ADD_QUANTITY(payload);
			localStorage.setItem("cart", JSON.stringify(this.cart));
		},
		minus(i) {
			let index = this.cart.indexOf(i);
			let quantity = i.quantity - 1;
			if (quantity < 1) {
				quantity = 1;
			}
			const payload = {
				index: index,
				quantity: quantity,
			};
			this.ADD_QUANTITY(payload);
			localStorage.setItem("cart", JSON.stringify(this.cart));
		},
		remove(i) {
			const index = this.cart.indexOf(i);
			const payload = {
				index: index,
			};
			this.REMOVE_ITEM(payload);
			localStorage.setItem("cart", JSON.stringify(this.cart));
		},
	},
};
</script>

<style lang="scss" scoped>
.main-wrapper {
	@media (max-width: 992px) {
		flex-direction: column;
		.cart-products {
			width: 100%;
		}
		.cart-total {
			width: 100%;
			border: none;
			/* border-top: 1px solid rgb(212, 212, 212); */
			h4 {
				text-align: left;
				margin-top: 20px;
			}
		}
	}
}
th {
	padding: 10px;
}

.cart-products {
	width: 60%;
}

.cart-total {
	width: 40%;
	padding: 10px;
	border-left: 1px solid rgb(212, 212, 212);
	h4 {
		text-align: center;
	}
	button {
		display: block;
		margin: 0 auto;
	}
	.summary {
		font-size: 1.1rem;
		.bold {
			font-weight: bold;
		}
	}
}

.total {
	text-align: right;
	margin-left: 10px;
}
</style>
