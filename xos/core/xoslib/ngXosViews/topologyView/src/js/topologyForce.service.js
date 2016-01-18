(function () {
  'use strict'
  angular.module('xos.topologyView')
  .service('topoForce', function(d3, topoConfig){
    const _this = this;
    var force = null;

    const tickFn = () => {
      if(this.d3Links && this.d3Nodes){
        this.d3Links
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

        this.d3Nodes
          .attr({
            transform: d => topoUtils.createTranslation(d.x, d.y)
          });
      }
    };

    this.createForceLayout = () => {
      if(!force){
        force = d3.layout.force()
          .charge(-520)
          .size([topoConfig.width, topoConfig.height]);
      }
      return force;
    };

    this.startForceLayout = (nodeList, linkList) => {
      force
        .nodes(nodeList)
        .links(linkList)
        .linkDistance(80)
        .on('tick', tickFn);
    };

    this.getForceLayout = () => {
      if(!force){
        return _this.createForceLayout();
      }
      console.log('getForceLayout');
      return force;
    }
  });
})();