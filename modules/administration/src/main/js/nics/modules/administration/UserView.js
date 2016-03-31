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
define(['./DDGridView', './UserController', './UserModel'],
		function(DDGridView, UserController, UserModel) {
	

	var FIRST_GRID_REF = "firstGrid";
	var SECOND_GRID_REF = "secondGrid";

	return Ext.define('modules.administration.UserView', {
	 
	 	extend: 'Ext.Panel',

	 	controller: 'usercontroller',
	 	
	 	reference: 'userView',
	 	
	 	title: 'Users',
	    
	    collapsible: true,
	    
	    autoWidth: true,
 		autoHeight: true,
	 
	 	initComponent: function(){
			this.callParent();
			
			this.add(new DDGridView({
			    reference: 'adminUserGrid',
			    region: 'center',
				columns: [
			        {text: "User Name", flex: 1, sortable: true, dataIndex: 'username'}
			    ],
			    dataModel: UserModel,
			    grids: [
				  {
					  title:'Enabled Users',
					  ref: FIRST_GRID_REF,
					  dragGroup: 'firstGridDDGroup',
					  dropGroup: 'secondGridDDGroup'
				   },{
					  title:'Disabled Users',
					  ref: SECOND_GRID_REF,
					  dragGroup: 'secondGridDDGroup',
					  dropGroup: 'firstGridDDGroup'
				   }         
				],
				height: 400
			}));
			
			this.add({
	        	xtype: 'panel',
	        	html: 'Drag and drop a username to enable/disable. <br/>To multi-select rows, hold down the control key while selecting.', 
	        	bodyStyle: 'padding:5px;font-size:12px'
			});

			this.lookupReference(FIRST_GRID_REF).addListener("rowdblclick", this.controller.onUserClick, this.controller);
			this.lookupReference(SECOND_GRID_REF).addListener("rowdblclick", this.controller.onUserClick, this.controller);
		},
	 	
	 	/*items:[{
			xtype: 'combobox',
			width: '100%',
			forceSelection: true,
			queryMode: 'local',
			displayField: 'workspacename',
			valueField: 'workspaceid',
			reference: 'adminWorkspaceDropdown',
			fieldStyle: {
				'textAlign':'center'
			},
			listConfig: {
				style: {
					'textAlign':'center'
				}
			},
			store: {
				fields: ['workspacename', 'workspaceid']
			},
			listeners:{
				select: 'setWorkspaceId'
			}
		}],*/
		
		getUsersPanel: function(){
			return this.lookupReference('adminUserGrid');
		},
		
		getFirstGrid: function(){
			return this.lookupReference(FIRST_GRID_REF);
		},
		
		getSecondGrid: function(){
			return this.lookupReference(SECOND_GRID_REF);
		},
		
		getWorkspaceDropdown: function(){
			return this.lookupReference('adminWorkspaceDropdown');
		},
		
		setWorkspaceDropdown: function(workspaceId){
			var dropdown = this.getWorkspaceDropdown();
			dropdown.select(dropdown.findRecord('workspaceid', workspaceId));
		},
		
		clearGrids: function(){
			var firstGrid = this.getFirstGrid();
			var secondGrid = this.getSecondGrid();
			
			if(firstGrid.getStore().getCount() > 0){
				firstGrid.getStore().removeAll();
			}
			
			if(secondGrid.getStore().getCount() > 0){
				secondGrid.getStore().removeAll();
			}
		}
	 });
});
