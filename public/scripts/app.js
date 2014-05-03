'use strict';

var app = angular.module('TodoApp', [
    'restangular',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ]);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});

app.config(['RestangularProvider', function(RestangularProvider){
 RestangularProvider.setBaseUrl('/api/v1');
 RestangularProvider.setDefaultRequestParams({ 'user_email': document.getElementById('user_email').innerHTML, 'auth_token':document.getElementById('user_auth_token').innerHTML});
}]);