/**
 * componentExists
 *
 * Check whether the given component exist in either the components or containers directory
 */

const fs = require('fs');
const pageComponents = fs.readdirSync('app/components');
const pageContainers = fs.readdirSync('app/containers');
const components = pageComponents.concat(pageContainers);

module.exports = {
  componentExists(comp) {
    return components.indexOf(comp) >= 0;
  },
};
