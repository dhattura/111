'use strict';

describe('Testcruds E2E Tests:', function () {
  describe('Test Testcruds page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/testcruds');
      expect(element.all(by.repeater('testcrud in testcruds')).count()).toEqual(0);
    });
  });
});
