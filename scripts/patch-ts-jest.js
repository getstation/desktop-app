/* eslint-disable global-require, no-param-reassign */
const ts = require('typescript');

// Compatibility shim for ts-jest 26 with TypeScript 5+
if (typeof ts.getMutableClone !== 'function') {
  ts.getMutableClone = (node) => ts.factory.cloneNode(node);
}

if (typeof ts.createNodeArray !== 'function') {
  ts.createNodeArray = (elements, hasTrailingComma) => ts.factory.createNodeArray(elements, hasTrailingComma);
}
