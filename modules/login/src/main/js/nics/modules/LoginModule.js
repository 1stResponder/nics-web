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
	"iweb/CoreModule",
	"./login/LoginViewer"], 
	
	function(Core, LoginViewer) {
	
		var LoginModule = function(){};
		
		LoginModule.prototype.load = function(){
			Ext.create('modules.login.LoginViewer');
			
			var help = Ext.create('Ext.form.Label',{
                html: "<div style=\"cursor: pointer;font-family: Arial,Verdana,sans-serif;font-size: 11px;font-weight: bold;color:blue\"><u>Help</u></div>",
                listeners: {
                    click: function(){
						window.open('https://public.nics.ll.mit.edu', '_blank');
                    },
                    element: 'el'
                }
            });

			var logout =  Ext.create('Ext.form.Label',{
				html: "<div style=\"cursor: pointer;font-family: Arial,Verdana,sans-serif;font-size: 11px;font-weight: bold;color:blue\"><u>Logout</u></div>",
				listeners: {
					click: function(){
						Core.EventManager.fireEvent('onLogout');
					},
					element: 'el'
				}
			});
			
			Core.View.addToTitleBar([help,{xtype: 'tbspacer', width: 5},logout,{xtype: 'tbspacer', width: 5}]);
		};
		
		return new LoginModule();
	}
);
