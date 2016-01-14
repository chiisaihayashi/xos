'use strict';

angular.module('xos.topologyView')
.service('TopoData', function ($http, $q, lodash) {
  
  this.getNodes = () => {
    let deferred = $q.defer();

    $http.get(`../mock/topologyNodes.json`)
    .then((res) => {
      deferred.resolve(res.data);
    })
    .catch((e) => {
      deferred.reject(e);
    });

    return deferred.promise;
  }

  this.getLinks = () => {
    let deferred = $q.defer();

    $http.get(`../mock/topologyLinks.json`)
    .then((res) => {
      deferred.resolve(res.data);
    })
    .catch((e) => {
      deferred.reject(e);
    });

    return deferred.promise;
  }

  this.getNodeIdx = (nodes, id) => {
    return lodash.findIndex(nodes, {id: id});
  }

});
