/*! HTML5 Shiv v3.1 | @jon_neal @afarkas @rem | MIT/GPL2 Licensed */
(function (win, doc) {
	// feature detection: whether the browser supports unknown elements
	var supportsUnknownElements = (function (a) {
		a.innerHTML = '<x-element></x-element>';

		return a.childNodes.length === 1;
	})(doc.createElement('a'));

	// feature detection: whether the browser supports default html5 styles
	var supportsHtml5Styles = (function (nav, docEl, compStyle) {
		docEl.appendChild(nav);

		return (compStyle = (compStyle ? compStyle(nav) : nav.currentStyle).display) && docEl.removeChild(nav) && compStyle === 'block';
	})(doc.createElement('nav'), doc.documentElement, win.getComputedStyle);

	// html5 global so that more elements can be shived and also so that existing shiving can be detected on iframes
	// more elements can be added and shived with the following code: html5.elements.push('element-name'); html5.shivDocument(document);
	// default options can be changed before the script is included: html5 = { shivMethods: false, shivCSS: false, elements: 'foo bar' };
	var html5 = {
		// a list of html5 elements
		elements: html5 && html5.elements ? html5.elements : 'abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video'.split(' '),
		shivMethods: html5 && html5.shivMethods ? html5.shivMethods : true,
		shivCSS: html5 && html5.shivCSS ? html5.shivCSS : true,
		shivDocument: function (scopeDocument) {
			if (supportsUnknownElements || scopeDocument.documentShived) {
				return;
			}

			var
			documentCreateElement = scopeDocument.createElement,
			documentCreateDocumentFragment = scopeDocument.createDocumentFragment;

			// shiv the document
			for (var i = 0, l = html5.elements.length; i < l; ++i) {
				documentCreateElement(html5.elements[i]);
			}

			// shiv document create element function
			scopeDocument.createElement = function (nodeName) {
				var element = documentCreateElement(nodeName);

				if (html5.shivMethods && element.canHaveChildren && !(element.xmlns || element.tagUrn)) {
					html5.shivDocument(element.document);
				}

				return element;
			};

			// shiv document create document fragment function
			scopeDocument.createDocumentFragment = function () {
				var frag = documentCreateDocumentFragment();

				return html5.shivMethods ? html5.shivDocument(frag) : frag;
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

			scopeDocument.documentShived = true;

			return scopeDocument;
		}
	};

	// shiv the document
	html5.shivDocument(doc);

	html5.type = 'default';

	win.html5 = html5;
})(this, document);