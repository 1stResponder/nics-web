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
define(['ext', './PhotoDetailController'], function(Ext, PhotoDetailController){
	
	return Ext.define('map.PhotoDetailView', {
		extend: 'Ext.panel.Panel',
		
		controller: 'photodetailcontroller',
		
		collapsible: true,
		collapsed: true,
		titleCollapse: true,
		animCollapse: false,
		
		dockedItems: [{
			xtype: 'toolbar',
			dock: 'top',
			layout: {
				pack: 'start'
			},
			reference: 'toolbar',
			items: [{
				xtype: 'button',
				text: 'Add Photo',
				icon: 'images/photos/image_add.png',
				reference: 'addButton',
				handler: 'onAddClick'
			}]
		}],
		
		items: [{
			xtype: 'dataview',
			reference: 'dataview',
			
			cls: 'photos-view',
			height: 150,
			scrollable: 'vertical',
			
			store: {
				fields: ['filename', 'description', 'created'],
				sorters: {property: 'created', direction: 'DESC'},
				data: []
			},
			
			emptyText: '<div class="emptyText">No photos to display</div>',
			deferEmptyText: false,
			
			itemSelector: 'div.thumb-wrap',
			tpl: [
				'<tpl for=".">',
					'<div class="thumb-wrap" title="{description}">',
						'<div class="thumb"><img src="{filename}"></div>',
						'<span class="label">{description}</span>',
					'</div>',
				'</tpl>',
				'<div class="x-clear"></div>'
			]
		}]
	});

});
