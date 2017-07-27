var app = angular.module('Factories', []);

app.factory('userFactory', function($http){
  var factory = {};
  // var token = "";
  // var admin = false;
  // var user = "";
  // var logged = false;

  factory.login = function(userName, password){
    var connection = $http({
      method:"POST",
      url:"login",
      data:{"userName":userName,"pword":password},
      headers:{"Content-Type":"application/json"}
    });

    return connection;
  };
  factory.logOut = function(){
    var connection = $http({
      method:"POST",
      url:"logout",
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
    console.log("SetToken: " + t);
    localStorage.setItem("token", t);
  };

  factory.getToken = function(){
    return localStorage.getItem("token");
  };

  factory.setAdmin = function(user) {
    console.log("SetAdmin: " + user);
    localStorage.setItem("admin", user);
  };

  factory.isAdmin = function(){
    return localStorage.getItem("admin");
  };

  factory.getUser = function() {
    return localStorage.getItem("user");
  };

  factory.setUser = function(u) {
    console.log("SetUser: " + u);
    localStorage.setItem("user", u);
  };

  factory.setLogged = function(u) {
    console.log("SetLogged: "+ u);
    localStorage.setItem("logged", u);
  };

  factory.isLogged = function(){
    return localStorage.getItem("logged");
  };

  var init = function(){
    var user = factory.getUser();
    console.log("User factory init user: " + user);
    var token = factory.getToken();
    console.log("User factory init token: " + token);

    if(user != null){
      factory.setLogged(true);
      if(token == "admin"){
        factory.setAdmin(true);
      }
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

  factory.getBooksByAuthor = function(queryParam){
    return $http({
                method: "GET",
                url: "api/book?author=" + queryParam,
                headers: {"Content-Type":"application/json",
                          "token":userFactory.getToken()}
              });
  }

  factory.loanBook = function(book) {
    return $http({
                method: "POST",
                url: "api/book",
                data: {"id": book._id, "user":userFactory.getUser()},
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
        data: {"id":book._id},
        headers: {"Content-Type":"application/json",
                  "token":userFactory.getToken()}
      });
    };
    return factory;
});
