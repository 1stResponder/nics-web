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
define([ "iweb/CoreModule" ], function(Core) {
	return Ext.define(null, {
		extend : 'Ext.Window',

		cls : 'add-photo-window',
		layout : {
			type : 'fit'
		},
		plain : true,
		title : 'Add Photo',
		closeAction : 'hide',
		renderTo : Ext.getBody(),

		resizable : false,
		width : 375,

		bodyPadding : '5px',

		referenceHolder: true,
		
		items : [ {
			xtype : 'form',
			reference: "form",

			layout : {
				type : 'vbox',
				align : 'stretch' // Child items are stretched to full width
			},

			fieldDefaults : {
				labelWidth : 70,
				anchor : '100%'
			},
			bodyPadding : 5,

			items : [ {
				xtype : 'textfield',
				name : 'description',
				fieldLabel : 'Description',
				enableKeyEvents : true
			}, {
				xtype : 'filefield',
				name: 'file',
				fieldLabel : 'Photo',
				buttonText : 'Select Photo...',
				enableKeyEvents : true
			} ]

		} ],
		buttonAlign : 'center',
		buttons : [ {
			text : "OK",
			handler : function(b, e) {
				var window = this.up('window');
				
				var url = window.url;
				var form = window.lookupReference("form").getForm();
				form.submit({
					url: url,
					waitMsg: 'Uploading your photo...',
					success: function(fp, o) {
						var feature = window.feature;
						feature.persistChange = false;
						feature.set("documents", o.result.features[0].documents);
						feature.persistChange = true;
						
						window.destroy();
					},
					failure: function(fp, o) {
						Ext.Msg.show({
							title: 'Add Photo',
							message: 'There was a problem adding the photo',
							buttons: Ext.Msg.OK,
							icon: Ext.Msg.ERROR
						});
						
						window.destroy();
					} 
				});
			}
		}, {
			text : "Cancel",
			handler : function(b, e) {
				var window = this.up("window");
				window.hide();
			}
		} ]

	});
});
