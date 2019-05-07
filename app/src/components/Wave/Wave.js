import React, { Component } from 'react'
import * as d3 from "d3";
import './style.css';

class Wave extends Component {

  handleClose(name) {
    this.setState({ [name]: { show: false }});
  }

  handleShow(name) {
    this.setState({ [name]: { show: true }});
  }

  componentDidMount = () => {
    (function () {
  
      var color = d3.scaleSequential(d3.interpolateBlues),
          waves, particles, x, y, r, data, boat;
  
      draw('svg');
      d3.timer(animate);
  
  
      function draw(type, r) {
  
          var example = d3.select("#example"),
              width = (window.innerWidth - 100),
              height = Math.min(500, width);
          x = d3.scaleLinear().range([0, width]);
          y = d3.scaleLinear().range([height, 0]);
  
          if (!data)
              data = [0.7, 0.6, 0.4, 0.2].map(function (d, i) {
                  var w = wave()
                      .radius(0.02*(i+1)*height)
                      .waveLength(0.2*(i+1))
                      .y(d);
                  w.area.x(function (dd) {
                      return x(dd.x) + dd.dx;
                  }).y1(function (dd) {
                      return y(dd.y) - dd.dy;
                  }).y0(function () {
                      return y(0);
                  });
                  return w;
              });
  
          example.select('.paper').remove();
  
          var paper = example
                  .append(type)
                  .classed('paper', true)
                  .attr('width', width).attr('height', height)
                  .style('stroke-width', 0.5);
  
          sun(paper)
              .append('rect')
              .attr('width', width)
              .attr('height', height)
              .style('fill', 'url(#sun)');
  
          waves = paper
              .append('g')
              .classed('waves', true)
              .selectAll('path')
              .data(data)
              .enter()
              .append('path')
              .style('stroke', 'none')
              .each(function (d) {
                  d3.select(this).attr('d', d.context(null)).style('fill', color(d.y()));
              });
  
          var circles = paper.selectAll('g.circles')
              .data(data)
              .enter()
              .append('g')
              .classed('circles', true)
              .selectAll('circles')
              .data(function (d) {return d.points();})
              .enter()
              .append('circle')
              .attr('r', function (d) {return d.radius;})
              .style('fill', 'none')
              .style('stroke', '#666')
              .attr('cx', function (d) {return x(d.x);})
              .attr('cy', function (d) {return y(d.y);});
  
          particles = paper.selectAll('g.particles')
              .data(data)
              .enter()
              .append('g')
              .classed('particles', true)
              .selectAll('circles')
              .data(function (d) {return d.points();})
              .enter()
              .append('circle')
              .attr('r', 3)
              .style('fill', '#666')
              .style('stroke-width', 0)
              .attr('cx', function (d) {return x(d.x) + d.dx;})
              .attr('cy', function (d) {return y(d.y) - d.dy;});
  
          boat = paper.append('text')
              .text("⛵")
              .style('text-anchor', 'middle')
              .style('alignment-baseline', 'middle')
              .style("font-size", "60px");
  
          moveBoat();
      }
  
      function animate () {
          waves.each(function (d) {
              d3.select(this).attr('d', d.tick());
          });
          particles.data(function (d) {return d.points();})
              .attr('cx', function (d) {return x(d.x) + d.dx;})
              .attr('cy', function (d) {return y(d.y) - d.dy;});
          moveBoat();
      }
  
      function moveBoat() {
          var d = data[1].point(20);
          boat.attr("transform", "translate(" + (x(d.x) + d.dx) + ", " + (y(d.y) - d.dy) + ")");
      }
  
      function sun (paper) {
          paper
              .append('defs')
              .append('radialGradient')
              .attr('id', 'sun')
              .attr('cx', '70%')
              .attr('cy', '30%')
              .attr('fx', '60%')
              .attr('fy', '30%')
              .selectAll('stop')
              .data([
                  {color: "#1e2b58", offset: '0%'},
                  {color: '#614cbf', offset: '60%'}
              ])
              .enter()
              .append('stop')
              .attr('offset', function (d) {
                  return d.offset;
              })
              .attr('stop-color', function (d) {
                  return d.color;
              });
          return paper;
      }
  
      function wave() {
          var radius = 0.1,       // intensity of wave
              waveLength = 1,     // wave length
              y = 0,
              area = d3.area().curve(d3.curveNatural),
              extent = [0, 1],
              pi = Math.PI,
              cos = Math.cos,
              sin = Math.sin,
              N = 8,
              speed = 0.01,
              time = 0;
  
          function wave (d) {
              return area(wave.points(d));
          }
  
          wave.area = area;
  
          wave.tick = function () {
              time += 1;
              return wave;
          };
  
          wave.context = function (_) {
              if (!arguments.length) return area.context();
              area.context(_);
              return wave;
          };
  
          wave.extent = function (_) {
              if (!arguments.length) return extent;
              extent = _;
              return wave;
          };
  
          wave.N = function (_) {
              if (!arguments.length) return N;
              N = +_;
              return wave;
          };
  
          wave.waveLength = function (_) {
              if (!arguments.length) return waveLength;
              waveLength = _;
              return wave;
          };
  
          wave.y = function (_) {
              if (!arguments.length) return y;
              y = _;
              return wave;
          };
  
          wave.radius = function (_) {
              if (!arguments.length) return radius;
              radius = _;
              return wave;
          };
  
          wave.speed = function (_) {
              if (!arguments.length) return speed;
              speed = _;
              return wave;
          };
  
          wave.points = function () {
              var w = extent[1] - extent[0] + 2*waveLength,
                  dx = waveLength/N,
                  Nx = Math.round(w/dx) + 1;
  
              return d3.range(Nx).map(point);
          };
  
          wave.point = point;
  
          function point (i) {
              var da = 2*pi/N,
                  dx = waveLength/N,
                  x0 = extent[0] - waveLength,
                  a = i*da - time*speed*pi;
  
              return {
                  x: x0 + i * dx,
                  y: y,
                  angle: a,
                  radius: radius,
                  dx: radius * cos(a),
                  dy: radius * sin(a)
              };
          }
  
          return wave;
      }
  
  }());
  }

  render() {
    return (
   <>   
      <div id="example"></div>
    </>
    );
  }
}

export default Wave