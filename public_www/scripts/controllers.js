var app = angular.module('Controllers', ['Factories']);

app.controller('LoginController', function($scope, $location, userFactory){
  $scope.login = function(){
    userFactory.login($scope.userName, $scope.pword)
    .then(function(data){
      console.log(data.data);
      var token = data.data.token;
      userFactory.setToken(token);
      var user = data.data.user;
      userFactory.setUser(user);
      userFactory.setLogged(true);

      if(token == "admin"){
        userFactory.setAdmin(true);
      }
      
      $location.url("/list");
      sessionStorage.setItem("token",token);
      sessionStorage.setItem("user",user);
    }, function(reason){
      alert(reason.data);
    });
  };

  $scope.register = function(){
    userFactory.register($scope.userName, $scope.pword)
    .then(function(data) {
      console.log(data.data);
    }, function(reason){
      alert(reason.data);
    });
  };
});

app.controller('ListController', function($scope, bookFactory){
  var init = function(){
    bookFactory.getBooks().then(function(data){
    $scope.bookList = data.data;
    console.log(data.data);
    } ,function(reason){
    console.log(reason.data);
    });
  }

  $scope.loan = function(book){
      bookFactory.loanBook(book).then(function(data){
        init();
        console.log(data.data);
      }, function(reason) {
        console.log(reason.data);
      });
  }

  init();
});

app.controller('AdminController', function($scope, $location, adminFactory, bookFactory){
  var init = function(){
    bookFactory.getBooks().then(function(data){
    $scope.bookList = data.data;
    console.log(data.data);
    } ,function(reason){
    console.log(reason.data);
    });
  }

  $scope.remove = function(book){
      adminFactory.removeBook(book).then(function(data){
        init();
        console.log(data.data);
      }, function(reason) {
        console.log(reason.data);
      });
  }

  $scope.addBook = function(){
    adminFactory.addBook($scope.title, $scope.author).then(function(data){
      console.log(data.data);
      $location.url("/admin/list");
    }, function(reason){
      console.log(reason.data);
    });
  }

  init();
});

app.controller('UiController', function($scope, userFactory){
  $scope.isLogged = function(){
    return userFactory.isLogged();
  };

  $scope.isAdmin = function(){
    return userFactory.isAdmin();
  };

});
