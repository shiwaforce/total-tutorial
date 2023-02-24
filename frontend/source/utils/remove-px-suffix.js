/**
 * Removes the 'px' suffix from a string.
 *
 * @param {string} str - The input string with or without 'px' suffix.
 * @returns {string} - The input string with the 'px' suffix removed.
 * If the input is not a string, returns the original input.
 *
 * @example
 * const input = '100px';
 * const output = removePxSuffix(input);
 * console.log(output); // '100'
 */
export default function removePxSuffix(str) {
	if (typeof str !== 'string') return str;
	if (str.endsWith('px')) {
		return str.slice(0, -2);
	}
	return str;
}
