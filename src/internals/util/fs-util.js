import fs from 'fs';

export function existsAsync(path) {

  return new Promise(resolve => {
    fs.access(path, fs.F_OK, err => {
      resolve(err == null);
    });
  });
}
