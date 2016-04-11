var cli  = require('ember-cli/lib/cli');
var path = require('path');
var fs   = require('fs');

module.exports = function (options) {
  process.stdout.write = (function(write) {
    return function(string, encoding, fd) {
      if (/version:/.test(string) || /warning:/.test(string)) {
        return;
      }

      write.apply(process.stdout, arguments)
    }
  })(process.stdout.write);

  process.stderr.write = (function(write) {
    return function(string, encoding, fd) {
      write.apply(process.stdout, arguments)
    }
  })(process.stderr.write);

  options.cli = {
    name: 'candycane',
    root: path.join(__dirname, '..', '..'),
    npmPackage: 'candycane-cli'
  };

  return cli(options);
};
