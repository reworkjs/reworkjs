import mzFs from 'mz/fs';

export async function readJson(fileName) {
  JSON.parse(await mzFs.readFile(fileName));
}
