import * as fs from 'fs';
import * as path from 'path';

// ref: https://medium.com/@allenhwkim/nodejs-walk-directory-f30a2d8f038f
export const walkDir = (dir: string): string[] => {
  let result = [];
  fs.readdirSync(dir).forEach(filename => {
    const dirPath = path.join(dir, filename);
    const isDirectory = fs.statSync(dirPath).isDirectory();

    if (isDirectory) {
      result = result.concat(walkDir(dirPath));
    } else {
      result.push(path.join(dir, filename));
    }
  });
  return result;
};
