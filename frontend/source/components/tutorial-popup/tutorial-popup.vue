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
	left: calc(50% - 300px);
	min-height: 320px;
	overflow: hidden;
	padding: 16px;
	position: fixed;
	top: calc(50% - 128px);
	width: 600px;
	z-index: var(--z-index-popup-content);
}

.tt-popup-header {
	align-items: center;
	background: var(--background-color);
	color: var(--color-base);
	display: flex;
	font-size: 24px;
	height: 24px;
}

.tt-popup-body {
	color: var(--color-normal);
	flex-grow: 1;
	margin-top: 8px;
}

.tt-popup-footer {
	align-items: center;
	border-top: 1px solid var(--color-gray-d9);
	height: 42px;
	display: flex;
}
</style>
