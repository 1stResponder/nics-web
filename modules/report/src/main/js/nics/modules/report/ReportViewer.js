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
 define(['iweb/CoreModule', 
         	'./ReportController'
         ], function(Core) {
	Ext.define('modules.report.ReportViewer', {

		extend: 'Ext.tab.Panel',
		
		controller: 'reportcontroller',

		initComponent: function(){
			this.reportListHeader = '<b>Reports</b><br/><ul>';
			this.reportList =
			this.reportListFooter = '</ul><br/>';
			
			this.callParent();
		},
	
		config: {
			title: 'Reports',
			text : 'Reports',
			style: 'nontb_style'
		},		
		
		/**
		 * Adds the given report as a new tab, generally should be a Panel
		 * 
		 * report = {title: 'Report Title', component: <Ext component to add in new tab>}
		 */
		addReport: function(report) {
			if(report && report.title && report.component) {
				
				// Check to see if the component has a set title, and if not, set it to the
				// one specified
				if(!report.component.title) {
					report.component.title = report.title;
				}
								
				this.add(report.component);
				
			} else {
				if(console){console.log("ReportViewer: report was either undefined, or missing a title: ",
						report);}
			}
		}
	});
});
