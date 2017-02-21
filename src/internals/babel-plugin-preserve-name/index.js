// @flow
import pathLib from 'path';
import { at } from 'lodash';
import frameworkMetadata from '../../shared/framework-metadata';

export default function preserveName({ types }: { types: Object }) {

  return {
    visitor: {
      CallExpression(path: Object) {
        const callee = path.node.callee;

        if (callee.name !== 'provider') {
          return;
        }

        const relativeProviderImportPath = at(path, 'scope.bindings.provider.path.parent.source.value')[0];
        if (!relativeProviderImportPath) {
          return;
        }

        const importerFile = path.hub.file.opts.filename;
        const absoluteProviderImportFile = pathLib.resolve(importerFile, relativeProviderImportPath);
        if (absoluteProviderImportFile.indexOf(`node_modules/${frameworkMetadata.name}`) === -1) {
          return;
        }

        const name = getClassName(path.node.arguments[0]);
        if (name == null) {
          return;
        }

        path.node.arguments.push(types.stringLiteral(name));
      },
    },
  };
}

function getClassName(arg) {
  if (!arg) {
    return null;
  }

  if (arg.type === 'AssignmentExpression') {
    return getClassName(arg.right);
  }

  if (arg.type === 'ClassExpression') {
    return arg.id.name;
  }

  return null;
}
