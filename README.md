#ractive-autosize-input

A clean and simple input component that calculates the needed width of the containing text and sizes itself accordingly. 

### Demo

[Live Demo](http://jondum.github.com/ractive-autosize-input/demo/)

### Install

```
npm install ractive-autosize-input --save
```

### Usage

Add the component to your Ractive instance:

```
new Ractive({
    ...
    components: {
        'autosize-input': require('ractive-autosize-input')
    },
    ...
});
```

Use it

```
<autosize-input value='Hello!'/>
```

```
<autosize-input placeholder='Secret phrase' value='{{.phrase}}'
                on-change='...'
                on-keypress='...'
                on-keydown='...'/>
```

You can style the component just like a regular input. The class
'ractive-autosize-input' is added to the input as well as any classes on the
`class` property on the instance:

```
<autosize-input value='Hello!' class='donkey balls'/>
```

Plays well with `max-width` and `min-width` as well

```
<autosize-input value='Hello!' style='max-width: 80px; min-width: 30px;'/>
```

### API

TODO. Stewardess telling me to close my laptop. :(


### Future?

Maybe make it work with textareas if there's demand for it


### Contributing


Open to PRs and stuff. I'm around.


