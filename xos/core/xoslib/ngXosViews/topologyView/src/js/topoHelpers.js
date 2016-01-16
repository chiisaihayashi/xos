(function () {
  'use strict';

  angular.module('xos.topologyView')
  .service('topoUtils', function(){
    this.createTranslation = (x, y) => `translate(${x},${y})`;
  });
})();
