<template>
	<b-modal id="login-modal" centered>
		<template #modal-header>
			<h5 class="text-uppercase">Login</h5>
			<b-button size="sm" variant="outline-danger" @click="hideModal">
				x
			</b-button>
		</template>

		<LoginForm />

		<template #modal-footer>
			<span @click="hideModal">
				<router-link to="/signup">Don't have an account? Sign Up!</router-link>
			</span>
		</template>
	</b-modal>
</template>

<script>
import LoginForm from "./LoginForm.vue";

export default {
	name: "LoginModal",
	components: {
		LoginForm,
	},

	methods: {
		hideModal() {
			this.$bvModal.hide("login-modal");
		},
	},
};
</script>

<style lang="scss" scoped>
.modal-login-button {
	background-color: var(--mainColor);
	border: 0;
	transition: all 0.3s;

	&:hover {
		background-color: var(--mainColorDarken);
	}
}
</style>
