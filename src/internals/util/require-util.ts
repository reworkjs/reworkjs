import fs from 'fs';
import type { IOptions } from 'glob';
import { resolveProject, resolveRoot } from './resolve-util.js';
import { asyncGlob } from './util.js';

/**
 * Returns the contents of a file in the root directory of the project using the framework.
 *
 * @param fileName - The name of the file to resolve.
 * @returns The contents of the file.
 */
export function requireRawProject(fileName: string): string {
  return fs.readFileSync(resolveProject(fileName), 'utf-8');
}

/**
 * Returns the contents of a file in the root directory of the framework.
 *
 * @param fileName - The name of the file to resolve.
 * @returns The contents of the file.
 */
export function requireRawRoot(fileName: string): string {
  return fs.readFileSync(resolveRoot(fileName), 'utf-8');
}

export async function importAll(glob: string, globOptions?: IOptions): Promise<Map<string, any>> {
  const files = await asyncGlob(glob, globOptions);

  const map = new Map<string, any>();

  await Promise.all(files.map(async file => {
    map.set(file, await import(file));
  }));

  return map;
}
