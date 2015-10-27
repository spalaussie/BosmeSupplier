'use strict';
/**
 * @ngdoc function
 * @name com.module.users.controller:RegisterCtrl
 * @description Login Controller
 * @requires $scope
 * @requires $routeParams
 * @requires $location
 * Controller for Register Page
 **/
angular.module('com.module.users')
  .controller('RegisterCtrl', function($rootScope, $scope, $routeParams, $location, $filter,
    CoreService, User, AppAuth, gettextCatalog, Category) {

    $scope.registration = {
      isSupplier:true,
      firstName: '',
      lastName: '',
      email: '',
      address:'',
      phone:'',
      bussinessname:'',
      password: ''
    };



    $scope.states ={
      'ACT':'ACT','NSW':'NSW','NT':'NT','QLD':'QLD','SA':'SA','TAS':'TAS','VIC':'VIC', 'WA':'WA'
    };

      $scope.schema = [
        {
          label: '',
        property: 'firstName',
        placeholder: gettextCatalog.getString('First Name'),
        type: 'text',
        attr: {
          ngMinlength: 3,
          required: true
        },
        msgs: {
          minlength: gettextCatalog.getString(
            'Needs to have at least 4 characters')
        }
      },
      {
        label: '',
        property: 'lastName',
        placeholder: gettextCatalog.getString('Last Name'),
        type: 'text',
        attr: {
          ngMinlength: 3,
          required: true
        },
        msgs: {
          minlength: gettextCatalog.getString(
            'Needs to have at least 4 characters')
        }
      },
      {
        label: '',
        property: 'email',
        placeholder: gettextCatalog.getString('Email'),
        type: 'email',
        help: gettextCatalog.getString(
          'Don\'t worry we won\'t spam your inbox'),
        attr: {
          required: true,
          ngMinlength: 7
        },
        msgs: {
          required: gettextCatalog.getString('You need an email address'),
          email: gettextCatalog.getString('Email address needs to be valid'),
          valid: gettextCatalog.getString('Nice email address!')
        }
      },
      {
          label: '',
          property: 'phone',
          placeholder: gettextCatalog.getString('Phone'),
          type: 'text',
          attr: {
            required: true,
            ngMinlength: 10
          }
        },
      {
        label: '',
        property: 'address',
        placeholder: gettextCatalog.getString('Address'),
        type: 'text',
        attr: {
          required: true,
          ngMinlength: 10
        }
      },
      {
        type: 'multiple',
        fields: [
          {
            label: '',
            property: 'zip',
            placeholder: gettextCatalog.getString('Zip'),
            type: 'number',
            attr: {
              required: true,
              ngMinlength: 4
            }
          },
          {
            label: '',
            defaultOption: 'Select a State',
            property: 'state',
            placeholder: gettextCatalog.getString('State'),
            type: 'select',
            list: 'key as value for (key,value) in states',
            attr: {
              required: true,
              ngMinlength: 10
            }
          }
        ],
        columns: 6
      },
      {
          label: '',
          property: 'bussinessname',
          placeholder: gettextCatalog.getString('Username / Business Name'),
          type: 'text',
          help: gettextCatalog.getString(
          'Bussiness name is your User name, avoid spaces'),
            attr: {
                required: true,
                ngMinlength: 4
            }
      },

      { type:'multiple',
        fields: [
          {
            label: '',
            property: 'password',
            placeholder: gettextCatalog.getString('Password'),
            type: 'password',
            attr: {
              required: true,
              ngMinlength: 6
            }
          },
          {
            label: '',
            property: 'confirmPassword',
            placeholder: gettextCatalog.getString('Confirm Password'),
            type: 'password',
            attr: {
              confirmPassword: 'user.password',
              required: true,
              ngMinlength: 6
            },
            msgs: {
              match: gettextCatalog.getString(
                'Your passwords need to match')
            }
          }
        ],
        columns: 6
      }
    ];

    $scope.options = {
      validation: {
        enabled: true,
        showMessages: false
      },
      layout: {
        type: 'basic',
        labelSize: 3,
        inputSize: 9
      }
    };


    $scope.confirmPassword = '';

    $scope.register = function() {

      $scope.registration.username = $scope.registration.bussinessname;
      delete $scope.registration.confirmPassword;
      $scope.user = User.save($scope.registration,
        function() {

          $scope.loginResult = User.login({
              include: 'user',
              rememberMe: true
            }, $scope.registration,
            function() {
              AppAuth.currentUser = $scope.loginResult.user;
              localStorage.setItem('currUserId',AppAuth.currentUser.id);
              var categories=[];
              var category1=new Category({name:'Frozen', description: 'Frozen Item', userId: AppAuth.currentUser.id});
              categories.push(category1);
              var category3=new Category({name:'Nuts/seeds', description: 'Walnuts, Pecans, Cashews, Cedar Nuts/Pine Nuts', userId: AppAuth.currentUser.id});
              categories.push(category3);
              var category4=new Category({name:'Dairy', description: 'Milk, Butter, Eggs, Cream, Yogurt, IceCream', userId: AppAuth.currentUser.id});
              categories.push(category4);
              var category5=new Category({name:'Herbs/Spices', description: 'Basil, Pepper, Cinnamon, Cumin, Garlic, Oregano', userId: AppAuth.currentUser.id});
              categories.push(category5);
              var category6=new Category({name:'Vegetables', description: 'Spinach, Carrot, Potatoes, Tomatoes', userId: AppAuth.currentUser.id});
              categories.push(category6);
              var category7=new Category({name:'Meat', description: 'Chicken, Pork, Lamb, Beaf', userId: AppAuth.currentUser.id});
              categories.push(category7);
              var category8=new Category({name:'Sea Food', description: 'Fish, Crab, Lobsters, Seaweed', userId: AppAuth.currentUser.id});
              categories.push(category8);
              var category9=new Category({name:'Fruits', description: 'Mango, Banana, Apple', userId: AppAuth.currentUser.id});
              categories.push(category9);

              Category.createMany(categories, function (err) {
                updateDashBoard();
              });

             /* if(!AppAuth.currentUser.isSupplier) {
                var supplier = new Supplier({
                  name: 'Bosme',
                  contactname: 'Bosme',
                  phone: '9877655237',
                  address: '22, main St',
                  zip: 2132,
                  state: 'NSW',
                  Country: 'Australia',
                  email: 'sales@bosme.com.au',
                  description: 'This is a test Supplier. Please add your own suppliers with all the details',
                  userId: AppAuth.currentUser.id
                });
                Supplier.upsert(supplier, function () {

                });
              }*/







              function updateDashBoard(){
                Category.find(
                  {
                    filter: {
                      where: {userId: AppAuth.currentUser.id}
                    }
                  }, function (categories) {
                    angular.forEach($rootScope.dashboardBox, function(box){
                      if(box.name==="Categories"){
                        box.quantity=categories.length;
                      }
                    })
                  });
                Supplier.find(
                  {
                    filter: {
                      where: {userId: AppAuth.currentUser.id}
                    }
                  }, function (suppliers) {
                    angular.forEach($rootScope.dashboardBox, function(box){
                      if(box.name==="Suppliers"){
                        box.quantity=suppliers.length;
                      }
                    })
                  });
              }

              CoreService.toastSuccess(gettextCatalog.getString(
                'Registered'), gettextCatalog.getString(
                'You are registered!'));
              $location.path('/');
            },
            function(res) {
              CoreService.toastWarning(gettextCatalog.getString(
                  'Error signin in after registration!'), res.data.error
                .message);
              $scope.loginError = res.data.error;
            }
          );

        },
        function(res) {
          CoreService.toastError(gettextCatalog.getString(
            'Error registering!'), res.data.error.message);
          $scope.registerError = res.data.error;
        }
      );
    };

  })
  .directive('confirmPassword',
    function() {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
          var validate = function(viewValue) {
            var password = scope.$eval(attrs.confirmPassword);
            ngModel.$setValidity('match', ngModel.$isEmpty(viewValue) ||
              viewValue === password);
            return viewValue;
          };
          ngModel.$parsers.push(validate);
          scope.$watch(attrs.confirmPassword, function() {
            validate(ngModel.$viewValue);
          });
        }
      };
    }
  );
