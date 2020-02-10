(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{CcfH:function(e,t,n){"use strict";n.r(t),n.d(t,"_frontmatter",(function(){return i})),n.d(t,"default",(function(){return l}));n("5hJT"),n("W1QL"),n("K/PF"),n("t91x"),n("75LO"),n("PJhk"),n("mXGw");var a=n("/FXl"),r=n("TjRS");n("aD51");function o(){return(o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e}).apply(this,arguments)}var i={};void 0!==i&&i&&i===Object(i)&&Object.isExtensible(i)&&!i.hasOwnProperty("__filemeta")&&Object.defineProperty(i,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"docs/2-routing.md"}});var s={_frontmatter:i},c=r.a;function l(e){var t=e.components,n=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,["components"]);return Object(a.b)(c,o({},s,n,{components:t,mdxType:"MDXLayout"}),Object(a.b)("h1",{id:"routing"},"Routing"),Object(a.b)("p",null,"Routing in rework.js is handled by ",Object(a.b)("a",o({parentName:"p"},{href:"https://reacttraining.com/react-router/web"}),"React Router DOM"),", with sprinkles added on top."),Object(a.b)("h2",{id:"creating-a-new-route"},"Creating a new Route"),Object(a.b)("p",null,"The default router treats all files named ",Object(a.b)("inlineCode",{parentName:"p"},"*.route.js"),"* as route definitions."),Object(a.b)("p",null,"The route file should default-export an object containing the metadata of the route: ",Object(a.b)("inlineCode",{parentName:"p"},"path")," & ",Object(a.b)("inlineCode",{parentName:"p"},"component")),Object(a.b)("pre",null,Object(a.b)("code",o({parentName:"pre"},{className:"language-typescript"}),"// src/pages/home.route.ts\n\nexport default {\n  path: '/',\n\n  // the react component to render on the homepage, works like any other component.\n  // see bellow for lazy-loading\n  component: MyLazyLoadedComponent,\n}\n")),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},"The actual default pattern is ",Object(a.b)("inlineCode",{parentName:"li"},"src/**/*.route.{js,jsx,mjs,ts,tsx}"))),Object(a.b)("h2",{id:"code-splitting--lazy-loading"},"Code Splitting & Lazy Loading"),Object(a.b)("p",null,"Code splitting in rework.js is handled by ",Object(a.b)("a",o({parentName:"p"},{href:"https://www.smooth-code.com/open-source/loadable-components/"}),"Loadable Components"),"."),Object(a.b)("p",null,"If we take the example above and expand it to lazy-load the homepage, we would end up with the following code:"),Object(a.b)("pre",null,Object(a.b)("code",o({parentName:"pre"},{className:"language-typescript"}),"// src/pages/home/home.route.ts\n\nimport loadable from '@loadable/component';\nimport CircularProgress from '@material-ui/core/CircularProgress';\n\nexport default {\n  path: '/',\n\n  // lazy-load the homepage\n  component: loadable(() => import('./home.view'), {\n    fallback: CircularProgress,\n  }),\n}\n")),Object(a.b)("p",null,"N.B.: You can lazy-load components anywhere using loadable, this is ",Object(a.b)("em",{parentName:"p"},"not")," strictly limited to route definitions."),Object(a.b)("p",null,"That library is fully integrated with the framework, including server-side rendering.",Object(a.b)("br",{parentName:"p"}),"\n","Please refer to ",Object(a.b)("a",o({parentName:"p"},{href:"https://www.smooth-code.com/open-source/loadable-components/"}),"their documentation")," for more information on code splitting."),Object(a.b)("h2",{id:"catch-all-routes-404"},"Catch-all routes (404)"),Object(a.b)("p",null,"Creating a catch-all route works pretty much the same. It is your standard route definition with a few differences:"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"path")," must be set to ",Object(a.b)("inlineCode",{parentName:"li"},"*")," to match all urls"),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"priority")," must be set to a low number so the route is matched last (if a catch-all route is matched first, all pages will display the catch-all)."),Object(a.b)("li",{parentName:"ul"},"(SSR) ",Object(a.b)("inlineCode",{parentName:"li"},"status")," can be set to any HTTP status code (eg. ",Object(a.b)("inlineCode",{parentName:"li"},"404"),") if you wish to change the status code the server will return.")),Object(a.b)("pre",null,Object(a.b)("code",o({parentName:"pre"},{className:"language-typescript"}),"// src/pages/404/404.route.ts\n\nimport loadable from '@loadable/component';\nimport CircularProgress from '@material-ui/core/CircularProgress';\n\nexport default {\n  // match all urls\n  path: '*',\n  // make this route definition match last\n  priority: 0,\n  // if this route matches, change ssr http status to 404\n  status: 404,\n\n  component: loadable(() => import('./404.view'), {\n    fallback: CircularProgress,\n  }),\n};\n")),Object(a.b)("h2",{id:"http-status-codes"},"HTTP status codes"),Object(a.b)("p",null,"Setting the HTTP status for SSR can be done either by setting the ",Object(a.b)("inlineCode",{parentName:"p"},"status")," property on your route definition\nor using the ",Object(a.b)("a",o({parentName:"p"},{href:"https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/guides/server-rendering.md#404-401-or-any-other-status"}),"React-Router APIs")),Object(a.b)("p",null,"The react-router way is a bit cumbersome so rework.js exposes two utilities you can use instead: ",Object(a.b)("inlineCode",{parentName:"p"},"HttpStatus")," & ",Object(a.b)("inlineCode",{parentName:"p"},"useHttpStatus"),". They are used like this:"),Object(a.b)("pre",null,Object(a.b)("code",o({parentName:"pre"},{className:"language-typescript",metastring:"jsx",jsx:!0}),"// HttpStatus component\n\n// src/pages/404/404.view.tsx\nimport * as React from 'react';\nimport { HttpStatus } from '@reworkjs/core/router';\n\nfunction My404Page() {\n  return (\n    <>\n      <HttpStatus code={404} />\n      Resource not found!\n    </>\n  );\n}\n")),Object(a.b)("pre",null,Object(a.b)("code",o({parentName:"pre"},{className:"language-typescript",metastring:"jsx",jsx:!0}),"// useHttpStatus hook\n\n// src/pages/404/404.view.tsx\nimport * as React from 'react';\nimport { useHttpStatus } from '@reworkjs/core/router';\n\nfunction My404Page() {\n\n  useHttpStatus(404);\n\n  return (\n    <>\n      Resource not found!\n    </>\n  );\n}\n")),Object(a.b)("h2",{id:"advanced-routing"},"Advanced Routing"),Object(a.b)("p",null,"While this route-loading system, it also limits what can be done with React-Router."),Object(a.b)("p",null,"If you wish to bypass it and come back to React-Router, you can create a single route file that will act as your router:"),Object(a.b)("pre",null,Object(a.b)("code",o({parentName:"pre"},{className:"language-typescript",metastring:"jsx",jsx:!0}),"// src/pages/router.route.tsx\n\nimport * as React from 'react';\nimport { Switch } from 'react-router-dom';\n\nexport default {\n  // match all urls\n  path: '*',\n  component: MyRouter,\n};\n\nfunction MyRouter() {\n  return (\n    <Switch>\n      {/* check out react-router for documentation on their routing! */}\n    </Switch>\n  );\n}\n")))}l&&l===Object(l)&&Object.isExtensible(l)&&!l.hasOwnProperty("__filemeta")&&Object.defineProperty(l,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"docs/2-routing.md"}}),l.isMDXComponent=!0}}]);
//# sourceMappingURL=component---docs-2-routing-md-2d5495c34d95511f8ff9.js.map