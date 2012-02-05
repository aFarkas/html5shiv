/*! HTML5 Shiv v3.3alpha | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed */
;(function(window, document) {

  /** Preset options */
  var options = window.html5 || {};

  /** Used to skip problem elements */
  var reSkip = /^<|^(?:button|iframe|input|script|textarea)$/i;

  /** Detect whether the browser supports default html5 styles */
  var supportsHtml5Styles;

  /** Detect whether the browser supports unknown elements */
  var supportsUnknownElements;

  (function() {
    var fake,
        a = document.createElement('a'),
        compStyle = window.getComputedStyle,
        docEl = document.documentElement,
        body = document.body || (fake = docEl.insertBefore(document.createElement('body'), docEl.firstChild));

    body.insertBefore(a, body.firstChild);
    a.hidden = true;
    a.innerHTML = '<xyz></xyz>';

    supportsHtml5Styles = (a.currentStyle || compStyle(a, null)).display == 'none';
    supportsUnknownElements = a.childNodes.length == 1 || (function() {
      // assign a false positive if unable to shiv
      try {
        (document.createElement)('a');
      } catch(e) {
        return true;
      }
      var frag = document.createDocumentFragment();
      return (
        typeof frag.cloneNode == 'undefined' ||
        typeof frag.createDocumentFragment == 'undefined' ||
        typeof frag.createElement == 'undefined'
      );
    }());

    body.removeChild(a);
    fake && docEl.removeChild(fake);
  }());

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a style sheet with the given CSS text and adds it to the document.
   * @private
   * @param {Document} ownerDocument The document.
   * @param {String} cssText The CSS text.
   * @returns {CSSStyleSheet} The style element.
   */
  function addStyleSheet(ownerDocument, cssText) {
    var p = document.createElement('p'),
        parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

    p.innerHTML = 'x<style>' + cssText + '</style>';
    return parent.insertBefore(p.lastChild, parent.firstChild);
  }

  /**
   * Returns the value of `html5.elements` as an array.
   * @private
   * @returns {Array} An array of shived element node names.
   */
  function getElements() {
    var elements = html5.elements;
    return typeof elements == 'string' ? elements.split(' ') : elements;
  }

  /**
   * Shivs the `createElement` and `createDocumentFragment` methods of the document.
   * @private
   * @param {Document|DocumentFragment} ownerDocument The document.
   */
  function shivMethods(ownerDocument) {
    var nodeName,
        cache = {},
        docCreateElement = ownerDocument.createElement,
        docCreateFragment = ownerDocument.createDocumentFragment,
        elements = getElements(),
        frag = docCreateFragment(),
        index = elements.length;

    function createDocumentFragment() {
      var node = frag.cloneNode(false);
      return html5.shivMethods ? (shivMethods(node), node) : node;
    }

    function createElement(nodeName) {
      // avoid shiving elements like button, iframe, input, and textarea
      // because IE < 9 cannot set the `name` or `type` attributes of an
      // element once it's inserted into a document
      var node = (cache[nodeName] || (cache[nodeName] = docCreateElement(nodeName))).cloneNode(false);
      return html5.shivMethods && !reSkip.test(nodeName) ? frag.appendChild(node) : node;
    }

    while (index--) {
      nodeName = elements[index];
      cache[nodeName] = docCreateElement(nodeName);
      frag.createElement(nodeName);
    }
    ownerDocument.createElement = createElement;
    ownerDocument.createDocumentFragment = createDocumentFragment;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Shivs the given document.
   * @memberOf html5
   * @param {Document} ownerDocument The document to shiv.
   * @returns {Document} The shived document.
   */
  function shivDocument(ownerDocument) {
    var shived;
    if (ownerDocument.documentShived) {
      return ownerDocument;
    }
    if (html5.shivCSS && !supportsHtml5Styles) {
      shived = !!addStyleSheet(ownerDocument,
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
    if (html5.shivMethods && !supportsUnknownElements) {
      shived = !shivMethods(ownerDocument);
    }
    if (shived) {
      ownerDocument.documentShived = shived;
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
     * An array or space separated string of node names of the elements to shiv.
     * @memberOf html5
     * @type Array|String
     */
    'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video'.split(' '),

    /**
     * A flag to indicate that the HTML5 style sheet should be inserted.
     * @memberOf html5
     * @type Boolean
     */
    'shivCSS': !(options.shivCSS === false),

    /**
     * A flag to indicate that the document's `createElement` and `createDocumentFragment`
     * methods should be overwritten.
     * @memberOf html5
     * @type Boolean
     */
    'shivMethods': !(options.shivMethods === false),

    /**
     * A string to describe the type of `html5` object ("default" or "default print").
     * @memberOf html5
     * @type String
     */
    'type': 'default',

    // shivs the document according to the specified `html5` object options
    'shivDocument': shivDocument
  };

  /*--------------------------------------------------------------------------*/

  // expose html5
  window.html5 = html5;

  // shiv the document
  shivDocument(document);

  /*------------------------------- Print Shiv -------------------------------*/

  /** Used to filter media types */
  var reMedia = /^$|\b(?:all|print)\b/;

  /** Used to namespace printable elements */
  var shivNamespace = 'html5shiv';

  /** Used to store elements that have been swapped with printable clones */
  var swapCache = [];

  /** Detect whether the browser supports shivable style sheets */
  var supportsShivableSheets = !supportsUnknownElements && (function() {
    // assign a false negative if unable to shiv
    return !(
      typeof document.namespaces == 'undefined' ||
      typeof document.parentWindow == 'undefined' ||
      typeof document.swapNode == 'undefined'
    );
  }());

  /*--------------------------------------------------------------------------*/

  /**
   * Registers an event listener on an element or window object.
   * @private
   * @param {Object} object The element/window object.
   * @param {String} eventName The name of the event.
   * @param {Function} handler The event handler.
   */
  function addListener(element, eventName, handler) {
    if (typeof element.addEventListener != 'undefined') {
      element.addEventListener(eventName, handler, false);
    } else if (typeof element.attachEvent != 'undefined') {
      element.attachEvent('on' + eventName, handler);
    }
  }

  /**
   * Creates a printable clone of the given element.
   * @private
   * @param {Document} ownerDocument The document.
   * @param {Element} element The element to clone.
   * @returns {Element} The printable clone.
   */
  function createPrintable(ownerDocument, element) {
    var attr,
        child,
        nodeName,
        attributes = element.attributes,
        index = attributes.length,
        nodeName = element.nodeName,
        printable = ownerDocument.createElement(shivNamespace + ':' + nodeName);

    // copy attributes to the printable element
    while (index--) {
      attr = attributes[index];
      attr.specified && printable.setAttribute(attr.nodeName, attr.nodeValue);
    }
    // copy styles to the printable element
    printable.style.cssText = element.style.cssText;
    return printable;
  }

  /**
   * Shivs the given CSS text.
   * (eg. header{} becomes html5shiv\:header{})
   * @private
   * @param {Document} ownerDocument The document.
   * @param {String} cssText The style text to shiv.
   * @returns {String} The shived style text.
   */
  function shivCssText(ownerDocument, cssText) {
    var pair,
        parts = cssText.split('{'),
        reElements = RegExp('(^|[\\s,])(' + getElements().join('|') + ')\\b', 'gi'),
        replacement = '$1' + shivNamespace + '\\:$2',
        index = parts.length;

    while (index--) {
      pair = parts[index] = parts[index].split('}');
      pair[pair.length - 1] = pair[pair.length - 1].replace(reElements, replacement);
      parts[index] = pair.join('}');
    }
    return parts.join('{');
  }

  /**
   * Swaps a node with a replacement node, transferring the node's children
   * to the replacement node.
   * @param {Element} element The element to swap.
   * @param {Element} replacment The element to swap with.
   */
  function swapNode(element, replacement) {
    var child;
    while ((child = element.firstChild)) {
      replacement.appendChild(child);
    }
    element.swapNode(replacement);
  }

  /**
   * Replaces printable clones with their original HTML5 elements.
   * (eg. html5shiv:header element becomes header element)
   * @private
   * @param {Document} ownerDocument The document.
   */
  function swapToHtml5(ownerDocument) {
    var data;
    while ((data = swapCache.pop())) {
      swapNode(data.printable, data.html5);
    }
  }

  /**
   * Replaces HTML5 elements with printable clones.
   * (eg. header element becomes html5shiv:header element)
   * @private
   * @param {Document} ownerDocument The document.
   */
  function swapToPrintable(ownerDocument) {
    var node,
        printable,
        nodes = ownerDocument.getElementsByTagName('*'),
        index = nodes.length,
        reElements = RegExp('^(?:' + getElements().join('|') + ')$', 'i');

    while (index--) {
      node = nodes[index];
      if (reElements.test(node.nodeName)) {
        printable = createPrintable(ownerDocument, node);
        swapCache.push({ 'html5': node, 'printable': printable });
        swapNode(node, printable);
      }
    }
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Shivs the given document for print.
   * @memberOf html5
   * @param {Document} ownerDocument The document to shiv.
   * @returns {Document} The shived document.
   */
  function shivPrint(ownerDocument) {
    var shivedSheet,
        ownerWindow = ownerDocument.parentWindow,
        namespaces = ownerDocument.namespaces;

    if (!supportsShivableSheets || ownerDocument.printShived) {
      return ownerDocument;
    }
    if (typeof namespaces[shivNamespace] == 'undefined') {
      namespaces.add(shivNamespace);
    }
    addListener(ownerWindow, 'beforeprint', function() {
      var imports,
          length,
          sheet,
          collection = ownerDocument.styleSheets,
          index = collection.length,
          cssText = [],
          sheets = [];

      // convert styleSheets collection to an array
      while (index--) {
        sheets[index] = collection[index];
      }
      // concat all style sheet CSS text
      while ((sheet = sheets.pop())) {
        // IE does not enforce a same origin policy for external style sheets
        if (!sheet.disabled && reMedia.test(sheet.media)) {
          for (imports = sheet.imports, index = 0, length = imports.length; index < length; index++) {
            sheets.push(imports[index]);
          }
          cssText.push(sheet.cssText);
        }
      }
      // replace HTML5 elements with printable clones and add shived style sheet
      cssText = shivCssText(ownerDocument, cssText.reverse().join(''));
      swapToPrintable(ownerDocument);
      shivedSheet = addStyleSheet(ownerDocument, cssText);
    });

    addListener(ownerWindow, 'afterprint', function() {
      // replace printable clones with original elements and remove shived style sheet
      swapToHtml5(ownerDocument);
      shivedSheet.parentNode.removeChild(shivedSheet);
    });

    ownerDocument.printShived = true;
    return ownerDocument;
  }

  /*--------------------------------------------------------------------------*/

  // expose API
  html5.type += ' print';
  html5.shivPrint = shivPrint;

  // shiv for print
  shivPrint(document);

}(this, document));