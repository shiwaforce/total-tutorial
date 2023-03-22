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
import {inject, onBeforeUnmount, onMounted, ref} from 'vue';
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
let observing = false;

const initStatic = inject(`$${constants.INIT_STATIC}`);

const stepSelectorPresent = step => !step.selector || document.querySelector(step.selector);
let observerTimeout = -1;
let websiteMutationTimeoutOnBootMs = constants.WEBSITE_MUTATION_TIMEOUT_ON_BOOT_MS;
const loadAnyway = () => {
	const foundMustHaveSelectorMissing = config?.steps?.filter(step => step.selector && step.mustPresent && !document.querySelector(step.selector));
	if (foundMustHaveSelectorMissing.length) {
		console.debug('waits for must have selectors', foundMustHaveSelectorMissing.map(step => step.selector));
		// if mutation observer not trigger, try it later
		observerTimeout = setTimeout(loadAnyway, websiteMutationTimeoutOnBootMs);
		websiteMutationTimeoutOnBootMs *= 1.25;
	} else {
		const notFoundSteps = config?.steps?.filter(step => step.selector && !document.querySelector(step.selector));
		console.debug('site does not loaded at time, drop not loaded selectors', notFoundSteps.map(step => step.selector));
		notFoundSteps.forEach(step => {
			step.selector = '';
		});
		hasAllElementsLoaded.value = true;
	}
};
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
};
const observer = new MutationObserver(mutationObserverCallback);
const startObserving = () => {
	console.debug('observing start');
	observer.observe(document.body, {attributes: true, childList: true, subtree: true});
	mutationObserverCallback();
	observing = true;
};
let state;

function startup() {
	try {
		state = JSON.parse(localStorage.getItem(constants.LOCAL_STORAGE_KEY))?.[window.location.pathname];
		isTutorialClosed.value = state?.exit;
		isTutorialFinished.value = state?.finish;
	} catch (error) {
		console.warn('Couldn\'t get local storage', error, isTutorialClosed, isTutorialFinished);
		isTutorialClosed.value = false;
		isTutorialFinished.value = false;
	}
	const isNeedToShow = config && !(isTutorialFinished.value || isTutorialClosed.value);
	onPathChange(() => {
		config = store.configForCurrentUrl();
		hasAllElementsLoaded.value = config?.steps?.every(step => document.querySelector(step.selector) || !step.selector);
		if (!observing && isNeedToShow) {
			startObserving();
		}
	});
	if (isNeedToShow) {
		startObserving();
		if (!localStorage.getItem(`${constants.APP_NAME}_${constants.INIT_STATIC}`)) {
			initStatic();
		}
	} else {
		console.debug('tutorial not need to show', isNeedToShow, isTutorialFinished.value, isTutorialClosed.value);
	}
}
onMounted(() => {
	startup();
});

document.addEventListener('total-tutorial-restart', () => {
	localStorage.removeItem(`${constants.APP_NAME}_${constants.INIT_STATIC}`);
	localStorage.removeItem(`${constants.LOCAL_STORAGE_KEY}`);
	startup();
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

const updateTutorialState = actionType => {
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
