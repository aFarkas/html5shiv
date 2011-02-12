/* On Window Load */
window.onload = function () {
	var anchor = document.getElementsByTagName('a'),
		a = -1;
	while (++a < anchor.length) {
		if (anchor[a].getAttribute('rel') == 'external') {
			anchor[a].setAttribute('target', '_blank');
		}
	}
};