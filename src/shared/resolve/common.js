
export function removeStartSlash(fileName) {
  if (fileName[0] === '/') {
    return fileName.substr(1);
  }

  return fileName;
}
