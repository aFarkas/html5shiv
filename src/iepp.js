(function(window, document, location) {
	//taken from modernizr
	if ( !window.attachEvent || !document.createStyleSheet || !(function(){ var elem = document.createElement("div"); elem.innerHTML = "<elem></elem>"; return elem.childNodes.length !== 1; })()) {
		return;
	}
	
	"abbr article aside audio canvas datalist details figcaption figure footer header hgroup mark meter nav output progress section subline summary time video".replace(/\w+/g,function(n){document.createElement(n);});
	
	var scripts = document.scripts;
	var path = (scripts[scripts.length -1].src || '').split('?')[0];
	path = path.slice(0, path.lastIndexOf("/") + 1);
	
	//todo: test if path is same origin 
	try {
		setTimeout(function(){
			document.createStyleSheet().addRule('head', 'behavior: url('+ path +'iepp.htc);');
		}, 1);
	} catch(er){}
	
	
})(window, document, location);

