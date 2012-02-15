/*! HTML5 Shiv vpre3.4 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed */
;(function(window, document) {

  /** Preset options */
  var presets = window.html5 || {};

  /** Used to skip problem elements */
  var reSkip = /^<|^(?:button|form|map|select|textarea)$/i;

  /** Cache of created elements, document methods, and shiv state */
  var shivCache = {};

  /** A list of HTML5 node names to shiv support for */
  var shivNames = 'abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video';

  /** Used to namespace printable elements and define `shivExpando` */
  var shivNamespace = 'html5shiv';

  /** Used to store an elements `shivUID` if `element.uniqueNumber` is not supported */
  var shivExpando = shivNamespace + /\d+$/.exec(Math.random());

  /** Used as a fallback for `element.uniqueNumber` */
  var shivUID = 1;

  /** Detect whether the browser supports default html5 styles */
  var supportsHtml5Styles;

  /** Detect whether the browser supports unknown elements */
  var supportsUnknownElements;

  (function() {
    var fake,
        docEl = document.documentElement,
        body = document.body || (fake = docEl.insertBefore(document.createElement('body'), docEl.firstChild)),
        compStyle = window.getComputedStyle,
        p = document.createElement('p');

    // avoid crashing the tab in IE8 if the detached body is styled with a background image
    fake && (fake.style.background = '');

    body.insertBefore(p, body.firstChild);
    p.hidden = true;
    p.innerHTML = '<xyz></xyz>';

    supportsHtml5Styles = (p.currentStyle || compStyle(p, null)).display == 'none';
    supportsUnknownElements = p.childNodes.length == 1 || (function() {
      // assign a false positive if unable to shiv
      try {
        (document.createElement)('p');
      } catch(e) {
        return true;
      }
      var frag = document.createDocumentFragment();
      return (
        typeof frag.createElement == 'undefined' ||
        typeof p.uniqueNumber == 'undefined'
      );
    }());

    body.removeChild(p);
    fake && docEl.removeChild(fake);
  }());

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a style sheet with the given CSS text and adds it to the document.
   * @private
   * @param {Document} ownerDocument The document.
   * @param {String} cssText The CSS text.
   * @returns {StyleSheet} The style element.
   */
  function addStyleSheet(ownerDocument, cssText) {
    var p = ownerDocument.createElement('p'),
        parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

    p.innerHTML = 'x<style>' + cssText + '</style>';
    return parent.insertBefore(p.lastChild, parent.firstChild);
  }

  /**
   * Gets the shiv cache object for the given document.
   * @private
   * @param {Document} ownerDocument The document.
   * @returns {Object} The shiv cache object.
   */
  function getCache(ownerDocument) {
    var nodes,
        docEl = ownerDocument.documentElement,
        id = docEl.uniqueNumber || docEl[shivExpando] || (docEl[shivExpando] = shivUID++);

    return shivCache[id] || (nodes = {}, shivCache[id] = {
      'shived': {
        'css': supportsHtml5Styles,
        'elements': supportsUnknownElements,
        'methods': supportsUnknownElements
      },
      'create': !supportsUnknownElements && shivElements(ownerDocument, nodes).createElement,
      'frag': !supportsUnknownElements && shivElements(ownerDocument.createDocumentFragment()),
      'nodes': nodes
    });
  }

  /**
   * Adds a style sheet with default styles for HTML5 elements to the given document.
   * @private
   * @param {Document} ownerDocument The document.
   */
  function shivCSS(ownerDocument) {
    addStyleSheet(ownerDocument,
      // corrects block display not defined in IE6/7/8/9
      'article,aside,details,figcaption,figure,footer,header,hgroup,nav,section{display:block}' +
      // corrects audio display not defined in IE6/7/8/9
      'audio{display:none}' +
      // corrects canvas and video display not defined in IE6/7/8/9
      'canvas,video{display:inline-block;*display:inline;*zoom:1}' +
      // corrects 'hidden' attribute and audio[controls] display not present in IE7/8/9
      '[hidden]{display:none}audio[controls]{display:inline-block;*display:inline;*zoom:1}' +
      // adds styling not present in IE6/7/8/9
      'mark{background:#FF0;color:#000}'
    );
  }

  /**
   * Creates HTML5 elements using the given document enabling the document to
   * parse them correctly.
   * @private
   * @param {Document|Fragment} ownerDocument The document.
   * @param {Object} cache An optional object used to store the elements created.
   * @returns {Document|Fragment} The document.
   */
  function shivElements(ownerDocument, cache) {
    var create = ownerDocument.createElement,
        index = shivNames.length;

    if (cache) {
      while (index--) {
        cache[shivNames[index]] = create(shivNames[index]);
      }
    } else while (index--) create(shivNames[index]);
    return ownerDocument;
  }

  /**
   * Shivs the `createElement` and `createDocumentFragment` methods of the document.
   * @private
   * @param {Document} ownerDocument The document.
   */
  function shivMethods(ownerDocument) {
    var cache = getCache(ownerDocument),
        create = cache.create,
        frag = cache.frag,
        nodes = cache.nodes;

    // allow a small amount of repeated code for better performance
    ownerDocument.createElement = function(nodeName) {
      var node = (nodes[nodeName] || (nodes[nodeName] = create(nodeName))).cloneNode();
      return node.canHaveChildren && !reSkip.test(nodeName) ? frag.appendChild(node) : node;
    };

    // compile unrolled `createElement` calls for better performance
    ownerDocument.createDocumentFragment = Function('f',
      'return function(){var n=f.cloneNode(),c=n.createElement;' +
      ('' + shivNames).replace(/\w+/g, 'c("$&")') +
      ';return n}'
    )(frag);
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a new shived element of the given node name.
   * @memberOf html5
   * @param {String} nodeName The node name of the element to create.
   * @param {Document} [ownerDocument=document] The context document.
   * @returns {Element} The new shived element.
   */
  function createElement(nodeName, ownerDocument) {
    ownerDocument || (ownerDocument = document);
    if (supportsUnknownElements) {
      return ownerDocument.createElement(nodeName);
    }
    // Avoid adding some elements to fragments in IE < 9 because
    // * attributes like `name` or `type` cannot be set/changed once an element
    //   is inserted into a document/fragment
    // * link elements with `src` attributes that are inaccessible, as with
    //   a 403 response, will cause the tab/window to crash
    // * script elements appended to fragments will execute when their `src`
    //   or `text` property is set
    var cache = getCache(ownerDocument),
        node = (cache.nodes[nodeName] || (cache.nodes[nodeName] = cache.create(nodeName))).cloneNode();

    return node.canHaveChildren && !reSkip.test(nodeName) ? cache.frag.appendChild(node) : node;
  }

  /**
   * Creates a new shived document fragment.
   * @memberOf html5
   * @param {Document} [ownerDocument=document] The context document.
   * @returns {Fragment} The new shived document fragment.
   */
  function createDocumentFragment(ownerDocument) {
    ownerDocument || (ownerDocument = document);
    return supportsUnknownElements
      ? ownerDocument.createDocumentFragment()
      : shivElements(getCache(ownerDocument).frag.cloneNode());
  }

  /**
   * Shivs the given document.
   * @memberOf html5
   * @param {Document} [ownerDocument=document] The document to shiv.
   * @returns {Document} The shived document.
   */
  function shivDocument(ownerDocument, options) {
    options || (options = {});
    ownerDocument || (ownerDocument = document);

    // juggle arguments
    if (ownerDocument && !ownerDocument.nodeType) {
      options = ownerDocument;
      ownerDocument = document;
    }
    var shived = getCache(ownerDocument).shived;
    if (!shived.css && options.shivCSS !== false) {
      shived.css = !shivCSS(ownerDocument);
    }
    if (!shived.methods && options.shivMethods !== false) {
      shived.methods = !shivMethods(ownerDocument);
    }
    return ownerDocument;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * The `html5` object is exposed so that more elements can be shived and
   * existing shiving can be detected on iframes.
   * @type Object
   * @example
   *
   * // options can be changed before the script is included
   * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
   */
  var html5 = {

    /**
     * A string to describe the type of `html5` object ("default" or "default print").
     * @memberOf html5
     * @type String
     */
    'type': 'default',

    // creates shived document fragments
    'createDocumentFragment': createDocumentFragment,

    // creates shived elements
    'createElement': createElement,

    // shivs the document according to the specified options
    'shivDocument': shivDocument
  };

  /*--------------------------------------------------------------------------*/

  // ensure `shivNames` is an array
  shivNames = typeof (shivNames = presets.elements || shivNames)  == 'string' ? shivNames.split(' ') : shivNames;

  // expose html5
  // use square bracket notation so Closure Compiler won't munge `html5`
  window['html5'] = html5;

  // shiv the primary document
  shivDocument(presets);

}(this, document));