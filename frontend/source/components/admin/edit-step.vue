<template lang="pug">
holed-admin-layer(:step="step")
	.tt-admin-container(:class="{'tt-has-selector': hasSelector}")
		.tt-step
			.tt-arrow
			editable-element.tt-title(
				:field="step.title"
				:step-index="props.stepIndex"
				placeholder="Click here to edit title..."
				@change="onChangeTitle"
			)
			editable-element.tt-description(
				:field="step.description"
				:step-index="props.stepIndex"
				placeholder="Chick here to edit description..."
				@change="onChangeDescription"
			)
		.tt-operations
			button(
				:disabled="!isFulfilled"
				:title="isFulfilled? 'Create new tutorial step...' : 'Please fill all of fields at left before create new step'"
				@click="emit('new-step')"
			)
				icon-with-text(icon="add") Add
			button(
				:disabled="!hasOtherStep"
				:title="hasOtherStep? 'Remove this tutorial step' : 'This is the only one explanatory step, so it cannot be removed'"
				@click="showConfirmationOfRemoveStep"
			)
				icon-with-text(icon="close") Del
			button(
				:title="hasSelector?'Choose another item on your website that needs explanation':'Choose one item on your website that needs explanation'"
				@click="emit('pick')"
			)
				icon-with-text(icon="box-search") Pick
			button(
				:disabled="!hasSelector"
				:title="hasSelector? 'Remove the selected selector' : 'At first choose one item on your website that needs explanation'"
				@click="emit('unpick')"
			)
				icon-with-text(icon="box-remove") Unp
			button(
				:disabled="!hasPrevStep"
				:title="hasPrevStep?'Move backward this step' : 'This is the first step, cannot move backward'"
				@click="emit('prev-step')"
			)
				icon-with-text(icon="backward") Prev
			button(
				:disabled="!hasNextStep"
				:title="hasNextStep? 'Move forward this step' : 'This is the last step, cannot move forward'"
				@click="emit('next-step')"
			)
				icon-with-text(icon="forward") Next
			button(
				:disabled="!isFulfilled"
				:title="isFulfilled? 'Download the compiled configuration' : 'Please fill all field before finish editing, or drop this step completly'"
				@click="emit('finish')"
			)
				icon-with-text(icon="download") Save
			button(title="Exit the configuration creator" @click="emit('exit')")
				icon-with-text(icon="cancel") Exit
tutorial-popup(v-if="isShowConfirmationOfRemoveStep")
	template(#header)
		p.tt-header-content Are you sure?
	template(#body)
		p.tt-body-content Do you want to remove this tutorial step?
	template(#footer)
		.tt-button-container
			button.tt-next(@click="closeConfirmRemoveStep") No
			button.tt-next(@click="removeStep") Yes
</template>

<script setup>
import calculateTutorialBoxLeft from '../../utils/calculate-tutorial-box-left';
import {computed, ref} from 'vue';
import EditableElement from './editable-element.vue';
import HoledAdminLayer from './holed-admin-layer.vue';
import IconWithText from '../svg-icon/icon-with-text.vue';
import TutorialPopup from '../tutorial-popup/tutorial-popup.vue';

const props = defineProps({
	step: {
		type: Object,
		required: true
	},
	countOfSteps: {
		type: Number,
		required: true
	},
	stepIndex: {
		type: Number,
		required: true
	}
});

const emit = defineEmits([
	'change-step', 'new-step', 'remove-step', 'move-step', 'prev-step', 'next-step', 'finish', 'pick', 'unpick', 'exit'
]);

const isFulfilled = computed(() => props.step.title && props.step.description);
const hasOtherStep = computed(() => props.countOfSteps > 1);
const hasSelector = computed(() => props.step.selector);
const hasNextStep = computed(() => props.countOfSteps > props.stepIndex + 1);
const hasPrevStep = computed(() => props.stepIndex > 0);
const topLeft = computed(() => {
	const topLeftValue = {top: 0, left: 0};
	if (props.step?.selector) {
		const selectedElement = document.querySelector(props.step.selector);
		const rect = selectedElement.getBoundingClientRect();
		const top = `${document.body.parentNode.scrollTop + rect.top + rect.height + 16}px`;
		const wholePanel = document.querySelector('.tt-admin-container');
		const left = calculateTutorialBoxLeft(wholePanel.offsetWidth, props.step.selector, rect);
		topLeftValue.top = top;
		topLeftValue.left = left;
	}
	return topLeftValue;
});

function onChangeTitle(newTitle) {
	emit('change-step', {prop: 'title', value: newTitle});
}

function onChangeDescription(newDescription) {
	emit('change-step', {prop: 'description', value: newDescription});
}

const isShowConfirmationOfRemoveStep = ref(false);

function showConfirmationOfRemoveStep() {
	isShowConfirmationOfRemoveStep.value = true;
}

function closeConfirmRemoveStep() {
	isShowConfirmationOfRemoveStep.value = false;
}

function removeStep() {
	emit('remove-step');
	closeConfirmRemoveStep();
}
</script>

<style scoped>
.tt-layer {
	background: #555;
	height: 100%;
	left: 0;
	opacity: 0.5;
	position: fixed;
	top: 0;
	width: 100%;
	z-index: var(--z-index-tutorial-layer);
}

.tt-admin-container {
	background: transparent;
	display: flex;
	gap: 8px;
	height: 240px;
	left: calc(50% - 160px);
	position: fixed;
	top: calc(50% - 120px);
	width: calc(320px + 100px);
	z-index: var(--z-index-tutorial-content);
}

.tt-admin-container.tt-has-selector {
	left: v-bind(topLeft.left);
	position: absolute;
	top: v-bind(topLeft.top);
}

.tt-step {
	height: 240px;
	width: 320px;
}

.tt-title {
	color: var(--color-base);
	font-size: 24px;
	margin-bottom: 12px;
}

.tt-description {
	color: var(--color-normal);
}

.tt-operations {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	height: 230px;
}

.tt-operations button {
	background: transparent;
	border: none;
	border-radius: 24px;
	width: 50px;
}

.tt-operations button:disabled {
	cursor: not-allowed;
	opacity: .5;
}

.tt-operations button:hover {
	background: #555;
	color: #fff;
}

.tt-step,
.tt-operations {
	background: #fff;
	border: 1px solid #555;
	border-radius: 8px;
	padding: 8px;
}


.tt-arrow {
	background: transparent;
	border-bottom: 10px solid #fff;
	border-left: 10px solid transparent;
	border-right: 10px solid transparent;
	display: none;
	left: 20px;
	height: 0;
	position: absolute;
	top: -9px;
	width: 0;
}

.tt-has-selector .tt-arrow {
	display: block;
}

</style>
