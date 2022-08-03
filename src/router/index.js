import Vue from "vue";
import VueRouter from "vue-router";
// import jwt from "jsonwebtoken";

const Home = () => import("../pages/Home.vue");
const Login = () => import("../pages/LoginPage.vue");
const About = () => import("../pages/About.vue");
const Brands = () => import("../pages/Brands.vue");
const ProductsPage = () => import("../pages/ProductsPage.vue");
const SearchResult = () => import("../pages/SearchResult.vue");
const SignUp = () => import("../pages/SignUp.vue");
const ProductDetail = () => import("../pages/ProductDetail.vue");

const Cart = () => import("../pages/CartPage.vue")
const Checkout = () => import("../pages/Checkout.vue")

Vue.use(VueRouter);

const titleDefault = "Pet Pal";

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},
	{
		path: "/login",
		name: "Login",
		component: Login,
		meta: { title: "Login" },
		beforeEnter: (to, from, next) => {
			if (localStorage.getItem("token")) {
				next(from);
				alert("You are already logged in!");
			} else next();
		},
	},
	{
		path: "/about",
		name: "About",
		component: About,
		meta: { title: `About - ${titleDefault}` },
	},
	{
		path: "/brands",
		name: "Brands",
		component: Brands,
		meta: { title: `Brands - ${titleDefault}` },
	},
	{
		path: "/dogs",
		name: "Dogs",
		component: ProductsPage,
		meta: { title: `For Dogs - ${titleDefault}` },
	},
	{
		path: "/cats",
		name: "Cats",
		component: ProductsPage,
		meta: { title: `For Cats - ${titleDefault}` },
	},
	{
		path: "/search",
		name: "Search",
		component: SearchResult,
		meta: { title: `Search Results - ${titleDefault}` },
	},
	{
		path: "/signup",
		name: "SignUp",
		component: SignUp,
		meta: { title: "Sign Up" },
	},
	{
		path: "/product/*",
		name: "ProductDetail",
		component: ProductDetail,
	},
	{
		path: "/cart",
		name: "Cart",
		component: Cart,
		meta: { title: `Cart - ${titleDefault}` },
	},

	{
		path: "/checkout",
		name: "Checkout",
		component: Checkout,
	}

];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
});

router.beforeEach((to, from, next) => {
	// Scroll to top on route change
	window.scrollTo(0, 0);
	if (to.meta.title) {
		document.title = to.meta.title;
	} else {
		document.title = titleDefault;
	}
	next();
});

export default router;
