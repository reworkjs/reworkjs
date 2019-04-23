// @flow

import { resolve } from 'path';

function removeStartSlash(fileName) {
  if (fileName[0] === '/') {
    return fileName.substr(1);
  }

  return fileName;
}

export const rootDirectory = resolve(__dirname, '../../..');

/**
 * Resolves a file in the root directory of the project using the framework.
 *
 * @param fileName - The name of the file to resolve.
 * @returns The path of the file.
 */
export function resolveProject(fileName: string): string {
  return resolve(process.cwd(), removeStartSlash(fileName));
}

/**
 * Resolves a file in the root directory of the framework.
 *
 * @param fileName - The name of the file to resolve.
 * @returns The path of the file.
 */
export function resolveRoot(fileName: string = ''): string {
  return resolve(rootDirectory, removeStartSlash(fileName));
}

/**
 * Resolves a file in the root directory of source of the framework (.build or framework).
 *
 * @param fileName - The name of the file to resolve.
 * @param opts - Option bag
 * @param opts.esModules - Use ES Modules version of the project
 * @returns The path of the file.
 */
export function resolveFrameworkSource(fileName: string, opts: { esModules: boolean }): string {
  return resolve(rootDirectory, opts.esModules ? 'es' : 'lib', 'framework', removeStartSlash(fileName));
}
