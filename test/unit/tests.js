(function(){

module("html5shiv tests");
var blockElements  = "article,aside,figcaption,figure,footer,header,hgroup,nav,section".split(',');
var initialShivMethods = html5.shivMethods;
var supportsHtml5 = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

var shivTests = function(fn){
	html5.shivMethods = true;
	fn();
	html5.shivMethods = initialShivMethods;
};

test("display block tests", function() {
	$.each(blockElements, function(i, elem){
		equals($(elem).css('display'), 'block', elem +" has display: block");
	});
});

test("parsing  tests", function() {
	$.each(blockElements, function(i, elem){
		equals($(elem +' div.inside').length, 1, elem +" has a div inside");
	});
});

test("style test", function() {
	var article = $('article');
	equals(article.css('borderTopWidth'), '2px', "article has a 2px border");
});

	
test("createElement/innerHTML test", function() {
	shivTests(
		function(){
			var div = document.createElement('div');
			var text = "This native javascript sentence is in a green box <mark>with these words highlighted</mark>?"
			div.innerHTML = '<section id="section">'+ text +'</section>';
			document.getElementById('qunit-fixture').appendChild(div);
			equals($('#section').html(), text, "innerHTML getter equals innerHTML setter");
			equals($('#section mark').length, 1, "section has a mark element inside");
		}
	);
});

test("createElement/createDocumentFragment/innerHTML test", function() {
	shivTests(
		function(){
			var div = document.createElement('div');
			var frag = document.createDocumentFragment();
			var markText = "with these words highlighted";
			div.innerHTML = '<section>This native javascript sentence is in a green box <mark>'+markText+'</mark>?</section>';
			frag.appendChild(div);
			div.innerHTML += '<article>This native javascript sentence is also in a green box <mark>'+markText+'</mark>?</article>';
			document.getElementById('qunit-fixture').appendChild(frag);
			equals($('section > mark', div).html(), markText, "innerHTML getter equals innerHTML setter");
			equals($('article', div).css('borderTopWidth'), '2px', "article has a 2px border");
		}
	);
});


test("createDocumentFragment/cloneNode/innerHTML test", function() {
	shivTests(
		function(){
			var frag = document.createDocumentFragment();
			var fragDiv = frag.appendChild(document.createElement('div'));
			var markText = "with these words highlighted2";
			var fragDivClone;
			fragDiv.innerHTML = '<article>This native javascript sentence is also in a green box <mark>'+markText+'</mark>?</article>';
			fragDivClone = fragDiv.cloneNode(true);
			document.getElementById('qunit-fixture').appendChild(fragDivClone);
			equals($('article > mark', fragDivClone).html(), markText, "innerHTML getter equals innerHTML setter");
			equals($('article', fragDivClone).css('borderTopWidth'), '2px', "article has a 2px border");
		}
	);
});

test("jQuery test", function() {
	shivTests(
		function(){
			var markText = "with these words highlighted3";
			var div = $('<div/>').html('<section><article>This jQuery 1.6.4 sentence is in a green box <mark>'+markText+'</mark>?</section></section>').appendTo('#qunit-fixture');
			
			equals($('section article > mark', div).html(), markText, "innerHTML getter equals innerHTML setter");
			equals($('article', div).css('borderTopWidth'), '2px', "article has a 2px border");
		}
	);
});



})();
