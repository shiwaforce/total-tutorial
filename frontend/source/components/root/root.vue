<template lang="pug">
step-box(
	v-if="config?.steps?.length && !isTutorialClosed && !isTutorialFinished && hasAllElementsLoaded"
	:config="config"
	@exit-tutorial="onExitTutorial"
	@finish-tutorial="onFinishTutorial"
)
.tt-display-none {{ hasAllElementsLoaded }}
</template>

<script setup>
import constants from '../../utils/constants';
import {inject, nextTick, onBeforeUnmount, onMounted, ref} from 'vue';
import loadStateFromLocalStorage from '../../utils/state/load-state-from-local-storage';
import onPathChange from '../../utils/on-path-change';
import saveStateToLocalStorage from '../../utils/state/save-state-to-local-storage';
import StepBox from '../step-box/step-box.vue';
import {useStore} from '../../store/use-store';

const rootId = inject(constants.ROOT_ID);
const isTutorialClosed = ref(false);
const isTutorialFinished = ref(false);
const hasAllElementsLoaded = ref(false);

const store = useStore();

let config = store.configForCurrentUrl();

const stepSelectorPresent = step => !step.selector || document.querySelector(step.selector);
let observerTimeout = -1;
const loadAnyway = () => {
	const foundMustHaveSelectorMissing = config?.steps?.filter(step => step.selector && step.mustPresent && !document.querySelector(step.selector));
	if (foundMustHaveSelectorMissing.length) {
		console.debug('waits for must have selectors', foundMustHaveSelectorMissing.map(step => step.selector));
		// if mutation observer not trigger, try it later
		observerTimeout = setTimeout(loadAnyway, constants.WEBSITE_MUTATION_TIMEOUT_ON_BOOT_MS);
	} else {
		const notFoundSteps = config?.steps?.filter(step => step.selector && !document.querySelector(step.selector));
		console.debug('site does not loaded at time, drop not loaded selectors', notFoundSteps.map(step => step.selector));
		notFoundSteps.forEach(step => {
			step.selector = '';
		})
		hasAllElementsLoaded.value = true;
	}
}
const mutationObserverCallback = () => {
	clearTimeout(observerTimeout);
	const loaded = config?.steps?.length && config?.steps.every(stepSelectorPresent);
	if (loaded) {
		setTimeout(() => { // when loaded, try to access later again
			hasAllElementsLoaded.value = config?.steps?.every(stepSelectorPresent);
		});
	} else {
		console.debug('total tutorial waits for selector(s)', config?.steps?.filter(step => step.selector && !document.querySelector(step.selector)).map(step => step.selector));
		// if site too slow, or broken, show tutorial anyway
		observerTimeout = setTimeout(loadAnyway, constants.WEBSITE_MUTATION_TIMEOUT_ON_BOOT_MS);
	}
}
const observer = new MutationObserver(mutationObserverCallback);

onMounted(() => {
	try {
		const state = JSON.parse(localStorage.getItem(constants.LOCAL_STORAGE_KEY))?.[window.location.pathname];
		isTutorialClosed.value = state?.isClosed;
		isTutorialFinished.value = state?.isFinished;
	} catch (error) {
		console.warn('Couldn\'t get local storage', error, isTutorialClosed, isTutorialFinished);
		isTutorialClosed.value = false;
		isTutorialFinished.value = false;
	}
	onPathChange(() => {
		config = store.configForCurrentUrl();
		hasAllElementsLoaded.value = config?.steps?.every(step => document.querySelector(step.selector) || !step.selector);
	});
	console.debug('observing start');
	observer.observe(document.body, {attributes: true, childList: true, subtree: true});
	mutationObserverCallback();
	const initStatic = inject(`$${constants.INIT_STATIC}`);
	if (!localStorage.getItem(`${constants.APP_NAME}_${constants.INIT_STATIC}`)) {
		initStatic();
	}
});

onBeforeUnmount(() => {
	observer.disconnect();
});

function sendDomEvent(eventName, detail = {}) {
	const rootElement = document.getElementById(rootId);
	rootElement?.dispatchEvent(new CustomEvent(eventName, {
		bubbles: true,
		detail
	}));
}

const updateTutorialState = (actionType) => {
	const currentPathname = window.location.pathname;
	const state = loadStateFromLocalStorage();
	const tutorialState = state[currentPathname] || {steps: []};
	tutorialState[actionType] = true;
	state[currentPathname] = tutorialState;
	saveStateToLocalStorage(state);
	sendDomEvent(`total-tutorial-${actionType}`, {step: config.currentStep});
};

const onExitTutorial = () => {
	isTutorialClosed.value = true;
	updateTutorialState('exit');
};

const onFinishTutorial = () => {
	isTutorialFinished.value = true;
	updateTutorialState('finish');
};
</script>

<style scoped>
.tt-display-none {
	display: none;
}
</style>
