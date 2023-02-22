/**
 * A function that creates a download link for a file and simulates a click on it to trigger a file download.
 * @param {string} filename - The name of the file to be downloaded.
 * @param {string} content - The content to be downloaded.
 * @param {string} [mime='text/plain'] - The MIME type of the content.
 * @returns {void}
 */
export default function download(filename, content, mime = 'text/plain') {
	const anchorElement = document.createElement('a');
	const encodedContentData = encodeURIComponent(content);
	anchorElement.setAttribute('href', `data:${mime};charset=utf-8,${encodedContentData}`);
	anchorElement.setAttribute('download', filename);
	anchorElement.style.display = 'none';
	document.body.appendChild(anchorElement);

	anchorElement.click();

	document.body.removeChild(anchorElement);
}
