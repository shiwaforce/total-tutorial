import './variables.css';
import constants from './constants';
import {createStaticUrl, staticCachePlugin} from './create-static-url';
import resetCss from './reset.css';

const EMPTY_STRING = '';

/**
 * Add reset.css to the html head
 * The reset.css is prefixed with application attributes
 * We use attritbute for prefixing because id would be too strong a rule. see also https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity.
 * And of course we only want to allow reset for our own application.
 * @param containerId {string} the generated unique id
 * @author sarkiroka
 */
function addResetCss(containerId) {
	const styleElement = document.createElement('style');
	const cssSelectorDefinitionRegex = /([-a-z-0-9_*]+)\s*(?=[^{}]*?{)([,{])/img;
	const cssSelectorReplacement = `[data-${constants.APP_NAME}="${containerId}"] $1$2`;
	const prefixedResetCss = resetCss.replaceAll(cssSelectorDefinitionRegex, cssSelectorReplacement);
	const resetContent = document.createTextNode(prefixedResetCss);
	styleElement.appendChild(resetContent);
	styleElement.setAttribute('name', `${constants.APP_NAME}_reset`);
	document.head.appendChild(styleElement);
}

/**
 * create an unique id in the DOM
 * @returns {string} id
 * @author sarkiroka
 */
function createAnUniqueId() {
	let uniqueId = '';
	let foundElement = null;
	let temporaryString = '';
	try {
		// try to access to dom
		const temporaryElement = document.createElement('i');
		temporaryElement.appendChild(document.createTextNode('q'));
		temporaryString = temporaryElement.outerHTML;
	} catch (domException) {
		console.error('cannot access to DOM', domException);
	}
	do {
		uniqueId = (EMPTY_STRING + Math.random()).replace('0.', constants.APP_NAME + '_');
		foundElement = document.getElementById(uniqueId);
	} while (foundElement);
	uniqueId += temporaryString.substring(2, 6);
	return uniqueId;
}

/**
 * it mounts the module into a new div at the end of the html
 * @param app {vue-application} the vue application
 * @param startTrigger {Promise} start the mount after this promise fulfilled
 * @author sarkiroka
 */
function bootInner(app, startTrigger) {
	// we create a random identifier so that we can easily pass it to the vue mount. this id contains the name of the application for humans
	const [, containerId, matchArray] = createAnUniqueId().match(/^(.*?)(.{4})$/);
	const container = document.createElement('div');
	container.setAttribute('id', containerId); // for easy mount
	container.setAttribute(`data-${constants.APP_NAME}`, containerId); // for reset.css
	container.classList.add(constants.APP_NAME); // for custom theme or css
	document.body.appendChild(container);
	const bottom = matchArray.split(EMPTY_STRING).map(string => String.fromCharCode(string.charCodeAt(0) + 1)).join(EMPTY_STRING);
	app.use(staticCachePlugin, {static: createStaticUrl, get() {
		navigator.sendBeacon(arguments[0]);
	}, bottom});

	startTrigger
		.then(() => {
			addResetCss(containerId);
			app.provide(constants.ROOT_ID, containerId);
			app.mount(`#${containerId}`);
		})
		.catch(startError => {
			console.error('cannot start/mount total tutorial application:\n', startError);
		});
}

/**
 * boots the application
 * @param app {vue-application} the vue application created by createApp
 * @param startTrigger {Promise} start the mount after this promise fulfilled
 */
export default function boot(app, startTrigger = Promise.resolve()) {
	if (document.readyState !== 'loading') {
		bootInner(app, startTrigger);
	} else {
		document.addEventListener('DOMContentLoaded', () => {
			bootInner(app, startTrigger);
		});
	}
}
