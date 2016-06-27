'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Testcrud = mongoose.model('Testcrud'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, testcrud;

/**
 * Testcrud routes tests
 */
describe('Testcrud CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Testcrud
    user.save(function () {
      testcrud = {
        name: 'Testcrud name'
      };

      done();
    });
  });

  it('should be able to save a Testcrud if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Testcrud
        agent.post('/api/testcruds')
          .send(testcrud)
          .expect(200)
          .end(function (testcrudSaveErr, testcrudSaveRes) {
            // Handle Testcrud save error
            if (testcrudSaveErr) {
              return done(testcrudSaveErr);
            }

            // Get a list of Testcruds
            agent.get('/api/testcruds')
              .end(function (testcrudsGetErr, testcrudsGetRes) {
                // Handle Testcrud save error
                if (testcrudsGetErr) {
                  return done(testcrudsGetErr);
                }

                // Get Testcruds list
                var testcruds = testcrudsGetRes.body;

                // Set assertions
                (testcruds[0].user._id).should.equal(userId);
                (testcruds[0].name).should.match('Testcrud name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Testcrud if not logged in', function (done) {
    agent.post('/api/testcruds')
      .send(testcrud)
      .expect(403)
      .end(function (testcrudSaveErr, testcrudSaveRes) {
        // Call the assertion callback
        done(testcrudSaveErr);
      });
  });

  it('should not be able to save an Testcrud if no name is provided', function (done) {
    // Invalidate name field
    testcrud.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Testcrud
        agent.post('/api/testcruds')
          .send(testcrud)
          .expect(400)
          .end(function (testcrudSaveErr, testcrudSaveRes) {
            // Set message assertion
            (testcrudSaveRes.body.message).should.match('Please fill Testcrud name');

            // Handle Testcrud save error
            done(testcrudSaveErr);
          });
      });
  });

  it('should be able to update an Testcrud if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Testcrud
        agent.post('/api/testcruds')
          .send(testcrud)
          .expect(200)
          .end(function (testcrudSaveErr, testcrudSaveRes) {
            // Handle Testcrud save error
            if (testcrudSaveErr) {
              return done(testcrudSaveErr);
            }

            // Update Testcrud name
            testcrud.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Testcrud
            agent.put('/api/testcruds/' + testcrudSaveRes.body._id)
              .send(testcrud)
              .expect(200)
              .end(function (testcrudUpdateErr, testcrudUpdateRes) {
                // Handle Testcrud update error
                if (testcrudUpdateErr) {
                  return done(testcrudUpdateErr);
                }

                // Set assertions
                (testcrudUpdateRes.body._id).should.equal(testcrudSaveRes.body._id);
                (testcrudUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Testcruds if not signed in', function (done) {
    // Create new Testcrud model instance
    var testcrudObj = new Testcrud(testcrud);

    // Save the testcrud
    testcrudObj.save(function () {
      // Request Testcruds
      request(app).get('/api/testcruds')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Testcrud if not signed in', function (done) {
    // Create new Testcrud model instance
    var testcrudObj = new Testcrud(testcrud);

    // Save the Testcrud
    testcrudObj.save(function () {
      request(app).get('/api/testcruds/' + testcrudObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', testcrud.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Testcrud with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/testcruds/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Testcrud is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Testcrud which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Testcrud
    request(app).get('/api/testcruds/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Testcrud with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Testcrud if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Testcrud
        agent.post('/api/testcruds')
          .send(testcrud)
          .expect(200)
          .end(function (testcrudSaveErr, testcrudSaveRes) {
            // Handle Testcrud save error
            if (testcrudSaveErr) {
              return done(testcrudSaveErr);
            }

            // Delete an existing Testcrud
            agent.delete('/api/testcruds/' + testcrudSaveRes.body._id)
              .send(testcrud)
              .expect(200)
              .end(function (testcrudDeleteErr, testcrudDeleteRes) {
                // Handle testcrud error error
                if (testcrudDeleteErr) {
                  return done(testcrudDeleteErr);
                }

                // Set assertions
                (testcrudDeleteRes.body._id).should.equal(testcrudSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Testcrud if not signed in', function (done) {
    // Set Testcrud user
    testcrud.user = user;

    // Create new Testcrud model instance
    var testcrudObj = new Testcrud(testcrud);

    // Save the Testcrud
    testcrudObj.save(function () {
      // Try deleting Testcrud
      request(app).delete('/api/testcruds/' + testcrudObj._id)
        .expect(403)
        .end(function (testcrudDeleteErr, testcrudDeleteRes) {
          // Set message assertion
          (testcrudDeleteRes.body.message).should.match('User is not authorized');

          // Handle Testcrud error error
          done(testcrudDeleteErr);
        });

    });
  });

  it('should be able to get a single Testcrud that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Testcrud
          agent.post('/api/testcruds')
            .send(testcrud)
            .expect(200)
            .end(function (testcrudSaveErr, testcrudSaveRes) {
              // Handle Testcrud save error
              if (testcrudSaveErr) {
                return done(testcrudSaveErr);
              }

              // Set assertions on new Testcrud
              (testcrudSaveRes.body.name).should.equal(testcrud.name);
              should.exist(testcrudSaveRes.body.user);
              should.equal(testcrudSaveRes.body.user._id, orphanId);

              // force the Testcrud to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Testcrud
                    agent.get('/api/testcruds/' + testcrudSaveRes.body._id)
                      .expect(200)
                      .end(function (testcrudInfoErr, testcrudInfoRes) {
                        // Handle Testcrud error
                        if (testcrudInfoErr) {
                          return done(testcrudInfoErr);
                        }

                        // Set assertions
                        (testcrudInfoRes.body._id).should.equal(testcrudSaveRes.body._id);
                        (testcrudInfoRes.body.name).should.equal(testcrud.name);
                        should.equal(testcrudInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Testcrud.remove().exec(done);
    });
  });
});
