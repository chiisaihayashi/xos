(function () {
  'use strict';
  angular.module('xos.topologyView')
  .factory('WSClient', function ($log) {
    function newWebSocket(url) {
      var ws = null;
      try {
        ws = new WebSocket(url);
      } catch (e) {
        $log.error('Unable to create web socket:', e);
      }
      return ws;
    }

    return {
      newWebSocket: newWebSocket
    };
  });
})();
