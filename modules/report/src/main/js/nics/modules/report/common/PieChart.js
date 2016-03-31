/*
 * Copyright (c) 2008-2016, Massachusetts Institute of Technology (MIT)
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
        var x, y, yAxis, xAxis, height, svg, color;

        return Ext.define('modules.report.PieChart',
            {
                extend: "Ext.Component",
                alias: "widget.piechart",

                initComponent: function()
                {
                    d3.legend = function(g)
                    {
                        g.each(function()
                        {
                            var g = d3.select(this),
                                items = {},
                                svg = d3.select(g.property("nearestViewportElement")),
                                legendPadding = g.attr("data-style-padding") || 5,
                                lb = g.selectAll(".legend-box").data([true]),
                                li = g.selectAll(".legend-items").data([true]);

                            lb.enter().append("rect").classed("legend-box", true);
                            li.enter().append("g").classed("legend-items", true);

                            svg.selectAll("[data-legend]").each(function() {
                                var self = d3.select(this);
                                items[self.attr("data-legend")] = {
                                    pos : self.attr("data-legend-pos") || this.getBoundingClientRect().y,
                                    color : self.attr("data-legend-color") != undefined ? self.attr("data-legend-color") : self.style("fill") != 'none' ? self.style("fill") : self.style("stroke")
                                }
                            });

                            items = d3.entries(items);

                            var colors = [];
                            for (var i = 0; i < items.length; i++)
                            {
                                colors.push(items[i].value.color);
                            }

                            li.selectAll("text")
                                .data(items, function(d) { return d.key; })
                                .call(function(d) { d.enter().append("text"); })
                                .call(function(d) { d.exit().remove(); })
                                .attr("y", function(d,i) { return i + "em"; })
                                .attr("x", "1em")
                                .text(function(d) { return d.key });

                            var color = d3.scale.ordinal();
                            color.range(colors);

                            li.selectAll("circle")
                                .data(items, function(d) { return d.key; })
                                .call(function(d) { d.enter().append("circle"); })
                                .call(function(d) { d.exit().remove(); })
                                .attr("cy", function(d,i) { return i - 0.25 + "em"})
                                .attr("cx", 0)
                                .attr("r", "0.4em")
                                .style("fill", function(d, i) { return color(i); });

                            var lbbox = li[0][0].getBoundingClientRect();
                            lb.attr("x", (lbbox.x - legendPadding))
                                .attr("y", (lbbox.y - legendPadding))
                                .attr("height", (lbbox.height + 2 * legendPadding))
                                .attr("width", (lbbox.width + 2 * legendPadding))
                        });
                        return g;
                    };

                    this.callParent();
                },

                setData: function(data)
                {
                    if (svg != null)
                    {
                        d3.select("#" + this.el.dom.id).selectAll("svg").remove();
                    }

                    var margin = {top: 20, right: 20, bottom: 20, left: 40},
                        width = 500 - margin.left - margin.right,
                        height = 400 - margin.top - margin.bottom,
                        radius = Math.min(width, height) / 3;

                    var color = d3.scale.category20();
                    if (this.colors != undefined)
                    {
                        color = d3.scale.ordinal();
                        color.range(this.colors);
                    }

                    var arc = d3.svg.arc()
                        .outerRadius(radius - 10)
                        .innerRadius(0);

                    this.pie = d3.layout.pie()
                        .sort(null)
                        .value(function(d) { return d.value; });

                    svg = d3.select("#" + this.el.dom.id).append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + (margin.left + width / 4) + "," + (margin.top + height / 3) + ")");

                    this.g = svg.selectAll(".arc")
                        .data(this.pie(data))
                        .enter().append("g")
                        .attr("class", "arc");

                    this.path = this.g.append("path")
                        .attr("d", arc)
                        .attr("data-legend", function(d) { return d.data.name + " - " + d.data.value; })
                        .style("fill", function(d, i) { return color(i);});

                    var legend = svg.append("g")
                        .attr("class", "legend")
                        .attr("transform", "translate(150,-75)")
                        .style("font-size", "12px")
                        .call(d3.legend);

                    var button = d3.select("#" + this.el.dom.id).append("button")
                        .text("SVG")
                        .on("click", function() {
                            var svgEl = svg[0][0];
                            window.open("data:text/xml;charset=utf-8," + new XMLSerializer().serializeToString(svgEl.ownerSVGElement), 'Download');
                        });
                }
            }
        );
    }
);