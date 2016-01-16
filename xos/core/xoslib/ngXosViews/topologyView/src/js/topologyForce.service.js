(function () {
  'use strict'
  angular.module('xos.topologyView')
  .service('topoForce', function(d3, topoConfig){
    const _this = this;
    var force = null;

    this.createForceLayout = () => {
      force = d3.layout.force()
        .charge(-520)
        .size([topoConfig.width, topoConfig.height]);
      return force;
    };

    this.startForceLayout = (nodeList, linkList) => {
      force
        .nodes(nodeList)
        .links(linkList)
        .linkDistance(80)
        .start();
    }

    this.getForceLayout = () => {
      if(!force){
        return _this.createForceLayout();
      }
      return force;
    }
  });
})();