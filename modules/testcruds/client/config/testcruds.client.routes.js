(function () {
  'use strict';

  angular
    .module('testcruds')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('testcruds', {
        abstract: true,
        url: '/testcruds',
        template: '<ui-view/>'
      })
      .state('testcruds.list', {
        url: '',
        templateUrl: 'modules/testcruds/client/views/list-testcruds.client.view.html',
        controller: 'TestcrudsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Testcruds List'
        }
      })
      .state('testcruds.create', {
        url: '/create',
        templateUrl: 'modules/testcruds/client/views/form-testcrud.client.view.html',
        controller: 'TestcrudsController',
        controllerAs: 'vm',
        resolve: {
          testcrudResolve: newTestcrud
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Testcruds Create'
        }
      })
      .state('testcruds.edit', {
        url: '/:testcrudId/edit',
        templateUrl: 'modules/testcruds/client/views/form-testcrud.client.view.html',
        controller: 'TestcrudsController',
        controllerAs: 'vm',
        resolve: {
          testcrudResolve: getTestcrud
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Testcrud {{ testcrudResolve.name }}'
        }
      })
      .state('testcruds.view', {
        url: '/:testcrudId',
        templateUrl: 'modules/testcruds/client/views/view-testcrud.client.view.html',
        controller: 'TestcrudsController',
        controllerAs: 'vm',
        resolve: {
          testcrudResolve: getTestcrud
        },
        data:{
          pageTitle: 'Testcrud {{ articleResolve.name }}'
        }
      });
  }

  getTestcrud.$inject = ['$stateParams', 'TestcrudsService'];

  function getTestcrud($stateParams, TestcrudsService) {
    return TestcrudsService.get({
      testcrudId: $stateParams.testcrudId
    }).$promise;
  }

  newTestcrud.$inject = ['TestcrudsService'];

  function newTestcrud(TestcrudsService) {
    return new TestcrudsService();
  }
})();
