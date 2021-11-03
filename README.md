# iStar-autolayout
> 🌟 An auto layout algorithm method for iStar models.

## Dependencies
- lodash: ^4.17.0
- d3-force: ^1.1.0

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
Please refer to [examples](https://github.com/FrozenYogurtPuff/iStar-autolayout/tree/main/examples).

### Optional options
```javascript
// All the fields are optional
const options = {
  layout: {
    mode: 'generator' | 'array' | 'first' | 'last',
    tickPerEpoch: 20,
    assureEpoch: 20,
    stopWhenStable: true,
    width: 1920,
    height: 1080
  },
  convert: {
    mode: 'piStar' | 'd3',
    nodeName: {...},
    nodeSize: {...},
    linkName: {...}
  },
  force: {
    forceValue: 50,
    width: 1920,
    height: 1080,
    radius: 50
  }
}
```
### Getting Started
```javascript
import { istarLayout } from 'istar-autolayout'
import model from 'model.json'

const options = null
const generator = istarLayout(model, options)()
let result = generator.next()
while (!result.done) {
  const { currentEpoch, nodes, links } = result.value
  result = generator.next()
}

```
