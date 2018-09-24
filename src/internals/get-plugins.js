// @flow

import frameworkConfig from '../shared/framework-config';

type PluginHooks = {
  client: string,
  server: string,
};

type FrameworkPlugin = {
  getInstallableDependencies: ?() => { [string]: string },
  getHooks: ?(() => PluginHooks),
};

/**
 * Loads and returns ReworkJS plugin instances (eg. @reworkjs/redux)
 */
export default function getPlugins(): FrameworkPlugin[] {
  const pluginConfigs = frameworkConfig.plugins;

  if (!pluginConfigs) {
    return [];
  }

  const plugins = [];
  for (const pluginConfig of pluginConfigs) {
    const pluginUri = typeof pluginConfig === 'string' ? pluginConfig : pluginConfig.plugin;
    const config = typeof pluginConfig === 'string' ? null : pluginConfig.config;

    // $FlowIgnore
    const Plugin = require(pluginUri);
    const pluginInstance = new Plugin(config);

    plugins.push(pluginInstance);
  }

  return plugins;
}

export function getHooks(side: string): string[] {

  const hooks = [];

  for (const plugin of getPlugins()) {
    if (!plugin.getHooks) {
      continue;
    }

    const pluginHooks = plugin.getHooks();
    if (pluginHooks[side]) {
      hooks.push(pluginHooks[side]);
    }
  }

  return hooks;
}
