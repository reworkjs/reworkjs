// @flow

import Helmet from 'react-helmet';
import loadRenderPage from '../../../shared/render-html';

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

class Head {
  title: string;
  base: string;
  meta: string;
  link: string;
  style: string;
  script: string;
  noscript: string;
  end: string;

  constructor(data) {
    Object.assign(this, data);
  }

  toString() {
    return this.title + this.base + this.meta + this.link + this.style + this.script + this.noscript + this.end;
  }
}

class Body {
  start: string;
  app: string;
  end: string;

  constructor(start: string, app: string, end: string) {
    this.start = start;
    this.app = app;
    this.end = end;
  }

  toString() {
    return this.start + this.app + this.end;
  }
}

type PageHtml = {
  head: Head,
  body: Body,
  htmlAttributes: string,
  bodyAttributes: string,
};

export type RenderPageFunction = (PageHtml) => string;

const renderPageDelegate = loadRenderPage();

export default function renderPage(data: { body?: string, header?: string, footer?: string } = {}) {
  const helmet: RenderedHelmet = Helmet.renderStatic();

  const pageHtml: PageHtml = {
    head: new Head({
      title: stringifyHelmet(helmet.title),
      base: stringifyHelmet(helmet.base),
      meta: stringifyHelmet(helmet.meta),
      link: stringifyHelmet(helmet.link),
      style: stringifyHelmet(helmet.style),
      script: stringifyHelmet(helmet.script),
      noscript: stringifyHelmet(helmet.noscript),
      end: data.header || '',
    }),
    body: new Body(
      '',
      `<div id="app">${data.body || ''}</div>`,
      data.footer || '',
    ),
    bodyAttributes: stringifyHelmet(helmet.bodyAttributes),
    htmlAttributes: stringifyHelmet(helmet.htmlAttributes),
  };

  return renderPageDelegate(pageHtml);
}

function stringifyHelmet(part) {
  if (!part || !part.toString) {
    return '';
  }

  return part.toString();
}
