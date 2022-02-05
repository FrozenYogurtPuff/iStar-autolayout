# iStar-autolayout
[![npm version](https://badge.fury.io/js/istar-autolayout.svg)](https://badge.fury.io/js/istar-autolayout)
> 🌟 An auto layout algorithm method for iStar models.

## Dependencies
- `lodash: ^4.17.0`
- `d3-force: ^1.1.0`

## Install
### via npm
```bash
$ npm -i istar-autolayout
```
### via Git
```bash
$ git clone https://github.com/FrozenYogurtPuff/iStar-autolayout.git
```

## Usage
### Getting Started
#### JavaScript
1. Include the script via `<script src="dist/main.js"></script>`
2. `istarLayout(jsonData, options)` is exposed as a global function which can be easily used

```javascript
const options = null;
const generator = istarLayout(jsonData, options)();
let result = generator.next();
while (!result.done) {
  const { currentEpoch, nodes, links } = result.value;
  result = generator.next();
}

```
Please refer to [examples/javascript](https://github.com/FrozenYogurtPuff/iStar-autolayout/tree/main/examples/javascript) for more.

#### TypeScript
1. Include the script via `import { istarLayout } from 'src/index' `
2. Use `istarLayout` with typed and re-bundle all the files on demand.

Please refer to [examples/typescript](https://github.com/FrozenYogurtPuff/iStar-autolayout/tree/main/examples/typescript) for more.

### Function Declaration
```typescript
declare export function istarLayout(
  data: DataFormat,
  options: Options,
): ResultSingle | ResultArray | (() => ResultGenerator)
```

### Options Definition
```typescript
// All fields are optional, default to the first option
interface LayoutOptions {
  mode?: 'generator' | 'array' | 'first' | 'last';
  tickPerEpoch?: number;
  assureEpoch?: number;
  stopWhenStable?: boolean;
  width?: number;
  height?: number;
}

interface ConvertOptions {
  mode?: 'piStar' | 'd3';
  nodeName?: { [name: string]: string };
  nodeSize?: { [name: string]: [number, number] };
  linkName?: { [name: string]: string };
  width?: number;
  height?: number;
}

interface ForceOptions {
  forceValue?: number;
  width?: number;
  height?: number;
  // radius?: number;
}

export interface Options {
  layout?: LayoutOptions;
  convert?: ConvertOptions;
  force?: ForceOptions;
}

const defaultOptions: Options = {
  layout: {
    mode: 'generator',
    tickPerEpoch: 50,
    assureEpoch: 20,
    stopWhenStable: true,
    width: 1920,
    height: 1080
  },
  convert: {
    mode: 'piStar',
    nodeName: {...},
    nodeSize: {...},
    linkName: {...}
  },
  force: {
    forceValue: 50,
    width: 1920,
    height: 1080
  }
}
```

## License
ISC License
