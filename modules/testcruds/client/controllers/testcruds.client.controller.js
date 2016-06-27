(function () {
  'use strict';

  // Testcruds controller
  angular
    .module('testcruds')
    .controller('TestcrudsController', TestcrudsController);

  TestcrudsController.$inject = ['$scope', '$state', 'Authentication', 'testcrudResolve'];

  function TestcrudsController ($scope, $state, Authentication, testcrud) {
    var vm = this;

    vm.authentication = Authentication;
    vm.testcrud = testcrud;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Testcrud
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.testcrud.$remove($state.go('testcruds.list'));
      }
    }

    // Save Testcrud
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.testcrudForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.testcrud._id) {
        vm.testcrud.$update(successCallback, errorCallback);
      } else {
        vm.testcrud.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('testcruds.view', {
          testcrudId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
