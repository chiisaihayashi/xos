'use strict';

angular.module('xos.topologyView', [
  'ngResource',
  'ngCookies',
  'ngLodash',
  'ui.router',
  'xos.helpers'
])
.config(($stateProvider) => {
  $stateProvider
  .state('user-list', {
    url: '/',
    template: '<topology-container></topology-container>'
  });
})
.config(function($httpProvider){
  $httpProvider.interceptors.push('NoHyperlinks');
});