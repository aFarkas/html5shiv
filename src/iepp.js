/*! iepp v2.2 MIT/GPL2 @jon_neal & afarkas */
(function(win, doc) {
	//taken from modernizr
	if ( !window.attachEvent || !doc.createStyleSheet || !(function(){ var elem = document.createElement("div"); elem.innerHTML = "<elem></elem>"; return elem.childNodes.length !== 1; })()) {
		return;
	}
	win.iepp = win.iepp || {};
	var iepp = win.iepp,
		elems = iepp.html5elements || 'abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|subline|summary|time|video',
		elemsArr = elems.split('|'),
		elemsArrLen = elemsArr.length,
		elemRegExp = new RegExp('(^|\\s)('+elems+')', 'gi'), 
		tagRegExp = new RegExp('<(\/*)('+elems+')', 'gi'),
		filterReg = /^\s*[\{\}]\s*$/,
		ruleRegExp = new RegExp('(^|[^\\n]*?\\s)('+elems+')([^\\n]*)({[\\n\\w\\W]*?})', 'gi'),
		nonPrintMedias = /@media +(?![Print|All])[^{]+\{([^{}]+\{[^{}]+\})+[^}]+\}/g,
		docFrag = doc.createDocumentFragment(),
		html = doc.documentElement,
		head = doc.getElementsByTagName('script')[0].parentNode,
		bodyElem = doc.createElement('body'),
		styleElem = doc.createElement('style'),
		printMedias = /print|all/,
		body;

	function shim(doc) {
		var a = -1;
		while (++a < elemsArrLen) {
			// Use createElement so IE allows HTML5-named elements in a document
			doc.createElement(elemsArr[a]);
		}
	}
	
	iepp.getCSS = function(styleSheetList, mediaType) {
		try {
			if(styleSheetList+'' === undefined){
				return '';
			}
		} catch(er){
			return '';
		}
		var a = -1,
			len = styleSheetList.length,
			styleSheet,
			cssText,
			cssTextArr = [];
		while (++a < len) {
			styleSheet = styleSheetList[a];
			//currently no test for disabled/alternate stylesheets
			if(styleSheet.disabled){
				continue;
			}
			mediaType = styleSheet.media || mediaType;
			// Get css from all non-screen stylesheets and their imports
			if (printMedias.test(mediaType)){
				cssText = styleSheet.cssText;
				if(mediaType != 'print'){
					cssText = cssText.replace(nonPrintMedias, "");
				}
				cssTextArr.push(iepp.getCSS(styleSheet.imports, mediaType), cssText);
			}
			//reset mediaType to all with every new *not imported* stylesheet
			mediaType = 'all';
		}
		return cssTextArr.join('');
	};
	
	iepp.parseCSS = function(cssText) {
		var cssTextArr = [],
			rule;
		while ((rule = ruleRegExp.exec(cssText)) != null){
			// Replace all html5 element references with iepp substitute classnames
			cssTextArr.push(( (filterReg.exec(rule[1]) ? '\n' : rule[1]) + rule[2] + rule[3]).replace(elemRegExp, '$1.iepp-$2') + rule[4]);
		}
		return cssTextArr.join('\n');
	};
	
	iepp.writeHTML = function() {
		var a = -1;
		body = body || doc.body;
		while (++a < elemsArrLen) {
			var nodeList = doc.getElementsByTagName(elemsArr[a]),
				nodeListLen = nodeList.length,
				b = -1;
			while (++b < nodeListLen){
				if (nodeList[b].className.indexOf('iepp-') < 0){
					// Append iepp substitute classnames to all html5 elements
					nodeList[b].className += ' iepp-'+elemsArr[a];
				}
			}
				
		}
		docFrag.appendChild(body);
		html.appendChild(bodyElem);
		// Write iepp substitute print-safe document
		bodyElem.className = body.className;
		bodyElem.id = body.id;
		// Replace HTML5 elements with <font> which is print-safe and shouldn't conflict since it isn't part of html5
		bodyElem.innerHTML = body.innerHTML.replace(tagRegExp, '<$1font');
	};
	
	iepp._beforePrint = function() {
		if(iepp.disablePP){return;}
		// Write iepp custom print CSS
		styleElem.styleSheet.cssText = iepp.parseCSS(iepp.getCSS(doc.styleSheets, 'all'));
		iepp.writeHTML();
	};
	
	iepp.restoreHTML = function() {
		if(iepp.disablePP){return;}
		// Undo everything done in onbeforeprint
		bodyElem.swapNode(body);
	};
	
	iepp._afterPrint = function() {
		// Undo everything done in onbeforeprint
		iepp.restoreHTML();
		styleElem.styleSheet.cssText = '';
	};
	
	// Shim the document and iepp fragment
	shim(doc);
	shim(docFrag);
	
	//
	if(iepp.disablePP){
		return;
	}
	
	// Add iepp custom print style element
	head.insertBefore(styleElem, head.firstChild);
	styleElem.media = 'print';
	styleElem.className = 'iepp-printshim';
	win.attachEvent(
		'onbeforeprint',
		iepp._beforePrint
	);
	win.attachEvent(
		'onafterprint',
		iepp._afterPrint
	);
})(this, document);