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
 define(['iweb/CoreModule', './AccountInfoController', './ChangeOrgViewer', 'nics/modules/report/common/FormVTypes' ], 

 	function(Core, AccountInfoController, ChangeOrgViewer) {
 	
		Ext.define('modules.accountinfo.AccountInfoViewer', {
			extend: 'Ext.Button',
		
			controller: 'accountinfocontroller',

			requires: [ 'Ext.Panel', 'Ext.Button', 'Ext.form.TextField', 'Ext.Container' ],
			
			referenceHolder: true,

			initComponent: function(){

				this.accountInfoButton = this.addMenuItem(
					"Account Information", "accountInfoButton");

				this.menu.add(this.accountInfoButton);
				this.changeOrgButton= this.addMenuItem(
				"Change Organization", "changeOrgButton");
				this.menu.add(this.changeOrgButton);

				this.userAccountTab = Ext.create('Ext.form.Panel', {
				    title: 'User Account Info',
					layout: 'anchor',
					bodyPadding: 10,
					referenceHolder: true,
				    defaults: {
				        anchor: '100%'
				    },
				    defaultType: 'textfield',
				    items: [{
				        fieldLabel: 'Username',
				        name: 'username',
				        xtype: 'displayfield'
				    },
				    {
				        fieldLabel: 'First Name',
				        name: 'firstname',
				        vtype:'simplealphanum'
				    },
				    {
				        fieldLabel: 'Last Name',
				        name: 'lastname',
				        vtype:'simplealphanum'
				    },
				    {
				        fieldLabel: 'Old Password',
				        name: 'oldpw',
				        inputType: 'password'
				    },
				    {
				        fieldLabel: 'New Password',
				        name: 'newpw',
				        inputType: 'password'
				    },
				    {
				        fieldLabel: 'Confirm Password',
				        name: 'confirmpw',
				        inputType: 'password'
				    },
				    {
				        fieldLabel: 'Organization',
				        name: 'org',
				        xtype: 'displayfield'
				    },
				    {
				        fieldLabel: 'Job Title',
				        name: 'job',
				        vtype:'simplealphanum'
				    },
				    {
				        fieldLabel: 'Rank',
				        name: 'rank',
				        vtype:'simplealphanum'
				    },
				    {
				        fieldLabel: 'Job Description',
				        name: 'desc',
				        vtype:'simplealphanum'
				    }],
				    buttons: [{
				    	 text: 'Submit',
				    	 reference: 'submitButton'
				    }]
				});
				
				this.userContactTab = Ext.create('Ext.grid.Panel', {
						title: 'User Contact Info',
						store:{
							model:'modules.accountinfo.AccountInfoModel'
						},
						referenceHolder: true,
						selType: 'rowmodel',
						columns: [
						 	{
					            text: 'Contact Type',
					            dataIndex: 'contacttypeid',
					            editor:{
					            	xtype:'combobox',
					            	allowBlank: false,
					            	editable: false,
					            	store: Ext.create('Ext.data.Store', {
									    fields: ['contacttypeid', 'type'],
									    data : [
									        {'contacttypeid':0, 'type':'Email'},
									        {'contacttypeid':1, 'type':'Home Phone'},
									        {'contacttypeid':2, 'type':'Cell Phone'},
									        {'contacttypeid':3, 'type':'Office Phone'},
									        {'contacttypeid':4, 'type':'Radio Number'},
									        {'contacttypeid':5, 'type':'Other Phone'}
									    ]
									}),
									valueField: 'contacttypeid',
									displayField: 'type'
									
					            }
					        },{
					            text: 'Value',
					            dataIndex: 'value',
					            width: 150,
					            editor:{
					            	xtype: 'textfield',
                					allowBlank: false,
                					vtype:'simplealphanum'
					            }
					        }
					       ],
				   buttons: [{
				  				text: 'Add',
				    	 		reference: 'addButton'
				  				
				    		},
				    		{
				    			text: 'Delete',
				    	 		reference: 'deleteButton'
				   			}],
				   	plugins:[{
							ptype: 'rowediting',
							pluginId: 'rowediting',
							
							listeners:{
								beforeedit: function(editor, context){
									var record = context.record;
									return record.phantom;
								},
								canceledit: function(editor, context) {
									var record = context.record;
									context.store.remove(record);
								},
								validateedit: function(editor, context) {
									Core.EventManager.fireEvent('nics.user.contact.validate',context)
								}
							}
					}]
				});
				

				this.accountInfoTabs = Ext.create('Ext.tab.Panel', {
					height: 475,
				    bodyBorder: false,
				    border: false,
				    items: [this.userAccountTab, this.userContactTab]
				});
				this.organizationInfoTabs = Ext.create('Ext.tab.Panel', {
					height: 475,
				    bodyBorder: false,
				    border: false,
				    items: [new ChangeOrgViewer()]
				});
				 

				this.accountWindow = Ext.create('Ext.window.Window',{
					title: 'User Account Info',
					cls: 'account-info-window',
					layout : 'form',
					minimizable : false,
					closable : true,
					maximizable : false,
					resizable : false,
					draggable : true,
					height: 515,
					width: 450,
					closeAction: 'hide',
					buttonAlign: 'center',
			    	items: [
				    		this.accountInfoTabs
				    ]
				});	
				 	
				this.organizationWindow = Ext.create('Ext.window.Window',{
					cls: 'account-info-window',
					layout : 'form',
					minimizable : false,
					closable : true,
					maximizable : false,
					resizable : false,
					draggable : true,
					height: 515,
					width: 450,
					closeAction: 'hide',
					buttonAlign: 'center',
			    	items: [
				    		this.organizationInfoTabs
				    ]
				});	
				 	

				this.callParent();
			},
	
			config: {
				text : '',
				cls: 'accountinfo-btn',
			
				menu : {
					xtype : 'menu',
					cls: 'accountinfo-menu',
					forceLayout : true,
					autoWidth: true
				},
				baseCls: 'nontb_style'
			},
			
			addMenuItem: function(label, id){
			
				var config = {
					text: label,
					id:id
				};
				
				var newItem = Ext.create('Ext.menu.Item',config);
				
				return this.menu.add(newItem);
			},
			
			setButtonLabel: function(name){
				this.setText(name);
			},
			
			setFormField: function(field, value){
				this.userAccountTab.getForm().findField(field).setValue(value);
			},
			

		});
});
