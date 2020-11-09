(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{"0Swh":function(e,t,n){"use strict";n.r(t),n.d(t,"_frontmatter",(function(){return i})),n.d(t,"default",(function(){return b}));var o=n("Fcif"),a=n("+I+c"),r=(n("mXGw"),n("/FXl")),p=n("TjRS"),i=(n("aD51"),{});void 0!==i&&i&&i===Object(i)&&Object.isExtensible(i)&&!i.hasOwnProperty("__filemeta")&&Object.defineProperty(i,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"docs/advanced-topics/root-component.md"}});var c={_frontmatter:i},l=p.a;function b(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(r.b)(l,Object(o.a)({},c,n,{components:t,mdxType:"MDXLayout"}),Object(r.b)("h1",{id:"root-component"},"Root Component"),Object(r.b)("p",null,"rework provides a convenient way to run code on all pages: The root component."),Object(r.b)("p",null,"This component is one of the top-most one. By default, this is the component whose file path is ",Object(r.b)("inlineCode",{parentName:"p"},"src/components/App")," (if any),\nthis can be changed ",Object(r.b)("a",{href:"configuration.md#entry-react",parentName:"p"},"in the configuration")," under the ",Object(r.b)("inlineCode",{parentName:"p"},"entry-react")," property."),Object(r.b)("h2",{id:"usages"},"Usages"),Object(r.b)("p",null,"You can use this component for a multitude of things such as:"),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},"setting a common ",Object(r.b)("a",{href:"../6-page-head.md",parentName:"li"},Object(r.b)("inlineCode",{parentName:"a"},"Helmet")),","),Object(r.b)("li",{parentName:"ul"},"app-wide providers,"),Object(r.b)("li",{parentName:"ul"},"adding an app-wide ",Object(r.b)("inlineCode",{parentName:"li"},"componentDidCatch()"),","),Object(r.b)("li",{parentName:"ul"},"prevent rendering of the whole app until some resources have loaded (by not rendering the ",Object(r.b)("inlineCode",{parentName:"li"},"children")," prop).")),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Note"),": This component will receive the rest of the app tree under the ",Object(r.b)("inlineCode",{parentName:"p"},"children")," prop. This prop must\nbe rendered or the rest of the app will not render."),Object(r.b)("pre",null,Object(r.b)("code",{className:"language-tsx",parentName:"pre"},"import * as React from 'react';\nimport { Helmet } from 'react-helmet-async';\n\ntype Props = {\n  children: React.ReactNode,\n};\n\nexport default function App(props: Props) {\n  // the `children` prop contains the rest of the component tree of the app.\n  return (\n    <>\n      <Helmet defaultTitle=\"My Site\" titleTemplate=\"My Site - %s\" />\n      {props.children}\n    </>\n  );\n}\n")))}void 0!==b&&b&&b===Object(b)&&Object.isExtensible(b)&&!b.hasOwnProperty("__filemeta")&&Object.defineProperty(b,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"docs/advanced-topics/root-component.md"}}),b.isMDXComponent=!0}}]);
//# sourceMappingURL=component---docs-advanced-topics-root-component-md-7e2af412aec464ba0cba.js.map