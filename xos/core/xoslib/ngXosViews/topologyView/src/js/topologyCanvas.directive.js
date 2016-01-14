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
    controller: function($element, d3){

      const config = {
        width: 600,
        height: 600
      }

      const svg = d3.select($element[0])
        .append('svg')
        .style('width', '600px')
        .style('height', '600px')
        .style('background-color', 'black');

      const color = d3.scale.category20();

      const force = d3.layout.force()
          .charge(-120)
          .linkDistance(30)
          .size([config.width, config.height]);

      force
        .nodes(this.topologyNodes)
        .links(this.topologyLinks)
        .start();

      var link = svg.selectAll('.link')
        .data(this.topologyLinks)
        .enter().append('line')
          .attr('class', 'link')
          .style('stroke-width', function(d) { return Math.sqrt(d.value); });

      var node = svg.selectAll('.node')
          .data(this.topologyNodes)
        .enter().append('circle')
          .attr('class', 'node')
          .attr('r', 10)
          .style('fill', function(d) { return color(d.group); })
          .call(force.drag);

      force.on('tick', function() {
        link.attr('x1', function(d) { 
              // debugger;
              return d.source.x; 
            })
            .attr('y1', function(d) { return d.source.y; })
            .attr('x2', function(d) { return d.target.x; })
            .attr('y2', function(d) { return d.target.y; });

        node.attr('cx', function(d) { return d.x; })
            .attr('cy', function(d) { return d.y; });
      });

    }
  };
});
