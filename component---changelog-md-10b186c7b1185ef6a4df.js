(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{BlVX:function(e,t,a){"use strict";a.r(t),a.d(t,"_frontmatter",(function(){return c})),a.d(t,"default",(function(){return h}));a("5hJT"),a("W1QL"),a("K/PF"),a("t91x"),a("75LO"),a("PJhk"),a("mXGw");var b=a("SAVP"),r=a("TjRS");a("aD51");function o(){return(o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var b in a)Object.prototype.hasOwnProperty.call(a,b)&&(e[b]=a[b])}return e}).apply(this,arguments)}var c={};void 0!==c&&c&&c===Object(c)&&Object.isExtensible(c)&&!c.hasOwnProperty("__filemeta")&&Object.defineProperty(c,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"CHANGELOG.md"}});var i={_frontmatter:c},m=r.a;function h(e){var t=e.components,a=function(e,t){if(null==e)return{};var a,b,r={},o=Object.keys(e);for(b=0;b<o.length;b++)a=o[b],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,["components"]);return Object(b.b)(m,o({},i,a,{components:t,mdxType:"MDXLayout"}),Object(b.b)("h1",{id:"changelog"},"Changelog"),Object(b.b)("p",null,"All notable changes to this project will be documented in this file. See ",Object(b.b)("a",o({parentName:"p"},{href:"https://github.com/conventional-changelog/standard-version"}),"standard-version")," for commit guidelines."),Object(b.b)("h3",{id:"0291-2019-11-20"},Object(b.b)("a",o({parentName:"h3"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.29.0...v0.29.1"}),"0.29.1")," (2019-11-20)"),Object(b.b)("h3",{id:"features"},"Features"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"add new getPluginInstance API (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/22db85e33a1c557f1a17a4857e9bd59db0633d97"}),"22db85e"),")"),Object(b.b)("li",{parentName:"ul"},"expose service worker events (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/28ad2fd9342db7f482bb5ae6067ea0d360bba5d7"}),"28ad2fd"),")"),Object(b.b)("li",{parentName:"ul"},"reduce logging spam, add webpackbar (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/b697d12a9b064c71678d7da2ce1458a4f5fe1c7c"}),"b697d12"),")"),Object(b.b)("li",{parentName:"ul"},"replace react-helmet with react-helmet-async (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/161bee12c7fe8203c6c751b9dd9c9b75c8f4218a"}),"161bee1"),")"),Object(b.b)("li",{parentName:"ul"},"update react-hot-loader (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/9839f2e200964e6fefa3aeb059a151c2fdd5b8a3"}),"9839f2e"),")")),Object(b.b)("h2",{id:"0290-2019-11-16"},Object(b.b)("a",o({parentName:"h2"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.28.1...v0.29.0"}),"0.29.0")," (2019-11-16)"),Object(b.b)("h3",{id:"-breaking-changes"},"⚠ BREAKING CHANGES"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"usage of ",Object(b.b)("inlineCode",{parentName:"li"},"--prerendering")," flag must be changed to ",Object(b.b)("inlineCode",{parentName:"li"},"--ssr")),Object(b.b)("li",{parentName:"ul"},"you will now need either move the files to a subfolder or adapt references to public resources")),Object(b.b)("h3",{id:"features-1"},"Features"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"allow js webpack type to be extended by plugins (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/6af969838bc381981365f27f89e7f4f52e928def"}),"6af9698"),")"),Object(b.b)("li",{parentName:"ul"},"always purge unused react-intl polyfills & add relativetime (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/9c226bc93060580d3d0fa5eb415a9fc529b29855"}),"9c226bc"),")"),Object(b.b)("li",{parentName:"ul"},"copy files from resource directory to root of dist (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/6cab5b75d629fe792fb063877dc089924182557f"}),"6cab5b7"),")"),Object(b.b)("li",{parentName:"ul"},"default lint-staged now autofixes (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/d0fd5087cfa779a6065f31753087f41b72948312"}),"d0fd508"),")"),Object(b.b)("li",{parentName:"ul"},"expose APIs to access react-router context & set http status (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/f1542145bb85eaad1ba7eb33da026a05bb671bd0"}),"f154214"),")"),Object(b.b)("li",{parentName:"ul"},"parse typescript as javascript files (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/78ef8b99811233e3b0ca820720e1d20e6d4a274e"}),"78ef8b9"),")"),Object(b.b)("li",{parentName:"ul"},"rename prerendering -> ssr (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/7ead843d02297f495885484d8ee4b016e4752b31"}),"7ead843"),")")),Object(b.b)("h3",{id:"bug-fixes"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"accept extra args in build (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/e78e0f85b69b94dbb0fc2399df71d2e613d8841f"}),"e78e0f8"),")")),Object(b.b)("h3",{id:"0281-2019-11-08"},Object(b.b)("a",o({parentName:"h3"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.28.0...v0.28.1"}),"0.28.1")," (2019-11-08)"),Object(b.b)("h3",{id:"bug-fixes-1"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"fix husky init crash (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/3cc6744850abfc2a5d0f9e7e84e33d447743efca"}),"3cc6744"),")")),Object(b.b)("h2",{id:"0280-2019-11-08"},Object(b.b)("a",o({parentName:"h2"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.27.0...v0.28.0"}),"0.28.0")," (2019-11-08)"),Object(b.b)("h3",{id:"features-2"},"Features"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"improve & update rjs init (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/0474666610bf7124c2b5ec0936135f563c301cba"}),"0474666"),")")),Object(b.b)("h3",{id:"bug-fixes-2"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},'fix logs being persisted to "undefined" dir (',Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/9cae513dfde37e1fb46c1f10a1ce0e9f88e13d0e"}),"9cae513"),")"),Object(b.b)("li",{parentName:"ul"},"require proper version of react-dom (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/c0edf3fe56b06ccedbca09bf8a6fbf3ad1ba9b6c"}),"c0edf3f"),")")),Object(b.b)("h2",{id:"0270-2019-10-24"},Object(b.b)("a",o({parentName:"h2"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.26.0...v0.27.0"}),"0.27.0")," (2019-10-24)"),Object(b.b)("h3",{id:"features-3"},"Features"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"drop srcset-loader as it is dead (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/ab4e1ea8cb94a814a3225bb3533197727c0786cd"}),"ab4e1ea"),")")),Object(b.b)("h3",{id:"-breaking-changes-1"},"⚠ BREAKING CHANGES"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"Any usage of srcset-loader will need to be updated")),Object(b.b)("h2",{id:"0260-2019-08-06"},Object(b.b)("a",o({parentName:"h2"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.25.2...v0.26.0"}),"0.26.0")," (2019-08-06)"),Object(b.b)("h3",{id:"features-4"},"Features"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"update react-intl to 3.x.x & remove react-intl workaround (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/d870528"}),"d870528"),")")),Object(b.b)("h2",{id:"0252-2019-08-02"},Object(b.b)("a",o({parentName:"h2"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.25.1...v0.25.2"}),"0.25.2")," (2019-08-02)"),Object(b.b)("h3",{id:"bug-fixes-3"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"remove ",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/reworkjs/redux"}),"@reworkjs/redux")," from externals (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/08e5f40"}),"08e5f40"),")")),Object(b.b)("h2",{id:"0251-2019-07-12"},Object(b.b)("a",o({parentName:"h2"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.25.0...v0.25.1"}),"0.25.1")," (2019-07-12)"),Object(b.b)("h3",{id:"bug-fixes-4"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"force app refresh after intl change (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/24c15f2"}),"24c15f2"),")"),Object(b.b)("li",{parentName:"ul"},"minify css in production (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/c298003"}),"c298003"),")"),Object(b.b)("li",{parentName:"ul"},"resolve webpack deprecation warnings (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/29f1908"}),"29f1908"),")")),Object(b.b)("h3",{id:"features-5"},"Features"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},'enable "removeAvailableModules" webpack opti (',Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/31b30b2"}),"31b30b2"),")")),Object(b.b)("h1",{id:"0250-2019-07-09"},Object(b.b)("a",o({parentName:"h1"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.24.1...v0.25.0"}),"0.25.0")," (2019-07-09)"),Object(b.b)("h3",{id:"bug-fixes-5"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"create new Chalk instance using Chalk.constructor (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/4815551"}),"4815551"),")"),Object(b.b)("li",{parentName:"ul"},"fix init ignoring errors (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/5e2f06b"}),"5e2f06b"),")"),Object(b.b)("li",{parentName:"ul"},"lazy load server-hooks (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/30036ce"}),"30036ce"),")"),Object(b.b)("li",{parentName:"ul"},"make babel cache env & side aware (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/b5e1b3e"}),"b5e1b3e"),")")),Object(b.b)("h2",{id:"0241-2019-07-03"},Object(b.b)("a",o({parentName:"h2"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.24.0...v0.24.1"}),"0.24.1")," (2019-07-03)"),Object(b.b)("h3",{id:"bug-fixes-6"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"fix useLocation having undefined in its url (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/9084cd5"}),"9084cd5"),")")),Object(b.b)("h2",{id:"0240-2019-06-18"},Object(b.b)("a",o({parentName:"h2"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.23.0...v0.24.0"}),"0.24.0")," (2019-06-18)"),Object(b.b)("h3",{id:"bug-fixes-7"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"resolve adhoc hook based on config file ",Object(b.b)("em",{parentName:"li"},"directory")," (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/4bd941a"}),"4bd941a"),")")),Object(b.b)("h3",{id:"features-6"},"Features"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"allow providing ad-hoc hooks (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/8cb50bc"}),"8cb50bc"),")"),Object(b.b)("li",{parentName:"ul"},"provide hook to configure express (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/a66100c"}),"a66100c"),")")),Object(b.b)("h1",{id:"0230-2019-06-14"},Object(b.b)("a",o({parentName:"h1"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.22.0...v0.23.0"}),"0.23.0")," (2019-06-14)"),Object(b.b)("h3",{id:"bug-fixes-8"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"don't inject babel-runtime inside of core-js (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/833b3c7"}),"833b3c7"),")"),Object(b.b)("li",{parentName:"ul"},"replace WebpackClean with CleanWebpack (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/d9021f5"}),"d9021f5"),"), closes ",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/issues/55"}),"#55"))),Object(b.b)("h3",{id:"features-7"},"Features"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"add config option to use the react-router HashRouter (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/840a185"}),"840a185"),")"),Object(b.b)("li",{parentName:"ul"},"allow people to define a custom path to the configuration file (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/5f5b98f"}),"5f5b98f"),")"),Object(b.b)("li",{parentName:"ul"},"validate configuration using Joi (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/9eb9c65"}),"9eb9c65"),")")),Object(b.b)("h3",{id:"breaking-changes"},"BREAKING CHANGES"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"default config file is now <project_dir>/.reworkrc"),Object(b.b)("li",{parentName:"ul"},"relative files & directories specified in config file are now relative to folder containing the config file.")),Object(b.b)("h2",{id:"0220-2019-05-28"},Object(b.b)("a",o({parentName:"h2"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.21.0...v0.22.0"}),"0.22.0")," (2019-05-28)"),Object(b.b)("h3",{id:"bug-fixes-9"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"make exported hooks use non-ssr version by default (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/79ededf"}),"79ededf"),")")),Object(b.b)("h2",{id:"0210-2019-05-27"},Object(b.b)("a",o({parentName:"h2"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.20.2...v0.21.0"}),"0.21.0")," (2019-05-27)"),Object(b.b)("h3",{id:"bug-fixes-10"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"make server-side use /lib to avoid esm in modules (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/4f607e3"}),"4f607e3"),")"),Object(b.b)("li",{parentName:"ul"},"prevent dev SSR server from crashing if front is ready before back-end (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/ebed78c"}),"ebed78c"),")"),Object(b.b)("li",{parentName:"ul"},"prevent server from crashing in dev mode if an exception occurs during build (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/48a64c2"}),"48a64c2"),")")),Object(b.b)("h3",{id:"features-8"},"Features"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"add experimental SSR resource loading (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/bb34439"}),"bb34439"),")"),Object(b.b)("li",{parentName:"ul"},"add support for ",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/loadable"}),"@loadable")," (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/6b2cbcb"}),"6b2cbcb"),")"),Object(b.b)("li",{parentName:"ul"},"add usePersistentValue (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/472813c"}),"472813c"),")"),Object(b.b)("li",{parentName:"ul"},"load .browser.ext over .ext on browser, .server.ext on server if present (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/422af5e"}),"422af5e"),")"),Object(b.b)("li",{parentName:"ul"},"make use-location return URL & cause re-render on change (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/40b23c8"}),"40b23c8"),")")),Object(b.b)("h2",{id:"0202-2019-05-13"},Object(b.b)("a",o({parentName:"h2"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.20.1...v0.20.2"}),"0.20.2")," (2019-05-13)"),Object(b.b)("h3",{id:"bug-fixes-11"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"prevent lodash feature from using babel.config.js when compiling node_modules (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/c57cb87"}),"c57cb87"),")")),Object(b.b)("h2",{id:"0201-2019-05-07"},Object(b.b)("a",o({parentName:"h2"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.20.0...v0.20.1"}),"0.20.1")," (2019-05-07)"),Object(b.b)("h3",{id:"bug-fixes-12"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"disable using babel.config.js as we load it manually (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/b336ba0"}),"b336ba0"),")")),Object(b.b)("h2",{id:"0200-2019-04-26"},Object(b.b)("a",o({parentName:"h2"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.19.0...v0.20.0"}),"0.20.0")," (2019-04-26)"),Object(b.b)("h3",{id:"bug-fixes-13"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"don't parse node_modules with remove-prop-types (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/9ce4429"}),"9ce4429"),")")),Object(b.b)("h3",{id:"features-9"},"Features"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"add ssr ready use-dnt, use-user-agent, use-location (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/5c808c2"}),"5c808c2"),")"),Object(b.b)("li",{parentName:"ul"},"expose request and response through context when in SSR (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/8225d26"}),"8225d26"),")"),Object(b.b)("li",{parentName:"ul"},"remove compression (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/8a76d19"}),"8a76d19"),")"),Object(b.b)("li",{parentName:"ul"},"replace uglify with terser & update deps (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/1537111"}),"1537111"),")")),Object(b.b)("h2",{id:"0190-2019-04-23"},Object(b.b)("a",o({parentName:"h2"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.18.0...v0.19.0"}),"0.19.0")," (2019-04-23)"),Object(b.b)("h3",{id:"features-10"},"Features"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"replace with-context-consumer with with-context (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/59600f1"}),"59600f1"),")")),Object(b.b)("h2",{id:"0180-2019-04-23"},Object(b.b)("a",o({parentName:"h2"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.17.4...v0.18.0"}),"0.18.0")," (2019-04-23)"),Object(b.b)("h3",{id:"bug-fixes-14"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"babel presets - use NODE_ENV if BABEL_ENV is not set (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/2198063"}),"2198063"),")"),Object(b.b)("li",{parentName:"ul"},"cancel redirect if same url, fix redirect crashing (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/b60b536"}),"b60b536"),")"),Object(b.b)("li",{parentName:"ul"},'make "server" build use /lib instead of /es (',Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/adae823"}),"adae823"),")")),Object(b.b)("h3",{id:"features-11"},"Features"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},'remove "webpack" from build folder name (',Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/33d4c28"}),"33d4c28"),")")),Object(b.b)("h2",{id:"0174-2019-03-05"},Object(b.b)("a",o({parentName:"h2"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.17.3...v0.17.4"}),"0.17.4")," (2019-03-05)"),Object(b.b)("h3",{id:"bug-fixes-15"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"don't resolve main-component so webpack is the one resolving files (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/04a33c1"}),"04a33c1"),")"),Object(b.b)("li",{parentName:"ul"},"remove .react.js from special file extension (.js is enough) (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/798d10a"}),"798d10a"),")")),Object(b.b)("h2",{id:"0173-2019-02-22"},Object(b.b)("a",o({parentName:"h2"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.17.2...v0.17.3"}),"0.17.3")," (2019-02-22)"),Object(b.b)("h3",{id:"bug-fixes-16"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"update dependencies & remove explicit regeneratorRuntime (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/b40e61f"}),"b40e61f"),")")),Object(b.b)("h2",{id:"0172-2019-02-12"},Object(b.b)("a",o({parentName:"h2"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.17.1...v0.17.2"}),"0.17.2")," (2019-02-12)"),Object(b.b)("h3",{id:"bug-fixes-17"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"stringify argv so webpack can replace it in built files (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/29dae67"}),"29dae67"),")")),Object(b.b)("h2",{id:"0171-2019-02-12"},Object(b.b)("a",o({parentName:"h2"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.17.0...v0.17.1"}),"0.17.1")," (2019-02-12)"),Object(b.b)("h3",{id:"bug-fixes-18"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"make @reworkjs/core/argv work on node processes (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/018cfc1"}),"018cfc1"),")")),Object(b.b)("h2",{id:"0170-2019-02-11"},Object(b.b)("a",o({parentName:"h2"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.16.0...v0.17.0"}),"0.17.0")," (2019-02-11)"),Object(b.b)("h3",{id:"bug-fixes-19"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"expose context for use in react hooks (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/a577078"}),"a577078"),")"),Object(b.b)("li",{parentName:"ul"},"update usage of old babel plugin (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/a2726ee"}),"a2726ee"),")")),Object(b.b)("h3",{id:"features-12"},"Features"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"remove eslint-loader (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/220423f"}),"220423f"),")")),Object(b.b)("h2",{id:"0160-2019-02-07"},Object(b.b)("a",o({parentName:"h2"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.15.1...v0.16.0"}),"0.16.0")," (2019-02-07)"),Object(b.b)("h3",{id:"bug-fixes-20"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"disable css-loader minimize, move to postcss (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/c501eed"}),"c501eed"),")")),Object(b.b)("h3",{id:"features-13"},"Features"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"remove build-in ngrok support (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/3f05ca2"}),"3f05ca2"),")"),Object(b.b)("li",{parentName:"ul"},"remove intl locales not matching available translations (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/06e1f1a"}),"06e1f1a"),")")),Object(b.b)("h3",{id:"breaking-changes-1"},"BREAKING CHANGES"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"use ngrok externally")),Object(b.b)("h2",{id:"0151-2019-01-08"},Object(b.b)("a",o({parentName:"h2"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.15.0...v0.15.1"}),"0.15.1")," (2019-01-08)"),Object(b.b)("h3",{id:"bug-fixes-21"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},Object(b.b)("strong",{parentName:"li"},"config:")," fix setting react-entry crashing the app (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/bebefa4"}),"bebefa4"),")")),Object(b.b)("h2",{id:"0150-2019-01-08"},Object(b.b)("a",o({parentName:"h2"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.14.1...v0.15.0"}),"0.15.0")," (2019-01-08)"),Object(b.b)("h3",{id:"bug-fixes-22"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"fix crash when persisting locale in cookies (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/278abbb"}),"278abbb"),")"),Object(b.b)("li",{parentName:"ul"},"Store prefered locale on change (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/a348e8d"}),"a348e8d"),")"),Object(b.b)("li",{parentName:"ul"},Object(b.b)("strong",{parentName:"li"},"babel:")," do not run react preset on node_modules (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/b912832"}),"b912832"),")"),Object(b.b)("li",{parentName:"ul"},Object(b.b)("strong",{parentName:"li"},"babel:")," fix crashes related to babel update (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/deca477"}),"deca477"),")"),Object(b.b)("li",{parentName:"ul"},Object(b.b)("strong",{parentName:"li"},"locale:")," enable react-intl locale after it has been loaded (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/5ef4818"}),"5ef4818"),")"),Object(b.b)("li",{parentName:"ul"},Object(b.b)("strong",{parentName:"li"},"react-intl:")," create locale alias when framework finds one that does not exist in react-intl (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/0f1e5c8"}),"0f1e5c8"),")"),Object(b.b)("li",{parentName:"ul"},Object(b.b)("strong",{parentName:"li"},"route:")," add key to top level routes (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/2d7e693"}),"2d7e693"),")")),Object(b.b)("h3",{id:"features-14"},"Features"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"allow plugins to hook client and server rendering (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/d6c2eb0"}),"d6c2eb0"),")"),Object(b.b)("li",{parentName:"ul"},"completely replace redux with new plugin system (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/1170ddf"}),"1170ddf"),")"),Object(b.b)("li",{parentName:"ul"},"expose singleton instance on plugins (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/5dc23ed"}),"5dc23ed"),")"),Object(b.b)("li",{parentName:"ul"},"hydrate react tree if its container has content, render otherwise (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/776ef82"}),"776ef82"),")"),Object(b.b)("li",{parentName:"ul"},"move public modules from index.js to individual sub-modules (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/05d241b"}),"05d241b"),")"),Object(b.b)("li",{parentName:"ul"},"Prevent ReworkJsWrapper from generating a new Div (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/20231ba"}),"20231ba"),")"),Object(b.b)("li",{parentName:"ul"},"Remove all usages of Redux (will add them through plugins) (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/2566067"}),"2566067"),")"),Object(b.b)("li",{parentName:"ul"},"update to react-router v4 (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/61d0860"}),"61d0860"),")"),Object(b.b)("li",{parentName:"ul"},Object(b.b)("strong",{parentName:"li"},"babel:")," update to babel 7, update hot reload system, transpile node_modules (stable only) (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/c489349"}),"c489349"),")"),Object(b.b)("li",{parentName:"ul"},Object(b.b)("strong",{parentName:"li"},"i18n:")," make translations local to a single react tree (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/921dec8"}),"921dec8"),")")),Object(b.b)("h2",{id:"0141-2018-08-09"},Object(b.b)("a",o({parentName:"h2"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.14.0...v0.14.1"}),"0.14.1")," (2018-08-09)"),Object(b.b)("h3",{id:"bug-fixes-23"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"make get-translations node mock work on non-unix filesystems (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/a4424b3"}),"a4424b3"),")")),Object(b.b)("h2",{id:"0140-2018-06-12"},Object(b.b)("a",o({parentName:"h2"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.13.0...v0.14.0"}),"0.14.0")," (2018-06-12)"),Object(b.b)("h3",{id:"bug-fixes-24"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"Fix crash when loading a project without an existing configuration file (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/48aaf40"}),"48aaf40"),")"),Object(b.b)("li",{parentName:"ul"},"Make render-html & pre-init optional (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/81c5cf2"}),"81c5cf2"),")")),Object(b.b)("h3",{id:"features-15"},"Features"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"Add a way to append a script to the service worker (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/5baeb49"}),"5baeb49"),")")),Object(b.b)("h2",{id:"0130-2018-05-09"},Object(b.b)("a",o({parentName:"h2"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.12.0...v0.13.0"}),"0.13.0")," (2018-05-09)"),Object(b.b)("h3",{id:"bug-fixes-25"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"Compress CSS files with gzip (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/572b59f"}),"572b59f"),")"),Object(b.b)("li",{parentName:"ul"},"Fix sending a corrupted response when trying to access a precompressed resource with a query parameter (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/0d9ca5d"}),"0d9ca5d"),")"),Object(b.b)("li",{parentName:"ul"},"Make SW cache root route (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/5c77e0e"}),"5c77e0e"),")"),Object(b.b)("li",{parentName:"ul"},"Make the built server able to run from a different directory than the one it was built in (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/4f1480c"}),"4f1480c"),")"),Object(b.b)("li",{parentName:"ul"},"only import framework-config in bundle in development mode (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/fc2c95e"}),"fc2c95e"),")"),Object(b.b)("li",{parentName:"ul"},"Use log directory to store app logs instead of build directory (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/cb6837d"}),"cb6837d"),")")),Object(b.b)("h3",{id:"features-16"},"Features"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"Add brotli pre-compress support (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/c43844b"}),"c43844b"),")")),Object(b.b)("h2",{id:"0120-2018-04-18"},Object(b.b)("a",o({parentName:"h2"},{href:"https://github.com/foobarhq/reworkjs/compare/v0.11.0...v0.12.0"}),"0.12.0")," (2018-04-18)"),Object(b.b)("h3",{id:"bug-fixes-26"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"Disable removeAvailableModules in development (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/c7ec6ee"}),"c7ec6ee"),")"),Object(b.b)("li",{parentName:"ul"},"Disable webp minification (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/2832d19"}),"2832d19"),")"),Object(b.b)("li",{parentName:"ul"},"Fix injecting cookies into BaseHelmet when building the app (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/faefd8d"}),"faefd8d"),")")),Object(b.b)("h3",{id:"features-17"},"Features"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"Disable eslint by default (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/f1f9e4b"}),"f1f9e4b"),")")),Object(b.b)("h3",{id:"breaking-changes-2"},"BREAKING CHANGES"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"Enable eslint using --features=eslint")),Object(b.b)("h2",{id:"0110-2018-04-11"},"0.11.0 (2018-04-11)"),Object(b.b)("h3",{id:"bug-fixes-27"},"Bug Fixes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"Bump required webpack-bundle-analyzer version to solve issue with concat modules (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/de8494a"}),"de8494a"),")"),Object(b.b)("li",{parentName:"ul"},"Don't ss-render context style tags in production (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/d9f28b2"}),"d9f28b2"),")"),Object(b.b)("li",{parentName:"ul"},"Fix app builder crashing in watch mode when initial build failed and an user tries to access it (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/fa274bb"}),"fa274bb"),")"),Object(b.b)("li",{parentName:"ul"},"Fix react not being able to display errors due to cross-origin issues (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/49dfbcb"}),"49dfbcb"),")"),Object(b.b)("li",{parentName:"ul"},"Fix server-side loading of CSS (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/fd27864"}),"fd27864"),")"),Object(b.b)("li",{parentName:"ul"},"Launch pre-rendering server on correct port in prod (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/38003c3"}),"38003c3"),")"),Object(b.b)("li",{parentName:"ul"},"Make render-html config entry work with SSR (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/d9c5a73"}),"d9c5a73"),")"),Object(b.b)("li",{parentName:"ul"},"Migrate optimization plugins to webpack.optimization (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/bd8152d"}),"bd8152d"),")"),Object(b.b)("li",{parentName:"ul"},"Only pre-render CSS as ",Object(b.b)("inlineCode",{parentName:"li"},"<style>")," tags in development (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/71ce71b"}),"71ce71b"),")"),Object(b.b)("li",{parentName:"ul"},"Only pre-serve named bundles for reliability (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/7d4f6ae"}),"7d4f6ae"),")"),Object(b.b)("li",{parentName:"ul"},"Optimize images on the server too so their hash is identical to the front-end (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/8a6af49"}),"8a6af49"),")"),Object(b.b)("li",{parentName:"ul"},"Prevent passing webp files to file-loader twice (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/c072796"}),"c072796"),")"),Object(b.b)("li",{parentName:"ul"},"Remove --no-prerendering warning as prerendering is now off by default (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/a605987"}),"a605987"),")"),Object(b.b)("li",{parentName:"ul"},"Replace deprecated webpack.optimize.UglifyJsPlugin with uglifyjs-webpack-plugin (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/f0eac80"}),"f0eac80"),")"),Object(b.b)("li",{parentName:"ul"},"Set lang html attribute to loaded language (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/f64c6b2"}),"f64c6b2"),")")),Object(b.b)("h3",{id:"features-18"},"Features"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"Add support for loading .mjs files (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/2c80a58"}),"2c80a58"),")"),Object(b.b)("li",{parentName:"ul"},"Add support for webp (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/06843a5"}),"06843a5"),")"),Object(b.b)("li",{parentName:"ul"},"Don't generate chunk names in splitChunks for long term caching (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/fa82439"}),"fa82439"),")"),Object(b.b)("li",{parentName:"ul"},"CSS is now split per chunk (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/43554a3"}),"43554a3"),")"),Object(b.b)("li",{parentName:"ul"},Object(b.b)("strong",{parentName:"li"},"webpack:")," Pass WebP to imagemin, configure mozjpeg&gifsicle (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/1660ad3"}),"1660ad3"),")"),Object(b.b)("li",{parentName:"ul"},"Update dependencies (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/a4265af"}),"a4265af"),")"),Object(b.b)("li",{parentName:"ul"},"Update peer dependencies (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/32646bb"}),"32646bb"),")"),Object(b.b)("li",{parentName:"ul"},"Migrate to React 16.3.1")),Object(b.b)("h3",{id:"breaking-changes-3"},"Breaking Changes"),Object(b.b)("ul",null,Object(b.b)("li",{parentName:"ul"},"Drop support for node ","<"," latest LTS (= 8) (",Object(b.b)("a",o({parentName:"li"},{href:"https://github.com/foobarhq/reworkjs/commit/80b76be"}),"80b76be"),")")))}h&&h===Object(h)&&Object.isExtensible(h)&&!h.hasOwnProperty("__filemeta")&&Object.defineProperty(h,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"CHANGELOG.md"}}),h.isMDXComponent=!0}}]);
//# sourceMappingURL=component---changelog-md-10b186c7b1185ef6a4df.js.map