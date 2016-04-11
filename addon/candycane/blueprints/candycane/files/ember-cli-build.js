const Babel = require('broccoli-babel-transpiler');
const Merge = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');

const babelSettings = {
  "presets": ["es2015-node5", "stage-0"],
  "plugins": ["transform-decorators-legacy"]
};

module.exports = function(defaults) {
  const app = new Babel('app', babelSettings);

  return new Merge([app]);
};
