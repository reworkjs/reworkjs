(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{CcfH:function(e,t,n){"use strict";n.r(t),n.d(t,"_frontmatter",(function(){return c})),n.d(t,"default",(function(){return u}));var a=n("Fcif"),o=n("+I+c"),r=(n("mXGw"),n("/FXl")),i=n("TjRS"),c=(n("aD51"),{});void 0!==c&&c&&c===Object(c)&&Object.isExtensible(c)&&!c.hasOwnProperty("__filemeta")&&Object.defineProperty(c,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"docs/2-routing.md"}});var s={_frontmatter:c},l=i.a;function u(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(r.b)(l,Object(a.a)({},s,n,{components:t,mdxType:"MDXLayout"}),Object(r.b)("h1",{id:"routing"},"Routing"),Object(r.b)("p",null,"Routing in rework.js is handled by ",Object(r.b)("a",{href:"https://reacttraining.com/react-router/web",parentName:"p"},"React Router DOM"),", with sprinkles added on top."),Object(r.b)("h2",{id:"creating-a-new-route"},"Creating a new Route"),Object(r.b)("p",null,"The default router treats all files named ",Object(r.b)("inlineCode",{parentName:"p"},"*.route.js"),"* as route definitions."),Object(r.b)("p",null,"The route file should default-export an object containing the metadata of the route: ",Object(r.b)("inlineCode",{parentName:"p"},"path")," & ",Object(r.b)("inlineCode",{parentName:"p"},"component")),Object(r.b)("pre",null,Object(r.b)("code",{className:"language-typescript",parentName:"pre"},"// src/pages/home.route.ts\n\nexport default {\n  path: '/',\n\n  // the react component to render on the homepage, works like any other component.\n  // see bellow for lazy-loading\n  component: MyLazyLoadedComponent,\n}\n")),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},"The actual default pattern is ",Object(r.b)("inlineCode",{parentName:"li"},"src/**/*.route.{js,jsx,mjs,ts,tsx}"))),Object(r.b)("h2",{id:"code-splitting--lazy-loading"},"Code Splitting & Lazy Loading"),Object(r.b)("p",null,"Code splitting in rework.js is handled by ",Object(r.b)("a",{href:"https://www.smooth-code.com/open-source/loadable-components/",parentName:"p"},"Loadable Components"),"."),Object(r.b)("p",null,"If we take the example above and expand it to lazy-load the homepage, we would end up with the following code:"),Object(r.b)("pre",null,Object(r.b)("code",{className:"language-typescript",parentName:"pre"},"// src/pages/home/home.route.ts\n\nimport * as React from 'react';\nimport loadable from '@loadable/component';\nimport CircularProgress from '@material-ui/core/CircularProgress';\n\nexport default {\n  path: '/',\n\n  // lazy-load the homepage\n  component: loadable(() => import('./home.view'), {\n    fallback: <CircularProgress />,\n  }),\n}\n")),Object(r.b)("p",null,"N.B.: You can lazy-load components anywhere using loadable, this is ",Object(r.b)("em",{parentName:"p"},"not")," strictly limited to route definitions."),Object(r.b)("p",null,"That library is fully integrated with the framework, including server-side rendering.\nPlease refer to ",Object(r.b)("a",{href:"https://www.smooth-code.com/open-source/loadable-components/",parentName:"p"},"their documentation")," for more information on code splitting."),Object(r.b)("h2",{id:"catch-all-routes-404"},"Catch-all routes (404)"),Object(r.b)("p",null,"Creating a catch-all route works pretty much the same. It is your standard route definition with a few differences:"),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"path")," must be set to ",Object(r.b)("inlineCode",{parentName:"li"},"*")," to match all urls"),Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"priority")," must be set to a low number so the route is matched last (if a catch-all route is matched first, all pages will display the catch-all)."),Object(r.b)("li",{parentName:"ul"},"(SSR) ",Object(r.b)("inlineCode",{parentName:"li"},"status")," can be set to any HTTP status code (eg. ",Object(r.b)("inlineCode",{parentName:"li"},"404"),") if you wish to change the status code the server will return.")),Object(r.b)("pre",null,Object(r.b)("code",{className:"language-typescript",parentName:"pre"},"// src/pages/404/404.route.ts\n\nimport * as React from 'react';\nimport loadable from '@loadable/component';\nimport CircularProgress from '@material-ui/core/CircularProgress';\n\nexport default {\n  // match all urls\n  path: '*',\n  // make this route definition match last\n  priority: 0,\n  // if this route matches, change ssr http status to 404\n  status: 404,\n\n  component: loadable(() => import('./404.view'), {\n    fallback: <CircularProgress />,\n  }),\n};\n")),Object(r.b)("h2",{id:"http-status-codes"},"HTTP status codes"),Object(r.b)("p",null,"Setting the HTTP status for SSR can be done either by setting the ",Object(r.b)("inlineCode",{parentName:"p"},"status")," property on your route definition\nor using the ",Object(r.b)("a",{href:"https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/guides/server-rendering.md#404-401-or-any-other-status",parentName:"p"},"React-Router APIs")),Object(r.b)("p",null,"The react-router way is a bit cumbersome so rework.js exposes two utilities you can use instead: ",Object(r.b)("inlineCode",{parentName:"p"},"HttpStatus")," & ",Object(r.b)("inlineCode",{parentName:"p"},"useHttpStatus"),". They are used like this:"),Object(r.b)("pre",null,Object(r.b)("code",{className:"language-typescript",metastring:"jsx",jsx:!0,parentName:"pre"},"// HttpStatus component\n\n// src/pages/404/404.view.tsx\nimport * as React from 'react';\nimport { HttpStatus } from '@reworkjs/core/router';\n\nfunction My404Page() {\n  return (\n    <>\n      <HttpStatus code={404} />\n      Resource not found!\n    </>\n  );\n}\n")),Object(r.b)("pre",null,Object(r.b)("code",{className:"language-typescript",metastring:"jsx",jsx:!0,parentName:"pre"},"// useHttpStatus hook\n\n// src/pages/404/404.view.tsx\nimport * as React from 'react';\nimport { useHttpStatus } from '@reworkjs/core/router';\n\nfunction My404Page() {\n\n  useHttpStatus(404);\n\n  return (\n    <>\n      Resource not found!\n    </>\n  );\n}\n")),Object(r.b)("h2",{id:"advanced-routing"},"Advanced Routing"),Object(r.b)("p",null,"While this route-loading system, it also limits what can be done with React-Router."),Object(r.b)("p",null,"If you wish to bypass it and come back to React-Router, you can create a single route file that will act as your router:"),Object(r.b)("pre",null,Object(r.b)("code",{className:"language-typescript",metastring:"jsx",jsx:!0,parentName:"pre"},"// src/pages/router.route.tsx\n\nimport * as React from 'react';\nimport { Switch } from 'react-router-dom';\n\nexport default {\n  // match all urls\n  path: '*',\n  component: MyRouter,\n};\n\nfunction MyRouter() {\n  return (\n    <Switch>\n      {/* check out react-router for documentation on their routing! */}\n    </Switch>\n  );\n}\n")))}void 0!==u&&u&&u===Object(u)&&Object.isExtensible(u)&&!u.hasOwnProperty("__filemeta")&&Object.defineProperty(u,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"docs/2-routing.md"}}),u.isMDXComponent=!0}}]);
//# sourceMappingURL=component---docs-2-routing-md-4d8e849a2616611a4b00.js.map