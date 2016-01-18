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
    controller: function($element, $log, d3, topoConfig, topoForce, topoElement, topoUtils, WSClient, TopoData){

      topoElement.createSvg($element[0]);

      this.topologyNodes = [];
      this.topologyLinks = [];

      this.d3Links, this.d3Nodes;

      // TODO move in a service
      const eventHandlers = {
        addNode: (node) => {
          topoForce.network.nodes.push(node);
          topoElement.createNodes();
        },
        addLink: (link) => {
          link.source = TopoData.getNodeIdx(topoForce.network.nodes, link.source);
          link.target = TopoData.getNodeIdx(topoForce.network.nodes, link.target);

          // TODO handle links pointing to non existing nodes
          topoForce.network.links.push(link);
          this.d3Links = topoElement.createLinks(this.topologyLinks);
        }
      };

      // Handles the specified (incoming) message using handler bindings.
      function handleMessage(msgEvent) {
        var ev, h;
        try {
          ev = JSON.parse(msgEvent.data);
        } catch (e) {
          $log.error('Message.data is not valid JSON', msgEvent.data, e);
          return null;
        }
        if(topoConfig.debug){
          $log.debug('[WS]', ev.event, ev.payload);
        }


        // NOTE if ev.event === bbu must trigger rru

        if (h = eventHandlers[ev.event]) {
          try {
            h(ev.payload);
          } catch (e) {
            $log.error('Problem handling event:', ev, e);
            return null;
          }
        } else {
          $log.warn('Unhandled event:', ev);
        }

      }
      // END TODO

      // setting up WS for event handling
      const ws = WSClient.newWebSocket('ws://localhost:8123');
      ws.onmessage = handleMessage;

    }
  };
});
