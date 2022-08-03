<template>
	<div class="nav-wrapper shadow bg-white sticky-top">
		<b-container>
			<b-navbar toggleable="sm" type="light">
				<b-navbar-brand
					><router-link to="/">Pet Pal</router-link></b-navbar-brand
				>

				<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

				<b-collapse id="nav-collapse" is-nav>
					<b-navbar-nav class="d-block d-sm-none">
						<b-form-input
							class="search"
							size="sm"
							placeholder="What do you want to find?"
						/>
					</b-navbar-nav>
					<b-navbar-nav>
						<b-nav-item
							><router-link to="/about">About Us</router-link></b-nav-item
						>
					</b-navbar-nav>
					<b-navbar-nav>
						<b-nav-item
							><router-link to="/brands">Brands</router-link></b-nav-item
						>
					</b-navbar-nav>
					<b-navbar-nav>
						<b-nav-item
							><router-link to="/dogs">For Dogs</router-link></b-nav-item
						>
					</b-navbar-nav>
					<b-navbar-nav>
						<b-nav-item
							><router-link to="/cats">For Cats</router-link></b-nav-item
						>
					</b-navbar-nav>
					<b-navbar-nav class="d-block d-sm-none">
						<b-nav-item v-if="!loginStatus"
							><router-link to="/login">Login</router-link></b-nav-item
						>
						<b-nav-item v-else @click="handleLogout">Logout</b-nav-item>
					</b-navbar-nav>
				</b-collapse>
			</b-navbar>
		</b-container>
	</div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
	name: "Navbar",

	computed: {
		...mapState({
			loginStatus: (state) => state.login.status,
		}),
	},

	methods: {
		...mapActions(["SET_LOGIN"]),

		handleLogout() {
			if (confirm("Are you sure?")) {
				localStorage.removeItem("token");
				this.SET_LOGIN(false);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.nav-wrapper {
	a,
	a:hover,
	a:focus,
	a:active {
		text-decoration: none;
		color: inherit;
	}

	.navbar-brand {
		font-family: var(--headerFont);
		font-size: 2.5rem;
	}

	#nav-collapse {
		justify-content: space-evenly;
		font-weight: bold;
		.search {
			width: 70%;
			margin: 0 auto;
		}
	}

	.nav-link {
		text-align: center;
		&:hover {
			color: var(--mainColor);
		}
	}
}
</style>
