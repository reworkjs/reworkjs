import frameworkConfig from '../config/framework-config';
import WebpackBase from './WebpackBase';

const WebpackConfig = frameworkConfig.webpack ? require(frameworkConfig.webpack) : WebpackBase;

const webpackConfig = (new WebpackConfig(WebpackBase.SIDE_SERVER)).buildConfig();

export default webpackConfig;
