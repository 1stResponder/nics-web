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
   var  instructions = '<p><b>INCIDENT BRIEFING (ICS 201-CG)</b></p>';
   		instructions += ' <p><b>Purpose.</b> The Incident Briefing form provides the Unified Command (and the Command and General Staffs assuming command of the incident) with basic information regarding the response situation and the resources allocated to the incident. It is also a permanent record of the initial incident response.</p>';
   	   	instructions += '<p><b>Preparation.</b> This briefing form is prepared under the direction of the initial Incident Commander for presentation to the Unified Command. This form can be used for managing the response during the initial period until the beginning of the first operational period for which an Incident Action Plan (IAP) is prepared. The information from the ICS form 201-CG can be used as the starting point for other ICS forms or documents. <br>';
   	    instructions += ' - Page 1 (Map/Sketch) may transition immediately to the Situation Map. <br>';
   	    instructions += '- Page 2 (Summary of Current Actions) may be used to continue tracking the response actions and as the initial input to the ICS form 215-CG and the ICS form 232-CG. <br>';
   	    instructions += '- Page 3 (Current Organization) may transition immediately to the Organization List (ICS form 203-CG) and/or Organization Chart (ICS form 207-CG). <br>';
   	    instructions += ' - Page 4 (Resources Summary) may be used to continue tracking resources assigned to the incident and as input to individual T-Cards (ICS form 219) or other resource tracking system.</p>';
   		instructions += '<p><b>Distribution.</b> After the initial briefing of the Unified Command and General Staff members, the Incident Briefing form is duplicated and distributed to the Command Staff, Section Chiefs, Branch Directors, Division/Group Supervisors, and appropriate Planning and Logistics Section Unit Leaders. The sketch map and summary of current action portions of the briefing form are given to the Situation Unit while the Current Organization and Resources Summary portion are given to the Resources Unit. All completed original forms MUST be given to the Documentation Unit.</p>';
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
   		instructions += '<td rowspan="3" valign="top">2.</td>';
   		instructions += '<td>Prepared By</td>';
   		instructions += '<td>Enter the name and position of the person completing the form.</td>';
   		instructions += '</tr>';
   		instructions += '<tr>';
   		instructions += '<td>Date</td>';
   		instructions += '<td>Enter date prepared (month, day, year).</td>';
   		instructions += '</tr>';
   		instructions += '<tr>';
   		instructions += '<td>Time</td>';
   		instructions += '<td>Enter time prepared (24-hour clock).</td>';
   		instructions += '</tr>';
   		instructions += '<tr>';
   		instructions += '<td >3.</td>';
   		instructions += '<td> Map/Sketch</td>';
   		instructions += '<td>Show the total Area of Operations, the incident site, overflight results, trajectories, impacted shorelines, or other graphics depicting situation and response status on a sketch or attached map.</td>';
   		instructions += '</tr>';
   		instructions += '<tr>';
   		instructions += '<td>4.</td>';
   		instructions += '<td>Current Situation</td>';
   		instructions += '<td>Enter short, clear, concise summary of the actions taken in managing the initial response.</td>';
   		instructions += '</tr>';
   		instructions += '<tr>';
   		instructions += '<td>5.</td>';
   		instructions += '<td>Initial Response, Objectives, Current & Planned Actions</td>';
   		instructions += '<td>Enter short, clear, concise statements of the objectives for managing the initial response, any actions taken in response to the incident, including the time, and note any significant events or specific problem areas as well as planned actions for the future.</td>';
   		instructions += '</tr>';
   		instructions += '<tr>';
   		instructions += '<td>6.</td>';
   		instructions += '<td>Current Organization</td>';
   		instructions += '<td>Enter, on the organization chart, the names of the individuals assigned to each position. Modify the chart as necessary, using additional boxes in the space provided under the Sections. Blank lines are provided in the Unified Command section for adding other agencies or groups participating in the Unified Command and/or for multiple Responsible Parties.</td>';
   		instructions += '</tr>';
   		instructions += '<tr>';
   		instructions += '<td rowspan="7" >7.</td>';
   		instructions += '<td>Resources Summary</td>';
   		instructions += '<td>Enter the following information about the resources allocated to the incident:</td>';
   		instructions += '</tr>';
   		instructions += '<tr>';
   		instructions += '<td>Resource</td>';
   		instructions += '<td>Description of the resource (e.g., open water boom, skimmer, vac truck, etc.).</td>';
   		instructions += '</tr>';
   		instructions += '<tr>';
   		instructions += '<td>Resource Identifier</td>';
   		instructions += '<td>Identifier for the resource (e.g., radio call-sign, vessel name, vendor name, license plate, etc.).</td>';
   		instructions += '</tr>';
   		instructions += '<tr>';
   		instructions += '<td>Date/Time Ordered</td>';
   		instructions += '<td>Date and time ordered (24-hour clock).</td>';
   		instructions += '</tr>';
   		instructions += '<tr>';
   		instructions += '<td>ETA</td>';
   		instructions += '<td>Estimated date and time for the resource to arrive at the staging area.</td>';
   		instructions += '</tr>';
   		instructions += '<tr>';
   		instructions += '<td>On-Scene</td>';
   		instructions += '<td>"X" upon the resource’s arrival.</td>';
   		instructions += '</tr>';
   		instructions += '<tr>';
   		instructions += '<td>Notes</td>';
   		instructions += '<td>Location of the resource, the actual assignment, and the status of the resource (if other than working).</td>';
   		instructions += '</tr>';
   		instructions += '</tbody>';
   		instructions += '</table>';
   		instructions += '<p>NOTE: Additional pages may be added to ICS 201-CG if needed</p></p>';
   		
	return Ext.define('modules.report-opp.I201InstructionsView', {
	 	extend: 'Ext.panel.Panel',
		header: true,
	    autoScroll: true,
        referenceHolder: true,
	 	collapsible:true,
	 	html: instructions
	 	
	});
});
