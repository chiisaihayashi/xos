(function () {
  angular.module('xos.topologyView')
  .service('topoElement', function(d3, topoConfig, topoForce, topoUtils, lodash){

    const _this = this;
    const color = topoConfig.color;
    var svg, force;

    this.createSvg = (element) => {
      svg = d3.select(element)
        .append('svg')
        .style('width', `${topoConfig.width}px`)
        .style('height', `${topoConfig.height}px`);

      force = topoForce.getForceLayout();

      return svg;
    };

    this.createLinks = () => {
      const allLinks = svg.selectAll('.link')
        .data(topoForce.network.links, d => `${d.source} - ${d.target}`);

      allLinks
        .enter()
        .append('line')
          .attr('class', 'link');

      // I link non riconoscono gli elementi associati
      topoForce.startForceLayout();

      return allLinks;
    };

    /**
    * Create all the nodes and attach them to the svg
    */
    this.createNodes = () => {
      
      const allNodes = svg.selectAll('.node')
        .data(topoForce.network.nodes, d => d.id);

      // NOTE we are not consideting update for now
      const newNodes = allNodes
        .enter()
        .append('g')
        .attr({
          class: d => d.type,
          transform: d => topoUtils.createTranslation(d.x, d.y)
        });

      // for each defined node type
      // add shape and label to the already existing node.
      lodash.forEach(Object.keys(topoConfig.nodeDefs), (type) => {
        let createNode = _this.createNodeElement(type);
        let filteredNodes = newNodes.filter(`.${type}`);
        filteredNodes.each(createNode);
      });

      topoForce.startForceLayout();

      return allNodes;
    };

    /**
    * Generate the configuration for a node type
    * and return the function that actually create it
    */
    this.createNodeElement = (type) => {

      const nodeType = type;
      const attrs = {
        class: `node ${nodeType}`
      };
      angular.extend(attrs, topoConfig.nodeDefs[nodeType]);

      return function(){
        var node = d3.select(this);

        if(nodeType === 'rru'){
          _this.createRRUArea(node);
        }

        node
          .append(attrs.shape)
          .attr(attrs)
          .style('fill', d => color(d.type))
          .call(force.drag);

        _this.appendTextToNode(node);
      }
    };

    /**
    * Append the label to a node element
    */
    this.appendTextToNode = (node) => {
      node
        .append('text')
        .text(d => d.label)
        .style('fill', d => color(d.type))
        .attr('x', -30)
        .attr('y', 25)
    };

    this.createRRUArea = (node) => {
      node
        .append('circle')
        .attr('class', 'node-area')
        .attr('r', 40)
        .style('fill', d => color(d.type))
        .call(force.drag);
    }
  });
})();
