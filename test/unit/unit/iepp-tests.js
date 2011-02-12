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
	
	
	
	
	module("IEPP");
	test("self test & init", function() {
		
		//todo test element parsing
		
		if($.browser.msie && parseInt($.browser.version, 10) < 9){
			ok(window.iepp, 'iepp is initialized');
		} else {
			ok(!window.iepp, 'iepp has not to be initialized');
			return;
		}
		
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
	test("nothing here yet", function() {
		expect(1);
		
		
		ok(true, "ToDo")
	});
	
	
	module("writeHTML");
	test("nothing here yet", function() {
		expect(1);
		
		//test rewrite
		
		ok(true, "ToDo")
	});
	
	module("restoreHTML");
	test("nothing here yet", function() {
		expect(1);
		
		
		ok(true, "ToDo")
	});
	
	
	module("print styles applyed");
	test("beforePrint/afterPrint", function() {
//		expect(1);
		
		var delayed = {
			store: [],
			test: function(name, args){
				this.store.push({name: name, args: args})
			},
			showResults: function(){
				$.each(this.store, function(i, test){
					window[test.name].apply(window, test.args);
				});
			}
		};
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
		
		delayed.test('equals', [$('.dotted-section-childs .iepp_section').css('borderBottomStyle'), 'dotted', "long selector test"]);
		
		delayed.test('equals', [$('#foo').css('borderBottomStyle'), 'double', "id selector test"]);
		
		
		
		
		
		iepp._afterPrint();
		delayed.showResults();
		
	});
	
	
})();
