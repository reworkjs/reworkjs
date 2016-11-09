import fs from 'fs';
import { resolveProject, resolveRoot, resolveFramework } from '../../shared/resolve';

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
 * Returns the contents of a file in the root directory of the project using the framework.
 *
 * @param fileName - The name of the file to resolve.
 * @returns The contents of the file.
 */
export function requireRawProject(fileName: string): string {
  return fs.readFileSync(resolveProject(fileName));
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

/**
 * Resolves a file in the root directory of source of the framework (.build or framework).
 *
 * @param fileName - The name of the file to resolve.
 * @returns The path of the file.
 */
export function requireFramework(fileName: string): any {
  return require(resolveFramework(fileName)); // eslint-disable-line global-require
}
