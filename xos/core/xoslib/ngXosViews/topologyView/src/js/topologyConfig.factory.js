(function () {
  'use strict'
  angular.module('xos.topologyView')
  .constant('topoConfig', {
    width: 600,
    height: 600,
    color: null,
    nodeDefs: {
      'fabric-switch': {
        shape: 'rect',
        width: 20,
        height: 20,
        x: -10,
        y: -10
      },
      'ovs-switch': {
        shape: 'rect',
        width: 20,
        height: 20,
        x: -10,
        y: -10
      },
      'bbu': {
        shape: 'ellipse',
        rx: 20,
        ry: 10
      },
      'rru': {
        shape: 'circle',
        r: 10
      }
    }
  })
  .run((topoConfig, d3) => {
    topoConfig.color = d3.scale.category20();
  })
})();
