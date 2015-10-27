'use strict';
angular.module('com.module.messages')
  .controller('MessagesCtrl', function($rootScope, $scope, $modal, $state, $stateParams,CoreService,ApiService, AppAuth, $location, gettextCatalog, User, Message, ClientSupplier) {


    var messageId = $stateParams.messageId;
    $scope.messages = [];
    $scope.message={};
    loadItems();
    getuserName(localStorage.getItem('$LoopBack$currentUserId'));

    /*****************************************************************************/
    /************Create a modal dialogue to accept or reject request *************/
    /*****************************************************************************/

    function open (sender) {

      $scope.senderDetails = {};

      var modalInstance = $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'senderModalContent.html',
        controller: 'ModalInstanceCtrl',
        backdrop: 'static',
        resolve: {
          sender: function () {
            return sender;
          }
        }
      });

      /***********************************************************************************/
      /*************Open a modal to accept or reject the clients (sender)request**********/
      /***********************************************************************************/

      modalInstance.result.then(function (sender) {

        /***********************adding sender to sippliers list*************************/
       var clientSupplier =new ClientSupplier({
          userId:sender.id,
          supplierId:localStorage.getItem('$LoopBack$currentUserId')
        });

        ClientSupplier.find({filter:{where: {and: [{userId:sender.id }, {supplierId: localStorage.getItem('$LoopBack$currentUserId') }]}}
        }, function(exists, bool){
          if(exists.length>0){
            CoreService.toastError(gettextCatalog.getString(
              'Client already added '), gettextCatalog.getString(
              'Client already exists '));
          }else {
            ClientSupplier.upsert(clientSupplier, function () {
              sendMessage(sender);
              $state.go('^.list');
            }, function (err) {
              console.log(err);
            });

          }
        });
    });
  };


    /*****************************************************************************/
    /************Create a modal dialogue read Messages **************************/
    /***************************************************************************/

      $scope.openMessage=function(thisMessage) {


      var modalInstance = $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'messageModalContent.html',
        controller: 'MessageModalInstanceCtrl',
        backdrop: 'static',
        resolve: {
          message: function () {
            return thisMessage;
          }
        }
      });

      /***********************************************************************************/
      /*************Open a modal to accept or reject the clients (sender)request**********/
      /***********************************************************************************/

      modalInstance.result.then(function (message) {
        if(!message.read) {
          Message.findById({
            id: message.id
          }, function (currMsg) {
            currMsg.read = true;
            Message.upsert(currMsg, function () {
              loadItems();
            });
          })
        }
      });

    };




    function getuserName(userId){
      User.findById({
        id: userId,
        fields: {'bussinessname':true}
      }).$promise.then(function (data) {
          $scope.user= data;
        });
    }


    function sendMessage(sender) {
      var today = new Date();
      var message = new Message({
        userId: sender.id,
        senderId:localStorage.getItem('$LoopBack$currentUserId') ,
        title: $scope.user.bussinessname + " has accepted your request." ,
        message: "You and " + $scope.user.bussinessname + ' are now in sync',
        createdAt: today
      });
      Message.upsert(message, function () {
        CoreService.toastSuccess(gettextCatalog.getString(
          'Client added '), gettextCatalog.getString(
          'Approval message is sent to client ' + $scope.sender.bussinessname));
        $state.go('^.list');
      }, function (err) {
        console.log(err);
      });
    }

    function loadItems() {
      Message.find({
        filter: {
          where: {
            userId: localStorage.getItem('$LoopBack$currentUserId')
          },order: 'read ASC, id DESC ',groupBy:'read'
        }
      }, function (messages) {
        $scope.messages = messages;
      });

      if (messageId) {
        Message.find({
          filter: {
            where: {id: messageId}
          }
        }, function (message) {
          $scope.message = message[0];
        });
      }
    }

    $scope.viewProfile=function(senderId){
        User.findById({
            id: senderId
          }).$promise.then(function (data) {
            $scope.sender=data;
            open($scope.sender);
        });
    };


    $scope.deletemessage = function (id) {
      CoreService.confirm(gettextCatalog.getString('Are you sure?'),
        gettextCatalog.getString('Deleting this cannot be undone'),
        function () {
          Message.deleteById(id, function () {
            CoreService.toastSuccess(gettextCatalog.getString(
              'Message deleted'), gettextCatalog.getString(
              'Your message is deleted!'));
            loadItems();
          }, function (err) {
            CoreService.toastError(gettextCatalog.getString(
              'Error deleting message'), gettextCatalog.getString(
                'Your message is not deleted: ') + err);
          });
        },
        function () {
          return false;
        });
    }

    function updateDashBoard(){
      Message.find(
        {
          filter: {
            where: {userId: localStorage.getItem('$LoopBack$currentUserId')}
          }
        }, function (messages) {
          angular.forEach($rootScope.dashboardBox, function(box){
            if(box.name==="Messages"){
              box.quantity=messages.length;
            }
          })
        });
    }

  });
