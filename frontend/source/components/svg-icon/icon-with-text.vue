<template lang="pug">
svg-icon(:icon="icon" )
slot
</template>

<script setup>
import SvgIcon from './svg-icon.vue';

defineProps({
	icon: {
		type:String,
		required: true
	}
});
</script>

<style scoped>

</style>
