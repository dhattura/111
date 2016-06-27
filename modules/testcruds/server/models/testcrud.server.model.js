'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Testcrud Schema
 */
var TestcrudSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Testcrud name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Testcrud', TestcrudSchema);
