import constants from './constants';

/**
 * Calculates the left position of the tutorial box, based on the width of the box, the selector of the current element
 * and its bounding rectangle.
 * @param {string|number} width - The width of the tutorial box. If not provided or not a number, the default width will be used.
 * @param {string} selector - The CSS selector of the current element.
 * @param {Object} currentElementBoundingRect - The bounding rectangle of the current element.
 * @returns {string} The calculated left position of the tutorial box, in pixels.
 */
const calculateTutorialBoxLeft = (width, selector, currentElementBoundingRect) => {
	const boxWidth = parseInt(width, 10) || constants.DEFAULT_WIDTH_OF_TUTORIAL_LAYER;
	const screenWidth = window.innerWidth;
	const elementLeft = currentElementBoundingRect.left;
	const hasVerticalScrollbar = document.documentElement.scrollHeight > document.documentElement.clientHeight;
	const scrollbarWidth = hasVerticalScrollbar ? window.innerWidth - document.documentElement.clientWidth : 0;

	if (!selector) {
		// Center the box horizontally on the screen, taking into account the scrollbar width.
		return `${(screenWidth - boxWidth - scrollbarWidth) / 2}px`;
	} else {
		// Calculate the minimum left position required to fully show the element inside the screen.
		const minLeft = screenWidth - boxWidth - scrollbarWidth;
		const left = Math.max(Math.min(elementLeft - 25 - scrollbarWidth, minLeft), 2);
		const right = left + boxWidth;

		// If the element extends beyond the right edge of the screen, adjust the left position.
		if (right > screenWidth - scrollbarWidth) {
			return `${left - (right - screenWidth + scrollbarWidth)}px`;
		} else {
			return `${left}px`;
		}
	}
};

export default calculateTutorialBoxLeft;
