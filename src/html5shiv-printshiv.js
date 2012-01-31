/*! HTML5 Shiv v3.2 | @jon_neal @afarkas @rem | MIT/GPL2 Licensed */
(function (win, doc) {
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

	var call = Date.call;

	var defaultHtml5Elements = 'abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video';

	var html5 = win.html5 || {};
	
	// html5 global so that more elements can be shived and also so that existing shiving can be detected on iframes
	// more elements can be added and shived: html5.elements.push('element-name'); html5.shivDocument(document);
	// defaults can be changed before the script is included: html5 = { shivMethods: false, shivCSS: false, elements: 'foo bar' };
	html5 = {
		// a list of html5 elements
		'elements': (typeof html5.elements === 'object') ? html5.elements : (html5.elements || defaultHtml5Elements).split(' '),
		'shivCSS': !(html5.shivCSS === false),
		'shivMethods': !(html5.shivMethods === false),
		'shivDocument': function (scopeDocument) {
			if (!supportsUnknownElements && !scopeDocument.documentShived) {
				var documentCreateElement = scopeDocument.createElement, documentCreateDocumentFragment = scopeDocument.createDocumentFragment;

				// shiv the document
				for (var i = 0, elements = html5.elements, l = elements.length; i < l; ++i) {
					call.call(documentCreateElement, scopeDocument, elements[i]);
				}

				// shiv the document create element method
				scopeDocument.createElement = function (nodeName) {
					var element = call.call(documentCreateElement, scopeDocument, nodeName);

					// shiv only supported elements (supporting children, not namespaced)
					if (html5.shivMethods && element.canHaveChildren && !(element.xmlns || element.tagUrn)) {
						html5.shivDocument(element.document);
					}

					return element;
				};

				// shiv the document create document fragment method
				scopeDocument.createDocumentFragment = function () {
					var frag = call.call(documentCreateDocumentFragment, scopeDocument);

					return (html5.shivMethods) ? html5.shivDocument(frag) : frag;
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
	html5.type = 'default print';

	// expose html5
	win.html5 = html5;
	
	// shiv the document
	html5.shivDocument(doc);

	// ie print shiv
	if (supportsUnknownElements || !win.attachEvent) {
		return;
	}

	// replaces an element with a namespace-shived clone (eg. header element becomes shiv:header element)
	function namespaceShivElement(element) {
		var elementClone, a, l, i;

		if (doc.documentMode > 7) {
			elementClone = doc.createElement('font');
			elementClone.setAttribute('data-html5shiv', element.nodeName.toLowerCase());
		}
		else {
			elementClone = doc.createElement('shiv:' + element.nodeName);
		}

		while (element.firstChild) {
			elementClone.appendChild(element.childNodes[0]);
		}

		for (a = element.attributes, l = a.length, i = 0; i < l; ++i) {
			if (a[i].specified) {
				elementClone.setAttribute(a[i].nodeName, a[i].nodeValue);
			}
		}

		elementClone.style.cssText = element.style.cssText;
		element.parentNode.replaceChild(elementClone, element);
		elementClone.originalElement = element;
	}

	// restores an element from a namespace-shived clone (eg. shiv:header element becomes header element)
	function unNamespaceShivElement(element) {
		var originalElement = element.originalElement;

		while (element.childNodes.length) {
			originalElement.appendChild(element.childNodes[0]);
		}

		element.parentNode.replaceChild(originalElement, element);
	}

	// get style sheet list css text
	function getStyleSheetListCssText(styleSheetList, mediaType) {
		// set media type
		mediaType = mediaType || 'all';

		// set local variables
		var
		i = -1,
		cssTextArr = [],
		styleSheetListLength = styleSheetList.length,
		styleSheet,
		styleSheetMediaType;

		// loop through style sheets
		while (++i < styleSheetListLength) {
			// get style sheet
			styleSheet = styleSheetList[i];

			// get style sheet media type
			styleSheetMediaType = styleSheet.media || mediaType;

			// skip a disabled or non-print style sheet
			if (styleSheet.disabled || !(/print|all/.test(styleSheetMediaType))) {
				continue;
			}

			// push style sheet css text
			cssTextArr.push(getStyleSheetListCssText(styleSheet.imports, styleSheetMediaType), styleSheet.cssText);
		}

		// return css text
		return cssTextArr.join('');
	}

	// shiv css text (eg. header {} becomes shiv\:header {})
	function shivCssText (cssText) {
		// set local variables
		var
		elementsRegExp = new RegExp('(^|[\\s,{}])(' + html5.elements.join('|') + ')', 'gi'),
		cssTextSplit = cssText.split('{'),
		cssTextSplitLength = cssTextSplit.length,
		i = -1;

		// shiv css text
		while (++i < cssTextSplitLength) {
			cssTextSplit[i] = cssTextSplit[i].split('}');

			if (doc.documentMode > 7) {
				cssTextSplit[i][cssTextSplit[i].length - 1] = cssTextSplit[i][cssTextSplit[i].length - 1].replace(elementsRegExp, '$1font[data-html5shiv="$2"]');
			}
			else {
				cssTextSplit[i][cssTextSplit[i].length - 1] = cssTextSplit[i][cssTextSplit[i].length - 1].replace(elementsRegExp, '$1shiv\\:$2');
			}

			cssTextSplit[i] = cssTextSplit[i].join('}');
		}

		// return shived css text
		return cssTextSplit.join('{');
	}

	// the before print function
	win.attachEvent(
		'onbeforeprint',
		function () {
			// test for scenarios where shiving is unnecessary or unavailable
			if (!doc.namespaces) {
				return;
			}

			// add the shiv namespace
			if (!doc.namespaces.shiv) {
				doc.namespaces.add('shiv');
			}

			// set local variables
			var
			i = -1,
			elementsRegExp = new RegExp('^(' + html5.elements.join('|') + ')$', 'i'),
			nodeList = doc.getElementsByTagName('*'),
			nodeListLength = nodeList.length,
			element,
			// sorts style and link files and returns their stylesheets
			shivedCSS = shivCssText(getStyleSheetListCssText((function (s, l) {
				var arr = [], i = s.length;
				while (i) {
					arr.unshift(s[--i]);
				}
				i = l.length;
				while (i) {
					arr.unshift(l[--i]);
				}
				arr.sort(function (a, b) {
					return (a.sourceIndex - b.sourceIndex);
				});
				i = arr.length;
				while (i) {
					arr[--i] = arr[i].styleSheet;
				}
				return arr;
			})(doc.getElementsByTagName('style'), doc.getElementsByTagName('link'))));

			// loop through document elements
			while (++i < nodeListLength) {
				// get element
				element = nodeList[i];

				// clone matching elements as shiv namespaced
				if (elementsRegExp.test(element.nodeName)) {
					namespaceShivElement(element);
				}
			}

			// set new shived css text
			doc.appendChild(doc._shivedStyleSheet = doc.createElement('style')).styleSheet.cssText = shivedCSS;
		}
	);

	// the after print function
	win.attachEvent(
		'onafterprint',
		function() {
			// test for scenarios where shiving is unnecessary
			if (!doc.namespaces) {
				return;
			}

			// set local variables
			var
			i = -1,
			nodeList = doc.getElementsByTagName('*'),
			nodeListLength = nodeList.length,
			element;

			// loop through document elements
			while (++i < nodeListLength) {
				// get element
				element = nodeList[i];

				// restore original elements
				if (element.originalElement) {
					unNamespaceShivElement(element);
				}
			}

			// cut new shived css text
			if (doc._shivedStyleSheet) {
				doc._shivedStyleSheet.parentNode.removeChild(doc._shivedStyleSheet);
			}
		}
	);
})(this, document);