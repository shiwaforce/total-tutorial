import constants from './constants';
import pad from './pad';

/**
 * The default JSON.parse() error handling is not informative enough in case of an error. For a
 * larger JSON, it is problematic to know where the error is in case of a syntax error, if only
 * its position is given in the error. Therefore, here we supplement the error if possible by
 * also showing a short insight from the parsed text around the error, specifically indicating the error.
 * @param textContent text with json string
 * @returns {*} parsed json
 * @author sarkiroka
 */
export default function usefulJsonParse(textContent) {
	let parsedContent = null;
	try {
		parsedContent = JSON.parse(textContent);
	} catch (parseError) {
		let parseErrorString = parseError.toString();
		const positionMatch = parseErrorString.match(/at position (\d+)/);
		if (positionMatch && positionMatch[1]) { // original error has position information
			const position = parseInt(positionMatch[1], 10) || 0;
			const textFragment =
				textContent.substring(position - constants.JSON_PARSE_ERROR_CONTEXT_LENGTH, position + 3 * constants.JSON_PARSE_ERROR_CONTEXT_LENGTH);
			const signPosition = Math.min(position, constants.JSON_PARSE_ERROR_CONTEXT_LENGTH);
			const signMargin = pad('', signPosition);
			parseErrorString += `\n\n${textFragment.replace(/\r|\n|\t/g, ' ')}\n${signMargin}^`;
		}
		throw parseErrorString;
	}
	return parsedContent;
}
