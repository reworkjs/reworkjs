import fs from 'fs';
import path from 'path';
import config from '@reworkjs/core/_internal_/framework-config';
import logger from '@reworkjs/core/logger';
import uniq from 'lodash/uniq.js';
import webpack from 'webpack';
import BaseFeature from '../BaseFeature.js';
import type WebpackConfigBuilder from '../WebpackConfigBuilder.js';

export default class ReactIntlFeature extends BaseFeature {

  getFeatureName() {
    return 'react-intl';
  }

  getDescription() {
    return 'Removes locales of unsupported languages.';
  }

  isDefaultEnabled() {
    return true;
  }

  visit(webpackConfig: WebpackConfigBuilder) {
    const supportedLocales = uniq(fs.readdirSync(config.directories.translations)
      .filter(file => !file.startsWith('_'))
      .map(fileName => {
        const locale = removeExtension(fileName);

        return extractLanguage(locale);
      }))
      .filter(language => /^[a-z]+$/i.test(language));

    logger.debug(`Removing react-intl locales unsupported by app language: ${supportedLocales.join(', ')}`);

    const ignoreRegex = new RegExp(`\\.\\/(?!${supportedLocales.join('|')})[a-z0-9-_]+\\.js`, 'i');

    // webpackConfig.injectPlugins(new webpack.IgnorePlugin(ignoreRegex, /react-intl\/locale-data$/));
    // webpackConfig.injectPlugins(new webpack.IgnorePlugin(ignoreRegex, /intl\/locale-data\/jsonp$/));
    webpackConfig.injectPlugins(new webpack.IgnorePlugin({ resourceRegExp: ignoreRegex, contextRegExp: /@formatjs\/intl-relativetimeformat\/locale-data$/ }));
    webpackConfig.injectPlugins(new webpack.IgnorePlugin({ resourceRegExp: ignoreRegex, contextRegExp: /@formatjs\/intl-numberformat\/locale-data$/ }));
    webpackConfig.injectPlugins(new webpack.IgnorePlugin({ resourceRegExp: ignoreRegex, contextRegExp: /@formatjs\/intl-listformat\/locale-data$/ }));
    webpackConfig.injectPlugins(new webpack.IgnorePlugin({ resourceRegExp: ignoreRegex, contextRegExp: /@formatjs\/intl-pluralrules\/locale-data$/ }));
  }
}

function removeExtension(fileName: string): string {
  const ext = path.extname(fileName);

  return fileName.substring(0, fileName.length - ext.length);
}

function extractLanguage(locale: string): string {
  const parts = locale.split(/[_-]/);

  return parts[0];
}
