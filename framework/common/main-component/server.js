import frameworkConfig from '../../server/framework-config';

const entryPoint = frameworkConfig['entry-react'];

export default require(entryPoint); // eslint-disable-line global-require
