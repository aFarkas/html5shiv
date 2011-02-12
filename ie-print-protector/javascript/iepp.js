// iepp v1.6.2 MIT @jon_neal
(function(win, doc) {
	var elems = 'abbr|article|aside|audio|canvas|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video',
		elemsArr = elems.split('|'),
		elemsArrLen = elemsArr.length,
		elemRegExp = new RegExp('(^|\\s)('+elems+')', 'gi'), 
		tagRegExp = new RegExp('<(\/*)('+elems+')', 'gi'),
		ruleRegExp = new RegExp('(^|[^\\n]*?\\s)('+elems+')([^\\n]*)({[\\n\\w\\W]*?})', 'gi'),
		docFrag = doc.createDocumentFragment(),
		html = doc.documentElement,
		head = html.firstChild,
		bodyElem = doc.createElement('body'),
		styleElem = doc.createElement('style'),
		body;
	function shim(doc) {
		var a = -1;
		while (++a < elemsArrLen)
			// Use createElement so IE allows HTML5-named elements in a document
			doc.createElement(elemsArr[a]);
	}
	function getCSS(styleSheetList, mediaType) {
		var a = -1,
			len = styleSheetList.length,
			styleSheet,
			cssTextArr = [];
		while (++a < len) {
			styleSheet = styleSheetList[a];
			// Get css from all non-screen stylesheets and their imports
			if ((mediaType = styleSheet.media || mediaType) != 'screen') cssTextArr.push(getCSS(styleSheet.imports, mediaType), styleSheet.cssText);
		}
		return cssTextArr.join('');
	}
	// Shim the document and iepp fragment
	shim(doc);
	shim(docFrag);
	// Add iepp custom print style element
	head.insertBefore(styleElem, head.firstChild);
	styleElem.media = 'print';
	win.attachEvent(
		'onbeforeprint',
		function() {
			var a = -1,
				cssText = getCSS(doc.styleSheets, 'all'),
				cssTextArr = [],
				rule;
			body = body || doc.body;
			// Get only rules which reference HTML5 elements by name
			while ((rule = ruleRegExp.exec(cssText)) != null)
				// Replace all html5 element references with iepp substitute classnames
				cssTextArr.push((rule[1]+rule[2]+rule[3]).replace(elemRegExp, '$1.iepp_$2')+rule[4]);
			// Write iepp custom print CSS
			styleElem.styleSheet.cssText = cssTextArr.join('\n');
			while (++a < elemsArrLen) {
				var nodeList = doc.getElementsByTagName(elemsArr[a]),
					nodeListLen = nodeList.length,
					b = -1;
				while (++b < nodeListLen)
					if (nodeList[b].className.indexOf('iepp_') < 0)
						// Append iepp substitute classnames to all html5 elements
						nodeList[b].className += ' iepp_'+elemsArr[a];
			}
			docFrag.appendChild(body);
			html.appendChild(bodyElem);
			// Write iepp substitute print-safe document
			bodyElem.className = body.className;
			// Replace HTML5 elements with <font> which is print-safe and shouldn't conflict since it isn't part of html5
			bodyElem.innerHTML = body.innerHTML.replace(tagRegExp, '<$1font');
		}
	);
	win.attachEvent(
		'onafterprint',
		function() {
			// Undo everything done in onbeforeprint
			bodyElem.innerHTML = '';
			html.removeChild(bodyElem);
			html.appendChild(body);
			styleElem.styleSheet.cssText = '';
		}
	);
})(this, document);