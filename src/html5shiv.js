/*! HTML5 Shiv vpre3.3 | @jon_neal @afarkas @rem | MIT/GPL2 Licensed */
(function (win, doc) {
	// set local variables
	var call = Date.call, elements, timestamp;

	// set html5
	var html5 = win.html5 || {};
	
	// feature detection: whether the browser supports default html5 styles
	var supportsHtml5Styles = (function(a, docEl, compStyle) {
		var fake, supported, root = doc.body || (fake = docEl.insertBefore(doc.createElement('body'), docEl.firstChild));

		root.insertBefore(a, root.firstChild);

		a.hidden = true;

		supported = (compStyle ? compStyle(a, null) : a.currentStyle).display === 'none';

		root.removeChild(a);

		fake && docEl.removeChild(fake);

		return supported;
	})(doc.createElement('a'), doc.documentElement, win.getComputedStyle);

	// feature detection: whether the browser supports unknown elements
	var supportsUnknownElements = (function (a) {
		a.innerHTML = '<x-element></x-element>';

		return a.childNodes.length === 1;
	})(doc.createElement('a'));

	function getElements() {
		return elements.slice();
	}

	function setElements(els) {
		timestamp = +(new Date);

		elements = (typeof els === 'object') ? els : els.split(' ');
	}

	setElements('abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video');

	// html5 global so that more elements can be shived and also so that existing shiving can be detected on iframes
	// options can be changed before the script is included: html5 = { shivMethods: false, shivCSS: false }
	// elements can be changed before or after the script is included: html = { elements: 'foo bar' }
	html5 = {
		// a list of html5 elements
		'getElements': getElements,
		'setElements': setElements,
		'shivCSS': !(html5.shivCSS === false),
		'shivMethods': !(html5.shivMethods === false),
		'shivDocument': function (scopeDocument) {
			var cacheStamp = timestamp, cacheNodes = {};

			if (!supportsUnknownElements && !scopeDocument.documentShived) {
				var documentCreateElement = scopeDocument.createElement, documentCreateDocumentFragment = scopeDocument.createDocumentFragment;

				// shiv the document
				for (var i = 0, l = elements.length; i < l; ++i) {
					call.call(documentCreateElement, scopeDocument, elements[i]);
				}

				// shiv the document create element method
				scopeDocument.createElement = function (nodeName) {
					if (cacheStamp !== timestamp) {
						cacheNodes = {};
						cacheStamp = timstamp;
					}

					var nodeCached = cacheNodes[nodeName], node = nodeCached ? nodeCached.cloneNode(false) : call.call(documentCreateElement, scopeDocument, nodeName);

					// shiv only non-cached supported elements (supporting children, not namespaced)
					if (html5.shivMethods && !nodeCached && node.canHaveChildren && !(node.xmlns || node.tagUrn)) {
						html5.shivDocument(node.document);
						cacheNodes[nodeName] = node;
					}

					return node;
				};

				// shiv the document create document fragment method
				scopeDocument.createDocumentFragment = function () {
					var node = call.call(documentCreateDocumentFragment, scopeDocument);

					return (html5.shivMethods) ? html5.shivDocument(node) : node;
				};
			}

			// set the document head variable
			var documentHead = scopeDocument.getElementsByTagName('head')[0];

			// shiv the default html5 styles
			if (html5.shivCSS && !supportsHtml5Styles && documentHead) {
				var p = scopeDocument.createElement('p');

				p.innerHTML = 'x<style>' +
					'article,aside,details,figcaption,figure,footer,header,hgroup,nav,section{display:block}' + // Corrects block display not defined in IE6/7/8/9
					'audio{display:none}' + // Corrects audio display not defined in IE6/7/8/9
					'canvas,video{display:inline-block;*display:inline;*zoom:1}' + // Corrects canvas and video display not defined in IE6/7/8/9
					'[hidden]{display:none}audio[controls]{display:inline-block;*display:inline;*zoom:1}' + // Corrects 'hidden' attribute and audio[controls] display not present in IE7/8/9
					'mark{background:#FF0;color:#000}' + // Addresses styling not present in IE6/7/8/9
				'</style>';

				documentHead.insertBefore(p.lastChild, documentHead.firstChild);
			}

			// set the document as shivved
			scopeDocument.documentShived = true;

			// return the document
			return scopeDocument;
		}
	};

	// expose shiv type
	html5.type = 'default';

	// expose html5
	win.html5 = html5;

	// shiv the document
	html5.shivDocument(doc);
})(this, document);