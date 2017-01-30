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
define(['./DDGridView', './ArchivedIncidentLookupController', './ArchiveModel',  'iweb/core/FormVTypes'],
		function(DDGridView, ArchivedIncidentLookupController, ArchiveModel) {
	
	return Ext.define('modules.administration.ArchivedIncidentLookup', {
	 
	 	extend: 'Ext.window.Window',
	 	
	 	title: 'Archived Incident Lookup',
        
	 	layout: {
            type: 'vbox',
            align: 'stretch'
        },
	 	
	 	controller: 'archivedincidentlookupcontroller',
	 	
	 	closeAction : 'hide',
	 	
	 	width: 400,
	 	
	 	height: 400,
	 	
	 	items: [{
	 		xtype:'form',
            layout: 'vbox',
            reference: 'incidentLookupForm',
            items: [{
	            xtype: 'fieldcontainer',
	            fieldLabel: 'Search Type',
	            defaultType: 'radiofield',
	            layout: {
		            type: 'hbox',
		            align: 'stretch'
		        },
	            items: [
	                {
				        xtype: 'radiogroup',
				        layout: {
				            type: 'hbox',
				            align: 'stretch'
				        },
				        items: [
				            { 
				            	boxLabel: 'Org Prefix', 
				            	name: 'rb', 
				            	reference: 'orgPrefix',
				            	flex: 1
				            },{ 
				            	boxLabel: 'Contains', 
				            	name: 'rb', 
				            	reference: 'contains'
				            }
				        ]
				    }
	            ]
	        },{
	        	xtype: 'textfield',
	        	fieldLabel: 'Search Value',
	        	reference: 'searchInput',
		        vtype:'simplealphanum'
	        }],
	        
	        buttons: [{
	        		text: 'Search',
	        		handler: 'findArchivedIncidents'
	        	}]
	 		},{
	        
	            xtype: 'grid',
	            flex:1,
	            reference: 'lookupGrid',
	            
	            store: {
	            	fields: [ "incidentname", "incidentid" ]
		        },
		        
		        autoHeight: true,
		        autoWidth: true,
		        autoScroll: true,
		       
		                
		        columns: [{
		            text: 'Incident',
		            dataIndex: 'incidentname',
		            flex: 1
		        }],
		        
		        buttons: [{
		        	text: 'Join',
		        	handler: 'joinIncident'
		        },{
		        	text: 'Clear',
		        	handler: 'clearGrid'
		        }],
		        selModel: {
		            selType: 'rowmodel',
		            mode   : 'SINGLE'
		        }
	    	}]
	});
});