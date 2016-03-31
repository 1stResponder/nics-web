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
define(['./DDGridView', './UserLookupController', './UserModel'],
		function(DDGridView, UserLookupController, UserModel) {
	
	return Ext.define('modules.administration.UserLookupView', {
	 
	 	extend: 'Ext.window.Window',
	 	
	 	title: 'User Lookup',
        
	 	layout: {
            type: 'vbox',
            align: 'stretch'
        },
	 	
	 	controller: 'userlookupcontroller',
	 	
	 	closeAction : 'hide',
	 	
	 	width: 400,
	 	
	 	height: 400,
	 	
	 	items: [{
	 		xtype:'form',
            layout: 'vbox',
            reference: 'userLookupForm',
            listeners: {
    			
            	hide:  function() {
                     alert('Rendered.');}
    		},
	 		items: [{
	            xtype: 'fieldcontainer',
	            fieldLabel: 'Search Type',
	            defaultType: 'radiofield',
	            defaults: {
	                flex: 1
	            },
	            layout: {
		            type: 'hbox',
		            align: 'stretch'
		        },
	            items: [
	                {
				        xtype: 'radiogroup',
				        items: [
				            { 
				            	boxLabel: 'Exact', 
				            	name: 'rb', 
				            	reference: 'exact' 
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
	        	fieldLabel: 'First Name ',
	        	reference: 'firstName'
	        },{
	        	xtype: 'textfield',
	        	fieldLabel: 'Last Name',
	        	reference: 'lastName'
	        }],
	        
	        buttons: [{
	        		text: 'Search',
	        		handler: 'findUsers'
	        	}]
	 		},{
	        
	            xtype: 'grid',
	            flex:1,
	            reference: 'lookupGrid',
	            
	            store: {
	            	fields: ['username', 'firstName', 'lastName', 'userId']
		        },
		        
		        autoHeight: true,
		        autoWidth: true,
		        autoScroll: true,
		       
		                
		        columns: [{
		            text: 'Username',
		            dataIndex: 'username',
		            flex: 1
		        },{
		            text: 'First Name',
		            dataIndex: 'firstName',
		            flex: 1
		        },{
		        	text: 'Last Name',
		            dataIndex: 'lastName'
		        }],
		        
		        buttons: [{
		        	text: 'Add Users',
		        	handler: 'addSelectedUsers'
		        },{
		        	text: 'Clear',
		        	handler: 'clearGrid'
		        }],
		        selModel: {
		            selType: 'rowmodel',
		            mode   : 'MULTI'
		        }
	    	}]
	});
});