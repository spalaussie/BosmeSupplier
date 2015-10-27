'use strict';
angular.module('com.module.settings')
  .run(function($rootScope, gettextCatalog) {

    $rootScope.getSetting = function(key) {
      var valor = '';
      angular.forEach($rootScope.settings.data, function(item) {
        if (item.key === key) {
          valor = item.value;
        }
      });
      return valor;
    };


  });
