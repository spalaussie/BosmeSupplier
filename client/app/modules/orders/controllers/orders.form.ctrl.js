'use strict';
var app = angular.module('com.module.orders');

function OrdersFormCtrl($scope, $modal, $state,$filter, $stateParams,ApiService, AppAuth, $location, CoreService, Supplier, gettextCatalog, Order, Product, ProductOrder) {


  var self = this;

  var orderId = $stateParams.orderId;


  // $scope.items = ['item1', 'item2', 'item3'];

  $scope.animationsEnabled = true;

  $scope.order=[];

  var orders={
    order:{},
    orderItems:[],
    supplier:{},
    user:{}
  }



  var orderLine = {
    orderId: '',
    productId: '',
    productName: '',
    unit: '',
    quantity: 0
  };

  $scope.orderLine = [];

  function initOrderLine() {
    var orderLine1 = {};
    orderLine1.orderId = '',
      orderLine1.productId = '';
    orderLine1.productName = '';
    orderLine1.unit = '';
    orderLine1.quantity = 0;
    return orderLine1;
  }

 //  get all the products for this supplier;

  if (orderId) {
    var lstOrderLine = [];
    $scope.order = Order.findById({
      id: orderId,
      filter: {include: 'products', order: 'productId ASC'}
    }, function (order) {
      $scope.supplier = Supplier.findById({
        id: order.supplierid
      });
      orders.supplier=$scope.supplier;
      $scope.products = Supplier.products({
        id: order.supplierid
      }).$promise.then(function (data) {
          $scope.products = data;
          angular.forEach($scope.products, function (product) {
            orderLine = initOrderLine();
            orderLine.orderId = orderId,
              orderLine.productId = product.id,
              orderLine.productName = product.name,
              orderLine.unit = product.unit,
              orderLine.quantity = 0
            lstOrderLine.push(orderLine);
          })

          $scope.orderLine = lstOrderLine;
        });
    })
  } else {
    $scope.supplier = {};
  }


  //$scope.Qty=1;
  $scope.decrQty = function (item) {
    if (item.quantity > 0) {
      item.quantity = item.quantity - 1;
    }
  };
  $scope.incrQty = function (item) {
    if (item.quantity >= 0) {
      item.quantity = item.quantity + 1;
    }
  };


}

app.controller('OrdersFormCtrl', OrdersFormCtrl);

