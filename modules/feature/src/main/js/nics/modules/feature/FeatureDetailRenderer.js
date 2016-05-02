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
define(["ol",'ext', 'iweb/CoreModule','nics/modules/UserProfileModule', './FeatureTopicListener'], 
		function(ol, Ext, Core, UserProfile, FeatureTopicListener){
	
	// custom Vtype for alphanum only fields, plus apostrophes, and - .  + , ? _ %
	Ext.apply(Ext.form.field.VTypes, {
	    extendedalphanum:  function(v) {
	        return /^[a-z0-9_\.\',\?\+%\s-]*$/i.test(v);
	    },
	    extendedalphanumText: 'This field should only contain letters, numbers, apostrophes, and - .  + , ? _ %',
	    extendedalphanumMask: /[a-z0-9_\.\',\?\+%\s-]/i
	});
	
	return Ext.define('features.FeatureDetailRenderer', {
		

		constructor: function() {
			Core.EventManager.addListener('nics.collabroom.activate', this.onActivateRoom.bind(this));
		},
		
		onActivateRoom: function(evt, collabRoomId, readOnly){
			this.readOnly = readOnly;
		},
		
		render: function(container, feature) {
	      if (this.supportsComments(feature)){

			//clone attributes object, fixes feature.set equality check
			var attributes = Ext.Object.merge({}, feature.get('attributes'));
			var user = feature.get('username');
			var description = feature.get('description');
			if (!description) {
				//The description is either in the feature itself (when it is first created) or in the attributes (when it is an existing feature)
				//get description from the attributes
				if (attributes && attributes.description){
					
						description = new Ext.form.field.Display({
						fieldLabel: 'Description',
						value: attributes.description
						
					});
					container.add( description);
				
				}
			}

			if (user) {
				user = new Ext.form.field.Display({
					fieldLabel: 'User',
					value: user
				});
				container.add(user);
			}
			 
			
			var updateDate= this.formatDateString(feature.get('lastupdate'));
			if (updateDate ) {	
				updateDate = new Ext.form.field.Display({
					fieldLabel: 'Last Updated',
					value: updateDate
				});
				container.add( updateDate );
			
			}
			var importName = feature.get('name');
			
			if(importName){
				importName = new Ext.form.field.Display({
					fieldLabel: 'Name',
					value: importName
				});
				container.add( importName );
			}	
			
			if (attributes && attributes.length){
				var length = new Ext.form.field.Display({
					fieldLabel: 'Distance',
					value: attributes.length
				});
				container.add( length );
			}	

			if (attributes && attributes.layerid) {
				var layerid = new Ext.form.field.Display({
					fieldLabel: 'Layer',
					value: attributes.layerid
				});
				container.add( layerid );
			}

			if (attributes && attributes.area) {
				var area = new Ext.form.field.Display({
					fieldLabel: 'Area',
					value: attributes.area
				});
				container.add( area );
			}	
		
			//Add sketch info


			//Add Comments
			//if attributes is undefined, define it with empty comments so that it won't throw an error
			if (!attributes) attributes = {comments:""};	
			var commentsText=attributes.comments;
			var	comments = new Ext.form.field.Display({
					fieldLabel: 'Comments',
					value: commentsText,
					htmlEncode:true,
					reference: 'displayComments'
				});
			container.add( comments );
			var newComments = new Ext.form.field.TextArea({
				fieldLabel: 'Comments',
				value: commentsText,
				hidden:true,
				vtype:'extendedalphanum',
				reference: 'textAreaComments'
			}); 
			
			
			container.add( newComments );

			if (!this.readOnly) {	
				
				var editState = "Edit"
				var editButton = new Ext.Button({
					text: editState,
					margin:'0 0 10 10',
					handler: function(btn) {
						switch (this.getText()){
							case 'Edit':
								comments.hide();
								newComments.show();
								this.setText('Update');
								break;
							case 'Update':
								if (newComments.isValid()) {
									this.setText('Edit');
								attributes.comments = newComments.getValue();
								feature.set("attributes", attributes);
								newComments.hide();
								comments.setValue(newComments.getValue());			
								comments.show();
								this.setText('Edit Comments');
								}
								else {
									alert('Please enter a valid comment');
									newComments.setValue("");
								}			
								break;
							}
							
						}	
					
				});
				container.add( editButton );
			}
			  return true;
		    }
		  return false;
		},
		supportsComments: function(feature) {
			return feature.get('featureId') != undefined;
		},
		
		
	
	    calculateAcres: function(feature){
	    	var wgs84Sphere = new ol.Sphere(6378137);
	    	var linearRing = feature.getGeometry().getLinearRing(0).clone();
			//TODO: get projection from map / controller?
			linearRing.transform("EPSG:3857", "EPSG:4326");
			var sqMetersArea = wgs84Sphere.geodesicArea(linearRing.getCoordinates());
			return(sqMetersArea  * 0.000247105381);
	    	
	    },
		
    	formatDateString: function(date)
        {
    		var str = "";
    		if (date){
    		  var components = date.split("-",3);
    		  str = components[1] + "/" + components[2] + "/" + components[0];
        	}
            return str;
        
        },
        formatDate: function(date)
        {
            var str = (date.getMonth() + 1) + "/"
            + date.getDate() + "/"
            + date.getFullYear();

            return str;
        },
	    formatDashStyle: function(dashStyle)
        {
    		var str = "";
    		if (dashStyle){
    		  var str = dashStyle.replace(/-/g, " ");
    		  str = str.charAt(0).toUpperCase() + str.slice(1);
    		  
        	}
            return str;
        
        }

		
	});

});
