'use strict';

angular.module('xos.topologyView')
.directive('topologyCanvas', function(){
  return {
    restrict: 'E',
    scope: {
      topologyNodes: '=',
      topologyLinks: '='
    },
    bindToController: true,
    controllerAs: 'vm',
    templateUrl: 'templates/topologyCanvas.tpl.html',
    controller: function($element, d3, topoConfig, topoForce, topoElement, topoUtils){

      topoElement.createSvg($element[0]);
      const force = topoForce.createForceLayout();

      // Start the force layout
      topoForce.startForceLayout(this.topologyNodes, this.topologyLinks);

      /**
      * Create all the links element
      */
      var link = topoElement.createLinks(this.topologyLinks);

      // Create all the node elements
      var node = topoElement.createNodes(this.topologyNodes)

      // filter all nodes based on type
      const fab = node.filter('.fabric-switch');
      const ovs = node.filter('.ovs-switch');
      const bbu = node.filter('.bbu');
      const rru = node.filter('.rru');

      // Setup node creators functions
      var createFab = topoElement.createNodeElement('fabric-switch');
      var createOvs = topoElement.createNodeElement('ovs-switch');
      var createBbu = topoElement.createNodeElement('bbu');
      var createRru = topoElement.createNodeElement('rru');

      // create different types of nodes
      fab.each(createFab);
      ovs.each(createOvs);
      bbu.each(createBbu);
      rru.each(createRru);

      force.on('tick', function() {
        link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

        node.attr({
          transform: d => topoUtils.createTranslation(d.x, d.y)
        });
      });

    }
  };
});
