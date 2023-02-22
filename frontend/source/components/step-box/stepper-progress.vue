<template lang="pug">
.tt-step-container
	.tt-progress-point(
		v-for="(step, index) in steps"
		:key="index"
		:title="`${index + 1} / ${steps.length} - ${step.title}`"
		@click="stepToIndex(index)"
		)
		.tt-step-circle(
			:class="{'tt-current-step': index == currentStep, 'tt-completed-step': index < currentStep}")
		.tt-checkmark-stem(v-if="index <= currentStep")
		.tt-checkmark-kick(v-if="index <= currentStep")
</template>

<script setup>
defineProps({
	steps: {
		type: Array,
		required: true
	},
	currentStep: {
		type: Number,
		required: true
	}
});

const emit = defineEmits(['stepToIndex']);

const stepToIndex = index => {
	emit('stepToIndex', index);
};

</script>

<style scoped>
.tt-step-container {
	display: flex;
	margin: 10px;
	gap: 6px;
}

.tt-current-step {
	outline: 1px solid var(--color-orange);
	background-color: transparent;
}

.tt-progress-point {
	display: inline-block;
	width: 14px;
	height: 14px;
	transform: rotate(45deg);
	cursor: pointer;
}

.tt-step-circle {
	position: absolute;
	width: 14px;
	height: 14px;
	background-color: #d1d5db;
	border-radius: 50%;
	left: 0;
	top: 0;
}

.tt-completed-step {
	background-color: var(--color-green);
}

.tt-checkmark-stem {
	position: absolute;
	width: 3px;
	height: 9px;
	background-color: #fff;
	left: 6px;
	top: 2px;
}

.tt-checkmark-kick {
	position: absolute;
	width: 3px;
	height: 3px;
	background-color: #fff;
	left: 3px;
	top: 8px;
}
</style>
