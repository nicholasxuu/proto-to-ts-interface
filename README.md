# proto-to-ts-interface

A simple tool to convert GRPC proto file to Typescript interface file

## Installation

`yarn`

## Command line solution

1. copy your proto files into protos directory.
2. `npm start`
3. check results in outputs directory.

## lib solution

```
import Converter from 'proto-to-ts-interface';

...

const fileContentStr = '';
const tsInterfaceFileStr = Converter.processProtoContent(fileContentStr;

...

```

## Tests

1. test proto files in tests directory.
2. `npm run test`
3. check results in outputs directory.
