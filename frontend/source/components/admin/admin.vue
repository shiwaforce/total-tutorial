<template lang="pug">
template(v-if="!exited")
	welcome-admin(v-if="state == STATES.START" @next="next")
	edit-step(
		v-if="state == STATES.EDIT"
		:step="currentStep"
		:count-of-steps="countOfSteps"
		:step-index="stepIndex"
		@change-step="onChangeStep"
		@new-step="onNewStep"
		@remove-step="onRemoveStep"
		@move-step="onMoveStep"
		@prev-step="onPrevStep"
		@next-step="onNextStep"
		@pick="onPick"
		@unpick="onUnpick"
		@finish="next"
		@exit="onExit"
	)
	pick-info(v-if="state == STATES.PICK_INFO" @start-pick="onStartPick" )
	element-picker(v-if="state == STATES.PICK" @on-element-picked="onElementPicked" )
	finish-admin(v-if="state == STATES.FINISH" :config="config" @exit="onExit")
</template>

<script setup>
import {computed, ref} from 'vue';
import EditStep from './edit-step.vue';
import ElementPicker from './element-picker.vue';
import FinishAdmin from './finish-admin.vue';
import PickInfo from './pick-info.vue';
import WelcomeAdmin from './welcome-admin.vue';

const STATES = {
	START: Symbol('start'), // intro
	EDIT: Symbol('edit'), // change the size, fill with content
	PICK_INFO: Symbol('pickInfo'), // information for picker
	PICK: Symbol('pick'), // pick an item on the page
	FINISH: Symbol('finish') // download configuration
};

const exited = ref(false);
const state = ref(STATES.START);
const steps = ref([{}]);
const stepIndex = ref(0);

const currentStep = computed(() => steps.value[stepIndex.value]);
const countOfSteps = computed(() => steps.value.length);
const config = computed(() => ({[location.pathname]: {steps: steps.value}}));

const DONT_SHOW_PICK_INFO_KEY = 'tt-dont-show-pick-info';

function next() {
	switch (state.value) {
		case STATES.START:
			state.value = STATES.EDIT;
			break;
		case STATES.EDIT:
			state.value = STATES.FINISH;
			break;
		case STATES.FINISH:
			state.value = STATES.START;
			break;
		default:
			console.warn('Unknown state', state.value);
	}
}

function onPick() {
	console.assert(state.value === STATES.EDIT, 'invalid state on pick', state.value);
	let dontShowAgain = false;
	try {
		dontShowAgain = JSON.parse(localStorage.getItem(DONT_SHOW_PICK_INFO_KEY) || 'false');
	} catch (parseError) {
		console.warn('cannot parse pick info checkbox value', localStorage.getItem(DONT_SHOW_PICK_INFO_KEY));
	}
	if (dontShowAgain) {
		state.value = STATES.PICK;
	} else {
		state.value = STATES.PICK_INFO;
	}
}

function onStartPick(dontShowAgain) {
	if (dontShowAgain) {
		localStorage.setItem(DONT_SHOW_PICK_INFO_KEY, 'true');
	}
	state.value = STATES.PICK;
}

function onElementPicked(selector) {
	currentStep.value.selector = selector;
	state.value = STATES.EDIT;
}

function onUnpick() {
	currentStep.value.selector = null;
}

function onChangeStep({prop, value}) {
	steps.value[stepIndex.value][prop] = value;
}

function onNewStep() {
	steps.value.splice(stepIndex.value + 1, 0, {});
	stepIndex.value++;
}

function onRemoveStep() {
	steps.value.splice(stepIndex.value, 1);
	stepIndex.value--;
}

function onMoveStep(isDirectionForward) {
	const current = currentStep.value;
	steps.value.splice(stepIndex.value, 1);
	if (isDirectionForward) {
		steps.value.splice(stepIndex.value + 1, 0, current);
		stepIndex.value++;
	} else {
		steps.value.splice(stepIndex.value - 1, 0, current);
		stepIndex.value--;
	}
}

function onPrevStep() {
	stepIndex.value--;
}

function onNextStep() {
	stepIndex.value++;
}

function onExit() {
	exited.value = true;
}
</script>
