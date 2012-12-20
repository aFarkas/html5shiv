# The HTML5 Shiv

`github.com/afarkas/html5shiv` is the home of the development of The HTML5 Shiv. This script is the defacto way to enable use of HTML5 sectioning elements in legacy Internet Explorer, as well as default HTML5 styling in Internet Explorer 6 - 9, Safari 4.x (and iPhone 3.x), and Firefox 3.x.

### `html5shiv.js`
*  contains the basic `createElement()` shiv technique, along with monkeypatches for `document.createElement` and `document.createDocumentFragment`. It also applies very [basic `display:block` styling](https://github.com/aFarkas/html5shiv/blob/4525162dd10e6fff7b83d06b28b562586e9fb058/src/html5shiv.js#L214-L217) for HTML5 elements.

### `html5shiv-printshiv.js` 
*  contains all the above plus a mechanism to allow HTML5 elements to be styled and contain children while being printed in IE6-8.

For the full story of the Shiv and all people involved, read [The Story of the HTML5 Shiv](http://paulirish.com/2011/the-history-of-the-html5-shiv/).

The shiv is now maintained by Alexander Farkas, Jonathan Neal, and Paul Irish, with many contributions from John-David Dalton.

The shiv is officially distributed by Modernizr, and the two google code projects html5shiv and html5shim (maintained by Remy Sharp).

If you have any issues in those implementations, you can report them here. :)
