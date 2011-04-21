(function(){
	var getIeppElement = function(){
		var styles = document.getElementsByTagName('style');
		var elem;
		for(var i = 0, len = styles.length; i < len;i++){
			if(styles[i].className == 'iepp-printshim'){
				elem = styles[i];
				break;
			}
		}
		return elem;
	};
	var ieppStyleElement = getIeppElement();
	window.ieppHelper = {
		parseCSS: function(style){
			if(!window.iepp || !iepp.parseCSS){
				return;
			}
			ieppStyleElement = ieppStyleElement || getIeppElement();
			if(!ieppStyleElement){return;}
			var old = ieppStyleElement.styleSheet.cssText;
			ieppStyleElement.styleSheet.cssText = style;
			style = iepp.parseCSS(ieppStyleElement.styleSheet.cssText);
			ieppStyleElement.styleSheet.cssText = old;
			return style;
		}
	};
})();
