'use strict';

var app = angular.module('TodoApp', [
    'restangular',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ]);

app.config(['RestangularProvider', '$routeProvider', function(RestangularProvider, $routeProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
  RestangularProvider.setBaseUrl('/api/v1');
  RestangularProvider.setDefaultRequestParams({ 'user_email': document.getElementById('user_email').innerHTML, 'auth_token':document.getElementById('user_auth_token').innerHTML});
}]);