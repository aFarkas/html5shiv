(function(){
	var removStyles =  function(){
		$('link, style')
			.filter(function(){
				return !this.className;
			})
			.remove()
		;
		document.documentElement.style.zoom = "1";
		document.documentElement.style.zoom = "";
	};
	var addLink =  function(src, medium, rel){
		var link = document.createElement('link');
		link.rel = rel || 'stylesheet'; 
		
		if(medium){
			link.media = medium;
		}
		$(link).appendTo('head');
		link.href = src;
		
	};
	var ieppStyleElement = $('style.iepp-printshim')[0];
	var delayed = {
		store: [],
		test: function(name, args){
			this.store.push({name: name, args: args})
		},
		showResults: function(){
			$.each(this.store, function(i, test){
				window[test.name].apply(window, test.args);
			});
			this.store = [];
		}
	};
	
	
	
	
	
	
	module("IEPP");
	test("self test & init", function() {
		
		//todo test element parsing
		
		if($.browser.msie && parseInt($.browser.version, 10) < 9){
			ok(window.iepp, 'iepp is initialized');
		} else {
			ok(!window.iepp, 'iepp has not to be initialized');
			return;
		}
		if(!window.iepp){return;}
		ok(iepp.getCSS(document.styleSheets, 'all') !== "", 'found some print styles');
		removStyles();
		ok(iepp.getCSS(document.styleSheets, 'all') === "", 'all print styles removed');
		ok(ieppStyleElement, 'style element was created');
		ieppStyleElement.media = 'all';
		ieppStyleElement.styleSheet.cssText = 'body {display: none !important;}';
		ok($('body').css('display') == 'none', 'change of medium and cssText access succesfull');
		ieppStyleElement.styleSheet.cssText = '';
	});
	
	if(!window.iepp){return;}
	module("getCSS");
	test("different media-attributes on link", function() {
		expect(10);
		var mediaLinkTest = function(screenMedium, printMedium){
			var css;
			removStyles();
			addLink('data/no-print.css', screenMedium);
			addLink('data/print.css', printMedium);
			document.documentElement.style.zoom = "1";
			document.documentElement.style.zoom = "";
			css = iepp.getCSS(document.styleSheets, 'all');
			ok(css.indexOf('isforprint') > -1, 'found styles with media='+ (printMedium || ""));
			ok(css.indexOf('isfnotorprint') < 0, 'did not include media='+ (screenMedium || ""));
		};
		
		mediaLinkTest('screen', 'print');
		mediaLinkTest('screen', '');
		mediaLinkTest('screen, projection', 'all');
		mediaLinkTest('only screen and (max-device-width: 480px)', 'all');
		mediaLinkTest('screen', 'screen, print');
	});
	
	test("different inline-media in link", function() {
		expect(4);
		var css;
		removStyles();
		
		addLink('data/inline-print-media.css', 'all');
		css = iepp.getCSS(document.styleSheets, 'all');
		ok(css.indexOf('isforprint') > -1, 'found styles with media=inline-print-media.css');
		ok(css.indexOf('isfnotorprint') < 0, 'did not include media=inline-print-media.css');
		
		addLink('data/inline-mixed-media.css', 'all');
		css = iepp.getCSS(document.styleSheets, 'all');
		ok(css.indexOf('isforprint') > -1, 'found styles with media=inline-mixed-media.css');
		ok(css.indexOf('isfnotorprint') < 0, 'did not include media=inline-mixed-media.css');
		
	});
	
	//ToDo: test imports, test alternate or disabled stylesheets
	
	
	module("parseCSS");
	test("simple css tests", function() {
//		expect(1);
		ieppStyleElement.media = 'all';
		$('<div id="test-markup"><font class="iepp-article dotted">foo</font><font class="iepp-section dotted">bar</font><font class="iepp-aside dotted">bar</font></div>').appendTo('body');
		var fontElements = ['font.iepp-article.dotted', 'font.iepp-section.dotted', 'font.iepp-aside.dotted'];
		var parseCSS = function(style){
			ieppStyleElement.styleSheet.cssText = style;
			return iepp.parseCSS(ieppStyleElement.styleSheet.cssText);
		};
		var testParser1 = function(name, style, appliedTest){
			appliedTest = appliedTest || 0; 
			style = parseCSS(style);
			ieppStyleElement.styleSheet.cssText = style;
			
			equals(style.split('{').length, style.split('}').length, "length of { equals length of } in parsed CSS: "+name);
			for(var i = 0; i < appliedTest; i++){
				ok($(fontElements[i]).css('borderBottomStyle') == 'dotted', "parsed styles can be applied:"+ name);
			}
			
		};
		
		for(var i = 0; i < 3; i++){
			ok($(fontElements[i]).css('borderBottomStyle') !== 'dotted', i+ ": self test: testobjects aren't dotted");
		}
		
		testParser1("simple", "article.dotted, section.dotted, aside.dotted {border-style: dotted;}", 1);
		testParser1("leading normal", "div {display: block} article.dotted, section.dotted, aside.dotted {border-style: dotted;}", 2);
		testParser1("leading normal with following normal/html5 element", "div {display: block} div article.dotted, section.dotted, aside.dotted {border-style: dotted;}", 2);
		testParser1("wrapping @media", "@media all { article.dotted, section.dotted, aside.dotted {border-style: dotted;} }", 2);
		testParser1("wrapping @media with following normal/html5 element", "@media all { div article.dotted, section.dotted, #test-markup aside.dotted {border-style: dotted;} }", 2);
		testParser1("@media in the middle", "article.dotted {border-style: dotted;} @media all { section.dotted {border-style: dotted;} } aside.dotted {border-style: dotted;}", 3);
		testParser1("@media in the middle with following normal/html5 element", "article.dotted {border-style: dotted;} @media all { body section.dotted {border-style: dotted;} } div aside.dotted {border-style: dotted;}", 3);
		
		var css;
		
		css = parseCSS("article.article {display: none}");
		ok(css.indexOf('.iepp-article.article') != 1, "simple selector is transformed correctly");
		
		if(parseInt($.browser.version, 10) > 6){
			css = parseCSS("#article article#section[data-article='article'].article {display: none}");
			ok(css.indexOf('#article .iepp-article#section[data-article="article"].article') != 1, "complex selector is transformed correctly");
		}
		
		
		
		ieppStyleElement.styleSheet.cssText = '';
		$('#test-markup').remove();
	});
	
	
	module("writeHTML/restoreHTML");
	test("nothing here yet", function() {
		//test writeHTML
		iepp.writeHTML();
		delayed.test('equals', [$('form').attr('action'), '/test/ test', "action attribute works"]);
		delayed.test('equals', [$('form div.inside-of-form').length, 1, "action='test/' does no't selfclose form in printview"]);
		
		iepp.restoreHTML();
		delayed.showResults();
		
		//restoreHTML
		equals($('form div.inside-of-form').length, 1, "action='test/test' does no't selfclose form");
	});
	
	
	
	
	module("print styles applyed");
	test("beforePrint/afterPrint", function() {
//		expect(1);
		
		removStyles();
		ieppStyleElement.media = 'all';
		addLink('data/print-styles.css', 'all');
		iepp._beforePrint();

		delayed.test('equals', [$('.show_on_print').css('display'), 'block', "print only style is visible"]);
		delayed.test('equals', [$('.show_on_screen').css('display'), 'none', "screen only element is hidden"]);
		
		delayed.test('equals', [$('.dotted-with-body-class').css('borderBottomStyle'), 'dotted', "body class style"]);
		
		delayed.test('equals', [$('.groove-with-body-id').css('borderBottomStyle'), 'groove', "body id style"]);
		
		delayed.test('equals', [$('.dashed_on_print').css('borderBottomStyle'), 'dashed', "simple style test"]);
		
		delayed.test('equals', [$('p.groove-with-long-selector').css('borderBottomStyle'), 'groove', "long selector test"]);
		
		delayed.test('equals', [$('p.groove-with-long-selector').css('borderBottomStyle'), 'groove', "long selector test"]);
		
		delayed.test('equals', [$('.dotted-section-childs .iepp-section').css('borderBottomStyle'), 'dotted', "long selector test"]);
		
		delayed.test('equals', [$('#foo').css('borderBottomStyle'), 'double', "id selector test"]);
				
		delayed.test('equals', [$('.print-is-copied').css('display'), 'inline-block', "print only styles are applied"]);
				
		iepp._afterPrint();
		delayed.showResults();
		
	});
	
	
})();
