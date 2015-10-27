'use strict';
var app = angular.module('com.module.orders');

function ModalInstanceClientCtrl($scope, $state, $stateParams,ApiService, AppAuth, $location, CoreService, gettextCatalog, $modalInstance, sender) {

  $scope.sender = sender;


  $scope.ok = function () {
      $modalInstance.close($scope.sender);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}
app.controller('ModalInstanceClientCtrl', ModalInstanceClientCtrl);
