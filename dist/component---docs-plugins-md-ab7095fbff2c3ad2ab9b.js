(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{"4mNh":function(e,t,n){"use strict";n.r(t),n.d(t,"_frontmatter",(function(){return i})),n.d(t,"default",(function(){return p}));n("5hJT"),n("W1QL"),n("K/PF"),n("t91x"),n("75LO"),n("PJhk"),n("mXGw");var o=n("SAVP"),a=n("TjRS");n("aD51");function r(){return(r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e}).apply(this,arguments)}var i={};void 0!==i&&i&&i===Object(i)&&Object.isExtensible(i)&&!i.hasOwnProperty("__filemeta")&&Object.defineProperty(i,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"docs/plugins.md"}});var l={_frontmatter:i},s=a.a;function p(e){var t=e.components,n=function(e,t){if(null==e)return{};var n,o,a={},r=Object.keys(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,["components"]);return Object(o.b)(s,r({},l,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("h1",{id:"customizing-the-framework"},"Customizing the framework"),Object(o.b)("h2",{id:"hook-system"},"Hook System"),Object(o.b)("p",null,"Hooks allow you to change the behavior of parts of the framework."),Object(o.b)("p",null,"In order to enable hooks, you will want to provide the path to your hook files inside of your ",Object(o.b)("a",r({parentName:"p"},{href:"./configuration.md#hooks"}),"configuration file"),"."),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},"hooks.client")," will accept the hook the framework will run in the browser version of the application"),Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},"hooks.server")," will accept the hook the framework will run during server-side rendering")),Object(o.b)("p",null,Object(o.b)("em",{parentName:"p"},"Example:")),Object(o.b)("pre",null,Object(o.b)("code",r({parentName:"pre"},{className:"language-json"}),'{\n  "hooks": {\n    "client": "./src/hooks/client",\n    "server": "./src/hooks/server"\n  }\n}\n')),Object(o.b)("p",null,"Paths are resolved relative to the configuration file."),Object(o.b)("p",null,"Your hook files must respect two key points:"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},"They must have a default export"),Object(o.b)("li",{parentName:"ul"},"The default export must be a class definition")),Object(o.b)("p",null,"Using a hook is as simple as providing the correctly named method inside of your class definition."),Object(o.b)("p",null,Object(o.b)("em",{parentName:"p"},"Example"),":"),Object(o.b)("pre",null,Object(o.b)("code",r({parentName:"pre"},{className:"language-javascript"}),"import { Provider } from 'react-redux';\nimport createConfiguredStore from '../create-store';\n\nexport default class ClientSideHook {\n\n  constructor() {\n    this.store = createConfiguredStore();\n  }\n\n  wrapRootComponent(component) {\n\n    return (\n      // add a redux store Provider\n      <Provider store={this.store}>\n        {component}\n      </Provider>\n    );\n  }\n}\n")),Object(o.b)("p",null,"Which hooks you can use depend on whether you are server-side or client-side"),Object(o.b)("h3",{id:"common-hooks"},"Common hooks"),Object(o.b)("p",null,"These are hooks that are available on both client & server sides."),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},"wrapRootComponent(React.AbstractComponent): React.AbstractComponent"),": use this hook to wrap the root component\nof the React tree. Useful if you need to add providers.")),Object(o.b)("h3",{id:"client-side-hooks"},"Client-side hooks"),Object(o.b)("p",null,Object(o.b)("strong",{parentName:"p"},"Note"),": A single instance of your hook will be created."),Object(o.b)("p",null,"Currently the framework does not offer any client-side specific hook. ",Object(o.b)("a",r({parentName:"p"},{href:"#common-hooks"}),"Common hooks")," are however available"),Object(o.b)("h3",{id:"server-side-hooks-ssr-only"},"Server-side hooks (SSR only)"),Object(o.b)("p",null,Object(o.b)("strong",{parentName:"p"},"Note"),": A new instance of your hook is created for each request, you can therefore store state specific to one request."),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},Object(o.b)("p",{parentName:"li"},Object(o.b)("inlineCode",{parentName:"p"},"preRender(HtmlParts): HtmlParts"),": this hook is called after React is done rendering\nand right before the page wrapper itself is being rendered. (If you have a better name for this, please open an issue!)."),Object(o.b)("p",{parentName:"li"},"The point of this hook is ",Object(o.b)("em",{parentName:"p"},"not")," to change how the page is rendered,\nbut to add extra content to the page (scripts, meta tags, etc)."),Object(o.b)("p",{parentName:"li"},"It receives and should return the following format:"),Object(o.b)("pre",{parentName:"li"},Object(o.b)("code",r({parentName:"pre"},{className:"language-typescript"}),"interface Htmlparts {\n  /** what will be put inside of <head>. Eg. Webpack preload scripts & CSS */\n  header: string;\n\n  /** The HTML outputted by React, the contents of <div id=app /> */\n  body: string;\n\n  /** What will be placed at the very end of the page */\n  footer: string;\n\n  /** The output of Helmet.renderStatic. See https://github.com/nfl/react-helmet#server-usage */\n  helmet: Object;\n}\n")),Object(o.b)("p",{parentName:"li"},Object(o.b)("em",{parentName:"p"},"note"),": This API is highly prone to changes to unify with Helmet.")),Object(o.b)("li",{parentName:"ul"},Object(o.b)("p",{parentName:"li"},Object(o.b)("inlineCode",{parentName:"p"},"postRequest(): void"),": This method is called after the server is done responding to the client with the generated page.")),Object(o.b)("li",{parentName:"ul"},Object(o.b)("p",{parentName:"li"},Object(o.b)("inlineCode",{parentName:"p"},"static configureServerApp(app: ExpressInstance): void"),": This method is called before the server is started. It enables you to\nadd new endpoints to the express instance."))),Object(o.b)("h2",{id:"plugin-system"},"Plugin system"),Object(o.b)("p",null,"While Hooks are great for solving needs specific to your project, plugins enable you\nto provide generic solutions that are reusable across projects."),Object(o.b)("p",null,"Plugins are a layer on top of hook."),Object(o.b)("h3",{id:"enabling-a-plugin"},"Enabling a plugin"),Object(o.b)("p",null,"In order to enable a plugin, you need to specify the name of the plugin as a key in the ",Object(o.b)("inlineCode",{parentName:"p"},"plugins")," object of\nyour ",Object(o.b)("a",r({parentName:"p"},{href:"./configuration.md#plugins"}),"configuration file"),". The value of that entry is the configuration of the plugin."),Object(o.b)("p",null,Object(o.b)("em",{parentName:"p"},"Example:")),Object(o.b)("pre",null,Object(o.b)("code",r({parentName:"pre"},{className:"language-json"}),'{\n  "plugins": {\n    "@reworkjs/redux": {\n      "global-stores": "./app/stores"\n    }\n  }\n}\n')),Object(o.b)("p",null,"The above example will cause the framework to load the ",Object(o.b)("inlineCode",{parentName:"p"},"@reworkjs/redux/plugin.js")," plugin definition."),Object(o.b)("h3",{id:"plugin-definition-resolution"},"Plugin definition resolution"),Object(o.b)("p",null,"If the path to the plugin definition points to a folder, the framework will attempt to resolve ",Object(o.b)("inlineCode",{parentName:"p"},"plugin.js")," in that folder."),Object(o.b)("p",null,"Alternatively, you can specify a file directly: ",Object(o.b)("inlineCode",{parentName:"p"},"./plugins/my-custom-plugin.js"),"."),Object(o.b)("p",null,"Paths are resolved relative to the configuration file."),Object(o.b)("h3",{id:"creating-a-plugin-definition"},"Creating a plugin definition"),Object(o.b)("p",null,"A typical plugin definition looks like this:"),Object(o.b)("pre",null,Object(o.b)("code",r({parentName:"pre"},{className:"language-javascript"}),"'use strict';\n\nconst path = require('path');\n\nmodule.exports = class ReduxPlugin {\n\n  constructor(params) {\n    const config = params.pluginConfig;\n    const configDir = path.dirname(params.configFile);\n\n    this.globalStoresDir = config['global-stores'] ? path.resolve(configDir, config['global-stores']) : null;\n  }\n\n  getHooks() {\n\n    return {\n      client: path.resolve(`${__dirname}/../hook-client`),\n      server: path.resolve(`${__dirname}/../hook-server`),\n    };\n  }\n}\n")),Object(o.b)("p",null,"Some key points:"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},"Your file will not be automatically transpiled by the framework, it must be compatible with your Node version."),Object(o.b)("li",{parentName:"ul"},"The main/default export of your plugin must be a class")),Object(o.b)("p",null,Object(o.b)("strong",{parentName:"p"},"Methods"),":"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},Object(o.b)("p",{parentName:"li"},Object(o.b)("inlineCode",{parentName:"p"},"constructor"),": Your plugin will be constructed and will be passed the following parameters:"),Object(o.b)("ul",{parentName:"li"},Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},"params.configFile"),": The location of the configFile in which your plugin was declared"),Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},"params.pluginConfig"),": The configuration of your plugin as specified in ",Object(o.b)("inlineCode",{parentName:"li"},"configFile")))),Object(o.b)("li",{parentName:"ul"},Object(o.b)("p",{parentName:"li"},Object(o.b)("inlineCode",{parentName:"p"},"getHooks"),": This method allows your to provide the different hooks the framework\nwill include in the project, the format is the same as the one described in ",Object(o.b)("a",r({parentName:"p"},{href:"#hook-system"}),"Hook System"),"."),Object(o.b)("p",{parentName:"li"},"A notable difference is that the path to the hook file must be absolute."))))}p&&p===Object(p)&&Object.isExtensible(p)&&!p.hasOwnProperty("__filemeta")&&Object.defineProperty(p,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"docs/plugins.md"}}),p.isMDXComponent=!0}}]);
//# sourceMappingURL=component---docs-plugins-md-ab7095fbff2c3ad2ab9b.js.map