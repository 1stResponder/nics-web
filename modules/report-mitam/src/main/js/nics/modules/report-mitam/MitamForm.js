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
         './MitamFormViewModel',
         './MitamFormController'], function(Core) {
	Ext.define('modules.report-mitam.MitamForm', {
	    
		extend: 'Ext.form.Panel',
		    	    
	    controller: 'mitamformcontroller',
	    
	    buttonAlign: 'center',
	
	    viewModel: {
	       type: 'mitam'
	    },
	    
	    autoHeight: true,
	    autoWidth: true,
	    
	    defaults: {
    	    scrollable: true,
            bodyPadding: 5,
            border: false
	    },
	    
	    listeners: {
	    	beforedestroy: 'onClose'
	    },
	    
	    layout: 'border',
	    
	    referenceHolder: true,
	    
	    setReadOnly: function () {
	    	this.getForm().getFields().each (function (field) {
	    		field.setReadOnly(true);
	    	});
	    	
	    	Ext.Array.forEach(this.query("button"), function(button){
	    		if(button.text == "Submit"){
	    			button.hide();
	    		}else if(button.text != "Cancel"){
	    			button.disable();
	    		} 
	    	});
	    	this.controller.setReadOnly(true);
	    },
	    
	    disableUpdateForm: function(){
	    	var form = this.lookupReference('updateForm');
	    	form.setHidden(true);
	    	
	    	//Enable all of the fields
	    	for(var i=0; i<form.items.length; i++){
	    		form.items.getAt(i).setDisabled(true);
	    	}
	    },
	    
	    items:[{
		    xtype: 'container',
	    	region: 'center',
		    defaultType: 'textfield',
		    reference: 'mitamForm',
            margin: '5 5 5 5',
		    items: [{
		            xtype: 'fieldcontainer',
		    	    defaultType: 'textfield',
		            reference: 'mitanFields',
		            items:[
				        {
				        	fieldLabel: 'Request Name',
				        	bind: '{name}',
					    	allowBlank: false
				        },
					    {
					        fieldLabel: 'Requesting Organization',
					        bind: '{org}',
					        allowBlank: false
					    }
				     ]
		    	},{
		            xtype: 'fieldcontainer',
		            layout: {
		                type: 'table',
		                columns: 2
		            },
		            fieldLabel: 'Categories',
		            defaultType: 'checkboxfield',
		            items: [
		                {
		                    boxLabel  : 'Transportation',
		                    bind	  : '{Transportation}'
		                }, {
		                    boxLabel  : 'Medical',
		                    bind	  : '{Medical}'
		                }, {
		                    boxLabel  : 'Re-Supply',
		                    bind	  : '{ReSupply}'
		                }, {
		                    boxLabel  : 'Security',
		                    bind	  : '{Security}'
		                }, {
		                    boxLabel  : 'Assessment',
		                    bind	  : '{Assessment}'
		                }, {
		                    boxLabel  : 'Engineering',
		                    bind	  : '{Engineering}'
		                }, {
		                    boxLabel  : 'Other',
		                    bind	  : '{Other}'
		                }, {
		                	xtype	  : 'textfield',
		                    bind	  : '{otherValue}'
		                }
		            ]
		        },
		        {
		            xtype: 'fieldcontainer',
		            defaultType: 'combobox',
		            defaults: {
		            	margin: '0 0 5 0',
			            editable: false,
			            displayField: 'label',
			            valueField: 'name',
			            labelWidth: 160,
	    	            queryMode: 'local',
				    	allowBlank: false
		            },
		            items:[{
		            	bind: {
			                store: '{duration}',
			                value: '{durationValue}'
			            },
			            fieldLabel: 'Duration'
			        },{
			            bind: {
			                store: '{priority}',
			                value: '{priorityValue}'
			            },
			            fieldLabel: 'Priority'
			        },{
			            bind: {
			                store: '{sizeOfEffort}',
			                value: '{sizeOfEffortValue}'
			            },
			            fieldLabel: 'Size of Effort'
			        },{
			            bind: {
			                store: '{hazardousMaterials}',
			                value: '{hazardousMaterialsValue}'
			            },
			            fieldLabel: 'Hazardous Materials'
			        }]
		        },{
		        	xtype: 'fieldset',
    	        	title: 'Destinations', 
		        	items: [{
			        	xtype: 'panel',
			        	border: false,
			        	margin: '10 20 10 20',
			        	header: false,
			        	dockedItems: [{
			                xtype: 'toolbar',
			                dock: 'top',
			                layout: {
			                	pack: 'start'
			                },
			                items: [{
				        		xtype: 'button',
				        		text: 'Add',
				        		handler: 'addDestination'
				        	},{
				        		xtype: 'button',
				        		text: 'Locate',
			                	enableToggle: true,
			                	reference: 'locateButton',
			                	listeners: {
			                		toggle: 'locateArea'
			                	}
				        	},{
				        		xtype: 'button',
				        		text: 'Delete',
				        		handler: 'deleteDestination'
				        	},{
				        		xtype: 'button',
				        		text: 'Zoom',
				        		reference: 'zoomButton',
				        		handler: 'zoomToDestination',
				        		disabled: true
				        	}]
			            }],
			        	items: [{
	        	        	xtype: 'gridpanel',
	    		        	reference: 'destinations',
		    	        	columns: [{ text: 'Title', dataIndex: 'title', flex: 1 }],
	        	            bind: {
	        	                store: '{destination}'
	        	            },
	        	            listeners: {
	        	            	selectionchange: 'onSelectionChange',
	        	            },
	        	            selModel: {
	    	        	          selType: 'checkboxmodel',
	    	        	          showHeaderCheckbox: false,
	    	        	          mode: 'single'
	    	        	    }
	        	        }]
		        	}]
		        },{
		        	xtype: 'container',
		        	header: false,
		        	border: false,
		        	margin: '10 20 10 20',
		        	items: [
	        	        {
	        	        	xtype: 'fieldset',
	        	        	title: 'Custom Field', 
	    		        	reference: 'customField',
	        	        	layout: {
	    		                type: 'table',
	    		                columns: 3,
    	                        tdAttrs: { style: 'padding: 10px;' }
	    		            },
	        	        	items:[
	    		        	       {
	    		        	    	   xtype:'textfield',
	    		        	    	   fieldLabel: 'Label',
	    		        	    	   labelWidth: 50,
	    		        	    	   bind: '{newLabel}',
	    		        	    	   margin: '5 0 5 5',
	    		        	    	   width: 150
	    		        	       },{
	    		        	    	   xtype:'textfield',
	    		        	    	   fieldLabel: 'Value',
	    		        	    	   labelWidth: 50,
	    		        	    	   bind: '{newValue}',
	    		        	    	   margin: '5 0 5 5',
	    		        	    	   width: 150
	    		        	       },{
	    		        	    	   xtype: 'button',
	    		        	    	   text: 'Add',
	    		        	    	   handler: 'addCustomField'
	    				        	}
	    		        	]
	        	        }
		        	]
		        }]
		     },{
    	    	xtype: 'fieldcontainer',
    	    	scrollable: true,
    	        bodyPadding: 5,
    		    height: 200,
    		    autoWidth: true,
    		    region: 'south',
    		    reference: 'updateForm',
    		    defaults: {
    		    	allowBlank: false
    		    },
    		    defaultType: 'textfield',
    		    title: 'Requestor Information',
    		    items:[{
            		fieldLabel: 'Requestor',
            		bind: '{requestor}',
    	            labelWidth: 160
    	    	},{
                	xtype: 'combobox',
    	            margin: '0 0 5 0',
    	            forceSelection: true,
    	            editable: false,
    	            displayField: 'label',
    	            valueField: 'name',
    	            triggerAction: 'all',
    	            queryMode: 'local',
    	            labelWidth: 160,
    	            bind: {
    	                store: '{performer}',
    	                value: '{performerValue}'
    	            },
    	            fieldLabel: 'Performer'
    	        },{
    	            xtype: 'combobox',
    	            margin: '0 0 5 0',
    	            forceSelection: true,
    	            editable: false,
    	            displayField: 'label',
    	            valueField: 'name',
    	            triggerAction: 'all',
    	            queryMode: 'local',
    	            labelWidth: 160,
    	            bind: {
    	                store: '{status}',
    	                value: '{statusValue}'
    	            },
    	            fieldLabel: 'Status'
    	        },{
    	        	xtype: 'gridpanel',
    	        	header: false,
    	        	border: false,
    	        	margin: '10 25 10 25',
    	        	plugins: [
    	              Ext.create('Ext.grid.plugin.CellEditing', {
    	                  clicksToEdit: 1
    	              })
    	            ],
    	            listeners: {
    	            	beforeedit: 'onBeforeTaskEdit'
    	            },
    	            reference: 'taskgrid',
    	        	columns: [{ 
    	        			text: 'Task', 
    	        			dataIndex: 'task', 
    	        			flex: 1 
    	        		},{ 
    	        			text: 'Status', 
    	        			dataIndex: 'status',
    	        			 editor: {
    	 	                    xtype: 'combo',
    	 	                    store: ['Submitted',
    	 	                            'Approved',
    	 	                            'Open',
    	 	                            'Cancelled',
    	 	                            'Closed',
    	 	                            'Completed',
    	 	                            'Not Accepted']
    	 	                }
    	        		}
            	    ],
    	            bind: {
    	                store: '{task}'
    	            },
    	        	buttonAlign: 'center',
    	        	buttons: [{
    	        		text: 'Add',
    	        		handler: 'addTask'
    	        	}]
    	        }]
	    	}],
	    	buttons: [{
	        	text: 'Submit',
		        handler: 'submitForm',
		        formBind: true, //only enabled once the form is valid
		        disabled: true
	    		},{
	        	text: 'Cancel',
		        handler: 'cancelForm'
		     }]
	     });
});