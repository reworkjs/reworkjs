export default function defaultRenderPage(pageHtml: PageHtml) {

  return `<!DOCTYPE html>
<html ${String(pageHtml.htmlAttributes)}>
<head>
  ${String(pageHtml.head)}
</head>
<body ${String(pageHtml.bodyAttributes)}>
  ${String(pageHtml.body)}
</body>
</html>`;
}
