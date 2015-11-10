/*
 * Copyright (c) 2008-2015, Massachusetts Institute of Technology (MIT)
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
define(['iweb/CoreModule','nics/modules/report/common/ReportImageModel'], 
		function(Core) {

	return Ext.define('modules.report.ReportTableView', {
	 	extend: 'Ext.Panel',
	 	
	 	layout: 'border',
	 	
	 	imageRef: 'imageView',
	 	
	 	plotBtnRef: 'plotButton',
	 	
	 	referenceHolder: true,
	 	
	 	dockedItems: [{
            xtype: 'toolbar',
            dock: 'top',
            layout: {
            	pack: 'start'
            },
            items: [{
            	xtype: 'button',
            	text: 'Plot', 
            	enableToggle: true,
                tooltip: 'Turn Plotting Layer On',
                reference: 'plotButton',
                listeners: {
                	toggle: 'onPlotButtonClick'
                }
            },
				{
					xtype: 'button',
					text: 'CSV',
					tooltip: 'Export CSV',
					reference: 'csvButton',
					handler: 'exportCSV'
				}]
	 	}],
	 	
	 	items:[{
	 		xtype: 'fieldset',
			title: 'Images',
			height: 400,
			collapsible: true,
			region: 'south',
			reference: 'imagePanel',
			items: [
			{
				reference: 'imageView',
				xtype: 'dataview',
				itemSelector:'div.thumb-wrap',
				multiSelect: false,
				style: 'overflow:auto',
				store:  {
		        	model: 'modules.report.ReportImageModel',
				},
				tpl: new Ext.XTemplate(
		                '<tpl for=".">',
	                    '<div class="thumb-wrap" id="{filename}">',
	                    '<div class="thumb"><a href="{url}" target="_blank"><img src="{url}" title="{filename}" width="480" height="360"></a></div></div>',
	                '</tpl>'
	            ),
				autoScroll: true,
				emptyText: 'No image associated with this report'
			}]
		}]
	});
});
