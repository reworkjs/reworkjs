import * as React from 'react';
import { useLocation } from 'react-router-dom';

export default function Error404View() {

  const loc = useLocation();

  return (
    <>
      <style type="text/css">
        {`
          .container {
            max-width: 600px;
            padding: 8px;
            margin: 0 auto;
            width: 100%;

            line-height: 1.6;
            font-size: 18px;
            color: #444;
          }

          p {
            font-family: 'sans-serif';
          }

          code {
            font-family: 'monospace';
            padding: 0.2em 0.4em;
            margin: 0;
            background: rgba(27,31,35,0.05);
            border-radius: 3px;
          }

          .footnote {
            font-size: 12px;
            text-align: right;
          }
        `}
      </style>
      <div className="container">
        <h1>rework.js development 404</h1>
        <p>You are seeing this page because there is no page at <code>{loc.pathname}</code></p>
        <p><a href="https://www.reworkjs.com/routing" target="_blank" rel="noopener noreferrer">Read up on how to create a new page</a></p>

        <p className="footnote"><em>This message in only visible in development</em></p>
      </div>
    </>
  );
}
