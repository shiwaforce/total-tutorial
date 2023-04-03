<template lang="pug">
.tt-popup-layer
.tt-popup
	.tt-popup-header
		slot(name="header")
	.tt-popup-body
		slot(name="body")
	.tt-popup-footer
		slot(name="footer")
</template>

<script setup>
defineProps({
	min: {
		type: Number,
		default: 320
	}
});
</script>

<style scoped>
.tt-popup-layer {
	top: 0;
	left: 0;
	position: fixed;
	width: 100%;
	height: 100%;
	background: var(--layer-color);
	z-index: var(--z-index-popup-layer);
}

.tt-popup {
	background: var(--background-color);
	border-radius: 12px;
	display: flex;
	flex-direction: column;
	z-index: var(--z-index-popup-content);
	left: calc(50% - 300px);
	min-height: v-bind(min + 'px');
	overflow: hidden;
	padding: 12px;
	position: fixed;
	top: calc(50% - 128px);
	width: 600px;
}

/* Styles for screens smaller than 768px */
@media only screen and (max-width: 767px) {
	.tt-popup {
		left: 16px;
		width: calc(100% - 32px);
	}
}

/* Styles for screens between 768px and 1024px */
@media only screen and (min-width: 768px) and (max-width: 1024px) {
	.tt-popup {
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 80%;
	}
}

.tt-popup-header {
	align-items: center;
	background: var(--background-color);
	color: var(--color-base);
	display: flex;
	font-size: 20px;
}

.tt-popup-body {
	color: var(--color-normal);
	margin-top: 8px;
}

.tt-popup-footer {
	align-items: center;
	border-top: 1px solid var(--color-gray-d9);
	display: flex;
	height: 42px;
	margin-top: 20px;
	padding-top: 20px;
}
</style>
