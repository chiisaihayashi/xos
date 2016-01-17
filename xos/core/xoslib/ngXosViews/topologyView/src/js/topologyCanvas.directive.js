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
      const force = topoForce.createForceLayout();

      this.topologyNodes = [];
      this.topologyLinks = [];
      
      topoForce.startForceLayout(this.topologyNodes, this.topologyLinks);

      this.d3Links, this.d3Nodes;

      // TODO move in a service
      const eventHandlers = {
        addNode: (node) => {
          this.topologyNodes.push(node);
          this.d3Nodes = topoElement.createNodes(this.topologyNodes);

          // add shape and label to the already existing node.
          const createNode = topoElement.createNodeElement(node.type);
          const filteredNodes = this.d3Nodes.filter(`.${node.type}`);
          filteredNodes.each(createNode);
        },
        addLink: (evt) => {
          evt.source = TopoData.getNodeIdx(this.topologyNodes, evt.source);
          evt.target = TopoData.getNodeIdx(this.topologyNodes, evt.target);

          // TODO handle links pointing to non existing nodes
          this.topologyLinks.push(evt);
          this.d3Links = topoElement.createLinks(this.topologyLinks);
        }
      }

      // Handles the specified (incoming) message using handler bindings.
      function handleMessage(msgEvent) {
        var ev, h;

        try {
          ev = JSON.parse(msgEvent.data);
        } catch (e) {
          $log.error('Message.data is not valid JSON', msgEvent.data, e);
          return null;
        }
        $log.debug(' ** WS ** ', ev.event, ev.payload);

        // NOTE if ev.event === bbu mu trigger rru

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

      force.on('tick', () => {
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
      });

    }
  };
});
