import constants from './constants';
/**
 * Scrolls the window to the middle of the given tutorial step element.
 * If the combined height of the tutorial step and the current element's bounding rectangle is not provided, the default height is used.
 *
 * @param {Object} step - The tutorial step element to scroll to.
 * @param {Object} currentElementBoundingRect - The bounding rectangle of the current element that the tutorial step is associated with.
 * @param {number} currentElementBoundingRect.top - The top position of the current element.
 * @param {number} currentElementBoundingRect.height - The height of the current element.
 * @returns {void}
 */
export const scrollIntoTheMiddleOfTheTutorialStep = (step, currentElementBoundingRect) => {
	const combinedHeight = currentElementBoundingRect.height + step.height || constants.DEFAULT_HEIGHT_OF_TUTORIAL_LAYER;
	const scrollY = currentElementBoundingRect.top + combinedHeight / 2 - window.innerHeight / 2;
	window.scroll({
		top: scrollY,
		behavior: 'smooth'
	});
};
