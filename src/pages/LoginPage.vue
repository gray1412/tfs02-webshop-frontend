<template>
	<b-container>
		<div class="wrapper">
			<h3 class="text-center mt-4 mb-5">LOGIN</h3>
			<LoginForm />
		</div>
	</b-container>
</template>

<script>
import LoginForm from "../components/LoginForm.vue";

export default {
	name: "LoginPage",
	components: {
		LoginForm,
	},
};
</script>

<style lang="scss" scoped>
.wrapper {
	width: 80%;
	margin: 0 auto;
}
</style>
