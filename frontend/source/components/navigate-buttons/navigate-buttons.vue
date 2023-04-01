<template lang="pug">
button.tt-navigate-button(v-if="hasPreviousButton" @click="stepRelative(-1)") Back
div(class="tt-navigate-button-placeholder" v-else)
stepper-progress(class="tt-buttons-middle" :steps="config.steps" :current-step="config.currentStep" @step-to-index="emit('step-to-index', $event)")
button.tt-navigate-button(v-if="hasNextButton" ref="nextButton" @click="stepRelative(+1)") Next
button.tt-navigate-button(v-if="hasFinishButton" @click="finish") Finish
</template>

<script setup>
import {computed, ref, watch} from 'vue';
import StepperProgress from '../step-box/stepper-progress.vue';
import {useStore} from '../../store/use-store';

const props = defineProps({
	config: {
		type: Object,
		required: true
	}
});

const emit = defineEmits(['finish-tutorial', 'navigate-to-step', 'step-to-index']);

const store = useStore();
const nextButton = ref(null);

const hasPreviousButton = computed(() => props.config.currentStep > 0);
const hasNextButton = computed(() => props.config.currentStep < props.config.steps.length - 1);
const hasFinishButton = computed(() => props.config.currentStep === props.config.steps.length - 1);

function setNextFocus() {
	setTimeout(() => {
		nextButton.value?.focus();
	});
}

function stepRelative(direction) {
	emit('navigate-to-step', direction);
	store.stepRelative(direction);
}

watch(() => props.config, setNextFocus);
setNextFocus();

const finish = () => {
	emit('finish-tutorial');
};
</script>

<style scoped>
.tt-navigate-button,
.tt-navigate-button-placeholder {
	width: 48px;
}

.tt-navigate-button {
	background-color: var(--color-gray-ff);
	border: 1px solid var(--color-base);
	border-radius: 6px;
	color: var(--color-base);
	cursor: pointer;
	font-size: 0.75rem;
	padding: 8px;
}

.tt-navigate-button:focus {
	outline: 1px solid var(--color-base);
}

.tt-navigate-button:hover {
	background-color: #e5e7eb;
	transition: background-color var(--fast) ease-in-out;
}

.tt-buttons-middle {
	flex-grow: 1;
}
</style>
