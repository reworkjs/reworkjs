(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{dGqD:function(e,t,o){"use strict";o.r(t),o.d(t,"_frontmatter",(function(){return a})),o.d(t,"default",(function(){return b}));var r=o("Fcif"),n=o("+I+c"),c=(o("mXGw"),o("/FXl")),i=o("TjRS"),a=(o("aD51"),{});void 0!==a&&a&&a===Object(a)&&Object.isExtensible(a)&&!a.hasOwnProperty("__filemeta")&&Object.defineProperty(a,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"docs/4-public-resources.md"}});var s={_frontmatter:a},l=i.a;function b(e){var t=e.components,o=Object(n.a)(e,["components"]);return Object(c.b)(l,Object(r.a)({},s,o,{components:t,mdxType:"MDXLayout"}),Object(c.b)("h1",{id:"public-resources"},"Public Resources"),Object(c.b)("p",null,"There are two way to access resources with rework.js: statically or through webpack"),Object(c.b)("h2",{id:"webpack-resources"},"Webpack resources"),Object(c.b)("p",null,'This is the "standard" way to import resources in rework.js. You do this by using the JavaScript ',Object(c.b)("inlineCode",{parentName:"p"},"import")," statement. The url of the resource will be returned (note: that won't download the resource, only give you the url)."),Object(c.b)("pre",null,Object(c.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript",metastring:"jsx",jsx:!0}),"// my-comp.tsx\n\nimport logoUrl from './logo.svg';\n\nexport default function Logo() {\n  return <img src={logoUrl} />;\n}\n")),Object(c.b)("p",null,"Resources imported this way have some processing applied to them:"),Object(c.b)("ul",null,Object(c.b)("li",{parentName:"ul"},"They will usually be optimised if possible"),Object(c.b)("li",{parentName:"ul"},"Their URL can change between two builds because a hash will be added to their URL for cache-busting.")),Object(c.b)("p",null,"This system will not always meet your needs. If you need webpack to back-off and let you have full control over your resource,\nyou'll want to use Static Resources (see below)."),Object(c.b)("h2",{id:"static-resources"},"Static resources"),Object(c.b)("p",null,"Resources located in the ",Object(c.b)("a",Object(r.a)({parentName:"p"},{href:"https://www.reworkjs.com/configuration#directoriesresources"}),Object(c.b)("inlineCode",{parentName:"a"},"resources"))," directory will be copied as-is at the root of the build directory.",Object(c.b)("br",{parentName:"p"}),"\n","These resources are not processed by webpack, no modification of any kind is done to them."),Object(c.b)("p",null,"The directory is ",Object(c.b)("inlineCode",{parentName:"p"},"./src/public")," by default but is configurable."),Object(c.b)("p",null,"In order to access the resource, you can't import its url. Instead, you reference it by URL directly.",Object(c.b)("br",{parentName:"p"}),"\n","E.g.: if your resource is located in ",Object(c.b)("inlineCode",{parentName:"p"},"<resource_folder>/favicon.ico"),", your icon will be available as ",Object(c.b)("inlineCode",{parentName:"p"},"/favicon.ico")),Object(c.b)("p",null,"symlinks will be followed when copying the contents of the ",Object(c.b)("inlineCode",{parentName:"p"},"resources")," folder, allowing you to reference files stored\nin vendor folders such as ",Object(c.b)("inlineCode",{parentName:"p"},"node_modules"),", ",Object(c.b)("inlineCode",{parentName:"p"},"bower_modules"),"."),Object(c.b)("p",null,"N.B.: You should avoid importing files located in ",Object(c.b)("inlineCode",{parentName:"p"},"resources")," using Webpack mechanisms (such as the ",Object(c.b)("inlineCode",{parentName:"p"},"import")," statement) as\nthat will cause the resource to be bundled twice. Instead, load that resource using browser loading systems (",Object(c.b)("inlineCode",{parentName:"p"},"<link>"),", ",Object(c.b)("inlineCode",{parentName:"p"},"<img>"),", etc...)."))}void 0!==b&&b&&b===Object(b)&&Object.isExtensible(b)&&!b.hasOwnProperty("__filemeta")&&Object.defineProperty(b,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"docs/4-public-resources.md"}}),b.isMDXComponent=!0}}]);
//# sourceMappingURL=component---docs-4-public-resources-md-6130f3818eb440abc6b3.js.map