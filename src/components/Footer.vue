<template>
	<footer class="bg-brown mt-3">
		<b-container>
			<section class="text-center mx-auto w-75 p-4">
				<div class="footer-brand">Pet Pal</div>
				<p>
					Pet Pal is the go-to destination for all your pet food needs in Hanoi.
					We strive to maximize our customers' satisfaction by treating their
					pets like one of our own.
				</p>
			</section>
			<section class="p-4">
				<div class="row g-4">
					<div class="col-md">
						<h2 class="text-center mb-4">Contacts</h2>
						<ul class="list-group list-group-flush lead">
							<li class="list-group-item bg-brown">
								<span class="fw-bold">Location:</span> 130 Trung Phung Str
							</li>
							<li class="list-group-item bg-brown">
								<span class="fw-bold">Phone 1:</span> (555) 555-5555
							</li>
							<li class="list-group-item bg-brown">
								<span class="fw-bold">Phone 2:</span> (333) 333-3333
							</li>
							<li class="list-group-item bg-brown">
								<span class="fw-bold">Email 1:</span>
								@gmail.com
							</li>
							<li class="list-group-item bg-brown">
								<span class="fw-bold">Email 2:</span>
								@gmail.com
							</li>
						</ul>
					</div>

					<div class="col-md">
						<Mapbox />
					</div>
				</div>
			</section>
		</b-container>
	</footer>
</template>

<script>
import Mapbox from "./Mapbox.vue";

export default {
	name: "Footer",
	components: {
		Mapbox,
	},
};
</script>

<style lang="scss" scoped>
.bg-brown {
	background-color: #54473e;
	color: white;

	.footer-brand {
		font-size: 2.5rem;
		font-family: var(--headerFont);
	}

	.list-group {
		@media (max-width: 768px) {
			text-align: center;
		}
	}
}
</style>
