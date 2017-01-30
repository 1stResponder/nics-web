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
define([
	'iweb/CoreModule',
	'./report-opp/i201/I201ReportView',
	'./report-opp/i201/I201FormView',	
	'./report-opp/i202/I202ReportView',
	'./report-opp/i202/I202FormView',
	'./report-opp/i203/I203ReportView',
	'./report-opp/i203/I203FormView',
	'./report-opp/i204/I204ReportView',
	'./report-opp/i204/I204FormView',
	'./report-opp/i205/I205ReportView',
	'./report-opp/i205/I205FormView',
	'./report-opp/i206/I206ReportView',
	'./report-opp/i206/I206FormView',
	'./report-opp/i207/I207ReportView',
	'./report-opp/i207/I207FormView'	
	
	], 
	
	function(Core,  I201ReportView, I201FormView,  I202ReportView, I202FormView,I203ReportView, I203FormView,I204ReportView, I204FormView, I205ReportView, I205FormView , I206ReportView, I206FormView, I207ReportView, I207FormView ) {
	
		var OppReportModule = function(){};
		
		OppReportModule.prototype.load = function(){
			
			var i201ReportView = Ext.create('modules.report-opp.I201ReportView');
			var i202ReportView = Ext.create('modules.report-opp.I202ReportView');
			var i203ReportView = Ext.create('modules.report-opp.I203ReportView');
			var i204ReportView = Ext.create('modules.report-opp.I204ReportView');
			var i205ReportView = Ext.create('modules.report-opp.I205ReportView');
			var i206ReportView = Ext.create('modules.report-opp.I206ReportView');
			var i207ReportView = Ext.create('modules.report-opp.I207ReportView');
			

		};
		
		return new OppReportModule();

		
	
	}
);
	
