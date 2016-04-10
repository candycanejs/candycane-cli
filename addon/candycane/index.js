/* jshint node: true */
'use strict';

module.exports = {
  name: 'candycane',

  includedCommands: function() {
    return {
      'new'       : require('./commands/new'),
      'init'      : require('./commands/init'),
      'serve'      : require('./commands/serve'),
    };
  }
};
