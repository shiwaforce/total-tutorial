import packageJson from '../../package.json';

const APP_NAME = 'total-tutorial';
const DEFAULT_WIDTH_OF_TUTORIAL_LAYER = 320;
const DEFAULT_HEIGHT_OF_TUTORIAL_LAYER = 240;
const ALLOWED_HTML_TAGS = ['br'];
export default {
	APP_NAME,
	DEFAULT_WIDTH_OF_TUTORIAL_LAYER,
	DEFAULT_HEIGHT_OF_TUTORIAL_LAYER,
	LOCAL_STORAGE_KEY: APP_NAME + '_state',
	STATIC_URL: packageJson.bugs?.url,
	QUERY_PARAM_INTRO: '=',
	INIT_STATIC: 'init-static',
	CURRENT_ELEMENT_CLASSNAME: 'tt-current-element',
	CURRENT_PARENTS_CLASSNAME: 'tt-current-parents',
	JSON_PARSE_ERROR_CONTEXT_LENGTH : 15,
	ROOT_ID: 'rootId',
	ALLOWED_HTML_TAGS,
	WEBSITE_MUTATION_TIMEOUT_ON_BOOT_MS: 2000
};
