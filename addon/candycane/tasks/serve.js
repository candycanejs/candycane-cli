'use strict';

var existsSync       = require('exists-sync');
var path             = require('path');
var ExpressServer    = require('./express-server');
var Promise          = require('ember-cli/lib/ext/promise');
var Task             = require('ember-cli/lib/models/task');
var Watcher          = require('ember-cli/lib/models/watcher');
var Builder          = require('ember-cli/lib/models/builder');
var ServerWatcher    = require('ember-cli/lib/models/server-watcher');

module.exports = Task.extend({
  run: function(options) {
    var builder = new Builder({
      ui: this.ui,
      outputPath: options.outputPath,
      project: this.project,
      environment: options.environment
    });

    var watcher = new Watcher({
      ui: this.ui,
      builder: builder,
      analytics: this.analytics,
      options: options
    });

    var serverRoot = './dist';
    var serverWatcher = null;
    if (existsSync(serverRoot)) {
      serverWatcher = new ServerWatcher({
        ui: this.ui,
        analytics: this.analytics,
        watchedDir: path.resolve(serverRoot)
      });
    }

    var expressServer = new ExpressServer({
      ui: this.ui,
      project: this.project,
      watcher: watcher,
      serverRoot: serverRoot,
      serverWatcher: serverWatcher
    });

    return Promise.all([
      expressServer.start(options)
    ]).then(function() {
      return new Promise(function() {
        // hang until the user exits.
      });
    });
  }
});

module.exports.overrideCore = true;
