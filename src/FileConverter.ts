import * as fs from 'fs';
import * as fse from 'fs-extra';
import * as path from 'path';
import Converter from './Converter';
import { walkDir } from './FsHelper';

export default class FileConverter {
  static run = async (dir = './protos') => {
    const protoDir = path.resolve(dir);
    const outputDir = path.resolve('./outputs');

    fse.ensureDirSync(outputDir);
    fse.emptyDirSync(outputDir);

    const fileList = walkDir(protoDir).map(filePath =>
      filePath.substring(protoDir.length + 1),
    );
    console.log(fileList);

    for (let i = 0; i < fileList.length; i++) {
      const filename = fileList[i];
      if (!filename.endsWith('.proto')) {
        continue;
      }

      FileConverter.processProtoFile(protoDir, filename, outputDir);
    }
  };

  static test = async () => {
    FileConverter.run('./tests');
  };

  static processProtoFile = (
    protoDir: string,
    filename: string,
    outputDir: string,
  ) => {
    const content = fs.readFileSync(`${protoDir}/${filename}`, 'utf8');
    // console.log(content);
    const resultStr = Converter.processProtoContent(content);

    fse.ensureFileSync(`${outputDir}/${filename}.ts`);
    fs.writeFileSync(`${outputDir}/${filename}.ts`, resultStr, 'utf8');
  };
}
