IEPP
================================

How To Use
------------------

* add iepp.js and iepp.htc to your project (both files have to be in the **same folder**)

---------------
	- js
	-	iepp.js
	-	iepp.htc
	- 	jquery.js
	- index.html
---------------

* include iepp.js into your webpage

---------------
	<!--[if lt IE 9]>
		<script src="js/iepp.js"></script>
	<![endif]-->
---------------

* make sure that your server serves .htc files with 'text/x-component' mime type

---------------

AddType text/x-component .htc

---------------


How To Use
------------------

iepp.js and iepp.htc has to be served from the same domain as the HTML, which uses iepp.