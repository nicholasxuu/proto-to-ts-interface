import TreeHelper from './TreeHelper';

const PROTO_STATE = {
  NULL: 0,
  MESSAGE: 1,
  ENUM: 2,
};

const tab = '   ';

export default class Converter {
  static stringifyEnumsTs = (enums: { [name: string]: string[] }) => {
    return Object.keys(enums)
      .map(name => {
        const inside = enums[name].map(line => `${tab}${line}`).join('\n');
        return `export enum ${name} {\n${inside}\n}`;
      })
      .join('\n\n');
  };
  static stringifyMessagesTs = (messages: { [name: string]: string[] }) => {
    return Object.keys(messages)
      .map(name => {
        const inside = messages[name].map(line => `${tab}${line}`).join('\n');
        return `export interface ${name} {\n${inside}\n}`;
      })
      .join('\n\n');
  };

  static processProtoContent = (str: string): string => {
    const lines = str.split('\n');

    let state = PROTO_STATE.NULL;

    const messageResult = {};
    const enumResult = {};

    const nestedNames = [];
    const imports = [];
    const messages = [];
    const enums = [];
    let messageTree = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // console.log(line);

      let match;
      if ((match = line.match(/^\s*$/))) {
        continue;
      }

      if ((match = line.match(/^\s*import\s+"(.*)\.proto"/))) {
        imports.push(match[1]);
        continue;
      }

      if ((match = line.match(/^\s*message\s+(\w+)\s*\{\s*\}/))) {
        nestedNames.push(match[1]);
        // console.log(line, nestedNames);
        messages.push(nestedNames.join(''));
        messageTree = TreeHelper.addToTree(messageTree, nestedNames, {});
        nestedNames.pop();
        continue;
      }

      if ((match = line.match(/^\s*message\s+(\w+)\s*\{/))) {
        state = PROTO_STATE.MESSAGE;
        nestedNames.push(match[1]);
        // console.log(line, nestedNames);
        messages.push(nestedNames.join(''));
        messageTree = TreeHelper.addToTree(messageTree, nestedNames, {});
        continue;
      }
      if ((match = line.match(/^\s*enum\s+(\w+)\s*\{/))) {
        state = PROTO_STATE.ENUM;
        nestedNames.push(match[1]);
        // console.log(line, nestedNames);
        enums.push(nestedNames.join(''));
        messageTree = TreeHelper.addToTree(messageTree, nestedNames, 'enum');
        continue;
      }
      if (line.match(/^\s*\}/)) {
        // console.log(line, nestedNames);
        nestedNames.pop();
        if (nestedNames.length === 0) {
          state = PROTO_STATE.NULL;
        } else {
          state = PROTO_STATE.MESSAGE;
        }
        continue;
      }

      if (state === PROTO_STATE.MESSAGE) {
        // console.log(line, nestedNames);
        const currentName = nestedNames.join('');
        if (!messageResult[currentName]) {
          messageResult[currentName] = [];
        }

        // todo: only support single level of parent right now
        if (
          (match = line.match(
            /^\s*(repeated\s+)?((\w+)\.)?(\w+)\s+([\w_]+)\s*\=\s*(\d+)/,
          ))
        ) {
          const isArray = !!match[1];
          const hasParentType = !!match[2];
          const parentTypeName = match[3] || '';
          const typeName = match[4];
          const name = match[5];

          let tsType = '';
          if (hasParentType) {
            tsType = `${parentTypeName}${typeName}`;
          } else {
            switch (typeName) {
              case 'double':
              case 'float':
              case 'int32':
              case 'uint32':
              case 'sint32':
              case 'fixed32':
              case 'sfixed32':
                tsType = 'number';
                break;
              case 'int64':
              case 'uint64':
              case 'sint64':
              case 'fixed64':
              case 'sfixed64':
              case 'string':
              case 'bytes':
                tsType = 'string';
                break;
              case 'bool':
                tsType = 'boolean';
                break;
              default: {
                if (
                  TreeHelper.isTreeBranch(messageTree, [
                    ...nestedNames,
                    typeName,
                  ])
                ) {
                  tsType = `${nestedNames.join('')}${typeName}`;
                } else {
                  tsType = typeName;
                }
              }
            }
          }

          const resultLine = `${name}: ${tsType}${isArray ? '[]' : ''};`;
          messageResult[currentName].push(resultLine);
        }
        continue;
      }

      if (state === PROTO_STATE.ENUM) {
        // console.log(line, nestedNames);
        const currentName = nestedNames.join('');
        if (!enumResult[currentName]) {
          enumResult[currentName] = [];
        }

        if ((match = line.match(/^\s*([\w_]+)\s*\=\s*(\d+)/))) {
          const name = match[1];

          const resultLine = `${name} = '${name}',`;
          enumResult[currentName].push(resultLine);
        }

        continue;
      }
    }

    // console.log(result);
    return `${Converter.stringifyEnumsTs(
      enumResult,
    )}\n\n${Converter.stringifyMessagesTs(messageResult)}`;
  };
}
