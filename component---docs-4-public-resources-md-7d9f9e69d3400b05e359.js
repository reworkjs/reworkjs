(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{dGqD:function(e,t,o){"use strict";o.r(t),o.d(t,"_frontmatter",(function(){return a})),o.d(t,"default",(function(){return l}));o("5hJT"),o("W1QL"),o("K/PF"),o("t91x"),o("75LO"),o("PJhk"),o("mXGw");var r=o("/FXl"),n=o("TjRS");o("aD51");function i(){return(i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var o=arguments[t];for(var r in o)Object.prototype.hasOwnProperty.call(o,r)&&(e[r]=o[r])}return e}).apply(this,arguments)}var a={};void 0!==a&&a&&a===Object(a)&&Object.isExtensible(a)&&!a.hasOwnProperty("__filemeta")&&Object.defineProperty(a,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"docs/4-public-resources.md"}});var c={_frontmatter:a},s=n.a;function l(e){var t=e.components,o=function(e,t){if(null==e)return{};var o,r,n={},i=Object.keys(e);for(r=0;r<i.length;r++)o=i[r],t.indexOf(o)>=0||(n[o]=e[o]);return n}(e,["components"]);return Object(r.b)(s,i({},c,o,{components:t,mdxType:"MDXLayout"}),Object(r.b)("h1",{id:"public-resources"},"Public Resources"),Object(r.b)("p",null,"There are two way to access resources with rework.js: statically or through webpack"),Object(r.b)("h2",{id:"webpack-resources"},"Webpack resources"),Object(r.b)("p",null,'This is the "standard" way to import resources in rework.js. You do this by using the JavaScript ',Object(r.b)("inlineCode",{parentName:"p"},"import")," statement. The url of the resource will be returned (note: that won't download the resource, only give you the url)."),Object(r.b)("pre",null,Object(r.b)("code",i({parentName:"pre"},{className:"language-typescript",metastring:"jsx",jsx:!0}),"// my-comp.tsx\n\nimport logoUrl from './logo.svg';\n\nexport default function Logo() {\n  return <img src={logoUrl} />;\n}\n")),Object(r.b)("p",null,"Resources imported this way have some processing applied to them:"),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},"They will usually be optimised if possible"),Object(r.b)("li",{parentName:"ul"},"Their URL can change between two builds because a hash will be added to their URL for cache-busting.")),Object(r.b)("p",null,"This system will not always meet your needs. If you need webpack to back-off and let you have full control over your resource,\nyou'll want to use Static Resources (see below)."),Object(r.b)("h2",{id:"static-resources"},"Static resources"),Object(r.b)("p",null,"Resources located in the ",Object(r.b)("a",i({parentName:"p"},{href:"https://www.reworkjs.com/configuration#directoriesresources"}),Object(r.b)("inlineCode",{parentName:"a"},"resources"))," directory will be copied as-is at the root of the build directory.",Object(r.b)("br",{parentName:"p"}),"\n","These resources are not processed by webpack, no modification of any kind is done to them."),Object(r.b)("p",null,"The directory is ",Object(r.b)("inlineCode",{parentName:"p"},"./src/public")," by default but is configurable."),Object(r.b)("p",null,"In order to access the resource, you can't import its url. Instead, you reference it by URL directly.",Object(r.b)("br",{parentName:"p"}),"\n","E.g.: if your resource is located in ",Object(r.b)("inlineCode",{parentName:"p"},"<resource_folder>/favicon.ico"),", your icon will be available as ",Object(r.b)("inlineCode",{parentName:"p"},"/favicon.ico")),Object(r.b)("p",null,"symlinks will be followed when copying the contents of the ",Object(r.b)("inlineCode",{parentName:"p"},"resources")," folder, allowing you to reference files stored\nin vendor folders such as ",Object(r.b)("inlineCode",{parentName:"p"},"node_modules"),", ",Object(r.b)("inlineCode",{parentName:"p"},"bower_modules"),"."),Object(r.b)("p",null,"N.B.: You should avoid importing files located in ",Object(r.b)("inlineCode",{parentName:"p"},"resources")," using Webpack mechanisms (such as the ",Object(r.b)("inlineCode",{parentName:"p"},"import")," statement) as\nthat will cause the resource to be bundled twice. Instead, load that resource using browser loading systems (",Object(r.b)("inlineCode",{parentName:"p"},"<link>"),", ",Object(r.b)("inlineCode",{parentName:"p"},"<img>"),", etc...)."))}l&&l===Object(l)&&Object.isExtensible(l)&&!l.hasOwnProperty("__filemeta")&&Object.defineProperty(l,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"docs/4-public-resources.md"}}),l.isMDXComponent=!0}}]);
//# sourceMappingURL=component---docs-4-public-resources-md-7d9f9e69d3400b05e359.js.map