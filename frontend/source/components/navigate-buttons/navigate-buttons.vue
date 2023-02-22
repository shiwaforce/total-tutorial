<template lang="pug">
button.tt-navigate-button(v-if="hasPreviousButton" @click="store.stepRelative(-1)") Back
button.tt-navigate-button(v-if="hasNextButton" ref="nextButton" @click="store.stepRelative(+1)") Next
button.tt-navigate-button(v-if="hasFinishButton" @click="finish") Finish
</template>

<script setup>
import {computed, ref, watch} from 'vue';
import {useStore} from '../../store/use-store';

const props = defineProps({
	config: {
		type: Object,
		required: true
	}
});

const emit = defineEmits(['finish-tutorial']);

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

watch(() => props.config, setNextFocus);
setNextFocus();

const finish = () => {
	emit('finish-tutorial');
};
</script>

<style scoped>
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
</style>
