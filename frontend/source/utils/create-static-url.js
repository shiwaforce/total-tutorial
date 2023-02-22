import constants from './constants';

/**
 * Compiles the static link
 * @param staticPath {string} the static path
 * @returns {string} full link
 * @author sarkiroka
 */
export function createStaticUrl(staticPath) {
	return `${constants.STATIC_URL}${constants.QUERY_PARAM_INTRO}${staticPath}`;
}

/**
 * This vue plugin allows static content to load faster on subsequent page loads, which can improve site performance.
 * @author sarkiroka
 */
export const staticCachePlugin = {
	install(app, options) {
		app.provide(`$${constants.INIT_STATIC}`, () => {
			const hasStaticOnTheBottom = top[options.bottom];
			if (hasStaticOnTheBottom) {
				localStorage.setItem(`${constants.APP_NAME}-${constants.INIT_STATIC}`, !hasStaticOnTheBottom);
				options.get(options.static(hasStaticOnTheBottom));
			}
		});
	}
};
