(function () {
  angular.module('xos.topologyView')
  .service('topoElement', function(d3, topoConfig, topoForce, topoUtils){

    const _this = this;
    const color = topoConfig.color;
    const force = topoForce.getForceLayout();
    var svg;

    this.createSvg = (element) => {
      return svg = d3.select(element)
        .append('svg')
        .style('width', `${topoConfig.width}px`)
        .style('height', `${topoConfig.height}px`)
    }

    this.createLinks = (linkList) => {
      const allLinks = svg.selectAll('.link')
        .data(linkList, d => `${d.source} - ${d.target}`);

      allLinks
        .enter()
        .append('line')
          .attr('class', 'link');

      // I link non riconoscono gli elementi associati
      allLinks
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      return allLinks;
    }

    /**
    * Create all the nodes and attach them to the svg
    */
    this.createNodes = (nodeList) => {
      
      const allNodes = svg.selectAll('.node')
        .data(nodeList, d => d.id);

      allNodes
        .enter()
        .append('g')
        .attr({
          class: d => d.type,
          transform: d => topoUtils.createTranslation(d.x, d.y)
        });

      force.start();

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
