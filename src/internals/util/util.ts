import type { IOptions } from 'glob';
import glob from 'glob';

export async function asyncGlob(path: string, opts: IOptions = {}): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    glob(path, opts, (error, files) => {
      if (error) {
        return void reject(error);
      }

      resolve(files);
    });
  });
}
