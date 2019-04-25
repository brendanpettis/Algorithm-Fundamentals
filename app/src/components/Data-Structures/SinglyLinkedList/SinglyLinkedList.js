import React, { Component } from 'react'
import * as d3 from "d3";
import './style.css';
import Highlight from 'react-highlight'
import styled from 'styled-components'
import { Modal, Button } from 'react-bootstrap'

const HighlightWrapper = styled.div`
  width: 95%;
  margin: auto;
`;

class SinglyLinkedList extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      code: {
        show: false
      },
      experiments: {
        show: false
      }
    };
  }

  handleClose(name) {
    this.setState({ [name]: { show: false }});
  }

  handleShow(name) {
    this.setState({ [name]: { show: true }});
  }

  componentDidMount = () => {
      // set up SVG for D3
      const width = 400;
      const height = 400;
      const colors = d3.scaleOrdinal(d3.schemeCategory10);

      const svg = d3.select('#singly')
        .append('svg')
        .on('contextmenu', () => {
          d3.event.preventDefault();
        })
        .attr('width', width)
        .attr('height', height);

      // set up initial nodes and links
      //  - nodes are known by 'id', not by index in array.
      //  - reflexive edges are indicated on the node (as a bold black circle).
      //  - links are always source < target; edge directions are set by 'left' and 'right'.
      const nodes = [{
          id: 0,
          reflexive: false
        },
        {
          id: 1,
          reflexive: true
        },
        {
          id: 2,
          reflexive: false
        }
      ];
      let lastNodeId = 2;
      const links = [{
          source: nodes[0],
          target: nodes[1],
          left: false,
          right: true
        },
        {
          source: nodes[1],
          target: nodes[2],
          left: false,
          right: true
        }
      ];

      // init D3 force layout
      const force = d3.forceSimulation()
        .force('link', d3.forceLink().id((d) => d.id).distance(150))
        .force('charge', d3.forceManyBody().strength(-500))
        .force('x', d3.forceX(width / 2))
        .force('y', d3.forceY(height / 2))
        .on('tick', tick);

      // init D3 drag support
      const drag = d3.drag()
        // Mac Firefox doesn't distinguish between left/right click when Ctrl is held... 
        .filter(() => d3.event.button === 0 || d3.event.button === 2)
        .on('start', (d) => {
          if (!d3.event.active) force.alphaTarget(0.3).restart();

          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (d) => {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        })
        .on('end', (d) => {
          if (!d3.event.active) force.alphaTarget(0);

          d.fx = null;
          d.fy = null;
        });

      // define arrow markers for graph links
      svg.append('svg:defs').append('svg:marker')
        .attr('id', 'end-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 6)
        .attr('markerWidth', 3)
        .attr('markerHeight', 3)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#000');

      svg.append('svg:defs').append('svg:marker')
        .attr('id', 'start-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 4)
        .attr('markerWidth', 3)
        .attr('markerHeight', 3)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M10,-5L0,0L10,5')
        .attr('fill', '#000');

      // line displayed when dragging new nodes
      const dragLine = svg.append('svg:path')
        .attr('class', 'link dragline hidden')
        .attr('d', 'M0,0L0,0');

      // handles to link and node element groups
      let path = svg.append('svg:g').selectAll('path');
      let circle = svg.append('svg:g').selectAll('g');

      // mouse event vars
      let selectedNode = null;
      let selectedLink = null;
      let mousedownLink = null;
      let mousedownNode = null;
      let mouseupNode = null;

      function resetMouseVars() {
        mousedownNode = null;
        mouseupNode = null;
        mousedownLink = null;
      }

      // update force layout (called automatically each iteration)
      function tick() {
        // draw directed edges with proper padding from node centers
        path.attr('d', (d) => {
          const deltaX = d.target.x - d.source.x;
          const deltaY = d.target.y - d.source.y;
          const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          const normX = deltaX / dist;
          const normY = deltaY / dist;
          const sourcePadding = d.left ? 17 : 12;
          const targetPadding = d.right ? 17 : 12;
          const sourceX = d.source.x + (sourcePadding * normX);
          const sourceY = d.source.y + (sourcePadding * normY);
          const targetX = d.target.x - (targetPadding * normX);
          const targetY = d.target.y - (targetPadding * normY);

          return `M${sourceX},${sourceY}L${targetX},${targetY}`;
        });

        circle.attr('transform', (d) => `translate(${d.x},${d.y})`);
      }

      // update graph (called when needed)
      function restart() {
        // path (link) group
        path = path.data(links);

        // update existing links
        path.classed('selected', (d) => d === selectedLink)
          .style('marker-start', (d) => d.left ? 'url(#start-arrow)' : '')
          .style('marker-end', (d) => d.right ? 'url(#end-arrow)' : '');

        // remove old links
        path.exit().remove();

        // add new links
        path = path.enter().append('svg:path')
          .attr('class', 'link')
          .classed('selected', (d) => d === selectedLink)
          .style('marker-start', (d) => d.left ? 'url(#start-arrow)' : '')
          .style('marker-end', (d) => d.right ? 'url(#end-arrow)' : '')
          .on('mousedown', (d) => {
            if (d3.event.ctrlKey) return;

            // select link
            mousedownLink = d;
            selectedLink = (mousedownLink === selectedLink) ? null : mousedownLink;
            selectedNode = null;
            restart();
          })
          .merge(path);

        // circle (node) group
        // NB: the function arg is crucial here! nodes are known by id, not by index!
        circle = circle.data(nodes, (d) => d.id);

        // update existing nodes (reflexive & selected visual states)
        circle.selectAll('circle')
          .style('fill', (d) => (d === selectedNode) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id))
          .classed('reflexive', (d) => d.reflexive);

        // remove old nodes
        circle.exit().remove();

        // add new nodes
        const g = circle.enter().append('svg:g');

        g.append('svg:circle')
          .attr('class', 'node')
          .attr('r', 12)
          .style('fill', (d) => (d === selectedNode) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id))
          .style('stroke', (d) => d3.rgb(colors(d.id)).darker().toString())
          .classed('reflexive', (d) => d.reflexive)
          .on('mouseover', function (d) {
            if (!mousedownNode || d === mousedownNode) return;
            // enlarge target node
            d3.select(this).attr('transform', 'scale(1.1)');
          })
          .on('mouseout', function (d) {
            if (!mousedownNode || d === mousedownNode) return;
            // unenlarge target node
            d3.select(this).attr('transform', '');
          })
          .on('mousedown', (d) => {
            if (d3.event.ctrlKey) return;

            // select node
            mousedownNode = d;
            selectedNode = (mousedownNode === selectedNode) ? null : mousedownNode;
            selectedLink = null;

            // reposition drag line
            dragLine
              .style('marker-end', 'url(#end-arrow)')
              .classed('hidden', false)
              .attr('d', `M${mousedownNode.x},${mousedownNode.y}L${mousedownNode.x},${mousedownNode.y}`);

            restart();
          })
          .on('mouseup', function (d) {
            if (!mousedownNode) return;

            // needed by FF
            dragLine
              .classed('hidden', true)
              .style('marker-end', '');

            // check for drag-to-self
            mouseupNode = d;
            if (mouseupNode === mousedownNode) {
              resetMouseVars();
              return;
            }

            // unenlarge target node
            d3.select(this).attr('transform', '');

            // add link to graph (update if exists)
            // NB: links are strictly source < target; arrows separately specified by booleans
            const isRight = mousedownNode.id < mouseupNode.id;
            const source = isRight ? mousedownNode : mouseupNode;
            const target = isRight ? mouseupNode : mousedownNode;

            const link = links.filter((l) => l.source === source && l.target === target)[0];
            if (link) {
              link[isRight ? 'right' : 'left'] = true;
            } else {
              links.push({
                source,
                target,
                left: !isRight,
                right: isRight
              });
            }

            // select new link
            selectedLink = link;
            selectedNode = null;
            restart();
          });

        // show node IDs
        g.append('svg:text')
          .attr('x', 0)
          .attr('y', 4)
          .attr('class', 'id')
          .text((d) => d.id);

        circle = g.merge(circle);

        // set the graph in motion
        force
          .nodes(nodes)
          .force('link').links(links);

        force.alphaTarget(0.3).restart();
      }

      function mousedown() {
        // because :active only works in WebKit?
        svg.classed('active', true);

        if (d3.event.ctrlKey || mousedownNode || mousedownLink) return;

        // insert new node at point
        const point = d3.mouse(this);
        const node = {
          id: ++lastNodeId,
          reflexive: false,
          x: point[0],
          y: point[1]
        };
        nodes.push(node);

        restart();
      }

      function mousemove() {
        if (!mousedownNode) return;

        // update drag line
        dragLine.attr('d', `M${mousedownNode.x},${mousedownNode.y}L${d3.mouse(this)[0]},${d3.mouse(this)[1]}`);
      }

      function mouseup() {
        if (mousedownNode) {
          // hide drag line
          dragLine
            .classed('hidden', true)
            .style('marker-end', '');
        }

        // because :active only works in WebKit?
        svg.classed('active', false);

        // clear mouse event vars
        resetMouseVars();
      }

      function spliceLinksForNode(node) {
        const toSplice = links.filter((l) => l.source === node || l.target === node);
        for (const l of toSplice) {
          links.splice(links.indexOf(l), 1);
        }
      }

      // only respond once per keydown
      let lastKeyDown = -1;

      function keydown() {
        d3.event.preventDefault();

        if (lastKeyDown !== -1) return;
        lastKeyDown = d3.event.keyCode;

        // ctrl
        if (d3.event.keyCode === 17) {
          circle.call(drag);
          svg.classed('ctrl', true);
          return;
        }

        if (!selectedNode && !selectedLink) return;

        switch (d3.event.keyCode) {
          case 8: // backspace
          case 46: // delete
            if (selectedNode) {
              nodes.splice(nodes.indexOf(selectedNode), 1);
              spliceLinksForNode(selectedNode);
            } else if (selectedLink) {
              links.splice(links.indexOf(selectedLink), 1);
            }
            selectedLink = null;
            selectedNode = null;
            restart();
            break;
          case 66: // B
            if (selectedLink) {
              // set link direction to both left and right
              selectedLink.left = true;
              selectedLink.right = true;
            }
            restart();
            break;
          case 76: // L
            if (selectedLink) {
              // set link direction to left only
              selectedLink.left = true;
              selectedLink.right = false;
            }
            restart();
            break;
          case 82: // R
            if (selectedNode) {
              // toggle node reflexivity
              selectedNode.reflexive = !selectedNode.reflexive;
            } else if (selectedLink) {
              // set link direction to right only
              selectedLink.left = false;
              selectedLink.right = true;
            }
            restart();
            break;
            default: break;
        }
      }

      function keyup() {
        lastKeyDown = -1;

        // ctrl
        if (d3.event.keyCode === 17) {
          circle.on('.drag', null);
          svg.classed('ctrl', false);
        }
      }

      // app starts here
      svg.on('mousedown', mousedown)
        .on('mousemove', mousemove)
        .on('mouseup', mouseup);
      d3.select(window)
        .on('keydown', keydown)
        .on('keyup', keyup);
      restart();
  }

  render() {
    return (
      <div>
          <h1>Singly Linked List</h1>
          <h3>What is it?</h3>
          <h3>Big O</h3>
          <h3>Examples / Use Cases</h3>
          <h3>Interactive Animation</h3>
          <div id="singly"></div>
        <>
        <Button variant="primary" onClick={()=> this.handleShow("code")}>
          Show What's Under the Hood
        </Button>

        <Modal size="lg" show={this.state.code.show} onHide={() => this.handleClose("code")}>
          <Modal.Header closeButton>
            <Modal.Title>Sample Code Implementation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <HighlightWrapper>
              <Highlight innerHTML={true}>{'<h3>Sample Code Implementation</h3>'}</Highlight>
              <Highlight language="javascript">
                {`

                /* 
                  Node Class
                  - Stores a piece of data
                  - Has a reference to the next node
                */

                class Node {
                  constructor(val){
                    this.val = val;
                    this.next = null;
                  }
                }

                /* 
                  Singly Linked List
                  - Uses Push, Pop, and has a length
                  - Creates nodes by utilizing the above node class
                */
              
              class SinglyLinkedList {
                constructor(){
                  this.head = null;
                  this.tail = null;
                  this.length = 0;
                }
                // Method to insert a new node to the end of the list 
                push(val){
           
                  var newNode = new Node(val);                
                  if(!this.head){
                    this.head = newNode;
                    this.tail = this.head;
                  }
                  else {
                    this.tail.next = newNode;
                    this.tail = newNode;
                  }
                  this.length++;
                  return this;
                }
                // Method to remove a node from the list 
                pop(){
                  if(!this.head){
                    return undefined;
                  }
                  var current = this.head;
                  var newTail = current;
                  while(current.next){
                    newTail = current;
                    current = current.next;
                  }             
                  this.tail = newTail;
                  this.tail.next = null;
                  this.length--;
              
                  if(this.length === 0){
                    this.head = null;
                    this.tail = null;
                  }
                  return current;
                }
              
                // Method to shift nodes by swapping out the head
                shift(){
                  if(!this.head){
                    return undefined;
                  }
                  var oldHead = this.head;
                  this.head = oldHead.next;
                  this.length--;

                   if(this.length === 0){
                    this.tail = null;
                  }
                  return oldHead;
                }

                // Method to insert a new load to the beginning of the list
                unshift(val){
                  var newNode = new Node(val);
                 
                  if(!this.head){
                    this.head = newNode;
                    this.tail = this.head;
                  }
                  else {
                    newNode.next = this.head;
                    this.head = newNode;
                  }
                  this.length++;
                  return this;
                }
              
                // Takes in an index and pulls out the corresponding value
                get(index){
                  if(index < 0 || index >= this.length){
                    return null;
                  }
                  var counter = 0;
                  var currentNode = this.head;
              
                  while(counter !== index){
                    currentNode = currentNode.next;
                    counter++;
                  }// Once the loop ends current node will be at the corresponding index
                  return currentNode;
                }
              
                // Takes in an index and value, and updates the corresponding node with the new value
                set(index, value){
                  var foundNode = this.get(index);

                  if(foundNode){
                    foundNode.val = value;
                    return true;
                  } 
                  return false;
                }
                // Takes in and index and value and inserts a new node with the corresponding value at the specified index
                insert(index, val){
                  if(index < 0 || index > this.length){
                    return false;
                  }

                  if(index === this.length){
                    this.push(val);
                    return true;
                  }

                  if(index === 0){
                    this.unshift(val);
                    return true;
                  }

                  var newNode = new Node(val);
                  var previousNode = this.get(index - 1);
                  var tempRef = previousNode.next;
                  previousNode.next = newNode;
                  newNode.next = tempRef;
                  this.length++;
                  return true;
                }

                // Takes in an index and removes the node at that index.
                remove(index){

                  if(index < 0 || index > this.length){
                    return undefined;
                  }

                  if(index === this.length - 1){
                    return this.pop();
                  }

                  if(index === 0){
                    return this.shift();
                  }

                  var previousNode = this.get(index -1);
                  var removedNode = previousNode.next;            
                  previousNode.next = removedNode.next;
                  this.length--;
                  return removedNode;
                }

                // Reverses the linked list, a common CS interview question, take notes++
                reverse(){
                  var tempHead = this.head;
                  this.head = this.tail;
                  this.tail = tempHead;
                  var nextNode;
                  var prevNode = null;
              
                  for(var i = 0; i < this.length; i++){
              
                    nextNode = tempHead.next;             
                    tempHead.next = prevNode;
                    prevNode = tempHead;
                    tempHead = nextNode;
                  }
                  return this;
                }

                // Not normally needed but will be useful to show reversed linked list
                print(){
                  var arr = [];
                  var currentNode = this.head;
                  while(currentNode){
                    arr.push(currentNode.val);         
                    currentNode = currentNode.next;
                  }
                  // Once all nodes have been traversed display the array formed
                  console.log(arr);
                }
              }
                `}
              </Highlight>
            </HighlightWrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={()=> this.handleClose("code")}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>

      <>
      <Button variant="warning" onClick={()=> this.handleShow("experiments")}>
          Show Console Experiments
        </Button>

        <Modal size="lg" show={this.state.experiments.show} onHide={() => this.handleClose("experiments")}>
          <Modal.Header closeButton>
            <Modal.Title>Console Experiments</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <HighlightWrapper>
              <Highlight innerHTML={true}>{'<h3>Console Experiments</h3>'}</Highlight>
              <Highlight language="javascript">
                {`            
                  /* 
                    Pop Tests, pop a node off, then display the current value of the list after pop
                    Repeat until list is empty.
                  */
                  
                  // Instantiate a new list
                  var list = new SinglyLinkedList();
                  
                  // Push three nodes on to it
                  list.push("Hello");
                  list.push("Goodbye");
                  list.push("World");
                  
                  // Get rid of one
                  list.pop();
                  // Display
                  list
                  // ^^ Repeat
                  list.pop();
                  list
                  list.pop();
                  list
                  
                  
                  /* 
                    Shift Tests, can reuse the original list if still in the same console session
                  */
                  
                  // Push three nodes on to it
                  list.push("Hello");
                  list.push("Goodbye");
                  list.push("World");
                  
                  // Shift the nodes over and remove the head
                  list.shift();
                  // Display the results
                  list
                  // ^^ Repeat
                  list.shift();
                  list
                  list.shift();
                  list
                  
                  /*
                    Unshift Tests, 
                  */
                  
                  // Push three nodes on to it
                  list.push("Hello");
                  list.push("Goodbye");
                  list.push("World");
                  // Add a new head node
                  list.unshift("Added");
                  // Display the results
                  list
                  // Remove all of the nodes
                  list.pop();
                  list.pop();
                  list.pop();
                  list.pop();
                  
                  // Will Hi will become the head and tail node
                  list.unshift("Hi");
                  // Unshift again, and watch "Hi" become the tail node, while "Bye" becomes the new head node
                  list.unshift("Bye");
                  // Clear out our list
                  list.pop();
                  list.pop();
                  /*
                    Get Tests
                  */
                  
                  // Push four nodes on to the list
                  list.push("Hello");
                  list.push("Goodbye");
                  list.push("World");
                  list.push("<3");
                  
                  // Should return "Hello"
                  list.get(0);
                  // Should return "Goodbye"
                  list.get(1);
                  // Should return "World"
                  list.get(2);
                  // Should return "<3"
                  list.get(3);
                  // Out of bounds, Should return null
                  list.get(5);
                  
                  /* 
                    Set Tests
                  */
                  
                  // Should return "World"
                  list.get(2);
                  // Should return true on success
                  list.set(2, "My Friends");
                  // Should now return "My Friends" at index 2
                  list.get(2);
                  
                  /* 
                    Insert Tests
                  */
                  
                  // First we're going to add something to the start of the list
                  // Display the current list
                  list
                  // Insert at 0, Should return true
                  list.insert(0, "First");
                  // List should display length of five with First at the head
                  list
                  
                  // Now we're going to add something to the end of the list
                  // Should return null
                  list.get(5);
                  // Should return true
                  list.insert(5, "LAST");
                  // Should return "LAST"
                  list.get(5);
                  
                  /* 
                    Remove Tests 
                  */
                  
                  // Remove from the Front
                  // Display the list, should be a length of 6, with First at head, and LAST at tail
                  list
                  // Should return the node removed of "First"
                  list.remove(0);
                  // Display the list, should be a length of 5, with Hello at head, and LAST at tail
                  list
                  
                  // Remove from the middle
                  // Should return the node removed of "<3"
                  list.remove(3);
                  // Display the list, should be a length of 4, with Hello at head, and LAST at tail
                  list 
                  
                  
                  // Remove from the End
                  // Should return the node removed of "LAST"
                  list.remove(3);
                  // Display the list, should be a length of 3, with Hello at head, and My Friends at tail
                  list
                  
                  /*
                    Reverse Tests
                  */
                  
                  // For this it will probably be easier to run a new console session
                  // After copying and pasting the Node and Stringly Linked List classes into the console run these commands
                  
                  // Instantiates a new list
                  var list = new SinglyLinkedList();
                  
                  // Pushes four values into the list
                  list.push("Hello");
                  list.push("Goodbye");
                  list.push("World");
                  list.push("<3");
                  
                  // Displays whats in the list as an array
                  list.print();
                  
                  // Run this to reverse the list
                  list.reverse();
                  
                  // Display the freshly reversed list with the print function
                  list.print();
                  
                  /* 
                    Please forgive my grammar and comment over kill.
                    I hope you enjoyed the demo and were able to follow along!
                    - Brendan Pettis 
                  */
                `}
              </Highlight>
            </HighlightWrapper>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={()=> this.handleClose("experiments")}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
          
      </div>
    );
  }
}

export default SinglyLinkedList