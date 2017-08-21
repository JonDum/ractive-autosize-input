(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("Ractive"));
	else if(typeof define === 'function' && define.amd)
		define(["Ractive"], factory);
	else if(typeof exports === 'object')
		exports["RactiveAutosizeInput"] = factory(require("Ractive"));
	else
		root["RactiveAutosizeInput"] = factory(root["Ractive"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
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
/***/ (function(module, exports, __webpack_require__) {

	
	var win = window, doc = win.document;

	var Ractive = __webpack_require__(1);

	// Share a single sizing element for all of the
	// instances on the page
	var sizer;

	var throttle = __webpack_require__(2);

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

	    template: __webpack_require__(15),

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

	    forward: function(event, context) {
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


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var debounce = __webpack_require__(3),
	    isObject = __webpack_require__(4);

	/** Error message constants. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/**
	 * Creates a throttled function that only invokes `func` at most once per
	 * every `wait` milliseconds. The throttled function comes with a `cancel`
	 * method to cancel delayed `func` invocations and a `flush` method to
	 * immediately invoke them. Provide `options` to indicate whether `func`
	 * should be invoked on the leading and/or trailing edge of the `wait`
	 * timeout. The `func` is invoked with the last arguments provided to the
	 * throttled function. Subsequent calls to the throttled function return the
	 * result of the last `func` invocation.
	 *
	 * **Note:** If `leading` and `trailing` options are `true`, `func` is
	 * invoked on the trailing edge of the timeout only if the throttled function
	 * is invoked more than once during the `wait` timeout.
	 *
	 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
	 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
	 *
	 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
	 * for details over the differences between `_.throttle` and `_.debounce`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to throttle.
	 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
	 * @param {Object} [options={}] The options object.
	 * @param {boolean} [options.leading=true]
	 *  Specify invoking on the leading edge of the timeout.
	 * @param {boolean} [options.trailing=true]
	 *  Specify invoking on the trailing edge of the timeout.
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


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(4),
	    now = __webpack_require__(5),
	    toNumber = __webpack_require__(8);

	/** Error message constants. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max,
	    nativeMin = Math.min;

	/**
	 * Creates a debounced function that delays invoking `func` until after `wait`
	 * milliseconds have elapsed since the last time the debounced function was
	 * invoked. The debounced function comes with a `cancel` method to cancel
	 * delayed `func` invocations and a `flush` method to immediately invoke them.
	 * Provide `options` to indicate whether `func` should be invoked on the
	 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
	 * with the last arguments provided to the debounced function. Subsequent
	 * calls to the debounced function return the result of the last `func`
	 * invocation.
	 *
	 * **Note:** If `leading` and `trailing` options are `true`, `func` is
	 * invoked on the trailing edge of the timeout only if the debounced function
	 * is invoked more than once during the `wait` timeout.
	 *
	 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
	 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
	 *
	 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
	 * for details over the differences between `_.debounce` and `_.throttle`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to debounce.
	 * @param {number} [wait=0] The number of milliseconds to delay.
	 * @param {Object} [options={}] The options object.
	 * @param {boolean} [options.leading=false]
	 *  Specify invoking on the leading edge of the timeout.
	 * @param {number} [options.maxWait]
	 *  The maximum time `func` is allowed to be delayed before it's invoked.
	 * @param {boolean} [options.trailing=true]
	 *  Specify invoking on the trailing edge of the timeout.
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
	  var lastArgs,
	      lastThis,
	      maxWait,
	      result,
	      timerId,
	      lastCallTime,
	      lastInvokeTime = 0,
	      leading = false,
	      maxing = false,
	      trailing = true;

	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  wait = toNumber(wait) || 0;
	  if (isObject(options)) {
	    leading = !!options.leading;
	    maxing = 'maxWait' in options;
	    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
	    trailing = 'trailing' in options ? !!options.trailing : trailing;
	  }

	  function invokeFunc(time) {
	    var args = lastArgs,
	        thisArg = lastThis;

	    lastArgs = lastThis = undefined;
	    lastInvokeTime = time;
	    result = func.apply(thisArg, args);
	    return result;
	  }

	  function leadingEdge(time) {
	    // Reset any `maxWait` timer.
	    lastInvokeTime = time;
	    // Start the timer for the trailing edge.
	    timerId = setTimeout(timerExpired, wait);
	    // Invoke the leading edge.
	    return leading ? invokeFunc(time) : result;
	  }

	  function remainingWait(time) {
	    var timeSinceLastCall = time - lastCallTime,
	        timeSinceLastInvoke = time - lastInvokeTime,
	        result = wait - timeSinceLastCall;

	    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
	  }

	  function shouldInvoke(time) {
	    var timeSinceLastCall = time - lastCallTime,
	        timeSinceLastInvoke = time - lastInvokeTime;

	    // Either this is the first call, activity has stopped and we're at the
	    // trailing edge, the system time has gone backwards and we're treating
	    // it as the trailing edge, or we've hit the `maxWait` limit.
	    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
	      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
	  }

	  function timerExpired() {
	    var time = now();
	    if (shouldInvoke(time)) {
	      return trailingEdge(time);
	    }
	    // Restart the timer.
	    timerId = setTimeout(timerExpired, remainingWait(time));
	  }

	  function trailingEdge(time) {
	    timerId = undefined;

	    // Only invoke if we have `lastArgs` which means `func` has been
	    // debounced at least once.
	    if (trailing && lastArgs) {
	      return invokeFunc(time);
	    }
	    lastArgs = lastThis = undefined;
	    return result;
	  }

	  function cancel() {
	    if (timerId !== undefined) {
	      clearTimeout(timerId);
	    }
	    lastInvokeTime = 0;
	    lastArgs = lastCallTime = lastThis = timerId = undefined;
	  }

	  function flush() {
	    return timerId === undefined ? result : trailingEdge(now());
	  }

	  function debounced() {
	    var time = now(),
	        isInvoking = shouldInvoke(time);

	    lastArgs = arguments;
	    lastThis = this;
	    lastCallTime = time;

	    if (isInvoking) {
	      if (timerId === undefined) {
	        return leadingEdge(lastCallTime);
	      }
	      if (maxing) {
	        // Handle invocations in a tight loop.
	        timerId = setTimeout(timerExpired, wait);
	        return invokeFunc(lastCallTime);
	      }
	    }
	    if (timerId === undefined) {
	      timerId = setTimeout(timerExpired, wait);
	    }
	    return result;
	  }
	  debounced.cancel = cancel;
	  debounced.flush = flush;
	  return debounced;
	}

	module.exports = debounce;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
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
	  return value != null && (type == 'object' || type == 'function');
	}

	module.exports = isObject;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var root = __webpack_require__(6);

	/**
	 * Gets the timestamp of the number of milliseconds that have elapsed since
	 * the Unix epoch (1 January 1970 00:00:00 UTC).
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Date
	 * @returns {number} Returns the timestamp.
	 * @example
	 *
	 * _.defer(function(stamp) {
	 *   console.log(_.now() - stamp);
	 * }, _.now());
	 * // => Logs the number of milliseconds it took for the deferred invocation.
	 */
	var now = function() {
	  return root.Date.now();
	};

	module.exports = now;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	var freeGlobal = __webpack_require__(7);

	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();

	module.exports = root;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

	module.exports = freeGlobal;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(4),
	    isSymbol = __webpack_require__(9);

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
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {number} Returns the number.
	 * @example
	 *
	 * _.toNumber(3.2);
	 * // => 3.2
	 *
	 * _.toNumber(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toNumber(Infinity);
	 * // => Infinity
	 *
	 * _.toNumber('3.2');
	 * // => 3.2
	 */
	function toNumber(value) {
	  if (typeof value == 'number') {
	    return value;
	  }
	  if (isSymbol(value)) {
	    return NAN;
	  }
	  if (isObject(value)) {
	    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
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


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(10),
	    isObjectLike = __webpack_require__(14);

	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike(value) && baseGetTag(value) == symbolTag);
	}

	module.exports = isSymbol;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(11),
	    getRawTag = __webpack_require__(12),
	    objectToString = __webpack_require__(13);

	/** `Object#toString` result references. */
	var nullTag = '[object Null]',
	    undefinedTag = '[object Undefined]';

	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

	/**
	 * The base implementation of `getTag` without fallbacks for buggy environments.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
	  if (value == null) {
	    return value === undefined ? undefinedTag : nullTag;
	  }
	  return (symToStringTag && symToStringTag in Object(value))
	    ? getRawTag(value)
	    : objectToString(value);
	}

	module.exports = baseGetTag;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	var root = __webpack_require__(6);

	/** Built-in value references. */
	var Symbol = root.Symbol;

	module.exports = Symbol;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(11);

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;

	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

	/**
	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the raw `toStringTag`.
	 */
	function getRawTag(value) {
	  var isOwn = hasOwnProperty.call(value, symToStringTag),
	      tag = value[symToStringTag];

	  try {
	    value[symToStringTag] = undefined;
	    var unmasked = true;
	  } catch (e) {}

	  var result = nativeObjectToString.call(value);
	  if (unmasked) {
	    if (isOwn) {
	      value[symToStringTag] = tag;
	    } else {
	      delete value[symToStringTag];
	    }
	  }
	  return result;
	}

	module.exports = getRawTag;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;

	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString(value) {
	  return nativeObjectToString.call(value);
	}

	module.exports = objectToString;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return value != null && typeof value == 'object';
	}

	module.exports = isObjectLike;


/***/ }),
/* 15 */
/***/ (function(module, exports) {

	module.exports={"v":4,"t":[{"t":4,"f":[{"t":7,"e":"textarea","m":[{"n":"class","f":["ractive-autosize-input ",{"t":2,"r":".class"}],"t":13},{"n":"type","f":[{"t":2,"r":".type"}],"t":13},{"n":"placeholder","f":[{"t":2,"r":".placeholder"}],"t":13},{"n":"value","f":[{"t":2,"r":"._value"}],"t":13},{"n":"name","f":[{"t":2,"r":".name"}],"t":13},{"n":"minlength","f":[{"t":2,"r":".minlength"}],"t":13},{"n":"maxlength","f":[{"t":2,"r":".maxlength"}],"t":13},{"n":"required","f":[{"t":2,"r":".required"}],"t":13},{"n":"readonly","f":[{"t":2,"r":".readonly"}],"t":13},{"n":"disabled","f":[{"t":2,"r":".disabled"}],"t":13},{"n":"autofocus","f":[{"t":2,"r":".autofocus"}],"t":13},{"n":["keydown"],"t":70,"f":{"r":["forward","@event"],"s":"[_0(_1)]"}},{"n":["keypress"],"t":70,"f":{"r":["forward","@event"],"s":"[_0(_1)]"}},{"n":["keyup"],"t":70,"f":{"r":["forward","@event"],"s":"[_0(_1)]"}},{"n":["input"],"t":70,"f":{"r":["forward","@event"],"s":"[_0(_1)]"}},{"n":["focus"],"t":70,"f":{"r":["forward","@event"],"s":"[_0(_1)]"}},{"n":["blur"],"t":70,"f":{"r":["forward","@event"],"s":"[_0(_1)]"}},{"n":"style","f":[{"t":2,"r":".style"}],"t":13}]}],"n":50,"r":"isMultiline"},{"t":4,"n":51,"f":[{"t":7,"e":"input","m":[{"n":"class","f":["ractive-autosize-input ",{"t":2,"r":".class"}],"t":13},{"n":"type","f":[{"t":2,"r":".type"}],"t":13},{"n":"placeholder","f":[{"t":2,"r":".placeholder"}],"t":13},{"n":"value","f":[{"t":2,"r":"._value"}],"t":13},{"n":"name","f":[{"t":2,"r":".name"}],"t":13},{"n":"minlength","f":[{"t":2,"r":".minlength"}],"t":13},{"n":"maxlength","f":[{"t":2,"r":".maxlength"}],"t":13},{"n":"required","f":[{"t":2,"r":".required"}],"t":13},{"n":"readonly","f":[{"t":2,"r":".readonly"}],"t":13},{"n":"disabled","f":[{"t":2,"r":".disabled"}],"t":13},{"n":"autofocus","f":[{"t":2,"r":".autofocus"}],"t":13},{"n":["keydown"],"t":70,"f":{"r":["forward","@event"],"s":"[_0(_1)]"}},{"n":["keypress"],"t":70,"f":{"r":["forward","@event"],"s":"[_0(_1)]"}},{"n":["keyup"],"t":70,"f":{"r":["forward","@event"],"s":"[_0(_1)]"}},{"n":["input"],"t":70,"f":{"r":["forward","@event"],"s":"[_0(_1)]"}},{"n":["focus"],"t":70,"f":{"r":["forward","@event"],"s":"[_0(_1)]"}},{"n":["blur"],"t":70,"f":{"r":["forward","@event"],"s":"[_0(_1)]"}},{"n":"style","f":[{"t":2,"r":".style"}],"t":13}]}],"l":1}],"e":{}};

/***/ })
/******/ ])
});
;