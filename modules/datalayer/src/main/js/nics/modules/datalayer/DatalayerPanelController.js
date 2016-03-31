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
define(['iweb/CoreModule'], 

	function(Core){
	
		Ext.define('modules.datalayer.DatalayerPanelController', {
		
			extend : 'Ext.app.ViewController',
			
			alias: 'controller.datalayerpanelcontroller',
			
			init: function(){
				Core.EventManager.addListener('nics.datalayer.legend.click', this.onDataLayerClick.bind(this));
				Core.EventManager.addListener('nics.datalayer.legend.unclick', this.onDataLayerUnclick.bind(this));
				Core.EventManager.addListener('nics.legend.panel.load', this.updateSize.bind(this));
				Core.EventManager.addListener('nics.legend.panel.ajax', this.getHtml.bind(this));
			},
			
			onDataLayerClick: function(event, datalayer){
			
				if(datalayer.legend != null){
			
					var fileExt = datalayer.legend.substr(datalayer.legend.length - 5);
				
					if(fileExt.indexOf('.') != -1){
					
						var image = Ext.create('Ext.Img',{
							xtype:'image',
							reference: 'legendpanel.' + datalayer.legend,
							src: datalayer.legend,
							padding: '0 0 20 0',
							listeners : {
					            load : {
					               element : 'el',
					               fn : function(el){
					               		Core.EventManager.fireEvent('nics.legend.panel.load',[ 'legendpanel.' + el.target.currentSrc, el.target.clientWidth, el.target.clientHeight]);             		
					               }
					            }
				        	}
						});
						
						this.getView().add(image);
						
					}
					else{
					
						var requestUrl = window.location.protocol + '//' + window.location.host + '/nics/proxy?url=' + datalayer.legend;
						
						$.ajax({
							url: requestUrl,
							headers: {'Content-Type':'text/html'},
							success: function(data, status, response){
								Core.EventManager.fireEvent('nics.legend.panel.ajax',[data,datalayer.legend]);
							},
							error: function(param1, status, error) {
								console.log('Failed to get legend for panel');
							}
						});
					}
				
				}
			},
			
			getHtml : function(event, info){
				var regex = /<img.*?src=['"](.*?)['"]/;
				
				if(info && info[0]){
					var htmlSrc = regex.exec(info[0])[1];
					
					if(!this.lookupReference('legendpanel.ajax.' + info[1])){
						this.getView().ajaxPhoto = info[1];
						var legendCmp = Ext.create('Ext.Img',{
							src: htmlSrc,
							reference: 'legendpanel.' + info[1],
							padding: '0 0 20 0',
							listeners : {
					            load : {
					               element : 'el',
					               fn : function(el){
					               		Core.EventManager.fireEvent('nics.legend.panel.load',[ 'legendpanel.', el.target.clientWidth, el.target.clientHeight]);
					               }
					            }
				        	}
						});
						
						this.getView().add(legendCmp);
					}
				}
			},
			
			onDataLayerUnclick: function(event, datalayer){
				this.getView().remove(this.getView().lookupReference('legendpanel.' + datalayer.legend));
			},
			
			updateSize: function(event, info){
				var image; 
				if(this.getView().ajaxPhoto){
					image = this.lookupReference('legendpanel.' + this.getView().ajaxPhoto);
					this.getView().ajaxPhoto = null;
				}
				else{
					image = this.lookupReference(info[0]);
				}
				
				if(image){
					image.setSize(info[1],info[2]);
				}
				
				
			}
			
	});
});
