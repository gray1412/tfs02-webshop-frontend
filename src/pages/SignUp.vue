<template>
	<b-container class="d-flex justify-content-center mb-3">
		<b-form class="sign-up-form" @submit.prevent="handleSignUp">
			<h3 class="text-center mt-3">SIGN UP</h3>

			<div class="form-group">
				<label>Email Address</label>
				<b-form-input
					v-model="email.value"
					:state="email.isValid"
					type="email"
					class="form-control form-control-md"
					@input="clearError"
				/>
				<ErrorMessage :message="email.error" />
			</div>

			<div class="form-group">
				<label>Full Name</label>
				<b-form-input
					v-model="name.value"
					:state="name.isValid"
					type="text"
					class="form-control form-control-md"
					@input="clearError"
				/>
				<ErrorMessage :message="name.error" />
			</div>

			<div class="form-group">
				<label>Password</label>
				<b-form-input
					v-model="password.value"
					:state="password.isValid"
					type="password"
					class="form-control form-control-md"
					@input="clearError"
				/>
				<ErrorMessage :message="password.error" />
			</div>

			<div class="form-group">
				<label>Confirm Password</label>
				<b-form-input
					v-model="confirmPassword.value"
					:state="confirmPassword.isValid"
					type="password"
					class="form-control form-control-md"
					@input="clearError"
				/>
				<ErrorMessage :message="confirmPassword.error" />
			</div>

			<button type="submit" class="sign-up-btn btn btn-dark btn-lg btn-block">
				Sign Up
			</button>
		</b-form>
	</b-container>
</template>

<script>
import axios from "axios";
import bcrypt from "bcryptjs";
import ErrorMessage from "../components/ErrorMessage.vue";

export default {
	name: "SignUp",
	components: {
		ErrorMessage,
	},
	data() {
		return {
			email: {
				value: "",
				isValid: null,
				error: "",
			},
			name: {
				value: "",
				isValid: null,
				error: "",
			},
			password: {
				value: "",
				isValid: null,
				error: "",
			},
			confirmPassword: {
				value: "",
				isValid: null,
				error: "",
			},
		};
	},
	methods: {
		async handleSignUp() {
			if (!this.validateForm()) {
				console.log("form is invalid");
				// alert("invalid form");
				return;
			}
			const hashPassword = bcrypt.hashSync(
				this.password.value,
				bcrypt.genSaltSync(10)
			);

			try {
				const res = await axios({
					method: "POST",
					url: "http://localhost:8081/api/auth/signup",
					data: {
						email: this.email.value,
						password: hashPassword,
						name: this.name.value,
					},
					headers: {
						"Access-Control-Allow-Origin": "*",
					},
				});

				if (res.data.success) {
					// console.log(res);
					if (confirm("Do you want to login?")) {
						this.$router.push("/login");
					}
				}
			} catch (err) {
				this.email.isValid = false;
				alert(err.response.data.message);
			}
		},

		clearError() {
			this.email.isValid = this.name.isValid = this.password.isValid = this.confirmPassword.isValid = null;
			this.email.error = this.name.error = this.password.error = this.confirmPassword.error =
				"";
		},

		validateForm() {
			let isFormValid = true;
			if (this.email.value === "") {
				this.email.isValid = false;
				this.email.error = "Please enter an email!";
				isFormValid = false;
			}

			if (this.name.value === "") {
				this.name.isValid = false;
				this.name.error = "Please enter a name!";
				isFormValid = false;
			}

			if (this.password.value.length < 6) {
				this.password.isValid = false;
				this.password.error = "Password must be at least 6 characters long!";
				isFormValid = false;
			}

			if (this.confirmPassword.value === "") {
				this.confirmPassword.isValid = false;
				this.confirmPassword.error = "Please re-enter your password!";
				isFormValid = false;
			}

			if (this.confirmPassword.value != this.password.value) {
				this.confirmPassword.isValid = false;
				this.confirmPassword.error = "Password doesn't match!";
				isFormValid = false;
			}

			return isFormValid;
		},
	},
};
</script>

<style lang="scss" scoped>
.sign-up-form {
	width: 80%;

	.sign-up-btn {
		background-color: var(--mainColor);
		margin: 20px 0;
		border: none;
		transition: all 0.3s;

		&:hover {
			background-color: var(--mainColorDarken);
		}
	}
	.form-group {
		margin-top: 20px;
	}
}
</style>
