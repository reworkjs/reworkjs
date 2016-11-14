/**
 * Route Generator
 */
const fs = require('fs');
const exists = require('../utils/exists');

function reducerExists(comp) {
  return exists.fileExists(`app/containers/${comp}/reducer.js`);
}

function sagasExists(comp) {
  return exists.fileExists(`app/containers/${comp}/sagas.js`);
}

function trimTemplateFile(template) {
  // Loads the template file and trims the whitespace and then returns the content as a string.
  return fs.readFileSync(`internals/generators/route/${template}`, 'utf8').replace(/\s*$/, '');
}

module.exports = {
  description: 'Add a route',
  prompts: [{
    type: 'input',
    name: 'component',
    message: 'Which component should the route show?',
    validate: value => {
      if (value.length === 0) {
        return 'The path is required';
      }

      if (!exists.componentExists(value)) {
        return `"${value}" doesn't exist.`;
      }

      return true;
    },
  }, {
    type: 'input',
    name: 'path',
    message: 'Enter the path of the route.',
    default: '/about',
    validate: value => {
      if (!(/\/.+/).test(value)) {
        return 'Invalid format';
      }

      return true;
    },
  }],

  actions: data => {
    if (data.path === '*') {
      data.priority = Number.MIN_SAFE_INTEGER;
    } else if (data.path.indexOf(':')) {
      data.priority = -1;
    }

    data.hasPriority = data.priority != null;
    data.hasSagas = sagasExists(data.component);
    data.hasReducer = reducerExists(data.component);

    return [{
      type: 'add',
      path: '../../app/routes/{{ camelCase component }}.js',
      template: trimTemplateFile('route.hbs'),
      abortOnFail: true,
    }];
  },
};
