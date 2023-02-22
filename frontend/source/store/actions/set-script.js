/**
 * saves the current script to later usage
 * @param script {scriptDomElement}
 * @author sarkiroka
 */
export default function setScript(script) {
	console.assert(!this.currentScript, 'redefine is not allowed');
	this.currentScript = script;
}
