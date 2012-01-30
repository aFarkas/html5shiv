/*! HTML5 Shiv v3.1 | @jon_neal @afarkas @rem | MIT/GPL2 Licensed */
(function (win, doc) {
	// feature detection: whether the browser supports unknown elements
	var supportsUnknownElements = (function (a) {
		a.innerHTML = '<x-element></x-element>';

		return a.childNodes.length === 1;
	})(doc.createElement('a'));

	// feature detection: whether the browser supports default html5 styles
	var supportsHtml5Styles = (function(nav, docEl, compStyle) {
		var
		fake,
		supported,
		root = doc.body || (fake = docEl.insertBefore(doc.createElement('body'), docEl.firstChild));

		root.insertBefore(nav, root.firstChild);

		supported = (compStyle ? compStyle(nav) : nav.currentStyle).display === 'block';

		root.removeChild(nav);

		fake && docEl.removeChild(fake);

		return supported;
	})(doc.createElement('nav'), doc.documentElement, win.getComputedStyle);
	
	var html5 = window.html5 || {};
	var elements = html5.element || 'abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video'.split(' ');

	// html5 global so that more elements can be shived and also so that existing shiving can be detected on iframes
	// more elements can be added and shived: html5.elements.push('element-name'); html5.shivDocument(document);
	// defaults can be changed before the script is included: html5 = { shivMethods: false, shivCSS: false, elements: 'foo bar' };
	html5 = {
		// a list of html5 elements
		elements: elements,
		shivMethods: !(html5.shivMethods === false),
		shivCSS: !(html5.shivCSS === false),
		type: 'default',
		shivDocument: function (scopeDocument) {
			if (supportsUnknownElements || scopeDocument.documentShived) {
				return;
			}

			var
			documentCreateElement = scopeDocument.createElement,
			documentCreateDocumentFragment = scopeDocument.createDocumentFragment;

			// shiv the document
			for (var i = 0, l = elements.length; i < l; ++i) {
				documentCreateElement(elements[i]);
			}

			// shiv document create element function
			scopeDocument.createElement = function (nodeName) {
				var element = documentCreateElement(nodeName);

				// don't shiv elements that can't have child nodes or namespaced custom elements to avoid
				// bugs associated with overwriting `createElement()`
				if (html5.shivMethods && element.canHaveChildren && !(element.xmlns || element.tagUrn)) {
					html5.shivDocument(element.document);
				}

				return element;
			};

			// shiv document create document fragment function
			scopeDocument.createDocumentFragment = function () {
				var frag = documentCreateDocumentFragment();

				return (html5.shivMethods) ? html5.shivDocument(frag) : frag;
			};

			// set document head as a variable
			var documentHead = scopeDocument.getElementsByTagName('head')[0];

			// shiv for default html5 styles
			if (html5.shivCSS && !supportsHtml5Styles && documentHead) {
				var div = scopeDocument.createElement('div');

				div.innerHTML = 'x<style>' +
					'article,aside,details,figcaption,figure,footer,header,hgroup,nav,section{display:block}' + // Corrects block display not defined in IE6/7/8/9
					'audio{display:none}' + // Corrects audio display not defined in IE6/7/8/9
					'canvas,video{display:inline-block;*display:inline;*zoom:1}' + // Corrects canvas and video display not defined in IE6/7/8/9 (audio[controls] in IE7)
					'[hidden]{display:none}audio[controls]{display:inline-block;*display:inline;*zoom:1}' + // Corrects 'hidden' attribute and audio[controls] display not present in IE7/8/9
					'mark{background:#FF0;color:#000}' + // Addresses styling not present in IE6/7/8/9
				'</style>';

				documentHead.insertBefore(div.lastChild, documentHead.firstChild);
			}

			// set document as shivved
			scopeDocument.documentShived = true;

			// return document
			return scopeDocument;
		}
	};

	// shiv the document
	html5.shivDocument(doc);

	win.html5 = html5;
})(this, document);