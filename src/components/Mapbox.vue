<template>
	<div id="mapContainer" class="map"></div>
</template>

<script>
import mapboxgl from "mapbox-gl";

export default {
	name: "Mapbox",
	data() {
		return {
			accessToken:
				"pk.eyJ1IjoiaGloaS1oYWhhLWhvaG8iLCJhIjoiY2twczFpZ2FnMGNrZjJ5cXJ4eHV1bnQyYiJ9.i4MGC-rYpmoCMPs2VzE-yQ",
		};
	},
	mounted() {
		mapboxgl.accessToken = this.accessToken;
		const map = new mapboxgl.Map({
			container: "mapContainer",
			style: "mapbox://styles/mapbox/streets-v11",
			center: [105.8361711335556, 21.01670761623033],
			zoom: 12,
		});
		const nav = new mapboxgl.NavigationControl();

		map.addControl(nav, "top-right");

		new mapboxgl.Marker({ color: "#fdbc1c" })
			.setLngLat([105.8361711335556, 21.01670761623033])
			.addTo(map);
	},
};
</script>

<style scoped>
.map {
	width: 100%;
	height: 100%;
	border-radius: 20px;
}
</style>
