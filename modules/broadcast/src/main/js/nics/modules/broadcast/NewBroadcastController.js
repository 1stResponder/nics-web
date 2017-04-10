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
define(['ext', "iweb/CoreModule", 'nics/modules/UserProfileModule', 'nics/modules/user/UserLookupView'],
    function(Ext, Core, UserProfile, UserLookupView){
        Ext.define('modules.broadcast.NewBroadcastController', {
            extend : 'Ext.app.ViewController',

            alias: 'controller.newbroadcastcontroller',

            init: function(){
            	this.lookupWindow = new UserLookupView({
            		callback: { fnc: this.addUsers, scope: this}
            	});            	
            	
                this.mediator = Core.Mediator.getInstance();
                
                Core.EventManager.addListener("NICS.broadcast.activeUsers", this.onLoadActiveUsers.bind(this));
            },
            
            onShow: function(){
            	var url = Ext.String.format("{0}/users/{1}/active", 
    					Core.Config.getProperty(UserProfile.REST_ENDPOINT),
    					UserProfile.getWorkspaceId());
    			this.mediator.sendRequestMessage(url, "NICS.broadcast.activeUsers");
            },
            
            onLoadActiveUsers: function(event, response){
            	if(response){
            		var selected = response.users;
            		var grid = this.lookupReference("userGrid");
            		var data = [];
                    var userid = UserProfile.getUserId();

                    for(var i=0; i<selected.length; i++) {

                            if(selected[i].userId != userid)
                            {
                                data.push([selected[i].username,
                                           selected[i].userId,
                                           "",""]);
                            }
                    }
                    grid.getStore().loadData(data, true);
            	}
            },
            
            onLookupUsers: function() {
            	this.lookupWindow.controller.clearGrid();
            	this.lookupWindow.show();
            },
            
            addUsers: function(selected) {
            	//Check to see if the user is already in the grid
            	var grid = this.lookupReference("userGrid");
            	var numOfUsers = grid.getStore().getCount();
            	var data = [];
                for(var i=0; i<selected.length; i++) {
                        data.push([selected[i].data.username,
                                   selected[i].data.userId,
                                   "",""]);
                }
                grid.getStore().loadData(data, true);
                grid.getSelectionModel().selectRange(0, (numOfUsers + data.length) - 1, true);
                
                this.lookupWindow.controller.clearGrid();
            },
            
            clearMessage: function(){
            	this.lookupReference("broadcastInput").setValue("");
            },
            
           publishAlert: function(){
        	   var alert = {
           			username: UserProfile.getUsername(),
           			message: this.lookupReference("broadcastInput").getValue(),
           			created: new Date().getTime()
	           	};
	           	
	           	var url = Ext.String.format("{0}/alert", Core.Config.getProperty(UserProfile.REST_ENDPOINT)); 
	           	
	           	var topic = 'nics.broadcast.alert.post.callback';
	           	Core.EventManager.createCallbackHandler(topic, this, 
						function(evt, response){
							if(response != -1){
								
								var selectedUsers = this.lookupReference("userGrid").getSelection();
								if(selectedUsers.length > 0){
									for(var i=0; i<selectedUsers.length; i++){
									    var alertUser = {
						           			alertid: response,
						           			userid: selectedUsers[i].data.id,
						           			incidentid: this.view.incidentId
							           	};
										
										var url = Ext.String.format("{0}/alert/user", Core.Config.getProperty(UserProfile.REST_ENDPOINT));
										
										var topic = 'nics.broadcast.useralert.post.callback';
										Core.EventManager.createCallbackHandler(topic, this, function(evt, response){});
										this.mediator.sendPostMessage(url, topic, alertUser);
									}
								}else{
									var alertUser = {
					           			alertid: response,
					           			userid: -1,
					           			incidentid: this.view.incidentId
						           	};
									
									var url = Ext.String.format("{0}/alert/user", Core.Config.getProperty(UserProfile.REST_ENDPOINT));
									
									var topic = 'nics.broadcast.useralert.post.callback';
									Core.EventManager.createCallbackHandler(topic, this, function(evt, response){});
									this.mediator.sendPostMessage(url, topic, alertUser);
								}

								Ext.MessageBox.alert("Alert", "The alert was successfully broadcast.");
							}
						}
				);
	           	
	           	this.mediator.sendPostMessage(url, topic, alert);          	
           },

            onCancel: function() {
            	this.getView().destroy();
            }
        });
    });


