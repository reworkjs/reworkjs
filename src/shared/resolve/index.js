import { resolve } from 'path';
import { removeStartSlash } from './common';

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
 * @returns The path of the file.
 */
export function resolveFramework(fileName: string): string {
  return resolve(rootDirectory, 'lib/framework', removeStartSlash(fileName));
}
