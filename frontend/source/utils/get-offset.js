/**
 * Calculates the offset top of the given DOM node relative to the top of its offset parent.
 *	@param {HTMLElement} node - The DOM node for which to calculate the offset top.
 *	@returns {number} - The offset top of the given node relative to its offset parent.
 */
export function getOffsetTop(node) {
	return node ? node.offsetTop + getOffsetTop(node.offsetParent) : 0;
}
/**
 *	Calculates the offset left of the given DOM node relative to the left of its offset parent.
 *	@param {HTMLElement} node - The DOM node for which to calculate the offset left.
 *	@returns {number} - The offset left of the given node relative to its offset parent.
 */
export function getOffsetLeft(node) {
	return node ? node.offsetLeft + getOffsetLeft(node.offsetParent) : 0;
}
