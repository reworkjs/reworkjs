import fs from 'fs';
import { resolveProject, resolveRoot } from './resolve-util';

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
 * Returns the contents of a file in the root directory of the framework.
 *
 * @param fileName - The name of the file to resolve.
 * @returns The contents of the file.
 */
export function requireRawRoot(fileName: string): string {
  return fs.readFileSync(resolveRoot(fileName));
}
