'use strict';

angular.module('xos.topologyView')
.directive('topologyContainer', function(lodash){
  return {
    restrict: 'E',
    scope: {},
    bindToController: true,
    controllerAs: 'vm',
    templateUrl: 'templates/topologyContainer.tpl.html',
    controller: function(TopoData){
      // TopoData.getNodes()
      // .then((res) => {
      //   this.topoNodes = res;
      //   return TopoData.getLinks();
      // })
      // .then((res) => {
      //   var parsed = lodash.map(res, (item) => {
      //     item.source = TopoData.getNodeIdx(this.topoNodes, item.source);
      //     item.target = TopoData.getNodeIdx(this.topoNodes, item.target);
      //     return item;
      //   });
      //   this.topoLinks = parsed;
      // })
      // .catch((e) => {
      //   // TODO write a component that wrap server errors (401, 403, 404, 500) and attach an element to the DOM
      //   this.error = e;
      // });
    }
  };
});
