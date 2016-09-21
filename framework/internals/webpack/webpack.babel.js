import frameworkConfig from '../../server/framework-config';
import WebpackBase from './WebpackBase';

const WebpackConfig = frameworkConfig.webpack ? require(frameworkConfig.webpack) : WebpackBase;

const webpackConfig = (new WebpackConfig()).buildConfig();

// console.log(webpackConfig);

export default webpackConfig;
