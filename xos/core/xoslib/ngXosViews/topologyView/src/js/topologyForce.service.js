(function () {
  'use strict'
  angular.module('xos.topologyView')
  .service('topoForce', function($log, d3, topoConfig, topoUtils){
    const _this = this;
    var force = null;

    this.network = {
      nodes: [],
      links: []
    };

    const tickFn = () => {
      if(_this.network.links.length > 0){
        _this.network.links
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);
      }

      if(_this.network.nodes.length > 0){
        $log.info(_this.network.nodes);
        _this.network.nodes
          .attr({
            transform: d => topoUtils.createTranslation(d.x, d.y)
          });
      }
    };

    this.createForceLayout = () => {
      if(!force){
        force = d3.layout.force()
          .charge(-520)
          .size([topoConfig.width, topoConfig.height])
          .nodes(_this.network.nodes)
          .links(_this.network.links)
          .linkDistance(80)
          .charge(-400)
          .size([topoConfig.width, topoConfig.height])
          .on('tick', tickFn);
      }
      if(topoConfig.debug){
        $log.debug('[FORCE] create')
      }
      if(topoConfig.verboseDebug){
        $log.info(force)
      }
      return force;
    };

    this.startForceLayout = () => {

      if(topoConfig.debug){
        $log.debug('[FORCE] start')
      }
      if(topoConfig.verboseDebug){
        $log.info(_this.network);
      }

      force
        .start();
    };

    this.getForceLayout = () => {
      if(!force){
        return _this.createForceLayout();
      }
      return force;
    }
  });
})();