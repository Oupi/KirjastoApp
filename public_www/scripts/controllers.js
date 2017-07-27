var app = angular.module('Controllers', ['Factories']);

app.controller('LoginController', function($scope, $location, userFactory){
  var init = function(){
    if(localStorage.getItem("token") && localStorage.getItem("user")){
      var token = localStorage.getItem("token");
      var user = localStorage.getItem("user");
      userFactory.setToken(token);
      userFactory.setLogged(true);
      userFactory.setUser(user);
      if(token == "admin"){
        userFactory.setAdmin(true);
      }
      $location.url("/list");
    }
  };

  $scope.login = function(){
    userFactory.login($scope.userName, $scope.pword)
    .then(function(data){
      console.log(data.data);
      var token = data.data.token;
      if(token){
        userFactory.setToken(token);
        var user = data.data.user;
        userFactory.setUser(user);
        userFactory.setLogged(true);

        if(token == "admin"){
          userFactory.setAdmin(true);
        }
        $location.url("/list");
        localStorage.setItem("token",token);
        localStorage.setItem("user",user);
      }
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
  init();
});

app.controller('ListController', function($scope, bookFactory, userFactory){
  var init = function(){
    bookFactory.getBooks().then(function(data){
    $scope.bookList = data.data;
    console.log(data.data);
    } ,function(reason){
    console.log(reason.data);
    });
  }

  $scope.loanState = function(book){
    if(book.loaned == ""){
      return "Loan";
    } else {
      return "Return";
    }
  }

  $scope.loan = function(book){
      bookFactory.loanBook(book).then(function(data){
        init();
        console.log(data.data);
      }, function(reason) {
        console.log(reason.data);
      });
  }

  $scope.isMine = function(book){
    if(book.loaned != ""){
      if(book.loaned == userFactory.getUser()){
        return true;
      } else {
        return false;
      }
    }
    return true;
  };

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

app.controller('UiController', function($scope, $location, userFactory){
  $scope.isLogged = function(){
    return userFactory.isLogged();
  };

  $scope.isAdmin = function(){
    return userFactory.isAdmin();
  };

  $scope.logOut = function(){
    userFactory.logOut(userFactory.getUser()).then(function(data){

      userFactory.setLogged(false);
      userFactory.setAdmin(false);
      userFactory.setUser("");
      userFactory.setToken("");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      $location.url("/login");
    }, function(reason){
      console.log(reason.data);
    });
  };
});
