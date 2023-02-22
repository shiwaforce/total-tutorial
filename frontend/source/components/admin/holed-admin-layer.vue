<template lang="pug">
.tt-element-layer
.tt-tutorial-layer
	slot
</template>

<script setup>
import {computed, watch} from 'vue';
import constants from '../../utils/constants';
import {getOffsetLeft, getOffsetTop} from '../../utils/get-offset';
import {scrollIntoTheMiddleOfTheTutorialStep} from '../../utils/scroll-into-middle';

const props = defineProps({
	step: {
		type: Object,
		required: true
	}
});

const currentDomElement = computed(() => props.step?.selector ? document.querySelector(props.step.selector) : document.createElement('div'));
const currentElementBoundingRect = computed(() => {
	const boundingBox = currentDomElement.value.getBoundingClientRect();
	return {
		height: boundingBox.height,
		width: boundingBox.width,
		top: getOffsetTop(currentDomElement.value),
		left: getOffsetLeft(currentDomElement.value)
	};
});
const elementLayerHeight = computed(() => `${currentElementBoundingRect.value.height + 8}px`);
const elementLayerWidth = computed(() => `${currentElementBoundingRect.value.width + 8}px`);
const elementLayerLeft = computed(() => `${currentElementBoundingRect.value.left - 4}px`);
const elementLayerTop = computed(() => `${currentElementBoundingRect.value.top - 4}px`);

watch(() => props.step, newStepValue => {
	const allElements = Array.from(document.querySelectorAll(`.${constants.CURRENT_ELEMENT_CLASSNAME}`));
	allElements.forEach(domElement => domElement.classList.remove(constants.CURRENT_ELEMENT_CLASSNAME));
	currentDomElement.value.classList.add(constants.CURRENT_ELEMENT_CLASSNAME);
	scrollIntoTheMiddleOfTheTutorialStep(newStepValue, currentElementBoundingRect.value);
});

currentDomElement.value.classList.add(constants.CURRENT_ELEMENT_CLASSNAME); // first, initial run
</script>

<style scoped>
.tt-element-layer {
	border: 4px solid #000;
	border-radius: 2px;
	box-sizing: border-box;
	height: v-bind(elementLayerHeight);
	left: v-bind(elementLayerLeft);
	position: absolute;
	top: v-bind(elementLayerTop);
	width: v-bind(elementLayerWidth);
	transition: height 750ms, left 500ms, top 500ms, width 750ms;
	background: transparent;
	box-shadow: 0 0 0 5000px var(--layer-color);
	z-index: var(--z-index-tutorial-layer);
}
</style>
