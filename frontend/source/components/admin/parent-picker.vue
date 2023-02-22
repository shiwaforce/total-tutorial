<template lang="pug">
.initOverlay
	.initContainer(:class="{isParentSelectionInProgress}")
		p.initTitle
			| Select different parent element (optional)
		p.initText
			| Optionally, you can select one of the parent elements of the chosen element.
			br
			| This can be useful if it was not possible to click on it because the parent HTML element
			| and the child HTML element were pixel-matched (are the same size).
		p.initText
			| Level of parent from child:
			strong  {{ selectedParentIndex }}
		.parentSelectorRangeWrapper
			input#range.range(
				v-model="selectedParentIndex",
				type="range",
				name="parent",
				list="parentSelectors",
				:max="parentSelectors.length - 1",
				@mousedown="startRangeDrag",
				@mouseup="endRangeDrag")
			datalist#parentSelectors
				option(v-for="(_, index) in parentSelectors", :key="index", :value="index")
			pre.htmlSelector {{ currentParentSelector }}
			button.initSaveSettingsButton(@click="selectParent")
				svg-icon(icon="thumbsup")
				| Looks good
</template>

<script setup>
import {computed, ref, watchEffect} from 'vue';
import getCssSelector from '../../utils/get-css-selector';
import SvgIcon from '../svg-icon/svg-icon.vue';

const props = defineProps({
	pickedElement: {
		type: Object,
		required: true
	}
});

const emit = defineEmits(['on-finish-selection', 'on-show-parent-layer']);

const selectedElement = ref(props.pickedElement);
const selectedParentIndex = ref(0);
const isParentSelectionInProgress = ref(false);

const parentsOfPickedElements = computed(() => {
	const parentsArray = [];
	let currentElement = props.pickedElement;
	while ((currentElement?.tagName + '').toUpperCase() != 'BODY') {
		parentsArray.push(currentElement);
		currentElement = currentElement.parentElement;
	}
	return parentsArray;
});

const parentSelectors = computed(() => {
	return parentsOfPickedElements.value.map(parentElement => getCssSelector(parentElement));
});

const currentParentSelector = computed(() => getCssSelector(parentsOfPickedElements.value[selectedParentIndex.value]));

function selectParent() {
	emit('on-finish-selection', selectedElement.value);
}

watchEffect(() => {
	emit('on-show-parent-layer', currentParentSelector.value);
});

function startRangeDrag() {
	isParentSelectionInProgress.value = true;
}

function endRangeDrag() {
	isParentSelectionInProgress.value = false;
}
</script>

<style scoped>
.initOverlay {
	background-color: rgba(0, 0, 0, .4);
	content: '';
	display: block;
	left: 0;
	height: 100vh;
	position: fixed;
	top: 0;
	width: 100vw;
	z-index: 92147483645;
}

.initContainer {
	background: #fff;
	border: none;
	border-radius: 6px;
	box-shadow: 0 4px 5px -2px rgba(58, 53, 65, .08), 0 2px 10px 1px rgba(58, 53, 65, .12), 0 2px 16px 1px rgba(58, 53, 65, .04);
	box-sizing: border-box;
	color: rgba(58, 53, 65, 1);
	font-family: Arial, sans-serif;
	left: calc(50% - 250px);
	max-height: calc(100vh - 100px);
	padding: 16px;
	position: fixed;
	overflow: hidden auto;
	top: 50px;
	transition-duration: .28s;
	transition-property: box-shadow, opacity;
	transition-timing-function: cubic-bezier(.4, 0, .2, 1);
	width: 500px;
	z-index: 92147483646;
}

.initTitle {
	color: rgba(58, 53, 65, 1);
	font-size: 20px;
	font-weight: 500;
	letter-spacing: normal;
	line-height: 32px;
	margin: 0 0 12px;
	padding: 0 30px 0 0;
}

.initText {
	color: rgba(58, 53, 65, .68);
	font-size: 14px;
	font-weight: 400;
	letter-spacing: normal;
	line-height: 20px;
	margin: 0 0 12px;
	padding: 0;
}

.initSaveSettingsButton {
	align-items: center;
	background-color: rgb(145, 85, 253);
	border: none;
	border-radius: 5px;
	box-shadow: 0 4px 14px -4px rgba(58, 53, 65, .08), 0 4px 8px -4px rgba(58, 53, 65, .12), 0 4px 8px -4px rgba(58, 53, 65, .04);
	color: rgb(255, 255, 255);
	cursor: pointer;
	display: flex;
	font-size: 14px;
	font-weight: 500;
	gap: 8px;
	height: 30px;
	justify-content: center;
	letter-spacing: normal;
	margin-left: auto;
	min-width: fit-content;
	padding-left: 18px;
	padding-right: 18px;
	text-align: center;
	transition-property: box-shadow, transform, opacity, background;
	transition-duration: .28s;
	transition-timing-function: cubic-bezier(.4, 0, .2, 1);
}

.initSaveSettingsButton:hover {
	box-shadow: 0 2px 4px -1px rgba(58, 53, 65, .08), 0 4px 5px 0 rgba(58, 53, 65, .12), 0 1px 10px 0 rgba(58, 53, 65, .04);
}

.initSaveSettingsButton .initSaveSettingsIcon {
	height: 20px;
	min-height: 20px;
	min-width: 20px;
	width: 20px;
}

.parentSelectorRangeWrapper {
	background-color: rgba(255, 255, 255, .4);
	border-radius: 6px;
	margin-left: -12px;
	margin-right: -12px;
	padding: 12px;
}

.range {
	appearance: auto;
	background-color: transparent;
	border: none;
	cursor: ew-resize;
	margin: 0;
	outline: none;
	padding: 0;
	resize: none;
	width: 100%;
}

.htmlSelector {
	background-color: #f4f4f4;
	border: 1px solid #e8e8e8;
	border-radius: 3px;
	color: #666;
	font-family: monospace;
	font-size: 12px;
	line-height: 1.4em;
	margin:	12px 0 16px;
	max-height: 100px;
	max-width: 100%;
	overflow: auto;
	padding: 4px;
	word-wrap: break-word;
	white-space: normal;
}

datalist {
	writing-mode: vertical-lr;
}

.isParentSelectionInProgress {
	background-color: rgba(255, 255, 255, 0);
	box-shadow: none;
}

.isParentSelectionInProgress.initContainer {
	overflow: hidden;
}

.isParentSelectionInProgress .initTitle,
.isParentSelectionInProgress .initText {
	visibility: hidden;
}

.isParentSelectionInProgress .initSaveSettingsButton {
	visibility: hidden;
}

.isParentSelectionInProgress .range {
	color: #000;
}
</style>
