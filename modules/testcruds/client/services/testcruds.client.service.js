//Testcruds service used to communicate Testcruds REST endpoints
(function () {
  'use strict';

  angular
    .module('testcruds')
    .factory('TestcrudsService', TestcrudsService);

  TestcrudsService.$inject = ['$resource'];

  function TestcrudsService($resource) {
    return $resource('api/testcruds/:testcrudId', {
      testcrudId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
