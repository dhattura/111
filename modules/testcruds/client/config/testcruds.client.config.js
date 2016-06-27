(function () {
  'use strict';

  angular
    .module('testcruds')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Testcruds',
      state: 'testcruds',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'testcruds', {
      title: 'List Testcruds',
      state: 'testcruds.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'testcruds', {
      title: 'Create Testcrud',
      state: 'testcruds.create',
      roles: ['user']
    });
  }
})();
