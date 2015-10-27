'use strict';
angular.module('com.module.orders')
  .run(function($rootScope,User, Order, gettextCatalog) {
    $rootScope.addMenu(gettextCatalog.getString('Orders'),
      'app.orders.list', 'ion-navigate');

      Order.find({
        filter:{
          where: {
            and:
              [ {supplierId:   localStorage.getItem('$LoopBack$currentUserId')},
                {status:1}
              ]
          }
        }
      },function(data) {
        $rootScope.addDashboardBox(gettextCatalog.getString('New Orders'),
          'bg-yellow', 'ion-android-star-outline', data.length,
          'app.orders.list');
    });

  })

  .run(function($rootScope,User, Order, gettextCatalog) {
    Order.find({
      filter:{where: {
        and:
          [ {supplierId:   localStorage.getItem('$LoopBack$currentUserId')},
            {status:2}
          ]
      }
      }
    },function(data) {
      $rootScope.addDashboardBox(gettextCatalog.getString('Pending Orders'),
        'bg-aqua', 'ion-android-star-half', data.length,
        'app.orders.list');
    });

  })

  .run(function($rootScope,User, Order, gettextCatalog) {
    Order.find({
      filter:{where: {
        and:
          [ {supplierId:   localStorage.getItem('$LoopBack$currentUserId')},
            {status:3}
          ]
      }
      }
    },function(data) {
      $rootScope.addDashboardBox(gettextCatalog.getString('Processed'),
        'bg-purple', 'ion-android-star', data.length,
        'app.orders.list');
    });

  })
;
