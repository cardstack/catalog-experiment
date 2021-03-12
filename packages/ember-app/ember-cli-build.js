'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { compatBuild } = require('@embroider/compat');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    // Add options here
  });

  process.env.STAGE2_ONLY = true;
  return compatBuild(app, null, {
    staticComponents: true,
    staticHelpers: true,
    staticAddonTrees: true,
    staticAddonTestSupportTrees: true,
  });
};
