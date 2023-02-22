/**
 * The string in the parameter is extended to "`amount`" if necessary.
 * The addition is done with the character specified in "`padCharacter`".
 * @param string {string} the original string
 * @param amount {number} expected length
 * @param padCharacter this charater used with pad
 * @param isLeft side of the pad
 * @returns {string} padded string with length at least "`amount`"
 * @author sarkiroka
 */
export default function pad(string, amount, padCharacter = ' ', isLeft = true) {
	console.assert(typeof string == 'string', 'please provide a string to pad', typeof string);
	console.assert(padCharacter.length == 1, 'length of the padCharacter should be 1');
	let paddedString = string;
	while (paddedString.length < amount) {
		paddedString = isLeft ? `${padCharacter}${paddedString}` : `${paddedString}${padCharacter}`;
	}
	return paddedString;
}
