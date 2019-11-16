---
name: Plugins
menu: Advanced Topics
route: /plugins
---

# Customizing the framework

## Hook System

Hooks allow you to change the behavior of parts of the framework.

In order to enable hooks, you will want to provide the path to your hook files inside of your [configuration file](configuration.md#hooks).

- `hooks.client` will accept the hook the framework will run in the browser version of the application
- `hooks.server` will accept the hook the framework will run during server-side rendering

*Example:*

```json
{
  "hooks": {
    "client": "./src/hooks/client",
    "server": "./src/hooks/server"
  }
}
```

Paths are resolved relative to the configuration file.

Your hook files must respect two key points:

- They must have a default export
- The default export must be a class definition

Using a hook is as simple as providing the correctly named method inside of your class definition.

*Example*:

```javascript
import { Provider } from 'react-redux';
import createConfiguredStore from '../create-store';

export default class ClientSideHook {

  constructor() {
    this.store = createConfiguredStore();
  }

  wrapRootComponent(component) {

    return (
      // add a redux store Provider
      <Provider store={this.store}>
        {component}
      </Provider>
    );
  }
}
```

Which hooks you can use depend on whether you are server-side or client-side

### Common hooks

These are hooks that are available on both client & server sides.

- `wrapRootComponent(React.AbstractComponent): React.AbstractComponent`: use this hook to wrap the root component 
  of the React tree. Useful if you need to add providers.

### Client-side hooks

**Note**: A single instance of your hook will be created.

Currently the framework does not offer any client-side specific hook. [Common hooks](#common-hooks) are however available

### Server-side hooks (SSR only)

**Note**: A new instance of your hook is created for each request, you can therefore store state specific to one request.

- `preRender(HtmlParts): HtmlParts`: this hook is called after React is done rendering 
  and right before the page wrapper itself is being rendered. (If you have a better name for this, please open an issue!).
  
  The point of this hook is *not* to change how the page is rendered, 
  but to add extra content to the page (scripts, meta tags, etc).
  
  It receives and should return the following format:
  ```typescript
  interface Htmlparts {
    /** what will be put inside of <head>. Eg. Webpack preload scripts & CSS */
    header: string;
  
    /** The HTML outputted by React, the contents of <div id=app /> */
    body: string;
  
    /** What will be placed at the very end of the page */
    footer: string;
  
    /** The output of Helmet.renderStatic. See https://github.com/nfl/react-helmet#server-usage */
    helmet: Object;
  }
  ```
  *note*: This API is highly prone to changes to unify with Helmet.

- `postRequest(): void`: This method is called after the server is done responding to the client with the generated page.
- `static configureServerApp(app: ExpressInstance): void`: This method is called before the server is started. It enables you to
  add new endpoints to the express instance.

## Plugin system

While Hooks are great for solving needs specific to your project, plugins enable you
to provide generic solutions that are reusable across projects.

Plugins are a layer on top of hook.

### Enabling a plugin

In order to enable a plugin, you need to specify the name of the plugin as a key in the `plugins` object of
your [configuration file](configuration.md#plugins). The value of that entry is the configuration of the plugin.

*Example:*

```json
{
  "plugins": {
    "@reworkjs/redux": {
      "global-stores": "./app/stores"
    }
  }
}
```

The above example will cause the framework to load the `@reworkjs/redux/plugin.js` plugin definition.

### Plugin definition resolution

If the path to the plugin definition points to a folder, the framework will attempt to resolve `plugin.js` in that folder.

Alternatively, you can specify a file directly: `./plugins/my-custom-plugin.js`.

Paths are resolved relative to the configuration file.

### Creating a plugin definition

A typical plugin definition looks like this:

```javascript
'use strict';

const path = require('path');

module.exports = class ReduxPlugin {

  constructor(params) {
    const config = params.pluginConfig;
    const configDir = path.dirname(params.configFile);

    this.globalStoresDir = config['global-stores'] ? path.resolve(configDir, config['global-stores']) : null;
  }

  getHooks() {

    return {
      client: path.resolve(`${__dirname}/../hook-client`),
      server: path.resolve(`${__dirname}/../hook-server`),
    };
  }
}
```

Some key points:

- Your file will not be automatically transpiled by the framework, it must be compatible with your Node version.
- The main/default export of your plugin must be a class

**Methods**:

- `constructor`: Your plugin will be constructed and will be passed the following parameters:
  - `params.configFile`: The location of the configFile in which your plugin was declared
  - `params.pluginConfig`: The configuration of your plugin as specified in `configFile`

- `getHooks`: This method allows your to provide the different hooks the framework 
  will include in the project, the format is the same as the one described in [Hook System](#hook-system).
   
  A notable difference is that the path to the hook file must be absolute.
