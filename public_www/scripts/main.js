var app = angular.module('kirjastoApp', ['ngRoute','Controllers']);

app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);

app.config(function($routeProvider) {

	$routeProvider.when("/login", {
			controller:"LoginController",
			templateUrl:"views/loginView.html"

	}).when("/list", {
			controller:"ListController",
			templateUrl:"views/bookList.html"

	}).when("/admin/list", {
      controller:"AdminController",
      templateUrl:"views/admin/bookList.html"

  }).when("/admin/add", {
      controller:"AdminController",
      templateUrl:"views/admin/addNewBook.html"

  }).
	otherwise({redirectTo:"/login"});

});
