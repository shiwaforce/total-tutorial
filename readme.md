# Total Tutorial

No-code/low-code webapp onboarding and tutorial library.

You can create a step by step tutorial to your visitors without programming!

Here is a GIF to demonstrate what the program is capable of:
![](https://github.com/shiwaforce/total-tutorial/blob/master/assets/total_tutorial.gif)

## How to use?

Just include into your website. For example:

```html
<script src="/total-tutorial.js?config=/config.json"></script>
```

## How to set up a config?

The format of the config is very [simple and intuitive](./config.md), so it can be compiled manually. However, we also provide a wyswyg method. On the website where you want to host the application, paste the following script into the developer toolbar's console:
```js
(()=>{s=document.createElement('script');
s.setAttribute('src', 'https://shiwaforce.github.io/total-tutorial/total-tutorial-admin.js');
document.head.appendChild(s);
console.log(unescape('%uD83D%uDC4D'));})()
```
A step by step wizard will then guide you through the config build process. Finally, the generated json file will be downloadable and you can pass it to your webmasters to insert into the site in the simple one-line manner above.

## Custom theme or style

If the default look doesn't fit your site, you have the option to tweak the look with your own css definitions. Our basic concept was to make this easy to do, so we never used important rules or id references anywhere. Most of our definitions are a combination of a single class and a single attribute. In some special cases elementName is also used. We have defined a "total-tutorial" class on the root element of the total tutorial application, which can be used to create your own look and feel.
For example, if you want a dark contrast look, you can start with something like this:

```css
.total-tutorial .tt-tutorial-layer,
.total-tutorial .tt-close,
.total-tutorial .tt-current-step-title {
	background: #000;
	color: #fff;
}
```

All css classes used start with the prefix "tt-" (tt is a shortcut to the name of the total tutorial product). This information is also great to use if you like:

```css
*[class^='tt-'], *[class*=' tt-'] {
	/* your definitions here */
}
```

But it's all up to you, no limits!

## Programmed integration, event-driven operation

It is natural to want to perform operations in the event that the total-tutorial is closed or has just finished. You can then trigger various functions on your website.

All you need to do is subscribe to the total-tutorial-exit and total-tutorial-finish events:

```js
document.body.addEventListener('total-tutorial-exit', exitEvent => {
	// your custom event handling here
	console.log(exitEvent.detail.step); // how many step copleted
});

document.body.addEventListener('total-tutorial-finish', finishEvent => {
	// your custom event handling here
});
```

If you want to reset your tutorial with a button or any element, you can do it with the following code:

```js
document.dispatchEvent(new Event('total-tutorial-restart'));
```


## Contributors

- Gyuri
- István
- Róka

### How to contribute?

Just open a pull request.

### How to start local development environment?

Just start with [poco](https://github.com/shiwaforce/poco)

```shell
poco up js
```

Try your changes out on [localhost](http://localhost)

## License

### Commercial license

Drop us an email telling us how many visitors you plan to use it for: [hello@shiwaforce.com](mailto:hello@shiwaforce.com)
We're cool, trust us

### License for personal use

CC-BY

This means in a nutshell that if you use the [compiled application](./frontend/dist/total-tutorial.js) from the dist folder, there is nothing else to do, you are free to use it for personal purpose.
The points is that, it is mandatory to include the total-tutorial git url in the source code, and it must appear in the production environment.
