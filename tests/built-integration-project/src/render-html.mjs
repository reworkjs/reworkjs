export default function renderPage(pageHtml) {

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
