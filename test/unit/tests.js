(function(){

module("html5shiv tests");
var blockElements  = "article,aside,figcaption,figure,footer,header,hgroup,nav,section".split(',');
var supportsHtml5 = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

var testEnv = [
	{
		doc: document,
		initialShivMethods: html5.shivMethods,
		html5: html5
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

var envTest = function(fn){
	$.each(testEnv, function(i, env){
		fn(env);
	});
};

QUnit.reset = function() {
	$.each(testEnv, function(i, env){
		$('#qunit-fixture', env.doc).html(env.fixture);
	});
};


var initIframes = function(){
	
	testEnv[0].fixture = $('#qunit-fixture').html();
	
	$('iframe.test-frame').each(function(){
		testEnv.push({
			doc: this.contentDocument,
			html5: this.contentWindow.html5,
			initialShivMethods: this.contentWindow.html5.shivMethods,
			fixture: $('#qunit-fixture', this.contentDocument).html()
		});
	});
};

test("display block tests", function() {
	initIframes();
	
	envTest(function(env){
		$.each(blockElements, function(i, elem){
			equals($(elem, env.doc).css('display'), 'block', elem +" has display: block");
		});
	});
});

test("parsing tests", function() {
	envTest(function(env){
		$.each(blockElements, function(i, elem){
			equals($(elem +' div.inside', env.doc).length, 1, elem +" has a div inside");
		});
	});
});

test("style test", function() {
	envTest(function(env){
		var article = $('article', env.doc);
		equals(article.css('borderTopWidth'), '2px', "article has a 2px border");
	});
});

	
test("createElement/innerHTML test", function() {
	envTest(function(env){
		shivTests(
			function(){
				var div = env.doc.createElement('div');
				var text = "This native javascript sentence is in a green box <mark>with these words highlighted</mark>?"
				div.innerHTML = '<section id="section">'+ text +'</section>';
				env.doc.getElementById('qunit-fixture').appendChild(div);
				equals($('#section', env.doc).html(), text, "innerHTML getter equals innerHTML setter");
				equals($('#section mark', env.doc).length, 1, "section has a mark element inside");
			},
			env
		);
	});
	
});

test("createElement/createDocumentFragment/innerHTML test", function() {
	envTest(function(env){
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
	});
});


test("createDocumentFragment/cloneNode/innerHTML test", function() {
	envTest(function(env){
		shivTests(
			function(){
				var frag = env.doc.createDocumentFragment();
				var fragDiv = frag.appendChild(env.doc.createElement('div'));
				var markText = "with these words highlighted2";
				var fragDivClone;
				fragDiv.innerHTML = '<article>This native javascript sentence is also in a green box <mark>'+markText+'</mark>?</article>';
				fragDivClone = fragDiv.cloneNode(true);
				env.doc.getElementById('qunit-fixture').appendChild(fragDivClone);
				equals($('article > mark', fragDivClone).html(), markText, "innerHTML getter equals innerHTML setter");
				equals($('article', fragDivClone).css('borderTopWidth'), '2px', "article has a 2px border");
			},
			env
		);
	});
});

test("form test", function() {
	shivTests(
		function(){
			var form = document.createElement('form');
			var select = document.createElement('select');
			var option = document.createElement('option');
			var markText = "with these words highlighted2";
			
			form.setAttribute('action', 'some/path');
			form.setAttribute('name', 'formName');
			form.target = '_blank';
			select.name = 'selectName';
			option.value = '1.value';
			
			form.innerHTML = '<article>This native javascript sentence is also in a green box <mark>'+markText+'</mark>?</article>';
			
			
			form.appendChild(select);
			
			
			
			if(select.add){
				select.add(option);
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

test("jQuery test", function() {
	envTest(function(env){
		shivTests(
			function(){
				var markText = "with these words highlighted3";
				var div = $('<div/>', env.doc).html('<section><article>This jQuery 1.6.4 sentence is in a green box <mark>'+markText+'</mark>?</section></section>').appendTo('#qunit-fixture');
				equals($('section article > mark', div).html(), markText, "innerHTML getter equals innerHTML setter");
				equals($('article', div).css('borderTopWidth'), '2px', "article has a 2px border");
			},
			env
		);
	});
});




})();
