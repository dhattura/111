'use strict';

/**
 * Module dependencies
 */
var testcrudsPolicy = require('../policies/testcruds.server.policy'),
  testcruds = require('../controllers/testcruds.server.controller');

module.exports = function(app) {
  // Testcruds Routes
  app.route('/api/testcruds').all(testcrudsPolicy.isAllowed)
    .get(testcruds.list)
    .post(testcruds.create);

  app.route('/api/testcruds/:testcrudId').all(testcrudsPolicy.isAllowed)
    .get(testcruds.read)
    .put(testcruds.update)
    .delete(testcruds.delete);

  // Finish by binding the Testcrud middleware
  app.param('testcrudId', testcruds.testcrudByID);
};
