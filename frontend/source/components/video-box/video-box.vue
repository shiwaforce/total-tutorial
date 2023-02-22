<template lang="pug">
video(width="320" height="240" controls)
	source(:src="props.videoUrl" type="video/mp4")
	| Your browser does not support the video tag :(
</template>

<script setup>
const props = defineProps({
	videoUrl: {
		type: String,
		required: true
	}
});
</script>

<style scoped>

</style>
