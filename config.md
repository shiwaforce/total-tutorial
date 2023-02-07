# Total Tutorial config specification

The whole config is an [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON). In this object, the property names are url paths. For example `"/"` or `"/about-us.html"`.
Under each of these properties, the tutorial steps for that url are defined in a `"steps"` array.

For example:

```json
{
	"/hello-world.html": {
		"steps": [
			{
				"selector": "h1",
				"title": "This is the main title",
				"description": "This title is very important"
			}
		]
	}
}
```

Multiple fields can be specified in a single step:

| property | mandatory | description                                                                              |
| -------- | --------- |------------------------------------------------------------------------------------------|
| selector | required | A CSS3 selector that defines the element for which you want to display explanatory text. |
| title | required | The title of the explanatory                                                             |
| description | required | A detailed description of the explanation in text form                                   |
| width | optional | Width of the explanatory box. <br> Default 320px                                         |
| height | optional | Height of the explanatory box. <br> Default: 240px |

The steps array may contain several steps. As many as you wish.
