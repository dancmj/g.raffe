angular.module('authService', []).factory('Auth', function ($http) {
  var authFactory = {};

  // authFactory.get = function(){
  //   return $http.get('/oauth/session/');
  // };
  //
  // authFactory.logout = function(){
  //   return $http.get('/oauth/logout/');
  // };

  return authFactory;
});
