import path from 'path';
import frameworkConfig from '@reworkjs/core/_internal_/framework-config';

type PluginHooks = {
  client: string,
  server: string,
};

type FrameworkPlugin = {
  getInstallableDependencies?(): { [key: string]: string },
  getHooks?(): PluginHooks,
};

export function getPluginInstance(PluginClass: Function): FrameworkPlugin | null {
  getPlugins();

  return PluginClass.instance || null;
}

/**
 * Loads and returns ReworkJS plugin instances (eg. @reworkjs/redux)
 */
export function getPlugins(): FrameworkPlugin[] {
  const pluginConfigs = frameworkConfig.plugins;

  if (!pluginConfigs) {
    return [];
  }

  const plugins = [];
  for (const [pluginModule, pluginConfig] of Object.entries(pluginConfigs)) {

    let Plugin;
    try {
      // FIXME
      Plugin = require(`${pluginModule}/plugin`);
    } catch (e) {
      console.error(`Could not find reworkjs plugin ${pluginModule}. Make sure the package is installed and module ${pluginModule}/plugin exists.`);
      throw e;
    }

    if (Plugin.default) {
      Plugin = Plugin.default;
    }

    if (Plugin.instance && !(Plugin.instance instanceof Plugin)) {
      throw new Error(`${pluginModule}/plugin: instance static property is reserved to reworkjs.`);
    }

    const pluginInstance = Plugin.instance || new Plugin({ pluginConfig, configFile: frameworkConfig.filePath });
    Plugin.instance = pluginInstance;

    plugins.push(pluginInstance);
  }

  return plugins;
}

export const HOOK_SIDES = Object.freeze({
  client: 'client',
  server: 'server',
});

export function getHooks(side: string): string[] {

  const hooks = [];

  const adHocHooks = frameworkConfig.hooks;
  if (adHocHooks[side]) {
    hooks.push(path.resolve(path.dirname(frameworkConfig.filePath), adHocHooks[side]));
  }

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
