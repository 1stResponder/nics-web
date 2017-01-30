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
define(['ext'], function(Ext) {
   var  instructions = '<p><b>MEDICAL PLAN (ICS 206-CG)</b></p>';
        instructions += ' <p><b>Purpose.</b>The Medical Plan provides information on incident medical aid stations, transportation services, hospitals, and medical emergency procedures</p>';
   	   	instructions += '<p><b>Preparation.</b>The Medical Plan is prepared by the Medical Unit Leader and reviewed by the Safety Officer.</p>';
   	    instructions += '<p><b>Distribution.</b> The Medical Plan may be attached to the Incident Objectives (ICS 202-CG), or information from the plan pertaining to incident medical aid stations and  ';
   	    instructions += 'medical emergency procedures may be taken from the plan and noted on the Assignment List (ICS 204-CG) or on the Assignment List Attachment (ICS 204a-CG).  ';
   	    instructions += 'All completed original forms MUST be given to the Documentation Unit.</p>';
   		instructions += '<table width="800" border="0" cellspacing="0" cellpadding="0">';
   		instructions += '<tbody valign="top">';
   		instructions += '<tr >';
   		instructions += ' <td width="50"><u>Item #</u></td>';
   		instructions += '<td width="150"><u>Item Title</u></td>';
   		instructions += '<td width="600"><u>Instructions</u></td>';
   		instructions += '</tr>';
   		instructions += '<tr >';
   		instructions += '<td >1.</td>';
      	instructions += '<td>Incident Name</td>';
   		instructions += '<td>Enter the name assigned to the incident.</td>';
   		instructions += '</tr>';
   		instructions += '<tr>';
   		instructions += '<td>2.</td>';
   		instructions += '<td>Operational Period</td>';
   		instructions += '<td>Enter the time interval for which the form applies. Record the start and end date and time.</td>';
   		instructions += '</tr>';
   		instructions += '<tr>';
   	   	instructions += '<td>3.</td>';
   	   	instructions += '<td> 	Medical Aid Stations</td>';
        instructions += '<td>Enter name, location, and telephone number of the medical aid station(s) (e.g., Cajon Staging Area, Cajon Camp Ground) and indicate if paramedics are located at the site.</td>';
		instructions += '</tr>';
		instructions += '<tr>';
   	   	instructions += '<td>4.</td>';
   	   	instructions += '<td> 	Transportation</td>';
        instructions += '<td>List name and address of ambulance services. Provide phone number and indicate if ambulance company has paramedics.</td>';
		instructions += '</tr>';
		instructions += '<tr>';
   	   	instructions += '<td>5.</td>';
   	   	instructions += '<td> 	Hospitals</td>';
        instructions += '<td>List hospitals that could serve this incident. Enter hospital name, address, phone number, the travel time by air and ground from the incident to the hospital, and indicate if the hospital has a burn center and/or a helipad.</td>';
		instructions += '</tr>';
		instructions += '<td>6.</td>';
   	   	instructions += '<td> 	Medical Emergency Procedures</td>';
        instructions += '<td>Note any special emergency instructions for use by incident personnel.</td>';
		instructions += '</tr>';
		instructions += '<tr>';
   		instructions += '<td rowspan="2" valign="top">7.</td>';
   		instructions += '<td>Reviewed By</td>';
   		instructions += '<td>nter the name of the Medical Unit Leader preparing the form.</td>';
   		instructions += '</tr>';
   		instructions += '<tr>';
   		instructions += '<td>Date/Time</td>';
   		instructions += '<td>Enter date (month, day, year) and time prepared (24-hour clock).</td>';
   		instructions += '</tr>';
  		instructions += '<tr>';
  		instructions += '<tr>';
   		instructions += '<td rowspan="2" valign="top">8.</td>';
   		instructions += '<td>Reviewed By</td>';
   		instructions += '<td>Enter the name of the Safety Officer who must review the plan.</td>';
   		instructions += '</tr>';
   		instructions += '<tr>';
   		instructions += '<td>Date/Time</td>';
   		instructions += '<td>Enter date (month, day, year) and time reviewed (24-hour clock).</td>';
   		instructions += '</tr>';
  		instructions += '<tr>';
   		instructions += '</tbody>';
   		instructions += '</table>';
   		
   		
	return Ext.define('modules.report-opp.I206InstructionsView', {
	 	extend: 'Ext.panel.Panel',
		header: true,
	    autoScroll: true,
        referenceHolder: true,
	 	collapsible:true,
	 	html: instructions
	 	
	});
});
