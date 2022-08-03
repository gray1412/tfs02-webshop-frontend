<template>
	<tr class="item">
		<td @click="$emit('remove', item)" class="del">
			<b-icon icon="x-square-fill" variant="danger"></b-icon>
		</td>

		<td class="image-wrapper">
			<img :src="item.image" />
		</td>
		<td class="item-info" @click="handleClick">
			<div class="product-name">{{ item.name }}</div>
			<div class="variant">Type: {{ item.variant.name }}</div>
		</td>
		<td class="p-2 mx-2 text-center">${{ item.variant.price }}</td>
		<td class="mx-3">
			<div class="d-flex justify-content-around">
				<input
					type="button"
					value="-"
					@click="$emit('minus', item)"
					class="qty-minus"
				/>
				<div class="qty">{{ item.quantity }}</div>
				<input
					type="button"
					value="+"
					@click="$emit('plus', item)"
					class="qty-plus"
				/>
			</div>
		</td>
		<td class="text-center p-2 mx-2">${{ total }}</td>
	</tr>
</template>

<script>
export default {
	name: "CartItem",
	props: {
		item: Object,
	},
	computed: {
		total() {
			return this.item.quantity * this.item.variant.price;
		},
	},
	methods: {
		handleClick() {
			this.$router.push(`/product/${this.item.alias}`);
		},
	},
};
</script>

<style lang="scss" scoped>
.item {
	width: 100%;
	padding: 5px 0;

	.image-wrapper {
		height: 100px;
		width: 100px;
		flex-shrink: 0;
		img {
			/* width: 100%; */
			display: block;
			height: 100%;
			padding: 10px;
			margin: 0 auto;
		}
	}

	.item-info {
		max-width: 450px;
		cursor: pointer;
	}

	.variant {
		color: var(--mainColor);
	}

	input[type="button"] {
		width: 30px;
		border: none;
		transition: all 0.5s;
		&:hover {
			background-color: var(--mainColor);
		}
	}
}
</style>
