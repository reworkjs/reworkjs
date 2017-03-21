// import fs from 'fs';
// import path from 'path';
// import chalk from 'chalk';
// import config from '../../../shared/framework-config';
// import { info } from '../stdio';
// import { resolveProject } from '../../../shared/resolve';
//
// export default async function publicise([libName]) {
//   if (!libName) {
//     throw new Error('Missing arg <libName>');
//   }
//
//   const projectNodeModule = resolveProject('node_modules');
//   const publicFolder = config.directories.resources;
//
//   const source = path.join(projectNodeModule, libName);
//   const destination = path.join(publicFolder, libName);
//
//   if (existsSync(destination)) {
//     throw new Error(`${JSON.stringify(destination)} already exists.`);
//   }
//
//   if (!existsSync(source)) {
//     throw new Error(`${JSON.stringify(source)} does not exist.`);
//   }
//
//   fs.symlinkSync(source, destination, 'dir');
//   info(`Created symlink ${chalk.magenta(JSON.stringify(destination))} => ${chalk.magenta(JSON.stringify(source))}`);
// }
//
// function existsSync(file) {
//   try {
//     fs.lstatSync(file);
//     return true;
//   } catch (e) {
//     return false;
//   }
// }
//
// export const usage = `rjs publicise <libName>`;
