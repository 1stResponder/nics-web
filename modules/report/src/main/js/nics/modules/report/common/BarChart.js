/*
 * Copyright (c) 2008-2015, Massachusetts Institute of Technology (MIT)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
define(["iweb/CoreModule", "d3"],
    function(Core, d3)
    {
        return Ext.define('modules.report.BarChart',
            {
                extend: "Ext.Component",
                alias: "widget.barchart",

                onRender: function()
                {
                    this.callParent(arguments);
                    this.el.on("load", this.onLoad, this);
                },

                onLoad: function()
                {
                    this.fireEvent("load", this);
                },

                setData: function(data, axisLabelY)
                {
                    var margin = {top: 20, right: 20, bottom: 150, left: 50},
                        width = 500 - margin.left - margin.right;

                    this.color = d3.scale.category20();
                    if (this.colors != undefined)
                    {
                        this.color = d3.scale.ordinal();
                        this.color.range(this.colors);
                    }

                    this.height = 500 - margin.top - margin.bottom;

                    this.graphX = d3.scale.ordinal().rangeRoundBands([10, width], .05);

                    this.graphY = d3.scale.linear().range([this.height, 0]);

                    this.xAxis = d3.svg.axis()
                        .scale(this.graphX)
                        .orient("bottom");

                    this.yAxis = d3.svg.axis()
                        .scale(this.graphY)
                        .orient("left")
                        .ticks(10);

                    this.svg = d3.select("#" + this.el.dom.id).append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", this.height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");

                    this.graphX.domain(data.map(function(d) { return d.name; }));
                    this.graphY.domain([0, d3.max(data, function(d) { return d.value; })]);

                    this.svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + this.height + ")")
                        .call(this.xAxis)
                        .selectAll("text")
                        .style("text-anchor", "end")
                        .attr("dx", "-.8em")
                        .attr("dy", "-.55em")
                        .attr("transform", "rotate(-90)" );

                    this.svg.append("g")
                        .attr("class", "y axis")
                        .call(this.yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text(axisLabelY);

                    var _color = this.color;
                    var _x = this.graphX;
                    var _y = this.graphY;
                    var _height = this.height;

                    this.svg.selectAll("bar")
                        .data(data)
                        .enter().append("rect")
                        .attr("class", "bar")
                        .style("fill", function(d) { return _color(d.name); })
                        .attr("x", function(d) { return _x(d.name); })
                        .attr("width", _x.rangeBand())
                        .attr("y", _height)
                        .attr("height", 0)
                        .transition()
                        .duration(500)
                        .delay(function(d, i) { return i * (1000 / data.length); })
                        .attr("height", function(d) { return _height - _y(d.value); })
                        .attr("y", function(d) { return _y(d.value); })

                    var _svg = this.svg;

                    var button = d3.select("#" + this.el.dom.id).append("button")
                        .text("SVG")
                        .on("click", function() {
                            var svgEl = _svg[0][0];
                            window.open("data:text/xml;charset=utf-8," + new XMLSerializer().serializeToString(svgEl.ownerSVGElement), 'Download');
                        });
                }
            }
        );
    }
);
