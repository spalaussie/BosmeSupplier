'use strict';
angular.module('com.module.orders')
  .controller('OrdersCtrl', function ($rootScope, $scope, $modal, ApiService, AppAuth, $location, $state, $stateParams,
                                      CoreService, gettextCatalog,User, Supplier, Order, Message) {

    var orderId = $stateParams.orderId;

    getuserName(localStorage.getItem('$LoopBack$currentUserId'));

    $scope.orderList={
      newOrders:[],
      pendingOrders:[],
      processedOrders:[]
    }


    /*
    load all the orders
*/
    loadOrders();

   function loadOrders() {

     //$scope.orders=[];
     Order.find({
       filter: {
         where: {
                supplierId:localStorage.getItem('$LoopBack$currentUserId')
         },
         include: ['products','user','productOrders']
       }
     }, function (orders) {
       var tempNewOrders=[];
       var tempPendingOrders=[];
       var tempProcessedOrders=[];

        angular.forEach(orders, function(order){
          switch(order.status){
            case 1: tempNewOrders.push(order);
                  break;
            case 2: tempPendingOrders.push(order);
                  break;
            case 3: tempProcessedOrders.push(order);
              break;
          }
        });

       $scope.orderList.newOrders=tempNewOrders;
       $scope.orderList.pendingOrders=tempPendingOrders;
       $scope.orderList.processedOrders=tempProcessedOrders;

     });
   }


    /*
      end loading all the orders
     */
    /*Get the current date*/

  /*  function getTodaysDate(){
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();

      if(dd<10) {
        dd='0'+dd
      }

      if(mm<10) {
        mm='0'+mm
      }

      today = mm+'/'+dd+'/'+yyyy;

      return today;
    }*/

    $scope.changeOrderStatus=function(orderToUpdate, orderList){

      switch (orderList) {
          case 'return':
          orderToUpdate.status=4;
          orderToUpdate.shippingdate = null;
          break;
        case 'new':
          orderToUpdate.status=2;
          orderToUpdate.shippingdate = null;
          break;
        case 'pending':
          orderToUpdate.status=3;
          orderToUpdate.shippingdate = CoreService.getTodaysDate();
          break;
        case 'processed':
          orderToUpdate.status=2;
          orderToUpdate.shippingdate = null;
      }


        Order.upsert(orderToUpdate, function(){

          switch (orderList) {
            case 'return':
              var index = $scope.orderList.newOrders.indexOf(orderToUpdate);
              $scope.orderList.newOrders.splice(index, 1);
              sendMessage('return',orderToUpdate);
              break;
            case 'new':
              var index = $scope.orderList.newOrders.indexOf(orderToUpdate);
              $scope.orderList.newOrders.splice(index, 1);
               $scope.orderList.pendingOrders.push(orderToUpdate);
              sendMessage('pending',orderToUpdate);

              break;
            case 'pending':
              var index = $scope.orderList.pendingOrders.indexOf(orderToUpdate);
              $scope.orderList.pendingOrders.splice(index, 1);
              $scope.orderList.processedOrders.push(orderToUpdate);
              sendMessage('processed',orderToUpdate);
              break;
            case 'processed':
              var index = $scope.orderList.processedOrders.indexOf(orderToUpdate);
              $scope.orderList.processedOrders.splice(index, 1);
              $scope.orderList.pendingOrders.push(orderToUpdate);
              sendMessage('pending',orderToUpdate);
              break;
          }

        });
    };


    function getuserName(userId){
      User.findById({
        id: userId,
        fields: {'bussinessname':true}
      }).$promise.then(function (data) {
          $scope.sender= data;
        });
    }

    function sendMessage(orderStatus,orderToUpdate){
      var today = new Date();
      var message = new Message({
        userId: orderToUpdate.user.id,
        senderId:localStorage.getItem('$LoopBack$currentUserId') ,
        title: 'Status of your order: '+orderToUpdate.id+ ' with ' + $scope.sender.bussinessname +  ' has  changed.' ,
        message: 'Status of your order:'+orderToUpdate.id+ ' with ' + $scope.sender.bussinessname + ' has a '+ orderStatus +' status.' ,
        createdAt: today
      });
      Message.upsert(message, function () {
        CoreService.toastSuccess(gettextCatalog.getString(
          'Staus changed message sent  '), gettextCatalog.getString(
          'Staus changed message is sent to client ' + orderToUpdate.user.username));
        $state.go('^.list');
      }, function (err) {
        console.log(err);
      });
    }

    /*****************************************************************/
    /************Create order  to modal dialogue confirm *************/
    /*****************************************************************/
    $scope.openQuickView = function (order) {

     // var order=order;

      var modalInstance = $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'ModalOrderContent.html',
        controller: 'OrderModalInstanceCtrl',
        backdrop: 'static',
        resolve: {
          currOrder: function () {
            return order;
          }
        }
      });
      /****************************************************************/
      /*************Save the order and send Email to supplier**********/
      /****************************************************************/
      modalInstance.result.then(function (dt) {

      });
    };




    function getClientName(userId){
      User.findById({
        id: userId,
        fields: {'bussinessname':true}
      }).$promise.then(function (data) {
          $scope.client= data;
        });
    }


    /*****************************************************************************/
    /************Quick view Client Profile *************/
    /*****************************************************************************/

    $scope.openProfile=function(userid){
    var client=User.findById({
        id: userid
      }, function (data) {
          client= data;
        });

      $scope.senderDetails = {};

      var modalInstance = $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'clientModalContent.html',
        controller: 'ModalInstanceClientCtrl',
        backdrop: 'static',
        resolve: {
          sender: function () {
            return client;
          }
        }
      });

      /***********************************************************************************/
      /*************Open a modal to accept or reject the clients (sender)request**********/
      /***********************************************************************************/

      modalInstance.result.then(function (sender) {

        /***********************adding sender to sippliers list*************************/
      });
    };






    function updateDashBoard(){
      Order.find({
        filter:{
          where: {
            userId:localStorage.getItem('$LoopBack$currentUserId')
          }
        }
      },function (orders) {
          angular.forEach($rootScope.dashboardBox, function(box){
            if(box.name==="Orders"){
              box.quantity=orders.length;
            }
          })
        });
    }


    /* End Create a new Order and get the new orderId to create a ProductOrder */

    $scope.onSubmit = function() {
      Order.upsert($scope.newOrder, function() {

      }, function(err) {
        console.log(err);
      });
    };

    $scope.deleteorder = function (id) {
      CoreService.confirm(gettextCatalog.getString('Are you sure?'),
        gettextCatalog.getString('Deleting this cannot be undone'),
        function () {
          Order.deleteById(id, function () {
            CoreService.toastSuccess(gettextCatalog.getString(
              'Order deleted'), gettextCatalog.getString(
              'Your order is deleted!'));
            loadOrders();
          }, function (err) {
            CoreService.toastError(gettextCatalog.getString(
              'Error deleting order'), gettextCatalog.getString(
                'Your order is not deleted: ') + err);
          });
        },
        function () {
          return false;
        });
    };

  })


//Datepicker
  .directive("mydatepicker", function(){
    return {
      restrict: "E",
      scope:{
        ngModel: "=",
        dateOptions: "=",
        opened: "="
      },
      link: function($scope, element, attrs) {
        $scope.open = function(event){
          event.preventDefault();
          event.stopPropagation();
          $scope.opened = true;
        };

        $scope.clear = function () {
          $scope.ngModel = null;
        };
      },
      templateUrl: 'modules/orders/views/datepicker.html'
    }
  })

;
