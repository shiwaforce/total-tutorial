<template lang="pug">
.tt-background-layer
.tt-element-layer
.tt-tutorial-layer
	.tt-arrow(v-if="currentStep.selector" )
	.tt-outer-container(ref="outerContainer")
		slot
</template>

<script setup>
import calculateTutorialBoxLeft from '../../utils/calculate-tutorial-box-left';
import {computed, nextTick, onMounted, ref, watch} from 'vue';
import constants from '../../utils/constants';
import {getOffsetLeft, getOffsetTop} from '../../utils/get-offset';
import {scrollIntoTheMiddleOfTheTutorialStep} from '../../utils/scroll-into-middle';
import removePxSuffix from "../../utils/remove-px-suffix";

const props = defineProps({
	config: {
		type: Object,
		required: true
	}
});

const outerContainer = ref(null);
const currentStep = computed(() => props.config.steps[props.config.currentStep]);
const currentDomElement = computed(() => (currentStep.value.selector && document.querySelector(currentStep.value.selector)) || document.createElement('div'));
const currentElementBoundingRect = computed(() => {
	const boundingBox = currentDomElement.value.getBoundingClientRect();
	return {
		height: boundingBox.height,
		width: boundingBox.width,
		top: getOffsetTop(currentDomElement.value),
		left: getOffsetLeft(currentDomElement.value)
	};
});
const dimensionValue = configuredValue => typeof configuredValue == 'number' ? `${configuredValue}px` : configuredValue;
const currentStepWidth = computed(() => dimensionValue(currentStep.value.width || constants.DEFAULT_WIDTH_OF_TUTORIAL_LAYER));
const currentStepHeight = computed(() => dimensionValue(currentStep.value.height || constants.DEFAULT_HEIGHT_OF_TUTORIAL_LAYER));
const boxTop = computed(() => {
	let calculatedTop = Math.max(currentElementBoundingRect.value.top + currentElementBoundingRect.value.height + 18, 2);
	if (!currentStep.value.selector) {
		calculatedTop = (document.documentElement.clientHeight - (parseInt(currentStep.value.height, 10) || constants.DEFAULT_HEIGHT_OF_TUTORIAL_LAYER)) / 2;
	}
	return `${calculatedTop}px`;
});
const boxLeft = computed(() => calculateTutorialBoxLeft(currentStep.value.width, currentStep.value.selector, currentElementBoundingRect.value));
const arrowLeft = computed(() => `${currentElementBoundingRect.value.left + 12 - removePxSuffix(boxLeft.value)}px`);
// element highlight
const elementLayerHeight = computed(() => currentElementBoundingRect.value.height + 12 + 'px');
const elementLayerWidth = computed(() => currentElementBoundingRect.value.width + 12 + 'px');
const elementLayerLeft = computed(() => currentElementBoundingRect.value.left - 6 + 'px');
const elementLayerTop = computed(() => currentElementBoundingRect.value.top - 6 + 'px');
const elementBorder = computed(() => currentStep.value.selector ? 3 + 'px' : 0);
const boxPosition = computed(() => {
	if (!currentStep.value.selector) {
		return 'fixed';
	}
	return 'absolute';
});

function updateSelectedElementBackground(selectedElement) {
	let currentColor = window.getComputedStyle(selectedElement).getPropertyValue('background-color');
	if (currentColor == 'rgba(0, 0, 0, 0)') {
		currentColor = '#fff';
	}
	const rootElement = document.querySelector(':root');
	rootElement.style.setProperty('--tt-highlightedElementBackgroundColor', currentColor);
}

function scrollToTopOfContent() {
	setTimeout(() => {
		outerContainer.value.scrollTo(0, 0);
	}, 100); // browsers are not consistent in how long it takes to achieve a "smooth" scroll
}

function addClassesForCurrentElement(selectedElement) {
	const allElements = Array.from(document.querySelectorAll(`.${constants.CURRENT_ELEMENT_CLASSNAME}`));
	allElements.forEach(domElement => domElement.classList.remove(constants.CURRENT_ELEMENT_CLASSNAME));
	const allParents = Array.from(document.querySelectorAll(`.${constants.CURRENT_PARENTS_CLASSNAME}`));
	allParents.forEach(domElement => domElement.classList.remove(constants.CURRENT_PARENTS_CLASSNAME));
	selectedElement.classList.add(constants.CURRENT_ELEMENT_CLASSNAME);
	let parentElement = selectedElement.parentElement;
	while (parentElement) {
		parentElement.classList.add(constants.CURRENT_PARENTS_CLASSNAME);
		parentElement = parentElement.parentElement;
	}
}

updateSelectedElementBackground(currentDomElement.value);
addClassesForCurrentElement(currentDomElement.value); // first, initial run

watch(() => props.config.currentStep, () => {
	updateSelectedElementBackground(currentDomElement.value);
	scrollToTopOfContent();
	addClassesForCurrentElement(currentDomElement.value);
	scrollIntoTheMiddleOfTheTutorialStep(currentStep.value, currentElementBoundingRect.value);
});

onMounted(() => {
	if (currentElementBoundingRect.value) {
		nextTick(() => {
			scrollIntoTheMiddleOfTheTutorialStep(currentStep.value, currentElementBoundingRect.value);
		});
	} else {
		scrollToTopOfContent();
	}
});
</script>

<style>
:root {
	--tt-highlightedElementBackgroundColor: #0f8;
}
</style>
<style scoped>
.tt-background-layer {
	background-color: var(--layer-color);
	height: 100%;
	left: 0;
	position: fixed;
	top: 0;
	width: 100%;
	z-index: var(--z-index-background-layer);
}

.tt-element-layer {
	background-color: var(--tt-highlightedElementBackgroundColor);
	border: v-bind(elementBorder) solid #141414;
	border-radius: 8px;
	box-sizing: border-box;
	height: v-bind(elementLayerHeight);
	left: v-bind(elementLayerLeft);
	position: absolute;
	top: v-bind(elementLayerTop);
	width: v-bind(elementLayerWidth);
	transition: height 750ms, left 500ms, top 500ms, width 750ms;
	z-index: var(--z-index-tutorial-layer);
}

.tt-tutorial-layer {
	background: #f3f4f6;
	border: 1px solid var(--color-normal);
	border-radius: 8px;
	height: v-bind(currentStepHeight);
	left: v-bind(boxLeft);
	padding: 12px 0 12px 12px; /* because scrollbar */
	position: v-bind(boxPosition);
	top: v-bind(boxTop);
	transition: height 750ms, left 500ms, top 500ms, width 750ms;
	width: v-bind(currentStepWidth);
	z-index: var(--z-index-tutorial-content);
}

.tt-outer-container {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.tt-arrow {
	background: transparent;
	border-bottom: 10px solid #f3f4f6;
	border-left: 10px solid transparent;
	border-right: 10px solid transparent;
	left: v-bind(arrowLeft);
	height: 0;
	position: absolute;
	top: -9px;
	width: 0;
}

:global(.tt-current-element) {
	position: relative;
	z-index: 92147483645 !important; /* cannot use variables in outside of tutorial container */
}

:global(.tt-current-parents) {
	position: initial !important;
}
</style>
