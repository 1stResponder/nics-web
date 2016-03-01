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
define(['ol',
        'iweb/CoreModule',
 		'nics/modules/UserProfileModule',
 		'nics/modules/report/common/ReportTableController'], 

	function(ol, Core, UserProfile){
	
		return Ext.define('modules.report-general.GeneralReportController', {
			extend : 'modules.report.ReportTableController',
			
			alias: 'controller.generalreportcontroller',
			
			imageProperty: 'fullpath',
			
			imagePath: 'fullpath',
			
			reportView: {
				user: "User",
				cat: "Category",
				desc: "Description",
				assigned: "Assigned",
				status: "Status",
				acknowledged: "Acknowledged"
			},
			
			onSelectionChange: function(grid, selected, eOpts){
				var formId = null;
				if (selected && selected.length) {
					formId = selected[0].get("formId");
				}

				var store = this.lookupReference(this.view.imageRef).store;
				store.filter('formId', formId);
			},
			
			onRowDblClick: function(grid, record, tr, rowIndex, e, eOpts){
				if(record.data.message){
					this.showReport(JSON.parse(record.data.message));
				}
			},
			
			onBeforeCellEdit: function(editor, context){
				if(context.column.dataIndex == "assigned"){ //better way to do this?
					this.showUserPicker(this.setAssignedUser, this, context.record);
					return false;
				}
				return true;
			},
			
			onCellEdit: function(editor, context){
				var message = JSON.parse(context.record.data.message);
				message.status = context.record.data.status;
				
				if(message.status == 'Acknowledged'){
					message.acknowledged = Core.Util.getUTCTimestamp();
				}
				
				this.updateForm({
					formId: context.record.data.formId,
					message: JSON.stringify(message),
					seqtime: context.record.data.seqtime
				});
			},
			
			setAssignedUser: function(record, user){
				record.set('assigned', user);
				
				var message = JSON.parse(record.data.message);
				message.assigned = user;
				
				this.updateForm({
					formId: record.data.formId,
					message: JSON.stringify(message),
					seqtime: record.data.seqtime
				});
			},
			
			getFormData: function(report){
				var message = JSON.parse(report.message);
				
				if(message.lon && message.lat){
					this.addFeature(message.lon, message.lat, report.formId);
				}
				
				return {
					formId: report.formId,
					sender: message.user,
				    submitted: Core.Util.formatDateToString(new Date(report.seqtime)),
					recipient: message.cat,
			        status: message.status ? message.status : 'Unacknowledged',
			        acknowledged: message.acknowledged ? message.acknowledged : '',
			        assigned: message.assigned ? message.assigned : "Assign...",
			        message: report.message,
			        seqtime: report.seqtime
				};
			}
		});
});
