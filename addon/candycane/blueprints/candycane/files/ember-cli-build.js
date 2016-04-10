const Babel = require('broccoli-babel-transpiler');

module.exports = function(defaults) {
  const babelScript = Babel('app', {
  });

  return babelScript;
};
