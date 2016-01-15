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

      const color = d3.scale.category20();

      const force = d3.layout.force()
          .charge(-520)
          .size([config.width, config.height]);

      force
        .nodes(this.topologyNodes)
        .links(this.topologyLinks)
        .linkDistance(80)
        .start();

      var link = svg.selectAll('.link')
        .data(this.topologyLinks)
        .enter().append('line')
          .attr('class', 'link')
          .style('stroke-width', function(d) { return Math.sqrt(d.value); });

      var node = svg.selectAll('.node')
        .data(this.topologyNodes, d => d.id)
        .enter()
        .append('g')
        .attr({
          class: d => d.type,
          transform: (d) => {
            return 'translate(' + d.x + ',' + d.y + ')';
          }
        });

      const fab = node.filter('.fabric-switch');
      const ovs = node.filter('.ovs-switch');
      const bbu = node.filter('.bbu');
      const rru = node.filter('.rru');

      fab.each(function(item){
        var node = d3.select(this);
        node
          .append('rect')
          .attr('class', `node node-${item.type}`)
          .attr('width', 20)
          .attr('height', 20)
          .attr('x', -10)
          .attr('y', -10)
          .style('fill', function(d) { return color(d.type); })
          .call(force.drag);

        node
          .append('text')
          .text((d) => d.label)
          .style('fill', function(d) { return color(d.type); })
          .attr('x', -30)
          .attr('y', 25)
      })

      ovs.each(function(item){
        var node = d3.select(this);
        node
          .append('rect')
          .attr('class', `node node-${item.type}`)
          .attr('width', 20)
          .attr('height', 20)
          .attr('x', -10)
          .attr('y', -10)
          .style('fill', function(d) { return color(d.type); })
          .call(force.drag);

        node
          .append('text')
          .text((d) => d.label)
          .style('fill', function(d) { return color(d.type); })
          .attr('x', -30)
          .attr('y', 25)
      })

      bbu.each(function(item){
        var node = d3.select(this);
        node
          .append('ellipse')
          .attr('class', `node node-${item.type}`)
          .attr('rx', 20)
          .attr('ry', 10)
          .style('fill', function(d) { return color(d.type); })
          .call(force.drag);

        node
          .append('text')
          .text((d) => d.label)
          .style('fill', function(d) { return color(d.type); })
          .attr('x', -30)
          .attr('y', 25)
      })

      rru.each(function(item){
        var node = d3.select(this);
        // area
        node
          .append('circle')
          .attr('class', 'node-area')
          .attr('r', 40)
          .style('fill', function(d) { return color(d.type); })
          .call(force.drag);

        node
          .append('circle')
          .attr('class', `node node-${item.type}`)
          .attr('r', 10)
          .style('fill', function(d) { return color(d.type); })
          .call(force.drag);

        node
          .append('text')
          .text((d) => d.label)
          .style('fill', function(d) { return color(d.type); })
          .attr('x', -30)
          .attr('y', 25)
      })

      force.on('tick', function() {
        link.attr('x1', function(d) {
          return d.source.x;
        })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });

        node.attr({
          transform: (d) => {
            return 'translate(' + d.x + ',' + d.y + ')';
          }
        });
      });

    }
  };
});
