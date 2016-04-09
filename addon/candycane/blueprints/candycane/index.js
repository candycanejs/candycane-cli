var stringUtils = require('ember-cli-string-utils');

module.exports = {
  description: '',

  locals: function(options) {
     // Return custom template variables here.
     return {
       packageName: stringUtils.dasherize(options.entity.name)
     };
  }
};
