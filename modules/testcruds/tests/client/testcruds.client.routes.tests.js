(function () {
  'use strict';

  describe('Testcruds Route Tests', function () {
    // Initialize global variables
    var $scope,
      TestcrudsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TestcrudsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TestcrudsService = _TestcrudsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('testcruds');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/testcruds');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          TestcrudsController,
          mockTestcrud;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('testcruds.view');
          $templateCache.put('modules/testcruds/client/views/view-testcrud.client.view.html', '');

          // create mock Testcrud
          mockTestcrud = new TestcrudsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Testcrud Name'
          });

          //Initialize Controller
          TestcrudsController = $controller('TestcrudsController as vm', {
            $scope: $scope,
            testcrudResolve: mockTestcrud
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:testcrudId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.testcrudResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            testcrudId: 1
          })).toEqual('/testcruds/1');
        }));

        it('should attach an Testcrud to the controller scope', function () {
          expect($scope.vm.testcrud._id).toBe(mockTestcrud._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/testcruds/client/views/view-testcrud.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TestcrudsController,
          mockTestcrud;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('testcruds.create');
          $templateCache.put('modules/testcruds/client/views/form-testcrud.client.view.html', '');

          // create mock Testcrud
          mockTestcrud = new TestcrudsService();

          //Initialize Controller
          TestcrudsController = $controller('TestcrudsController as vm', {
            $scope: $scope,
            testcrudResolve: mockTestcrud
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.testcrudResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/testcruds/create');
        }));

        it('should attach an Testcrud to the controller scope', function () {
          expect($scope.vm.testcrud._id).toBe(mockTestcrud._id);
          expect($scope.vm.testcrud._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/testcruds/client/views/form-testcrud.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TestcrudsController,
          mockTestcrud;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('testcruds.edit');
          $templateCache.put('modules/testcruds/client/views/form-testcrud.client.view.html', '');

          // create mock Testcrud
          mockTestcrud = new TestcrudsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Testcrud Name'
          });

          //Initialize Controller
          TestcrudsController = $controller('TestcrudsController as vm', {
            $scope: $scope,
            testcrudResolve: mockTestcrud
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:testcrudId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.testcrudResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            testcrudId: 1
          })).toEqual('/testcruds/1/edit');
        }));

        it('should attach an Testcrud to the controller scope', function () {
          expect($scope.vm.testcrud._id).toBe(mockTestcrud._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/testcruds/client/views/form-testcrud.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
