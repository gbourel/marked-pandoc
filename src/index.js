
let last = null;

const attrMatch = /[.#][a-z\-0-9]*|[a-z\-0-9]*="[a-z\-0-9]*"/g

/// Parse classes, id and attributes
function parseAttributes(input) {
  let id = '';
  let classes = [];
  let attrs = [];

  const content = input.match(attrMatch);

  content.forEach((str)=>{
    const attrType = str.substring(0, 1);
    switch (attrType){
      case ".":
        classes.push(str.substring(1));
        break;
      case "#":
        id = str.substring(1);
        break;
      default:
        attrs.push(str)
    }
  });

  return {
    id: id,
    classes: classes,
    attrs: attrs
  };
}

export const pandoc = {
    extensions: [
    // [Paragraphe]{.classname #id attr=value} format
    {
      name: 'pandoc-span',
      level: 'inline',
      start: (src) => src.indexOf('['),
      tokenizer(src) {
        const found = /^\[(?<text>[^\[]*)\]\{(?<attr>.*)\}/.exec(src);
        if (!found) return;
  
        const val = parseAttributes(found.groups.attr);
        return {
          type: 'pandoc-span',
          raw: found[0],
          text: found[1],
          id: val.id,
          classes: val.classes,
          attrs: val.attrs,
          tokens: this.lexer.inline(found[1])
        };
      },
      renderer(token) {
        return `<span ${token.classes.length ? "class="+token.classes.join(" "):""} ${token.id ? "id="+token.id : ""} ${token.attrs.join(" ")}>${this.parser.parseInline(token.tokens)}</span>`;
      }
  },
  {
      name: 'pandoc-attributes',
      level: 'inline',
      start: (src) => src.indexOf('{'),
      tokenizer(src) {
        const found = /^\{(?<attr>.*)\}$/.exec(src);
        if (!found) return;

        const val = parseAttributes(found.groups.attr);
        return {
          type: 'pandoc-attributes',
          raw: found[0],
          id: val.id,
          classes: val.classes,
          attrs: val.attrs
        };
      },
      renderer(token) {
        return '';
      }
  }, {
      name: 'image',
      renderer(token) {
        let elt = `<img src="${token.href}" alt="${token.text}"`;
        if (token.id) { elt = `${elt} id="${token.id}"`; }
        if (token.attrs && token.attrs.length > 0) {
          elt = `${elt} ${token.attrs.join(' ')}`;
        }
        if (token.classes && token.classes.length > 0) {
          elt = `${elt} class="${token.classes.join(' ')}"`;
        }
        return `${elt}/>`;
      }
  }],
  walkTokens: (token) => {
    if (token.type === 'pandoc-attributes') {
      if (token.id) { last.id = token.id; }
      if (token.classes) { last.classes = token.classes; }
      if (token.attrs) { last.attrs = token.attrs; }
    }
    last = token;
  }
};