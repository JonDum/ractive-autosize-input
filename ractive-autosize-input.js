(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["RactiveAutosizeInput"] = factory();
	else
		root["RactiveAutosizeInput"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	var win = window, doc = win.document;

	/*
	 *  There's some super weird fucking bug when
	 *  a component requires Ractive from a node_module
	 *  and then uses an observer inside a lifecycle hook...
	 *  sooo yea until I can wrap my head around that bullshit
	 *  you need to have Ractive as a global
	 *
	 */
	//var Ractive = require('ractive');

	// Share a single sizing element for all of the
	// instances on the page
	var sizer;

	var throttle = __webpack_require__(1);

	var styles = [
	    'fontSize',
	    'fontFamily',
	    'fontWeight',
	    'letterSpacing',
	    'padding',
	    'border',
	];

	//

	var RactiveAutosizeInput = Ractive.extend({

	    template: __webpack_require__(7),

	    computed: {
	        isMultiline: function() {

	            var multiline = this.get('multiline');

	            // test if multiline is explicitly defined
	            if(multiline === false || multiline === true)
	                return multiline;

	            // if not, automatically check for newline chars
	            return /\n/.test(this.get('_value'));
	        }, 
	        _value: {
	            get: function() {
	                var value = this.get('value');
	                return value && value.replace ? value.replace(/\\n/g, '\n') : value;
	            },
	            set: function(value) {
	                this.set('value', value);
	            }
	        }
	    },

	    onrender: function() {

	        var self = this;

	        var el = self.find('*');

	        if(!sizer) {
	            sizer = doc.createElement('div');
	            sizer.style.display = 'inline-block!important';
	            sizer.style.position = 'fixed';
	            sizer.style.speak = 'none';
	            sizer.style.whiteSpace = 'pre';
	            sizer.style.left = sizer.style.top = '-9999px';
	            sizer.className = 'ractive-autosize-input-sizer';
	            doc.body.appendChild(sizer);
	        }

	        var oldStyles = window.getComputedStyle(el);
	        self.resizeHandler = throttle(function(event) {

	            var newStyles = window.getComputedStyle(el);
	            var dirty;

	            for(var i = 0; i < styles.length; i++) {
	                var style = styles[i];
	                if(newStyles[style] !== oldStyles[style]) {
	                    dirty = true;
	                }
	                // copy over style now that we've checked, cloning whole object doesn't work 
	                //oldStyles.setProperty(style, newStyles[style]);
	            }

	            oldStyles= clone(newStyles);

	            if(dirty)
	                self.updateSize();

	        }, 60);

	        window.addEventListener('resize', self.resizeHandler);

	        if(MutationObserver) {

	            var observer = self.observer = new MutationObserver(function(mutations) {
	                self.updateSize();
	            });

	            observer.observe(el, {
	                attributes: true,
	                attributeFilter: ['style', 'class', 'id']
	            });
	        }

	        self.observe('placeholder value', self.updateSize);
	    },

	    updateSize: function() {

	        var self = this;

	        var value = self.get('_value');
	        var placeholder = self.get('placeholder');
	        var el = self.find('*');

	        var inputStyle = win.getComputedStyle(el);

	        styles.forEach(function(style) {
	            sizer.style[style] = inputStyle[style];
	        });

	        if(placeholder && placeholder.length > 0) {
	            sizer.textContent = placeholder;
	            var widthWithPlaceholder = sizer.offsetWidth;
	            var heightWithPlaceholder = sizer.offsetHeight;
	        }

	        sizer.textContent = value;
	        var widthWithValue = sizer.offsetWidth;

	        var newWidth = Math.max(widthWithPlaceholder || 0, widthWithValue || 0)+'px';

	        if(inputStyle.minWidth !== newWidth)
	            el.style.minWidth = newWidth;

	        // do the same operations above but for height
	        // if we're in multiline mode
	        if(self.get('isMultiline')) {

	            var heightWithValue = sizer.offsetHeight;
	            var newHeight = Math.max(heightWithPlaceholder || 0, heightWithValue|| 0)+'px'

	            if(inputStyle.minHeight !== newHeight)
	                el.style.minHeight = newHeight;

	        }


	    },

	    onteardown: function() {
	        if(self.observer)
	            self.observer.disconnect();
	        window.removeEventListener('resize', self.resizeListener);
	    },

	    forward: function(details) {
	        var event = details.original;
	        if(event && event.type)
	            this.fire(event.type, event);
	    }
	});

	// CSSStyleDeclarations get passed by reference, so we have to do this
	// bs to make a copy (of only the styles we care about)
	function clone(styleDec) {
	    var clone = {};

	    if(!styleDec || !styleDec.cssText)
	        return;

	    styles.forEach(function(style) {
	        clone[style] = styleDec[style];
	    });

	    return clone;
	}

	module.exports = RactiveAutosizeInput;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var debounce = __webpack_require__(2),
	    isObject = __webpack_require__(3);

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/**
	 * Creates a throttled function that only invokes `func` at most once per
	 * every `wait` milliseconds. The throttled function comes with a `cancel`
	 * method to cancel delayed `func` invocations and a `flush` method to
	 * immediately invoke them. Provide an options object to indicate whether
	 * `func` should be invoked on the leading and/or trailing edge of the `wait`
	 * timeout. The `func` is invoked with the last arguments provided to the
	 * throttled function. Subsequent calls to the throttled function return the
	 * result of the last `func` invocation.
	 *
	 * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
	 * on the trailing edge of the timeout only if the throttled function is
	 * invoked more than once during the `wait` timeout.
	 *
	 * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
	 * for details over the differences between `_.throttle` and `_.debounce`.
	 *
	 * @static
	 * @memberOf _
	 * @category Function
	 * @param {Function} func The function to throttle.
	 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
	 * @param {Object} [options] The options object.
	 * @param {boolean} [options.leading=true] Specify invoking on the leading
	 *  edge of the timeout.
	 * @param {boolean} [options.trailing=true] Specify invoking on the trailing
	 *  edge of the timeout.
	 * @returns {Function} Returns the new throttled function.
	 * @example
	 *
	 * // Avoid excessively updating the position while scrolling.
	 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
	 *
	 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
	 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
	 * jQuery(element).on('click', throttled);
	 *
	 * // Cancel the trailing throttled invocation.
	 * jQuery(window).on('popstate', throttled.cancel);
	 */
	function throttle(func, wait, options) {
	  var leading = true,
	      trailing = true;

	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  if (isObject(options)) {
	    leading = 'leading' in options ? !!options.leading : leading;
	    trailing = 'trailing' in options ? !!options.trailing : trailing;
	  }
	  return debounce(func, wait, {
	    'leading': leading,
	    'maxWait': wait,
	    'trailing': trailing
	  });
	}

	module.exports = throttle;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(3),
	    now = __webpack_require__(4),
	    toNumber = __webpack_require__(5);

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;

	/**
	 * Creates a debounced function that delays invoking `func` until after `wait`
	 * milliseconds have elapsed since the last time the debounced function was
	 * invoked. The debounced function comes with a `cancel` method to cancel
	 * delayed `func` invocations and a `flush` method to immediately invoke them.
	 * Provide an options object to indicate whether `func` should be invoked on
	 * the leading and/or trailing edge of the `wait` timeout. The `func` is invoked
	 * with the last arguments provided to the debounced function. Subsequent calls
	 * to the debounced function return the result of the last `func` invocation.
	 *
	 * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
	 * on the trailing edge of the timeout only if the debounced function is
	 * invoked more than once during the `wait` timeout.
	 *
	 * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
	 * for details over the differences between `_.debounce` and `_.throttle`.
	 *
	 * @static
	 * @memberOf _
	 * @category Function
	 * @param {Function} func The function to debounce.
	 * @param {number} [wait=0] The number of milliseconds to delay.
	 * @param {Object} [options] The options object.
	 * @param {boolean} [options.leading=false] Specify invoking on the leading
	 *  edge of the timeout.
	 * @param {number} [options.maxWait] The maximum time `func` is allowed to be
	 *  delayed before it's invoked.
	 * @param {boolean} [options.trailing=true] Specify invoking on the trailing
	 *  edge of the timeout.
	 * @returns {Function} Returns the new debounced function.
	 * @example
	 *
	 * // Avoid costly calculations while the window size is in flux.
	 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
	 *
	 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
	 * jQuery(element).on('click', _.debounce(sendMail, 300, {
	 *   'leading': true,
	 *   'trailing': false
	 * }));
	 *
	 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
	 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
	 * var source = new EventSource('/stream');
	 * jQuery(source).on('message', debounced);
	 *
	 * // Cancel the trailing debounced invocation.
	 * jQuery(window).on('popstate', debounced.cancel);
	 */
	function debounce(func, wait, options) {
	  var args,
	      maxTimeoutId,
	      result,
	      stamp,
	      thisArg,
	      timeoutId,
	      trailingCall,
	      lastCalled = 0,
	      leading = false,
	      maxWait = false,
	      trailing = true;

	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  wait = toNumber(wait) || 0;
	  if (isObject(options)) {
	    leading = !!options.leading;
	    maxWait = 'maxWait' in options && nativeMax(toNumber(options.maxWait) || 0, wait);
	    trailing = 'trailing' in options ? !!options.trailing : trailing;
	  }

	  function cancel() {
	    if (timeoutId) {
	      clearTimeout(timeoutId);
	    }
	    if (maxTimeoutId) {
	      clearTimeout(maxTimeoutId);
	    }
	    lastCalled = 0;
	    args = maxTimeoutId = thisArg = timeoutId = trailingCall = undefined;
	  }

	  function complete(isCalled, id) {
	    if (id) {
	      clearTimeout(id);
	    }
	    maxTimeoutId = timeoutId = trailingCall = undefined;
	    if (isCalled) {
	      lastCalled = now();
	      result = func.apply(thisArg, args);
	      if (!timeoutId && !maxTimeoutId) {
	        args = thisArg = undefined;
	      }
	    }
	  }

	  function delayed() {
	    var remaining = wait - (now() - stamp);
	    if (remaining <= 0 || remaining > wait) {
	      complete(trailingCall, maxTimeoutId);
	    } else {
	      timeoutId = setTimeout(delayed, remaining);
	    }
	  }

	  function flush() {
	    if ((timeoutId && trailingCall) || (maxTimeoutId && trailing)) {
	      result = func.apply(thisArg, args);
	    }
	    cancel();
	    return result;
	  }

	  function maxDelayed() {
	    complete(trailing, timeoutId);
	  }

	  function debounced() {
	    args = arguments;
	    stamp = now();
	    thisArg = this;
	    trailingCall = trailing && (timeoutId || !leading);

	    if (maxWait === false) {
	      var leadingCall = leading && !timeoutId;
	    } else {
	      if (!lastCalled && !maxTimeoutId && !leading) {
	        lastCalled = stamp;
	      }
	      var remaining = maxWait - (stamp - lastCalled);

	      var isCalled = (remaining <= 0 || remaining > maxWait) &&
	        (leading || maxTimeoutId);

	      if (isCalled) {
	        if (maxTimeoutId) {
	          maxTimeoutId = clearTimeout(maxTimeoutId);
	        }
	        lastCalled = stamp;
	        result = func.apply(thisArg, args);
	      }
	      else if (!maxTimeoutId) {
	        maxTimeoutId = setTimeout(maxDelayed, remaining);
	      }
	    }
	    if (isCalled && timeoutId) {
	      timeoutId = clearTimeout(timeoutId);
	    }
	    else if (!timeoutId && wait !== maxWait) {
	      timeoutId = setTimeout(delayed, wait);
	    }
	    if (leadingCall) {
	      isCalled = true;
	      result = func.apply(thisArg, args);
	    }
	    if (isCalled && !timeoutId && !maxTimeoutId) {
	      args = thisArg = undefined;
	    }
	    return result;
	  }
	  debounced.cancel = cancel;
	  debounced.flush = flush;
	  return debounced;
	}

	module.exports = debounce;


/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	module.exports = isObject;


/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * Gets the timestamp of the number of milliseconds that have elapsed since
	 * the Unix epoch (1 January 1970 00:00:00 UTC).
	 *
	 * @static
	 * @memberOf _
	 * @type {Function}
	 * @category Date
	 * @returns {number} Returns the timestamp.
	 * @example
	 *
	 * _.defer(function(stamp) {
	 *   console.log(_.now() - stamp);
	 * }, _.now());
	 * // => logs the number of milliseconds it took for the deferred function to be invoked
	 */
	var now = Date.now;

	module.exports = now;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(6),
	    isObject = __webpack_require__(3);

	/** Used as references for various `Number` constants. */
	var NAN = 0 / 0;

	/** Used to match leading and trailing whitespace. */
	var reTrim = /^\s+|\s+$/g;

	/** Used to detect bad signed hexadecimal string values. */
	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

	/** Used to detect binary string values. */
	var reIsBinary = /^0b[01]+$/i;

	/** Used to detect octal string values. */
	var reIsOctal = /^0o[0-7]+$/i;

	/** Built-in method references without a dependency on `root`. */
	var freeParseInt = parseInt;

	/**
	 * Converts `value` to a number.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {number} Returns the number.
	 * @example
	 *
	 * _.toNumber(3);
	 * // => 3
	 *
	 * _.toNumber(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toNumber(Infinity);
	 * // => Infinity
	 *
	 * _.toNumber('3');
	 * // => 3
	 */
	function toNumber(value) {
	  if (isObject(value)) {
	    var other = isFunction(value.valueOf) ? value.valueOf() : value;
	    value = isObject(other) ? (other + '') : other;
	  }
	  if (typeof value != 'string') {
	    return value === 0 ? value : +value;
	  }
	  value = value.replace(reTrim, '');
	  var isBinary = reIsBinary.test(value);
	  return (isBinary || reIsOctal.test(value))
	    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
	    : (reIsBadHex.test(value) ? NAN : +value);
	}

	module.exports = toNumber;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(3);

	/** `Object#toString` result references. */
	var funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 8 which returns 'object' for typed array constructors, and
	  // PhantomJS 1.9 which returns 'function' for `NodeList` instances.
	  var tag = isObject(value) ? objectToString.call(value) : '';
	  return tag == funcTag || tag == genTag;
	}

	module.exports = isFunction;


/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports={"v":3,"t":[{"t":4,"f":[{"t":7,"e":"textarea","a":{"class":["ractive-autosize-input ",{"t":2,"r":".class"}],"type":[{"t":2,"r":".type"}],"placeholder":[{"t":2,"r":".placeholder"}],"value":[{"t":2,"r":"._value"}],"name":[{"t":2,"r":".name"}],"minlength":[{"t":2,"r":".minlength"}],"maxlength":[{"t":2,"r":".maxlength"}],"required":[{"t":2,"r":".required"}],"readonly":[{"t":2,"r":".readonly"}],"disabled":[{"t":2,"r":".disabled"}],"autofocus":[{"t":2,"r":".autofocus"}],"style":[{"t":2,"r":".style"}]},"v":{"keydown":{"m":"forward","a":{"r":["event"],"s":"[_0]"}},"keypress":{"m":"forward","a":{"r":["event"],"s":"[_0]"}},"keyup":{"m":"forward","a":{"r":["event"],"s":"[_0]"}},"input":{"m":"forward","a":{"r":["event"],"s":"[_0]"}},"focus":{"m":"forward","a":{"r":["event"],"s":"[_0]"}},"blur":{"m":"forward","a":{"r":["event"],"s":"[_0]"}}}}],"n":50,"r":"isMultiline"},{"t":4,"n":51,"f":[{"t":7,"e":"input","a":{"class":["ractive-autosize-input ",{"t":2,"r":".class"}],"type":[{"t":2,"r":".type"}],"placeholder":[{"t":2,"r":".placeholder"}],"value":[{"t":2,"r":"._value"}],"name":[{"t":2,"r":".name"}],"minlength":[{"t":2,"r":".minlength"}],"maxlength":[{"t":2,"r":".maxlength"}],"required":[{"t":2,"r":".required"}],"readonly":[{"t":2,"r":".readonly"}],"disabled":[{"t":2,"r":".disabled"}],"autofocus":[{"t":2,"r":".autofocus"}],"style":[{"t":2,"r":".style"}]},"v":{"keydown":{"m":"forward","a":{"r":["event"],"s":"[_0]"}},"keypress":{"m":"forward","a":{"r":["event"],"s":"[_0]"}},"keyup":{"m":"forward","a":{"r":["event"],"s":"[_0]"}},"input":{"m":"forward","a":{"r":["event"],"s":"[_0]"}},"focus":{"m":"forward","a":{"r":["event"],"s":"[_0]"}},"blur":{"m":"forward","a":{"r":["event"],"s":"[_0]"}}}}],"r":"isMultiline"}]};

/***/ }
/******/ ])
});
;