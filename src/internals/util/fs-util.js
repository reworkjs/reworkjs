import mzFs from 'mz/fs';

export async function readJson(fileName) {
  return JSON.parse(await mzFs.readFile(fileName));
}
