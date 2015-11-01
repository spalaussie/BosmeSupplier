/*
*
 */
//Converter Class
var fs = require("fs");
var Promise = require('bluebird');
var app = require('../../server/server');
module.exports = function(UploadCSV) {

  var Category =undefined;

  var Product=undefined;

  var userId=undefined;
  var categories=undefined , suppliers=undefined ;
var success=false;
  UploadCSV.convertToJSON=function(UserId) {



    Category = UploadCSV.app.models.Category;
    Product = UploadCSV.app.models.Product;

    userId=UserId;


    createCategories(userId)
      .then(function(inserted){
        categories=inserted;

           createProducts(userId,categories)
              .then(function(inserted){
                products=inserted;
                console.log("inserted Products Data",inserted);
              })
              .catch(function(error){
               success=false;
                console.log("Error in creating Products ",error);
              })
            ;
        success=true;
          console.log("inserted Categories Data",inserted);
      })
      .catch(function(error){
        console.log("Error in creating categories ",error);
            createProducts(userId,categories)
              .then(function(inserted){
                products=inserted;
                success=true;
                console.log("inserted Products Data",inserted);
              })
              .catch(function(error){
                success=false;
                console.log("Error in creating Products ",error);
              })
      });

  };
  function getCatsAndSups(callback){

    Category.find(
      {
        where: {userId:userId},
        fields: {name: true}
      }, function(err, cats, created) {
        if (err) {
          console.error('err', err);
        }
        categories=cats;
      });

    callback();

  }



  var createProducts= function(userId, categories) {
    return new Promise(function (resolve, reject) {
      var Converter = require("csvtojson").Converter;
      var fileStream = fs.createReadStream("storage/files/products.csv");

//new converter instance
      var param = {};
      var converter = new Converter(param);
      //end_parsed will be emitted once parsing finished

      converter.on("end_parsed", function (jsonProdObj) {

        var newProds=[];

        Product.find({where: {userId: userId}, fields: {id: true, name: true}}, function (err, prods, created) {
          if (err) {
            console.error('err', err);
          }
          products = prods;

          jsonProdObj.forEach(function (s) {
            if (ifExists(s, products)) {
            } else {
              newProds.push(s);
              // console.log(s.name);
            }
          });
          //console.log(newProds);
          if (newProds.length > 0) {
            newProds.forEach(function (d) {
              d.userId = userId,
              d.categoryId = getItemId(d.category, categories),
              console.log(d.categoryId);
              d.supplierId = userId;
            });

            Product.create(newProds, function (err, res) {
              if (err){reject(err);}
              else {
                var inserted = res;
                resolve(inserted);
              }
            });
          }
        });
      });
//read from file
      // This will wait until we know the readable stream is actually valid before piping
      fileStream.on('open', function () {
        // This just pipes the read stream to the response object (which goes to the client)
        fileStream.pipe(converter);
      });

      // This catches any errors that happen while creating the readable stream (usually invalid names)
      fileStream.on('error', function(err) {
        //converter.end(err);
        reject(err);
        //console.log("File does not existing",err);
      });
      //fileStream.pipe(converter);
    });
  };


  function getItemId(name, objItem){
    var id=0;
    if(objItem!=undefined) {
      if (objItem.length > 0) {
        objItem.forEach(function (obj) {
          if (name === obj.name) {
            id = obj.id
            console.log(obj.id);
          }
        });
      }
    }
    return id;
  }

 /* var createSuppliers= function(userId){
    return new Promise(function(resolve, reject) {

      var Converter = require("csvtojson").Converter;
      var fileStream = fs.createReadStream("storage/files/suppliers.csv");
      //new converter instance
      var param = {};
      var converter = new Converter(param);

      //end_parsed will be emitted once parsing finished

      converter.on("end_parsed", function (jsonObj) {
        // console.log(jsonObj); //here is your result json object

        var newSupp=[];

        Supplier.find(
          {
            where: {userId:userId},
            fields: {id:true,name: true}
          }, function(err, suppliers, created) {
            if (err) {
              console.error('err', err);
            }

            jsonObj.forEach(function(s){
              if(ifExists(s,suppliers)){
              }else {
                newSupp.push(s);
                // console.log(s.name);
              }
            });
            //console.log(newSupp);
            if(newSupp.length>0) {
              newSupp.forEach(function (d) {
                d.userId = userId
              });

              Supplier.create(newSupp, function (err, res) {
                if (err){reject(err);}
                else {
                  var inserted = res.concat(suppliers);;
                  resolve(inserted);
                }
              });
            }
          });
      });

//read from file
      // This will wait until we know the readable stream is actually valid before piping
      fileStream.on('open', function () {
        // This just pipes the read stream to the response object (which goes to the client)
        fileStream.pipe(converter);
      });

      // This catches any errors that happen while creating the readable stream (usually invalid names)
      fileStream.on('error', function(err) {
        //converter.end(err);
        reject(err);
        //console.log("File doesnot exists", err);
      });
      //fileStream.pipe(converter);
    });
};*/

  var createCategories= function(userId){
    return new Promise(function(resolve, reject){
      var Converter = require("csvtojson").Converter;
      var fileStream = fs.createReadStream("storage/files/categories.csv");

      //var categories=[];

//new converter instance
      var param = {};
      var converter = new Converter(param);

//end_parsed will be emitted once parsing finished
      converter.on("end_parsed", function (jsonObj) {
        // console.log(jsonObj); //here is your result json object

        var newCat=[];

        Category.find(
          {
            where: {userId:userId},
            fields: {id:true,name: true}
          }, function(err, categories, created) {
            if (err) {
              console.error('err', err);
            }

            jsonObj.forEach(function(d){
              if(ifExists(d,categories)){
              }else {
                newCat.push(d);
                console.log(d.name);
              }
            });
            // console.log(newCat);
            if(newCat.length>0) {
              newCat.forEach(function (d) {
                d.userId = userId
              });

              Category.create(newCat, function (err, res) {
                if (err){reject(err);}
                else {
                  var inserted = res.concat(categories);
                  resolve(inserted);
                }
              });
            }else{
              reject(err);
            }
          });
      });

//read from file
      // This will wait until we know the readable stream is actually valid before piping
      fileStream.on('open', function () {
        // This just pipes the read stream to the response object (which goes to the client)
        fileStream.pipe(converter);
      });

      // This catches any errors that happen while creating the readable stream (usually invalid names)
      fileStream.on('error', function(err) {
        reject(err);
        //console.log("File doesnot exists", err);
      });
      //fileStream.pipe(converter);
    });
  };

/*  function createCategories(callback){
  }*/

  function ifExists(item, itemArray){
    var exists=false;
    itemArray.forEach(function(c) {
      if(item.name=== c.name){
        exists=true;
      }
    });
    return exists;
  }



  UploadCSV.remoteMethod(
    'convertToJSON',
    {
      accepts: {arg: 'userId', type: 'string'},
      returns: {arg: 'success', type: 'string'}
    }
  );


};





