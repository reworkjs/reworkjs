#!/usr/bin/env node

// eslint-disable-next-line
const fs = require('fs');

// eslint-disable-next-line
const path = require('path');

const PROJECT_ROOT = path.resolve(`${__dirname}/..`);
const GITIGNORE_FILE = `${PROJECT_ROOT}/.gitignore`;

const exportables = fs.readdirSync(`${PROJECT_ROOT}/src/exportables`);
let gitignore = fs.readFileSync(GITIGNORE_FILE).toString();

for (const exportable of exportables) {
  const moduleName = path.parse(exportable).name;

  addToGitIgnore(moduleName);

  if (fs.existsSync(`${PROJECT_ROOT}/${moduleName}/package.json`)) {
    continue;
  }

  fs.mkdirSync(`${PROJECT_ROOT}/${moduleName}`);
  fs.writeFileSync(`${PROJECT_ROOT}/${moduleName}/package.json`, generatePackageJson(exportable));
}

fs.writeFileSync(GITIGNORE_FILE, gitignore);

function generatePackageJson(exportable) {
  return JSON.stringify({
    private: true,
    main: `../lib/exportables/${exportable}`,
    module: `../es/exportables/${exportable}`,
    'es:next': `../es/exportables/${exportable}`,
  });
}

function addToGitIgnore(moduleName) {

  const ignoreDirective = `/${moduleName}`;

  if (gitignore.includes(ignoreDirective)) {
    return;
  }

  const HEADING = '# Auto-generated importable sub-modules\n';

  let index = gitignore.indexOf(HEADING);
  if (index === -1) {
    index = gitignore.length + 1;
    gitignore += `\n${HEADING}`;
  }

  index += HEADING.length;

  gitignore = insertString(gitignore, `${ignoreDirective}\n`, index);
}

function insertString(strA, strB, position) {
  return strA.slice(0, position) + strB + strA.slice(position);
}
