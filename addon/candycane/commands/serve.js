'use strict';

var assign      = require('lodash/assign');
var Command     = require('ember-cli/lib/models/command');
var Promise     = require('ember-cli/lib/ext/promise');
var SilentError = require('silent-error');
var PortFinder  = require('portfinder');
var win         = require('ember-cli/lib/utilities/windows-admin');
var EOL         = require('os').EOL;
var ServeTask       = require('../tasks/serve');

PortFinder.basePort = 49152;

var getPort = Promise.denodeify(PortFinder.getPort);
var defaultPort = process.env.PORT || 3000;

module.exports = Command.extend({
  name: 'serve',
  description: 'Builds and serves your app, rebuilding and restarting on file changes.',
  aliases: ['server', 's'],

  availableOptions: [
    { name: 'port',                 type: Number,  default: defaultPort,   aliases: ['p'] },
    { name: 'host',                 type: String,                          aliases: ['H'],     description: 'Listens on all interfaces by default' },
    { name: 'watcher',              type: String,  default: 'events',      aliases: ['w'] },
    { name: 'environment',          type: String,  default: 'development', aliases: ['e', { 'dev': 'development' }, { 'prod': 'production' }] },
    { name: 'output-path',          type: 'Path',  default: 'dist/',       aliases: ['op', 'out'] },
    { name: 'ssl',                  type: Boolean, default: false },
    { name: 'ssl-key',              type: String,  default: 'ssl/server.key' },
    { name: 'ssl-cert',             type: String,  default: 'ssl/server.crt' }
  ],

  run: function(commandOptions) {

    commandOptions.liveReloadHost = commandOptions.liveReloadHost || commandOptions.host;

    return this._checkExpressPort(commandOptions)
      .then(function(commandOptions) {
        commandOptions = assign({}, commandOptions, {
          baseURL: this.project.config(commandOptions.environment).baseURL || '/'
        });

        var serve = new ServeTask({
          ui: this.ui,
          analytics: this.analytics,
          project: this.project
        });

        return win.checkWindowsElevation(this.ui).then(function() {
          return serve.run(commandOptions);
        });
      }.bind(this));
  },

  _checkExpressPort: function(commandOptions) {
    return getPort({ port: commandOptions.port, host: commandOptions.host })
      .then(function(foundPort) {

        if (commandOptions.port !== foundPort && commandOptions.port !== 0) {
          var message = 'Port ' + commandOptions.port + ' is already in use.';
          return Promise.reject(new SilentError(message));
        }

        // otherwise, our found port is good
        commandOptions.port = foundPort;
        return commandOptions;

      }.bind(this));
  },
});

module.exports.overrideCore = true;
