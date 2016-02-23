
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
var sizer

var throttle = require('lodash/throttle');

var styles = [
    'fontSize',
    'fontFamily',
    'fontWeight',
    'letterSpacing',
    'padding',
    'border',
];

var RactiveAutosizeInput = Ractive.extend({

    template: require('./template'),

    onrender: function() {

        var self = this;

        var input = self.find('input');

        if(!sizer) {
            sizer = doc.createElement('span');
            sizer.style.display = 'inline-block!important';
            sizer.style.position = 'fixed';
            sizer.style.left = sizer.style.top = '-9999px';
            sizer.className = 'ractive-autosize-input-sizer';
            doc.body.appendChild(sizer);
        }

        var oldStyles = window.getComputedStyle(input);
        self.resizeHandler = throttle(function(event) {

            var newStyles = window.getComputedStyle(input);
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

            observer.observe(input, {
                attributes: true,
                attributeFilter: ['style', 'class', 'id']
            });
        }

        self.observe('placeholder value', self.updateSize);
    },

    updateSize: function() {

        var self = this;

        var value = self.get('value');
        var placeholder = self.get('placeholder');
        var input = self.find('input');

        var inputStyle = win.getComputedStyle(input);

        styles.forEach(function(style) {
            sizer.style[style] = inputStyle[style];
        });


        if(placeholder.length > 0 && value.length == 0) {
            sizer.textContent = placeholder;
            var sizeWithPlaceHolder = sizer.offsetWidth;
        }

        sizer.textContent = value;
        var sizeWithValue = sizer.offsetWidth;

        input.style.width = Math.max(sizeWithPlaceHolder || 0, sizeWithValue || 0)+'px';

    },

    onteardown: function() {
        if(self.obserserver)
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
