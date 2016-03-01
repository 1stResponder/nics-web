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
define(['ext'], function(Ext) {

	return Ext.define('modules.multiincidentview.MultiIncidentViewModel', {	 
	 	extend: 'Ext.data.Model',
	 	
	 	idProperty: 'incidentId',
	 	
	 	fields : [
			{
				name : 'incidentname',
				mapping: 'incidentname'
			},
			{
			
				name: 'lastupdate',
				mapping: 'lastUpdate',
				convert: function (v, rec) {
					var date = null;
					
					if(v != undefined || v != null){

						date = new Date(v);
						console.log(v);
						console.log(rec);
						//return date.toString("Y-m-d H:i:s");
						
					}
					else{
						date = new Date(rec.data.created);
						//console.log(date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate());
						//return date.toString("Y-m-d H:i:s");
						
					}
					
					return "got it";
					
				}
			},
			{
				name : 'incidenttypes',
				mapping: 'incidentIncidenttypes',
				convert: function (v, rec) {
					
					
					var incidentTypes = "";
					
					if(v != undefined){
					
						for(var i = 0; i < v.length; i++){
					
							incidentTypes += v[i].incidentType.incidentTypeName;
							
							if(i != v.length - 1){
								incidentTypes += ", "
							}
					
						}
						
					}
					return "incidenttypes";
					//return incidentTypes;
					
				}
			},
			{
				name : 'description',
				mapping : 'description'
			}
		]
	 	
	 });
});
