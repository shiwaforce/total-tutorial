/* eslint-env node */
module.exports = {
	root: true,
	globals: {
	},
	extends: [
		'eslint-config-client-shiwaforce',
		'plugin:vue/vue3-recommended',
		'plugin:vue-pug/vue3-recommended'
	],
	plugins: ['abc'],
	overrides: [
	],
	rules: {
		'abc/rule': ['error'],
		'array-callback-return': ['error'],
		'arrow-parens': ['error', 'as-needed'],
		'arrow-spacing': ['error'],
		'curly': ['error', 'all'],
		'id-length': ['error', {
			min: 3,
			max: 64,
			properties: 'never',
			exceptions: ['id', 'i', 'j']
		}],
		'id-blacklist': ['error', 'retValue', 'err', 'val', 'test', 'condition', 'element', 'data', 'item', 'obj', 'arr', 'array', 'object'],
		'func-name-matching': ['error'],
		'func-names': ['error'],
		'max-depth': ['error', {max: 4}],
		'max-params': ['error', {max: 7}],
		'max-statements-per-line': ['error'],
		'no-await-in-loop': ['error'],
		'no-const-assign': ['error'],
		'no-duplicate-imports': ['error'],
		'no-multi-spaces': ['error'],
		'object-curly-spacing': [2, 'never'],
		'prefer-const': ['error'],
		'vue/html-indent': ['error', 'tab', {
			attribute: 1,
			baseIndent: 1,
			closeBracket: 0,
			alignAttributesVertically: true,
			ignores: []
		}],
		'vue/max-attributes-per-line': ['error', {
			singleline: {
				max: 4
			}
		}],
		'vue/multi-word-component-names': [0],
		'vue/component-api-style': ['error',
			['script-setup', 'composition']
		],
		'vue/script-indent': ['error', 'tab', {
			baseIndent: 0,
			switchCase: 1
		}]
	},
	parserOptions: {
		ecmaVersion: 11
	}
};
