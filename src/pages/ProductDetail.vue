<template>
	<b-container>
		<div class="main py-4">
			<div class="image-wrapper">
				<img :src="product.image_url" alt="product-image" />
			</div>
			<div class="p-3 ">
				<h3>{{ product.name }}</h3>
				<div class="brand">
					Brand: <strong>{{ product.brand_name }}</strong>
				</div>
				<div class="d-flex align-items-center justify-content-between">
					<div class="d-flex align-items-center">
						<s v-if="product.original_price">${{ product.original_price }}</s>
						<div class="price">${{ getPrice }}</div>
					</div>

					<div class="quantity">
						<span>{{
							getStock > 0 ? `In Stock: ${getStock}` : "SOLD OUT!"
						}}</span>
					</div>
				</div>

				<!-- Radio buttons -->
				<b-form-group
					class="py-2"
					v-for="(option, index) in radioOptions"
					:key="index"
					:label="capitalize(index)"
				>
					<b-form-radio-group
						class="btn-radios"
						v-model="selected[index]"
						:options="option"
						name="radios-btn"
						button-variant="outline-warning"
						buttons
						@change="handleOptionChange(index)"
					></b-form-radio-group>
				</b-form-group>
				<!-- End Radio buttons -->
				<hr />
				<b-form>
					<div class="quantity-form py-3 d-flex">
						<input type="button" value="-" @click="minus()" />
						<input
							type="number"
							@input="handleQuantityInput"
							:value="this.quantity"
						/>
						<input type="button" value="+" @click="plus()" />
					</div>
					<b-button
						@click="handleAddCart"
						class="add-cart-btn my-3 py-3 shadow rounded"
						size="lg"
						>ADD TO CART
					</b-button>
				</b-form>
			</div>
		</div>
		<h3>Description</h3>
		<div class="text-justify">
			{{ product.description }}
		</div>
	</b-container>
</template>

<script>
import axios from "axios";
import { mapState, mapActions } from "vuex";

export default {
	async created() {
		const alias = this.$route.params.pathMatch;

		const { data } = await axios({
			url: `http://localhost:8081/api/products/${alias}`,
		});

		this.product = data.data;
		// Get the options to render
		for (let option of data.data.options) {
			this.radioOptions[option.name] = [];
			// Initiate a selected state to hold the radio buttons' values
			this.selected[option.name] = "";
			option.option_values.forEach((elem) => {
				this.radioOptions[option.name].push({
					text: `${elem.name}`, // Text inside the radio buttons
					value: `${elem.name}`, // Value of radio buttons
				});
			});
		}
		this.price = data.data.price;
		// console.log(this.product);
		document.title = `${this.product.name} - Pet Pal`;
	},

	computed: {
		...mapState({
			cart: (state) => state.cart.items,
		}),
		getPrice() {
			return this.chosenVariant.price
				? this.chosenVariant.price
				: this.product.price;
		},
		getStock() {
			return this.chosenVariant.quantity
				? this.chosenVariant.quantity
				: this.product.quantity;
		},
	},

	data() {
		return {
			product: {},
			price: 0,
			quantity: 1,
			selected: {},
			radioOptions: {},
			chosenVariant: {},
		};
	},

	methods: {
		...mapActions(["SET_CART", "ADD_TO_CART", "ADD_QUANTITY"]),
		plus() {
			if (this.quantity < 1) {
				this.quantity = 1;
				return;
			}
			if (this.quantity >= this.getStock) {
				this.quantity = this.getStock;
				return;
			}

			this.quantity++;
		},
		minus() {
			if (this.quantity <= 1) {
				this.quantity = 1;
				return;
			}
			if (this.quantity > this.getStock) {
				this.quantity = this.getStock;
				return;
			}
			this.quantity--;
		},
		handleQuantityInput(e) {
			this.quantity = e.target.value;
		},
		capitalize(str) {
			return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
		},
		handleOptionChange() {
			if (!this.validateObject(this.selected)) {
				return;
			}

			// Get variant name
			let optionArr = [];
			for (let key in this.selected) {
				optionArr.push(this.selected[key]);
			}
			const variantName = optionArr.join("/");

			// Get the variant
			const variant = this.product.variants.find(
				(elem) => elem.name == variantName
			);
			// console.log("chosen variant", variant);
			this.chosenVariant = variant;
		},
		handleAddCart() {
			if (!this.validateObject(this.selected)) {
				alert("Please select your options!");
				console.log("add cart fails");
				return;
			}

			const cartItem = {
				name: this.product.name,
				variant: this.chosenVariant,
				alias: this.product.alias,
				id: this.product.id,
				image: this.product.image_url,
				quantity: this.quantity,
				stock: this.getStock,
			};

			// Check if item is already in cart
			for (let item of this.cart) {
				if (item.variant.id === cartItem.variant.id) {
					cartItem.quantity += item.quantity;
					// console.log(
					// 	`already in cart, quantity changed from ${item.quantity} to ${cartItem.quantity}`
					// );

					// Update the quantity
					const payload = {
						index: this.cart.indexOf(item),
						quantity: cartItem.quantity,
					};
					this.ADD_QUANTITY(payload);
					this.saveCartToLocal(); // Cache cart to localStorage
					return;
				}
			}
			this.ADD_TO_CART(cartItem); // Add item to cart state
			this.saveCartToLocal(); // Cache cart to localStorage
		},

		saveCartToLocal() {
			localStorage.setItem("cart", JSON.stringify(this.cart));
			this.addCartToast();
		},
		addCartToast() {
			this.$toasted.show("Item added to cart!", {
				position: "top-center",
				duration: 1500,
			});
		},
		// Function to validate all properties of object have truthy value
		validateObject(object) {
			for (let key in object) {
				if (!object[key]) {
					return false;
				}
			}
			return true;
		},
	},
};
</script>

<style lang="scss">
.main {
	display: grid;
	grid-template-columns: 1fr 1fr;
	@media (max-width: 768px) {
		display: flex;
		flex-direction: column;
	}

	.image-wrapper {
		display: flex;
		min-width: 50%;
		height: 500px;
		img {
			display: block;
			margin: auto;
			max-height: 100%;
			max-width: 100%;
			padding: 20px;
		}
	}

	.brand,
	.quantity {
		font-size: 1.2rem;
		padding-bottom: 10px;
	}

	.price {
		font-size: 2rem;
		font-weight: bold;
		padding-bottom: 10px;
	}

	.add-cart-btn {
		background-color: var(--mainColor);
		border: none;
		&:hover {
			background-color: var(--mainColorDarken);
		}
	}

	.btn-radios {
		label {
			margin: 0 5px;
			border-radius: 0;
		}
		input {
			display: none;
		}
	}

	.quantity-form {
		input {
			width: 50px;
			text-align: center;
		}

		input[type="button"] {
			width: 30px;
			border: none;
			transition: all 0.5s;
			&:hover {
				background-color: var(--mainColor);
			}
		}

		input::-webkit-outer-spin-button,
		input::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}
		input[type="number"] {
			-moz-appearance: textfield;
		}
	}
}
</style>
