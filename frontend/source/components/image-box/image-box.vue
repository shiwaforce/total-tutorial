<template lang="pug">
img.tt-image(:src="imageUrl" alt="")
</template>

<script setup>
defineProps({
	imageUrl: {
		type: String,
		required: true
	}
});
</script>

<style scoped>
.tt-image {
	max-width: 100%;
}
</style>
