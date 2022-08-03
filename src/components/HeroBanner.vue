<template>
	<div class="banner-wrapper d-flex justify-content-center mb-3">
		<b-container>
			<div class="text-box d-flex flex-column justify-content-center">
				<h1 class="mb-2">PET PAL</h1>
				<div class="d-flex align-items-center mb-2">
					<b-icon
						id="telephone-icon"
						icon="telephone-fill"
						animation="throb"
					></b-icon>
					<h2 class="text mx-2">0123123123</h2>
				</div>
			</div>
		</b-container>
	</div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.banner-wrapper {
	* {
		margin: 0;
	}

	background: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0) 50%,
			rgba(0, 0, 0, 0.65) 100%
		),
		url(../assets/images/banner.jpg);
	background-repeat: no-repeat;
	background-size: cover;
	background-position: center center;
	height: 50vh;
	animation: animateBanner 1s;

	@keyframes animateBanner {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.text-box {
		height: 100%;
		color: white;
	}
}
</style>
