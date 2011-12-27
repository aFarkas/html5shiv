/*! HTML5 Shiv v pre3.1 | @jon_neal @afarkas @rem @jdbartlett | MIT/GPL2 Licensed */
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
	// more elements can be added and shived with the following code: html5.elements.push('element-name'); shivDocument(document);
	var html5 = {
		// a list of html5 elements
		elements: 'abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video'.split(' '),

		// the shiv function
		shivDocument: function (scopeDocument) {
			scopeDocument = scopeDocument || doc;

			// test if the document has already been shived
			if (scopeDocument.documentShived) {
				return;
			}
			scopeDocument.documentShived = true;

			// set local variables
			var
			documentCreateElement = scopeDocument.createElement,
			documentHead = scopeDocument.getElementsByTagName('head')[0],
			documentCreateElementReplaceFunction = function (m) { documentCreateElement(m); };

			// shiv for unknown elements
			if (!supportsUnknownElements) {
				// shiv the document
				html5.elements.join(' ').replace(/\w+/g, documentCreateElementReplaceFunction);
			}

			// shiv for default html5 styles
			if (!supportsHtml5Styles && documentHead) {
				var div = documentCreateElement('div');
				div.innerHTML = ['x<style>',
					'article,aside,details,figcaption,figure,footer,header,hgroup,nav,section{display:block}', // Corrects block display not defined in IE6/7/8/9
					'audio{display:none}', // Corrects audio display not defined in IE6/7/8/9
					'canvas,video{display:inline-block;*display:inline;*zoom:1}', // Corrects canvas and video display not defined in IE6/7/8/9 (audio[controls] in IE7)
					'[hidden]{display:none}audio[controls]{display:inline-block;*display:inline;*zoom:1}', // Corrects 'hidden' attribute and audio[controls] display not present in IE7/8/9
					'mark{background:#FF0;color:#000}', // Addresses styling not present in IE6/7/8/9
				'</style>'].join('');
				documentHead.insertBefore(div.lastChild, documentHead.firstChild);
			}

			// return document (for potential chaining)
			return scopeDocument;
		},
		//http://jdbartlett.github.com/innershiv
		innerShiv: (function () {
			var div;
			var regScript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
			var regClose = /(<([\w:]+)[^>]*?)\/>/g;
			var regCloseElements = /^(?:area|br|col|embed|hr|img|input|link|meta|param)$/i;
			var regTable = /^<(tbody|tr|td|th|col|colgroup|thead|tfoot)[\s\/>]/i;
			
			// Used to idiot-proof self-closing tags
			function fcloseTag(all, front, tag) {
				return (regCloseElements).test(tag) ? all : front + '></' + tag + '>';
			}
			
			function init(){
				div = doc.createElement('div');
					
				if (!supportsUnknownElements) {
					// MSIE allows you to create elements in the context of a document
					// fragment. Jon Neal first discovered this trick and used it in his
					// own shimprove: http://www.iecss.com/shimprove/
					var shimmedFrag = doc.createDocumentFragment();
					var i = html5.elements.length;
					while (i--) {
						shimmedFrag.createElement(html5.elements[i]);
					}
					
					shimmedFrag.appendChild(div);
				}
			}
			
			return function (
				html, /* string */
				returnFrag /* optional false bool */
			) {
				var tabled, scope, returnedFrag, j;
				if (!div) {
					init();
					
				}
				
				html = html
					// Trim whitespace to avoid unexpected text nodes in return data:
					.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
					// Strip any scripts:
					.replace(regScript, '')
					// Fix misuses of self-closing tags:
					.replace(regClose, fcloseTag)
					;
				
				// Fix for using innerHTML in a table
				
				if ((tabled = html.match(regTable))) {
					div.innerHTML = '<table>' + html + '</table>';
				} else {
					div.innerHTML = html;
				}
				
				// Avoid returning the tbody or tr when fixing for table use
				
				if (tabled) {
					scope = div.getElementsByTagName(tabled[1])[0].parentNode;
				} else {
					scope = div;
				}
				
				// If not in jQuery return mode, return child nodes array
				if (returnFrag === false) {
					return scope.childNodes;
				}
				
				// ...otherwise, build a fragment to return
				returnedFrag = doc.createDocumentFragment();
				j = scope.childNodes.length;
				while (j--) {
					returnedFrag.appendChild(scope.firstChild);
				}
				
				return returnedFrag;
			};
		}())
	};

	// shiv the document
	html5.shivDocument(doc);
	
	html5.type = 'default';

	win.html5 = html5;
})(this, document);