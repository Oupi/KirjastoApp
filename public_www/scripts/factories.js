var app = angular.module('Factories', []);

app.factory('userFactory', function($http){
  var factory = {};
  var token = "";
  var admin = false;
  var user = "";

  factory.login = function(userName, password){
    var connection = $http({
          method:"POST",
          url:"login",
          data:{"userName":userName,"pword":password},
          headers:{"Content-Type":"application/json"}
          });

    return connection;
  };
  factory.register = function(userName, password){
    var connection = $http({
          method:"POST",
          url:"newUser",
          data:{"userName":userName,"pword":password},
          headers:{"Content-Type":"application/json"}
          });

    return connection;
  };

  factory.setToken = function(t){
    token = t;
  };

  factory.getToken = function(){
    return token;
  };

  factory.setAdmin = function(user) {
    admin = user;
  };

  factory.isAdmin = function(){
    return admin;
  };

  factory.getUser = function() {
    return user;
  };

  factory.setUser = function(u) {
    user = u;
  };



  return factory;
});

app.factory('bookFactory', function($http, userFactory){
  var factory = {};

  factory.getBooks = function(){
    return $http({
                method: "GET",
                url: "api/book",
                headers: {"Content-Type":"application/json",
                          "token":userFactory.getToken()}
              });
  }

  factory.loanBook = function(book) {
    return $http({
                method: "POST",
                url: "api/book",
                data: {"id": book.id, "user":userFactory.getUser()},
                headers: {"Content-Type":"application/json",
                          "token":userFactory.getToken()}
              });
  }
  return factory;
});
