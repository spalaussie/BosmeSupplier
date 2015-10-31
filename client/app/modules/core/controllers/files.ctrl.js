'use strict';
angular.module('com.module.core')
  .controller('FilesCtrl', function($scope, $rootScope, $http, CoreService, gettextCatalog,UploadCSV, usSpinnerService) {

    $scope.load = function() {
      $http.get(CoreService.env.apiUrl + '/containers/files/files').success(
        function(data) {
          console.log(data);
          $scope.files = data;
        });
    };

    $scope.import = function(){
     // startSpin();
      UploadCSV.convertToJSON(
        {
          userId:localStorage.getItem('$LoopBack$currentUserId')
        }).$promise.then(function successFunction(result) {

          $scope.someVariable = result;
          console.log(result);
        });
    };


    $scope.delete = function(index, id) {
      CoreService.confirm(gettextCatalog.getString('Are you sure?'),
        gettextCatalog.getString('Deleting this cannot be undone'),
        function() {
          $http.delete(CoreService.env.apiUrl +
            '/containers/files/files/' + encodeURIComponent(id)).success(
            function(data, status, headers) {
              console.log(data);
              console.log(status);
              console.log(headers);
              $scope.files.splice(index, 1);
              CoreService.toastSuccess(gettextCatalog.getString(
                'File deleted'), gettextCatalog.getString(
                'Your file is deleted!'));
            });
        },
        function() {
          return false;
        });
    };

    $scope.$on('uploadCompleted', function(event) {
      console.log('uploadCompleted event received');
      console.log(event);
      $scope.load();
    });



      /*******************************************************************************/
      /*****************************Spinner Global************************************/
      /*******************************************************************************/
      $scope.startcounter = 0;
      function startSpin() {
        if (!$scope.spinneractive) {
          usSpinnerService.spin('spinner-1');
          $scope.startcounter++;
        }
      }

      function stopSpin() {
        if ($scope.spinneractive) {
          usSpinnerService.stop('spinner-1');
        }
      }
      $scope.spinneractive = false;

      $rootScope.$on('us-spinner:spin', function(event, key) {
        $scope.spinneractive = true;
      });

      $rootScope.$on('us-spinner:stop', function(event, key) {
        $scope.spinneractive = false;
      });

      /*******************************************************************************/


  });
