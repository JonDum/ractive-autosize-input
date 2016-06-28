
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

var throttle = require('lodash/throttle');

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

    template: require('!ractive!./template'),

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
