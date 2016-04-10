'use strict';

var ExpressServer = require(`ember-cli/lib/tasks/server/express-server`);

module.exports = ExpressServer.extend({
  processAppMiddlewares: function(options) {
    if (this.project.has(this.serverRoot)) {
      var server = this.project.require(this.serverRoot);
      server = server.default || server;

      if (typeof server !== 'function') {
        throw new TypeError('candycane-cli expected the index module to export an express instance');
      }

      if (server.length === 3) {
        // express app is function of form req, res, next
        return this.app.use(server);
      }

      return server(this.app, options);
    }
  },
});
