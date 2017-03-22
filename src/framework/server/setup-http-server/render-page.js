import Helmet from 'react-helmet';

type HelmetItem = {
  toComponent: Function,
  toString: Function,
};

type RenderedHelmet = {
  base: HelmetItem,
  bodyAttributes: HelmetItem,
  htmlAttributes: HelmetItem,
  link: HelmetItem,
  meta: HelmetItem,
  noscript: HelmetItem,
  script: HelmetItem,
  style: HelmetItem,
  title: HelmetItem,
};

export default function renderPage({ body = '', header = '', footer = '' } = {}) {
  const helmet: RenderedHelmet = Helmet.renderStatic();

  return `<!DOCTYPE html>
<html ${toString(helmet.htmlAttributes)}>
<head>
  ${toString(helmet.title)}
  ${toString(helmet.base)}
  ${toString(helmet.meta)}
  ${toString(helmet.link)}
  ${toString(helmet.noscript)}
  ${toString(helmet.script)}
  ${header}
</head>
<body ${toString(helmet.bodyAttributes)}>
  <div id="app">
    ${body}
  </div>
  ${footer}
</body>
</html>`;
}

function toString(part) {
  if (!part || !part.toString) {
    return '';
  }

  return part.toString();
}
