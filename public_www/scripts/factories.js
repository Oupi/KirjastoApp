var app = angular.module('Factories', []);

app.factory('userFactory', function($http){
  var factory = {};
  var token = "";
  var admin = false;
  var user = "";
  var logged = false;

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

  factory.setLogged = function(u) {
    logged = u;
  };

  factory.isLogged = function(){
    return logged;
  };

  var init = function(){
    var user = sessionStorage.getItem("user");
    var token = sessionStorage.getItem("token");

    if(user && token){
      factory.setUser(user);
      factory.setLogged(true);
      if(token == "admin"){
        factory.setAdmin(true);
      }
      factory.setToken(token);
    }
  };

  init();

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

app.factory('adminFactory', function($http, userFactory){
    var factory = {};

    factory.addBook = function (title, author){
      return $http({
        method: "POST",
        url: "api/admin/book",
        data: {"title": title, "author": author},
        headers: {"Content-Type":"application/json",
                  "token":userFactory.getToken()}
      });
    };

    factory.removeBook = function(book){
      return $http({
        method: "DELETE",
        url: "api/admin/book",
        data: {"id":book.id},
        headers: {"Content-Type":"application/json",
                  "token":userFactory.getToken()}
      });
    };
    return factory;
});
