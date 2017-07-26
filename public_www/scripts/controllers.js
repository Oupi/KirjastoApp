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
      if(token == "admin"){
        userFactory.setAdmin(true);
      }
      $location.url("/list");
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
  }
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
