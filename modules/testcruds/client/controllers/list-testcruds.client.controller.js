(function () {
  'use strict';

  angular
    .module('testcruds')
    .controller('TestcrudsListController', TestcrudsListController);

  TestcrudsListController.$inject = ['TestcrudsService'];

  function TestcrudsListController(TestcrudsService) {
    var vm = this;

    vm.testcruds = TestcrudsService.query();
  }
})();
