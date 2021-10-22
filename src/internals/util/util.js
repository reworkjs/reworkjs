import glob from 'glob';

export function asyncGlob(path: string, opts: Object): Promise<string[]> {
  return new Promise((resolve, reject) => {
    return glob(path, opts, (error, files) => {
      if (error) {
        return void reject(error);
      }

      resolve(files);
    });
  });
}
