
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

var RactiveAutosizeInput = Ractive.extend({

    template: require('./template'),

    onrender: function() {

        var self = this;

        if(!sizer) {

            sizer = doc.createElement('span');
            sizer.style.display = 'inline-block!important'; 
            sizer.style.position = 'fixed';
            sizer.style.left = sizer.style.top = '-9999px';
            sizer.className = 'ractive-autosize-input-sizer';
            doc.body.appendChild(sizer);

        }

        self.observe('placeholder value', function() {

            var value = self.get('value');
            var input = self.find('input');
            var inputStyle = win.getComputedStyle(input);

            sizer.style.fontSize = inputStyle.fontSize;
            sizer.style.fontFamily = inputStyle.fontFamily;
            sizer.style.fontWeight = inputStyle.fontWeight;
            sizer.style.letterSpacing = inputStyle.letterSpacing;
            sizer.style.padding = inputStyle.padding;
            sizer.style.border = inputStyle.border;

            var placeholder = self.get('placeholder');

            sizer.textContent = placeholder;
            var sizeWithPlaceHolder = sizer.offsetWidth;

            sizer.textContent = value;
            var sizeWithValue = sizer.offsetWidth;

            input.style.width = Math.max(sizeWithPlaceHolder, sizeWithValue)+'px';

        });
    },
    forward: function(details) {
        var event = details.original;
        if(event && event.type)
            this.fire(event.type, event);
    }
});

module.exports = RactiveAutosizeInput;
