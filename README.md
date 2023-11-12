# marked-pandoc

A [marked](https://github.com/markedjs/marked) extension to use [pandoc](https://pandoc.org/MANUAL.html) flavored markdown.

## Installation

```
npm install marked-pandoc
```

## Usage

```javascript
import { pandoc } from "marked-pandoc";

marked.use(pandoc);
```

### Markdown extensions

This extension allows to use the following pandoc syntax:

 * `[Some text]{.myclass}` will generate `<span class="myclass">Some text</span>`
 * `![Alt](image.jpg){.myclass}` will generate `<img src="image.jpg" alt="Alt" class="myclass" />`
