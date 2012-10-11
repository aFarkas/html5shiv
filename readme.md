html5shiv (htc version)
================================

How To Use
------------------

* add iepp.js and iepp.htc to your project (both files have to be in the **same folder**)

---------------
	- js
	-	html5shiv.js
	-	html5shiv.htc
	- 	jquery.js
	- index.html
---------------

* include iepp.js into your webpage

---------------
	<!--[if lt IE 9]>
		<script src="js/html5shiv.js"></script>
	<![endif]-->
---------------

* make sure that your server serves .htc files with 'text/x-component' mime type

---------------
	#Apache config: add text/x-component for .htc files
	AddType text/x-component .htc
---------------

Limitations
------------------

**Same domain/same origin policy**
html5shiv.js and html5shiv.htc has to be served from the same domain as the HTML, which uses html5shiv.