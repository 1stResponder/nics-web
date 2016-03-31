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
define(['ext', "iweb/CoreModule", "nics/modules/UserProfileModule"],
    function(Ext, Core, UserProfile)
    {
        return Ext.define('modules.report-explosives.ExplosivesGraphController', {
            extend: 'Ext.app.ViewController',

            alias: 'controller.explosivesgraphcontroller',

            init: function()
            {
                this.mediator = Core.Mediator.getInstance();
            },

            setIncident: function(incidentId)
            {
                this.fetchData(incidentId);
            },

            fetchData: function(incidentId)
            {
                var topic = Core.Util.generateUUID();
                Core.EventManager.createCallbackHandler(topic, this, this.handleResponse);

                var endpoint = Core.Config.getProperty(UserProfile.REST_ENDPOINT);

                var url = Ext.String.format('{0}/reports/{1}/{2}', endpoint, incidentId, "UXO");

                this.mediator.sendRequestMessage(url, topic);
            },

            handleResponse: function(e, data)
            {
                if (data.message != "ok")
                {
                    console.log("Failed to load data for explosives graph!");
                    return;
                }

                var totals = {};
                totals.perDay = [];
                totals.byReporter = [];
                totals.byDeviceType = [];

                for (var i = 0; i < data.reports.length; i++)
                {
                    var report = data.reports[i];

                    // perDay
                    var date = new Date(report.seqtime);
                    var dateStr = date.toDateString();

                    var found = false;
                    for (var j = 0; j < totals.perDay.length; j++)
                    {
                        if (totals.perDay[j].name == dateStr) {
                            totals.perDay[j].value++;
                            found = true;
                            break;
                        }
                    }
                    if (!found)
                        totals.perDay.push({name: dateStr, value: 1});

                    // byReporter
                    found = false;
                    var message = JSON.parse(report.message);
                    var reporter = message["ur-reportingunit"];
                    if (reporter == "" || reporter == undefined)
                        reporter = "Anonymous";

                    for (j = 0; j < totals.byReporter.length; j++)
                    {
                        if (totals.byReporter[j].name == reporter)
                        {
                            totals.byReporter[j].value++;
                            found = true;
                            break;
                        }
                    }
                    if (!found)
                        totals.byReporter.push({name: reporter, value:1});

                    // byDeviceType
                    found = false;
                    var uxoType = message["ur-uxotype"];
                    if (uxoType == "" || uxoType == undefined)
                        uxoType = "Unidentified";

                    for (j = 0; j < totals.byDeviceType.length; j++)
                    {
                        if (totals.byDeviceType[j].name == uxoType)
                        {
                            totals.byDeviceType[j].value++;
                            found = true;
                            break;
                        }
                    }
                    if (!found)
                        totals.byDeviceType.push({name: uxoType, value:1});
                }

                this.getView().updateGraphs(totals);
            }
        });
    }
);
