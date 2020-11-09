(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{iUVL:function(e,t,n){"use strict";n.r(t),n.d(t,"_frontmatter",(function(){return l})),n.d(t,"default",(function(){return s}));var i=n("Fcif"),r=n("+I+c"),o=(n("mXGw"),n("/FXl")),a=n("TjRS"),l=(n("aD51"),{});void 0!==l&&l&&l===Object(l)&&Object.isExtensible(l)&&!l.hasOwnProperty("__filemeta")&&Object.defineProperty(l,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"docs/advanced-topics/configuration.md"}});var c={_frontmatter:l},b=a.a;function s(e){var t=e.components,n=Object(r.a)(e,["components"]);return Object(o.b)(b,Object(i.a)({},c,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("h1",{id:"rework-configuration"},"rework Configuration"),Object(o.b)("p",null,"The rework configuration gives you the ability to customise the framework to your liking, and to enable plugins."),Object(o.b)("p",null,"By default, the configuration file should be named ",Object(o.b)("inlineCode",{parentName:"p"},".reworkrc")," and\nbe placed at the root of your project. (see also: ",Object(o.b)("a",{href:"#specifying-the-path-to-the-configuration-file",parentName:"p"},"How to specifify the configiguration file path"),")"),Object(o.b)("h2",{id:"contents"},"Contents"),Object(o.b)("p",null,"Example configuration file with all entries:"),Object(o.b)("pre",null,Object(o.b)("code",{className:"language-json",parentName:"pre"},'{\n  "routingType": "browser",\n  "directories": {\n    "logs": "./.build",\n    "build": "./.build",\n    "resources": "./src/public",\n    "translations": "./src/translations"\n  },\n  "routes": "**/*.route.js",\n  "entry-react": "./src/components/App",\n  "render-html": "./src/render-html.js",\n  "pre-init": "./src/pre-init.js",\n  "service-worker": "./src/service-worker.js",\n  "plugins": {\n    "@reworkjs/redux": {}\n  }\n}\n')),Object(o.b)("p",null,"All entries are optional\nPaths are resolved from the location of your configuration file"),Object(o.b)("p",null,Object(o.b)("strong",{parentName:"p"},"Important note:")," Changes to the configuration files will only take effect after the app has been restarted."),Object(o.b)("h3",{id:"routingtype"},Object(o.b)("inlineCode",{parentName:"h3"},"routingType")),Object(o.b)("p",null,"Default: ",Object(o.b)("inlineCode",{parentName:"p"},"browser")),Object(o.b)("p",null,"The type of router to use, see ",Object(o.b)("a",{href:"https://reacttraining.com/react-router/web",parentName:"p"},"React-Router")," documentation for more information on the types of routers."),Object(o.b)("p",null,"Possible values: ",Object(o.b)("inlineCode",{parentName:"p"},"browser")," for ",Object(o.b)("a",{href:"https://reacttraining.com/react-router/web/api/BrowserRouter",parentName:"p"},"BrowserRouter"),", ",Object(o.b)("inlineCode",{parentName:"p"},"hash")," for ",Object(o.b)("a",{href:"https://reacttraining.com/react-router/web/api/HashRouter",parentName:"p"},"HashRouter")),Object(o.b)("h3",{id:"emit-integrity"},"'emit-integrity'"),Object(o.b)("p",null,"Default: ",Object(o.b)("inlineCode",{parentName:"p"},"true")),Object(o.b)("p",null,"Emit ",Object(o.b)("a",{href:"https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity",parentName:"p"},"subresource integrity")," on generated assets.\nThis might cause issues when loading using the ",Object(o.b)("inlineCode",{parentName:"p"},"file://")," protocol on some platforms, such as Cordova iOS."),Object(o.b)("p",null,"Note: Subresource integrity is always disabled in development mode."),Object(o.b)("h3",{id:"directoriesbuild"},Object(o.b)("inlineCode",{parentName:"h3"},"directories.build")),Object(o.b)("p",null,"Default: ",Object(o.b)("inlineCode",{parentName:"p"},"./.build")),Object(o.b)("p",null,"The directory in which compiled files will be outputted."),Object(o.b)("p",null,"server files will be located in ",Object(o.b)("inlineCode",{parentName:"p"},"{directories.build}/server"),"\nclient files will be located in ",Object(o.b)("inlineCode",{parentName:"p"},"{directories.build}/client")),Object(o.b)("h3",{id:"directorieslogs"},Object(o.b)("inlineCode",{parentName:"h3"},"directories.logs")),Object(o.b)("p",null,"Default: Value of ",Object(o.b)("inlineCode",{parentName:"p"},"directories.build")),Object(o.b)("p",null,"The directory in which build & running logs will be outputted."),Object(o.b)("h3",{id:"directoriesresources"},Object(o.b)("inlineCode",{parentName:"h3"},"directories.resources")),Object(o.b)("p",null,"Default: ",Object(o.b)("inlineCode",{parentName:"p"},"./src/public")),Object(o.b)("p",null,"This directory contains assets that should not be transformed and will merely be copied over. (default: ",Object(o.b)("inlineCode",{parentName:"p"},"./src/public"),")"),Object(o.b)("p",null,"The files located inside of ",Object(o.b)("inlineCode",{parentName:"p"},"resources")," will be copied inside of the ",Object(o.b)("inlineCode",{parentName:"p"},"public")," directory in the output files.\nBe careful not to use the name of a built resource (such as ",Object(o.b)("inlineCode",{parentName:"p"},"index.html")," or ",Object(o.b)("inlineCode",{parentName:"p"},"main.js"),")."),Object(o.b)("p",null,"See the chapter on ",Object(o.b)("a",{href:"../4-public-resources.md",parentName:"p"},"Public Resources")," for more information"),Object(o.b)("h3",{id:"directoriestranslations"},Object(o.b)("inlineCode",{parentName:"h3"},"directories.translations")),Object(o.b)("p",null,"Default: ",Object(o.b)("inlineCode",{parentName:"p"},"./src/translations")),Object(o.b)("p",null,"This directory contains the translation files used by ",Object(o.b)("inlineCode",{parentName:"p"},"react-intl"),". See the chapter about ",Object(o.b)("a",{href:"../5-i18n.md",parentName:"p"},"i18n")),Object(o.b)("h3",{id:"routes"},Object(o.b)("inlineCode",{parentName:"h3"},"routes")),Object(o.b)("p",null,"Default: ",Object(o.b)("inlineCode",{parentName:"p"},"src/**/*.route.js")),Object(o.b)("p",null,"A glob matching all files that should be interpreted as route definitions. See the chapter about ",Object(o.b)("a",{href:"./routing.md",parentName:"p"},"routing")," for more information."),Object(o.b)("h3",{id:"pre-init"},Object(o.b)("inlineCode",{parentName:"h3"},"pre-init")),Object(o.b)("p",null,"Default: none"),Object(o.b)("p",null,"This file allows you to specify code to run before the rest of your application is loaded. You can use it to load\ndependencies needed by your application, such as polyfills."),Object(o.b)("p",null,"This file can have a single, optional, default export that is either a Promise, or a function (which optionally returns a Promise)."),Object(o.b)("p",null,"If exporting a Promise, your application will be loaded after the promise resolves"),Object(o.b)("p",null,"If exporting a Function, your application will be loaded after the execution of the function and after the Promise the function returns (if any) resolves."),Object(o.b)("h2",{id:"entry-react"},Object(o.b)("inlineCode",{parentName:"h2"},"entry-react")),Object(o.b)("p",null,"See ",Object(o.b)("a",{href:"root-component.md",parentName:"p"},"The Root Component")),Object(o.b)("h3",{id:"render-html"},Object(o.b)("inlineCode",{parentName:"h3"},"render-html")),Object(o.b)("p",null,"TBD"),Object(o.b)("h3",{id:"service-worker"},Object(o.b)("inlineCode",{parentName:"h3"},"service-worker")),Object(o.b)("p",null,"Default: none"),Object(o.b)("p",null,"If specified, the file will be loaded inside of the service worker."),Object(o.b)("h2",{id:"hooks"},Object(o.b)("inlineCode",{parentName:"h2"},"hooks")),Object(o.b)("p",null,"See ",Object(o.b)("a",{href:"plugins.md#hook-system",parentName:"p"},"The first section of Plugins")),Object(o.b)("h2",{id:"plugins"},Object(o.b)("inlineCode",{parentName:"h2"},"plugins")),Object(o.b)("p",null,"See ",Object(o.b)("a",{href:"plugins.md#plugin-system",parentName:"p"},"The second section of Plugins")),Object(o.b)("h2",{id:"specifying-the-path-to-the-configuration-file"},"Specifying the path to the configuration file"),Object(o.b)("p",null,"Specify the ",Object(o.b)("inlineCode",{parentName:"p"},"--reworkrc")," argument in the ",Object(o.b)("inlineCode",{parentName:"p"},"rjs")," cli to change the used configuration file: ",Object(o.b)("inlineCode",{parentName:"p"},"rjs start --reworkrc=./app/.reworkrc")))}void 0!==s&&s&&s===Object(s)&&Object.isExtensible(s)&&!s.hasOwnProperty("__filemeta")&&Object.defineProperty(s,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"docs/advanced-topics/configuration.md"}}),s.isMDXComponent=!0}}]);
//# sourceMappingURL=component---docs-advanced-topics-configuration-md-a1f1ecd5890f3deb664a.js.map