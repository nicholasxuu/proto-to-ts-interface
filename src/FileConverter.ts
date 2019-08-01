import * as fs from 'fs';
import * as path from 'path';
import Converter from './Converter';

export default class FileConverter {
  static run = async () => {
    const protoDir = path.resolve('./protos');
    const outputDir = path.resolve('./outputs');

    const fileList = fs.readdirSync(protoDir);
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
    const protoDir = path.resolve('./tests');
    const outputDir = path.resolve('./outputs');

    const fileList = fs.readdirSync(protoDir);
    console.log(fileList);

    for (let i = 0; i < fileList.length; i++) {
      const filename = fileList[i];
      if (!filename.endsWith('.proto')) {
        continue;
      }

      FileConverter.processProtoFile(protoDir, filename, outputDir);
    }
  };

  static processProtoFile = (
    protoDir: string,
    filename: string,
    outputDir: string,
  ) => {
    const content = fs.readFileSync(`${protoDir}/${filename}`, 'utf8');
    // console.log(content);
    const resultStr = Converter.processProtoContent(content);

    fs.writeFileSync(`${outputDir}/${filename}.ts`, resultStr, 'utf8');
  };
}
