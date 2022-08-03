<template>
	<div>
		<div id="card-element">
			<input type="text" />
		</div>
	</div>
</template>

<script>
export default {
	name: "Stripe",
	mounted() {
		const stripe = window.Stripe(
			"pk_test_51JFwLUFFH821MiaEwZIGg8yG1zLjKbAinyhcAo1pB0ZOCj9gfqxZxQ8qyix8NkQOGHBZh8Ii7tzLneYXQoXcthwI000we09WYn"
		);
		this.stripe = stripe;
		let elements = stripe.elements();
		this.card = elements.create("card", {
			hidePostalCode: true,
			style: {
				base: {
					iconColor: "#666EE8",
					color: "#31325F",
					lineHeight: "40px",
					fontWeight: 300,
					fontSize: "15px",
					"::placeholder": {
						color: "gray",
					},
				},
			},
		});
		this.card.mount("#card-element");
	},
	methods: {
		createPaymentMethod() {
			return this.stripe.createPaymentMethod("card", this.card);
		},
	},
};
</script>
