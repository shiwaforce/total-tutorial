<template lang="pug">
teleport(to="body")
	.ttElementSelectorLayer(ref="elementSelectorLayer" @click="onElementSelected")
parent-picker(
	v-if="showParentPicker"
	:picked-element="lastSelectedElement"
	@on-finish-selection="onFinishParentSelection"
	@on-show-parent-layer="onShowParentLayer"
)
</template>

<script setup>
import {onMounted, onUnmounted, ref} from 'vue';
import ParentPicker from './parent-picker.vue';

const emit = defineEmits(['on-element-picked', 'on-element-change']);

const elementSelectorLayer = ref(null);
const lastSelectedElement = ref(null);
const selectedElementSelector = ref('');
let lastElementOnTarget = null;
const showParentPicker = ref(false);

function showTargetElementLayer(targetElement) {
	lastElementOnTarget = targetElement;
	const boundingRect = targetElement.getBoundingClientRect();
	if (!elementSelectorLayer.value.style) {
		elementSelectorLayer.value.style = {};
	}
	const marginAround = 8; // show a slightly larger frame to better highlight the selected box
	elementSelectorLayer.value.style.left = `${boundingRect.left - marginAround}px`;
	elementSelectorLayer.value.style.top = `${boundingRect.top - marginAround}px`;
	elementSelectorLayer.value.style.width = `${boundingRect.width + 2 * marginAround}px`;
	elementSelectorLayer.value.style.height = `${boundingRect.height + 2 * marginAround}px`;
	elementSelectorLayer.value.style.display = 'block';
}

function onElementHover(event) {
	if (!elementSelectorLayer.value.style) {
		elementSelectorLayer.value.style = {};
	}
	elementSelectorLayer.value.style.display = 'none';
	const targetElement = document.elementFromPoint(event.clientX, event.clientY);
	lastSelectedElement.value = targetElement;
	showTargetElementLayer(targetElement);
}

function onScrollUpdateSelectedElementLayer() {
	if (lastElementOnTarget) {
		showTargetElementLayer(lastElementOnTarget);
	}
}

function onElementSelected() {
	document.removeEventListener('mousemove', onElementHover);
	elementSelectorLayer.value.style.display = 'none';
	showParentPicker.value = true;
}

function onFinishParentSelection() {
	document.removeEventListener('scroll', onScrollUpdateSelectedElementLayer);
	elementSelectorLayer.value.style.display = 'none';
	emit('on-element-picked', selectedElementSelector.value);
	showParentPicker.value = false;
}

function onShowParentLayer(selector) {
	selectedElementSelector.value = selector;
	showTargetElementLayer(document.querySelector(selector));
}

onMounted(() => {
	document.addEventListener('mousemove', onElementHover);
	document.addEventListener('scroll', onScrollUpdateSelectedElementLayer);
});

onUnmounted(() => {
	document.removeEventListener('mousemove', onElementHover);
	document.removeEventListener('scroll', onScrollUpdateSelectedElementLayer);
});

</script>

<style scoped>
.ttElementSelectorLayer {
	background-color: transparent;
	border: 6px solid #000;
	border-radius: 8px;
	box-shadow: 0 0 0 5000px rgba(0, 0, 0, 0.5);
	position: fixed !important;
	z-index: 99998; /* cannot use variable because this element was teleported */
}
</style>
