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
define(['iweb/CoreModule', "nics/modules/UserProfileModule", "nics/modules/report/common/OrgChart",'../AbstractFormController', './I207ReportView',  './I207FormView','./I207FormViewModel'],

	function(Core, UserProfile, OrgChart,AbstractFormController, I207ReportView, I207FormView , I207FormViewModel ){
	
		
	
		Ext.define('modules.report-opp.I207FormController', {
			extend : 'modules.report-opp.AbstractFormController',
			
			alias: 'controller.i207formcontroller',
			init : function(args) {
				
				this.mediator = Core.Mediator.getInstance();
				
				   
				this.callParent();
				
				
			},
				
			onJoinIncident: function(e, incident) {
				
				this.getView().enable();		
			},
			
			

			setFormReadOnly: function () {
				    var allowUpdate = true;
			    	this.view.getForm().getFields().each (function (field) {
			    		field.setReadOnly(true);
			    		
			    			
			    	});
			    	this.view.lookupReference('submitButton207').hide();
			    	this.view.lookupReference('cancelButton207').hide();
			    	this.view.lookupReference('resetButton207').hide();
			    	Ext.ComponentQuery.query('checkbox[cls=i207]').forEach(function(checkbox) {
			    		checkbox.hide();
			    	});
			    	if (this.lookupReference('orgchart'))this.lookupReference('orgchart').setData();
			    		if (Ext.getCmp('update207'))  Ext.getCmp('update207').enable(); 
			    		if (Ext.getCmp('view207'))   Ext.getCmp('view207').enable(); 
			    },
			    cancelForm: function(){

		    		Core.EventManager.fireEvent("CancelReport203", 'cancelForm');
			    		
		    	},
		    	cancelImport: function(){
		    		Core.EventManager.fireEvent("CancelReport203", 'cancelImport');
			    		
		    	},
		    	
	    	
	    
	    	
	    	
	    	
	    
	    	
	    	
		   
			
	    	
				
		
			
		});
});