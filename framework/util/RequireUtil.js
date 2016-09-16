import { resolve } from 'path';
import fs from 'fs';

export const rootDirectory = resolve(__dirname, '../..');

/**
 * Require a file in the root directory of the project using the framework.
 *
 * @param fileName - The name of the file to require.
 * @returns The contents of the file.
 */
export function requireProject(fileName: string): any {
  return require(resolveProject(fileName)); // eslint-disable-line global-require
}

/**
 * Resolves a file in the root directory of the project using the framework.
 *
 * @param fileName - The name of the file to resolve.
 * @returns The path of the file.
 */
export function resolveProject(fileName: string): string {
  return resolve(process.cwd(), removeRoot(fileName));
}

/**
 * Returns the contents of a file in the root directory of the project using the framework.
 *
 * @param fileName - The name of the file to resolve.
 * @returns The contents of the file.
 */
export function requireRawProject(fileName: string): string {
  return fs.readFileSync(resolveProject(fileName));
}

/**
 * Resolves a file in the root directory of the framework.
 *
 * @param fileName - The name of the file to resolve.
 * @returns The path of the file.
 */
export function resolveRoot(fileName: string): string {
  return resolve(rootDirectory, removeRoot(fileName));
}

/**
 * Require a file in the root directory of the framework.
 *
 * @param fileName - The name of the file to require.
 * @returns The contents of the file.
 */
export function requireRoot(fileName: string): any {
  return require(resolveRoot(fileName)); // eslint-disable-line global-require
}

/**
 * Returns the contents of a file in the root directory of the framework.
 *
 * @param fileName - The name of the file to resolve.
 * @returns The contents of the file.
 */
export function requireRawRoot(fileName: string): string {
  return fs.readFileSync(resolveRoot(fileName));
}

function removeRoot(fileName) {
  if (fileName[0] === '/') {
    return fileName.substr(1);
  }

  return fileName;
}
