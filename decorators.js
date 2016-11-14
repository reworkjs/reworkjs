/* eslint-disable */

var getDefault = require('./lib/shared/util/ModuleUtil').getDefault;

exports.container = getDefault(require('./lib/framework/common/decorators/container'));

const ProviderNamespace = require('./lib/framework/common/decorators/provider');
exports.provider = ProviderNamespace.provider;
exports.reducer = ProviderNamespace.reducer;
exports.saga = ProviderNamespace.saga;
exports.action = ProviderNamespace.action;
