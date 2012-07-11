(function(){

module("html5shiv tests");
var blockElements  = "article,aside,figcaption,figure,footer,header,hgroup,nav,section".split(',');

var testEnv = [
	{
		doc: document,
		initialShivMethods: html5.shivMethods,
		html5: html5,
		name: 'default'
	}
];


var shivTests = function(fn, env){
	if(!env){
		env = testEnv[0];
	}
	env.html5.shivMethods = true;
	fn();
	env.html5.shivMethods = env.initialShivMethods;
};

var envTest = function(name, fn, frames){
	if(!frames){
		frames = ['default'];
	}
	asyncTest(name, function(){
		$.each(testEnv, function(i, env){
			if($.inArray(env.name, frames) != -1){
				fn(env);
			}
		});
		if(testEnv.length > 1){
			start();
		} else {
			initIframes();
		}
	});
	
};

QUnit.reset = function() {
	$.each(testEnv, function(i, env){
		$('#qunit-fixture', env.doc).html(env.fixture);
	});
};


var initIframes = function(){
	if(testEnv.length > 1){return;}
	testEnv[0].fixture = $('#qunit-fixture').html();
	
	$('iframe.test-frame').each(function(){
		var win = this.contentWindow;
		if($('#qunit-fixture', win.document).length){
			testEnv.push({
				doc: win.document,
				html5: win.html5,
				initialShivMethods: (win.html5 || {}).shivMethods,
				fixture: $('#qunit-fixture', win.document).html(),
				name: this.src.split('?')[1]
			});
		}
	});
	if(testEnv.length > 1){
		start();
	} else {
		setTimeout(initIframes, 30);
	}
};


$(initIframes);


envTest("display block tests", function(env){
	$.each(blockElements, function(i, elem){
		equals($(elem, env.doc).css('display'), 'block', elem +" has display: block");
	});

}, ['default', 'disableMethodsBefore']);

envTest("test html5.createElement/html5.createDocumentFragment", function(env){
	var doc5 = html5;
	if(env.html5){
		doc5 = env.html5;
		env.html5.shivMethods = false;
	}
	html5.shivMethods = false;
	
	var fragDiv =  doc5.createElement('div', env.doc);
	var frag = doc5.createDocumentFragment(env.doc);
	var markText = "with these words highlighted";
	var div = $( doc5.createElement('div', env.doc) ).html('<section><article><mark>s</mark></article>?</section>').appendTo(env.doc.getElementById('qunit-fixture'));
	
	fragDiv.innerHTML = '<section>This native javascript sentence is in a green box <mark>'+markText+'</mark>?</section>';
	
	frag.appendChild(fragDiv);
	fragDiv.innerHTML += '<article>This native javascript sentence is also in a green box <mark>'+markText+'</mark>?</article>';
	
	env.doc.getElementById('qunit-fixture').appendChild(frag);
	
	equals($('section article > mark', div).length, 1, "found mark in section > article");
	equals($('section > mark', fragDiv).html(), markText, "innerHTML getter equals innerHTML setter");
	equals($('article', fragDiv).css('borderTopWidth'), '2px', "article has a 2px border");
	
	if(env.html5){
		env.html5.shivMethods = env.initialShivMethods;
	}
	html5.shivMethods = true;
}, ['disableMethodsBefore', 'disableMethodsAfter']);


if(!html5.supportsUnknownElements){

	envTest("config shivMethods test", function(env){
		var div = $('<div/>', env.doc).html('<section><article><mark></mark></article>?</section>').appendTo(env.doc.getElementById('qunit-fixture'));
		equals($('section article > mark', div).length, (env.html5.shivMethods) ? 1 : 0, "found/no found mark in section > article");
	}, ['default', 'disableMethodsBefore', 'disableMethodsAfter']);
	
	envTest("config shivCSS test", function(env){
		$.each(blockElements, function(i, elem){
			equals($(elem, env.doc).css('display'), 'inline', elem +" has display: inline if unshived");
		});
		env.html5.shivCSS = true;
		env.html5.shivDocument();
		$.each(blockElements, function(i, elem){
			equals($(elem, env.doc).css('display'), 'block', elem +" has display: block. after reshiving");
		});
	}, ['disableCSS']);
}

envTest("config add elements test", function(env){
	var value = $.trim($('abcxyz', env.doc).html());
	ok((html5.supportsUnknownElements || env.html5.elements.indexOf('abcxyz') !== -1) ? value : !value, "unknownelement has one/none div inside: "+ value);
}, ['default', 'disableMethodsBefore', 'addUnknownBefore', 'addUnknownAfter']);

envTest("parsing tests", function(env){
	$.each(blockElements, function(i, elem){
		equals($(elem +' div.inside', env.doc).length, 1, elem +" has a div inside");
	});	
}, ['default', 'disableMethodsBefore']);

envTest("style test", function(env){
	var article = $('article', env.doc);
	equals(article.css('borderTopWidth'), '2px', "article has a 2px border");
}, ['default', 'disableMethodsBefore']);

if (!html5.supportsUnknownElements) {
	envTest("shiv different document", function(env){
		var markText = "with these words highlighted3";
		var markup = '<section><article>This jQuery 1.6.4 sentence is in a green box <mark>' + markText + '</mark></article>?</section>';
		
		var div = $('<div/>', env.doc).html(markup).appendTo(env.doc.getElementById('qunit-fixture'));
		equals($('section article > mark', div).length, 0, "document is not shived");
		
		html5.shivDocument(env.doc);
		
		div = $('<div/>', env.doc).html(markup).appendTo(env.doc.getElementById('qunit-fixture'));
		equals($('section article > mark', div).length, 1, "document is shived");
		equals($('article', div).css('borderTopWidth'), '2px', "article has a 2px border");
		
	}, ['noEmbed']);
}
	
envTest("createElement/innerHTML test", function(env){
	shivTests(
		function(){
			var div = env.doc.createElement('div');
			var text = "This native javascript sentence is in a green box <mark>with these words highlighted</mark>?";
			div.innerHTML = '<section id="section">'+ text +'</section>';
			env.doc.getElementById('qunit-fixture').appendChild(div);
			equals($('#section', env.doc).html(), text, "innerHTML getter equals innerHTML setter");
			equals($('#section mark', env.doc).length, 1, "section has a mark element inside");
		},
		env
	);
}, ['default', 'disableMethodsBefore']);

envTest("createElement/createDocumentFragment/innerHTML test", function(env){
	shivTests(
		function(){
			var div = env.doc.createElement('div');
			var frag = env.doc.createDocumentFragment();
			var markText = "with these words highlighted";
			div.innerHTML = '<section>This native javascript sentence is in a green box <mark>'+markText+'</mark>?</section>';
			frag.appendChild(div);
			div.innerHTML += '<article>This native javascript sentence is also in a green box <mark>'+markText+'</mark>?</article>';
			env.doc.getElementById('qunit-fixture').appendChild(frag);
			equals($('section > mark', div).html(), markText, "innerHTML getter equals innerHTML setter");
			equals($('article', div).css('borderTopWidth'), '2px', "article has a 2px border");
		},
		env
	);
}, ['default', 'disableMethodsBefore']);


envTest("createDocumentFragment/cloneNode/innerHTML test", function(env){
	shivTests(
		function(){
			var frag = env.doc.createDocumentFragment();
			var fragDiv = env.doc.createElement('div');
			
			var markText = "with these words highlighted2";
			var fragDivClone;
			frag.appendChild(fragDiv);
			
			fragDiv.innerHTML = '<div><article>This native javascript sentence is also in a green box <mark>'+markText+'</mark>?</article></div>';
			
			fragDivClone = fragDiv.cloneNode(true);
			
			env.doc.getElementById('qunit-fixture').appendChild(fragDivClone);
			equals($('mark', env.doc).html(), markText, "innerHTML getter equals innerHTML setter");
		},
		env
	);
}, ['default', 'addUnknownAfter']);

test("form test", function() {
	shivTests(
		function(){
			var form = document.createElement('form');
			var select = document.createElement('select');
			var input = document.createElement('input');
			var button = document.createElement('button');
			var option = document.createElement('option');
			var markText = "with these words highlighted2";
			
			form.setAttribute('action', 'some/path');
			form.setAttribute('name', 'formName');
			form.target = '_blank';
			select.name = 'selectName';
			option.value = '1.value';
			button.setAttribute('type', 'submit');
			input.type = 'submit';
			
			form.innerHTML = '<article>This native javascript sentence is also in a green box <mark>'+markText+'</mark>?</article>';
			
			
			form.appendChild(select);
			form.appendChild(button);
			form.appendChild(input);
			
			
			
			if(select.add){
				try {
					select.add(option);
				} catch(er){
					select.appendChild(option);
				}
			} else {
				select.appendChild(option);
			}
			document.getElementById('qunit-fixture').appendChild(form);
			
			equals($('select option', form).val(), '1.value', "select has one option with value");
			equals($('article > mark', form).html(), markText, "innerHTML getter equals innerHTML setter");
			equals($('article', form).css('borderTopWidth'), '2px', "article has a 2px border");
		}
	);
});

envTest("jQuery test", function(env){
	shivTests(
		function(){
			var markText = "with these words highlighted3";
			var div = $('<div/>', env.doc).html('<section><article>This jQuery 1.6.4 sentence is in a green box <mark>'+markText+'</mark></article>?</section>').appendTo(env.doc.getElementById('qunit-fixture'));
			equals($('article > mark', div).html(), markText, "innerHTML getter equals innerHTML setter");
			equals($('article', div).css('borderTopWidth'), '2px', "article has a 2px border");
		},
		env
	);
});




})();
