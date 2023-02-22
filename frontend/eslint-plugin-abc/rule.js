/**
 * @fileoverview Rule to require sorting of import declarations
 * @author sarkiroka
 */
'use strict';

const memberSyntaxSortOrder = ['none', 'all', 'other'];
const syntaxHumanizer = (syntax, example) => {
	let retValue = syntax;
	switch (syntax) {
		case 'none':
			retValue = `"none of field imported" (${example})`;
			break;
		case 'all':
			retValue = `"all of fileds imported" (${example})`;
			break;
		case 'other':
			retValue = `"other import syntaxes" (${example})`;
			break;
		default:
			retValue = syntax;
	}
	return retValue;
};

/**
 * Gets the group by member parameter index for given declaration.
 * @param {ASTNode} node the ImportDeclaration node.
 * @returns {number} the declaration group by member index.
 */
function getMemberParameterGroupIndex(node) {
	return memberSyntaxSortOrder.indexOf(usedMemberSyntax(node));
}

/**
 * Gets the used member syntax style.
 *
 * import "my-module.js" --> none
 * import * as myModule from "my-module.js" --> all
 * import {myMember} from "my-module.js" --> single
 * import {foo, bar} from  "my-module.js" --> multiple
 * @param {ASTNode} node the ImportDeclaration node.
 * @returns {string} used member parameter style, ["all", "multiple", "single"]
 */
function usedMemberSyntax(node) {
	let retValue = 'other';
	if (node.specifiers.length === 0) {
		retValue = 'none';
	} else if (node.specifiers[0].type === 'ImportNamespaceSpecifier') {
		retValue = 'all';
	}
	return retValue;
}

/**
 * Gets the local name of the first imported module.
 * @param {ASTNode} node the ImportDeclaration node.
 * @returns {?string} the local name of the first imported module.
 */
function getFirstLocalMemberName(node) {
	let retValue = null;
	if (node.specifiers[0]) {
		retValue = node.specifiers[0].local.name;
	}
	return retValue;
}

/**
 * Calculates number of lines between two nodes. It is assumed that the given `left` node appears before
 * the given `right` node in the source code. Lines are counted from the end of the `left` node till the
 * start of the `right` node. If the given nodes are on the same line, it returns `0`, same as if they were
 * on two consecutive lines.
 * @param {ASTNode} left node that appears before the given `right` node.
 * @param {ASTNode} right node that appears after the given `left` node.
 * @returns {number} number of lines between nodes.
 */
function getNumberOfLinesBetween(left, right) {
	return Math.max(right.loc.start.line - left.loc.end.line - 1, 0);
}


module.exports = {
	meta: {
		type: 'suggestion',

		docs: {
			description: 'enforce sorted import declarations within modules',
			recommended: false,
			url: 'https://eslint.org/docs/rules/abc-imports'
		},

		schema: [],

		fixable: 'code',

		messages: {
			sortImportsAlphabetically: 'Imports should be sorted alphabetically. The second line ({{lineAfter}}) should be earlier than the first line ({{lineBefore}})',
			sortMembersAlphabetically: 'Member "{{member1Name}}" and "{{member2Name}}" of the import declaration should be sorted alphabetically. ({{line}})',
			unexpectedSyntaxOrder: 'Expected "{{syntaxA}}" syntax before "{{syntaxB}}" syntax.'
		}
	},

	create(context) {
		const sourceCode = context.getSourceCode();
		let previousDeclaration = null;
		return {
			ImportDeclaration(node) {
				if (previousDeclaration && false && getNumberOfLinesBetween(previousDeclaration, node) > 0) {
					// reset declaration sort
					previousDeclaration = null;
				}

				if (previousDeclaration) {
					const currentMemberSyntaxGroupIndex = getMemberParameterGroupIndex(node);
					const previousMemberSyntaxGroupIndex = getMemberParameterGroupIndex(previousDeclaration);
					let currentLocalMemberName = getFirstLocalMemberName(node);
					let previousLocalMemberName = getFirstLocalMemberName(previousDeclaration);

					previousLocalMemberName = previousLocalMemberName && previousLocalMemberName.toLowerCase();
					currentLocalMemberName = currentLocalMemberName && currentLocalMemberName.toLowerCase();

					/*
					 * When the current declaration uses a different member syntax,
					 * then check if the ordering is correct.
					 * Otherwise, make a default string compare (like rule sort-vars to be consistent) of the first used local member name.
					 */
					if (currentMemberSyntaxGroupIndex !== previousMemberSyntaxGroupIndex) {
						if (currentMemberSyntaxGroupIndex < previousMemberSyntaxGroupIndex) {
							context.report({
								node,
								messageId: 'unexpectedSyntaxOrder',
								data: {
									syntaxA: syntaxHumanizer(memberSyntaxSortOrder[currentMemberSyntaxGroupIndex], sourceCode.text.substring(node.start, node.end)),
									syntaxB: syntaxHumanizer(memberSyntaxSortOrder[previousMemberSyntaxGroupIndex], sourceCode.text.substring(previousDeclaration.start, previousDeclaration.end))
								}
							});
						}
					} else {
						if (previousLocalMemberName && currentLocalMemberName && currentLocalMemberName < previousLocalMemberName) {
							context.report({
								node,
								messageId: 'sortImportsAlphabetically',
								data: {
									lineAfter: sourceCode.text.substring(node.start, node.end),
									lineBefore: sourceCode.text.substring(previousDeclaration.start, previousDeclaration.end)
								}
							});
						}
					}
				}

				previousDeclaration = node;

				const importSpecifiers = node.specifiers.filter(specifier => specifier.type.toLowerCase().indexOf('import') != -1);
				const getSortableName = specifier => specifier.local.name.toLowerCase();
				const specifiedNames = importSpecifiers.map(getSortableName);

				const firstUnsortedIndex = specifiedNames.findIndex((name, index, array) => array[index - 1] > name);

				if (firstUnsortedIndex !== -1) {
					let line = sourceCode.text.substring(node.start, node.end);
					context.report({
						node: importSpecifiers[firstUnsortedIndex],
						messageId: 'sortMembersAlphabetically',
						data: { member1Name: importSpecifiers[firstUnsortedIndex].local.name, member2Name: specifiedNames[firstUnsortedIndex - 1], line },
						fix(fixer) {
							if (importSpecifiers.some(specifier =>
								sourceCode.getCommentsBefore(specifier).length || sourceCode.getCommentsAfter(specifier).length)) {

								// If there are comments in the ImportSpecifier list, don't rearrange the specifiers.
								return null;
							}

							return fixer.replaceTextRange(
								[importSpecifiers[0].range[0], importSpecifiers[importSpecifiers.length - 1].range[1]],
								importSpecifiers

									// Clone the importSpecifiers array to avoid mutating it
									.slice()

									// Sort the array into the desired order
									.sort((specifierA, specifierB) => {
										const aName = getSortableName(specifierA);
										const bName = getSortableName(specifierB);

										return aName > bName ? 1 : -1;
									})

									// Build a string out of the sorted list of import specifiers and the text between the originals
									.reduce((sourceText, specifier, index) => {
										const textAfterSpecifier = index === importSpecifiers.length - 1 ?
											'' :
											sourceCode.getText().slice(importSpecifiers[index].range[1], importSpecifiers[index + 1].range[0]);

										return sourceText + sourceCode.getText(specifier) + textAfterSpecifier;
									}, '')
							);
						}
					});
				}
			}
		};
	}
};
