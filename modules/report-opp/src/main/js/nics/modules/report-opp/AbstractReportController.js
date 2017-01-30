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
define([  'iweb/CoreModule', 
			'nics/modules/UserProfileModule'
			],

function(Core, UserProfile) {
	
	Ext.define('modules.report-opp.AbstractReportController', {
		extend : 'Ext.app.ViewController',
		
		alias : 'controller.oppabstractreportcontroller',
		
		

        onUpdate: function(){
        	this.displayCurrentRecord(false, 'UPDATE');
		},
		
		onFinalize: function(){
			this.displayCurrentRecord(false, 'FINAL');
		},
		
		onReportSelect: function(){
			this.displayCurrentRecord(true, 'select');	
		},
		onView: function(){
			this.displayCurrentRecord(true, 'select');	
		},
		onReportRendered: function() {	
			 this.displayCurrentRecord(true, 'select');	
			
		},
		onCancel: function(e, message){
			if (message === 'cancelImport'){
				var combo  = this.lookupReference(this.view.comboRef);
				combo.clearValue();
				combo.getStore().removeAll()
				var oppReportContainer = this.view.lookupReference(this.view.oppReportRef);
				oppReportContainer.removeAll();
				this.enableButton(this.view.createRef);
				this.disableButton(this.view.updateRef);
				this.disableButton(this.view.finalRef);
				
			}
			else {
				var combo  = this.lookupReference(this.view.comboRef);
				var currentFormId=combo.getValue();
				if (currentFormId){
					this.hasFinalForm = false;
					this.displayCurrentRecord(true, 'select');
				}
				else{
					var oppReportContainer = this.view.lookupReference(this.view.oppReportRef);
					oppReportContainer.removeAll();
					this.enableButton(this.view.createRef);
					
				}
			}
				
		},
		
		

		buildReportData: function(report){
			var message = JSON.parse(report.message);
			var reportTitle  = message.datecreated;
			var reportType = message.report.reportType;
		
			
			
			return {
				formId: report.formId,
				incidentId: this.incidentId,
				incidentName: this.incidentName,
				name: reportTitle,
				message: report.message,
				status: reportType,
				datecreated: report.datecreated
				
			};
		},
		
		
		
		enableButton: function(buttonRef){
			if(this.lookupReference(buttonRef)) this.lookupReference(buttonRef).enable();
			
			
		},
		disableButton: function(buttonRef){
			if(this.lookupReference(buttonRef)) this.lookupReference(buttonRef).disable();
			
			
		},

	onReportReady: function(e, response) {
		if (response){
			 var iFrameId = "printerFrame";
			 var printFrame = Ext.get(iFrameId);
			 if (printFrame == null) {
		     printFrame = Ext.getBody().appendChild({
		                id: iFrameId,
		                tag: 'iframe',
		                cls: 'x-hidden',  style: {
		                    display: "none"
		                }
		            });
		        }
		     var printContent = printFrame.dom.contentWindow;
			  // output to the iframe
		     printContent.document.open();
		     printContent.document.write(response);
		     printContent.document.close();
		  // print the iframe
		     printContent.print();
		
			}
			
	}
	});
});
