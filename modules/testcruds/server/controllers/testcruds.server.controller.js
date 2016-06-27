'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Testcrud = mongoose.model('Testcrud'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Testcrud
 */
exports.create = function(req, res) {
  var testcrud = new Testcrud(req.body);
  testcrud.user = req.user;

  testcrud.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(testcrud);
    }
  });
};

/**
 * Show the current Testcrud
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var testcrud = req.testcrud ? req.testcrud.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  testcrud.isCurrentUserOwner = req.user && testcrud.user && testcrud.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(testcrud);
};

/**
 * Update a Testcrud
 */
exports.update = function(req, res) {
  var testcrud = req.testcrud ;

  testcrud = _.extend(testcrud , req.body);

  testcrud.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(testcrud);
    }
  });
};

/**
 * Delete an Testcrud
 */
exports.delete = function(req, res) {
  var testcrud = req.testcrud ;

  testcrud.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(testcrud);
    }
  });
};

/**
 * List of Testcruds
 */
exports.list = function(req, res) { 
  Testcrud.find().sort('-created').populate('user', 'displayName').exec(function(err, testcruds) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(testcruds);
    }
  });
};

/**
 * Testcrud middleware
 */
exports.testcrudByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Testcrud is invalid'
    });
  }

  Testcrud.findById(id).populate('user', 'displayName').exec(function (err, testcrud) {
    if (err) {
      return next(err);
    } else if (!testcrud) {
      return res.status(404).send({
        message: 'No Testcrud with that identifier has been found'
      });
    }
    req.testcrud = testcrud;
    next();
  });
};
