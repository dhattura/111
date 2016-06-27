(function () {
  'use strict';

  angular
    .module('needs')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Needs',
      state: 'needs',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'needs', {
      title: 'List Needs',
      state: 'needs.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'needs', {
      title: 'Create Need',
      state: 'needs.create',
      roles: ['user']
    });
  }
})();
