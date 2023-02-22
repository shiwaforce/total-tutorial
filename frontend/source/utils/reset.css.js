/**
 * reset.css
 * It's not a plain css file because it would be included in the other css before prefixing.
 * Prefixing is needed to make sure that the rest of the site is not modified.
 * @author sarkiroka
 */
export default `
a,button,div,h1,h2,p,input {
	background-color: var(--background-color);
	border: 0;
	box-sizing: border-box;
	color: var(--color-normal);
	font-family: Verdana,Geneva,sans-serif;
	font-size: 16px;
	font-weight: normal;
	line-height: normal;
	margin: 0;
	overflow: initial;
	padding: 0;
	text-decoration: none;
	-webkit-appearance: auto!important;
}
`.replaceAll(/[\r\n\t]/img, '');
