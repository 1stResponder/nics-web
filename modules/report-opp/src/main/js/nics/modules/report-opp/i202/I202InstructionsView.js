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
   var  instructions = '<p><b>INCIDENT OBJECTIVES (ICS 202-CG)</b></p>';
   		instructions += ' <p><b>Purpose.</b>The Incident Objectives form describes the basic incident strategy, control objectives, command emphasis/priorities, and safety considerations for use ';
   	   	instructions += 'during the next operational period. The Command Direction form supplements the ICS 202 form by documenting the IC/UC strategic direction and guidance through Key ';
   	   	instructions += 'Decisions/Procedures, Priorities and Limitations/Constraints for use during the next operational period. The Critical Information Requirements form supplements ';
   	   	instructions += 'the ICS 202 form by documenting the IC/UC strategic direction and guidance through Critical Information Requirements for use during the next operational period.</p>';
   	   	instructions += '<p><b>Preparation.</b> The Incident Objectives form is completed by the Planning Section following each Command and General Staff Meeting conducted in preparing the';
   	   	instructions += 'Incident Action Plan. The Command Direction form is completed by the Planning Section following each Unified Command Objectives Meeting conducted (input may '; 
   	    instructions += 'be made during the Initial Unified Command Meeting) and aids with Command Direction for the Command and General Staff meeting and when preparing the Incident ';
   	    instructions += 'Action Plan. The Critical Information Requirements form is completed and/or updated by the Planning Section following each Unified Command Objectives Meeting ';
      	instructions += '(input may be made during the Initial Unified Command Meeting) conducted in preparing the Incident Action Plan. </p>';
        instructions += '<p><b>Distribution.</b>  The Incident Objectives form will be reproduced with the IAP and given to all supervisory personnel at the Section, Branch, Division/Group, and Unit ';
        instructions += 'levels. All completed original forms MUST be given to the Documentation Unit. The Command Direction form may be included with the IAP and given to all  ';
        instructions += 'supervisory personnel at the Section, Branch, Division/Group, and Unit levels. All completed original forms MUST be given to the Documentation Unit. The Critical  ';
        instructions += 'Information Requirements form may be reproduced with the IAP and should be given to all supervisory personnel at the Section, Branch, Division/Group, and Unit ';
    	instructions += 'levels. All completed original forms MUST be given to the Documentation Unit.</p>';
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
   	   	instructions += '<td>Objective(s)</td>';
        instructions += '<td> 	Enter clear, concise statements of the objectives for managing the response. These objectives are for the incident response for this operational period and for the duration of the incident. Include alternatives.</td>';
		instructions += '</tr>';
		instructions += '<td>3a.</td>';
   	   	instructions += '<td>Key Decisions and Procedures</td>';
        instructions += '<td>Enter operational guiding measures from the Unified Command. Provide IMT process guidance for delegation of authority, agency cooperation, cost sharing, resource ordering and other administrative guidance.</td>';
		instructions += '</tr>';
		instructions += '<td>3b.</td>';
   	   	instructions += '<td>Critical Information Requirements</td>';
        instructions += '<td>Enter clear, concise statements of critical information requirements for the response. These requirements are for the incident response for this operational period and for the duration of the incident. Listed in order of importance.</td>';
		instructions += '</tr>';
		instructions += '<tr>';
   	   	instructions += '<td>4.</td>';
   	   	instructions += '<td>Operational Period Command Emphasis</td>';
        instructions += '<td>Enter clear, concise statements for safety message, priorities, and key command emphasis/decisions/directions. Enter information such as known safety ';
   	   	instructions += 'hazards and specific precautions to be observed during this operational period. If available, a safety message should be referenced and attached. ';
   	   	instructions += 'At the bottom of this box, enter the location where approved Site Safety Plan is available for review.';
   	   	instructions += 'Note location of the approved Site Safety Plan.</td>';
		instructions += '</tr>';
		instructions += '<tr>';
   	   	instructions += '<td></td>';
   	   	instructions += '<td>Safety Plan</td>';
        instructions += '<td>Note location of the approved Site Safety Plan.</td>';
		instructions += '</tr>';
		instructions += '<tr>';
   	   	instructions += '<td>5.</td>';
   	   	instructions += '<td>Prepared By</td>';
        instructions += '<td>Enter the name of the Planning Section Chief completing the form.</td>';
		instructions += '</tr>';
		instructions += '<tr>';
   	   	instructions += '<td></td>';
   	   	instructions += '<td>Date/Time</td>';
        instructions += '<td> 	Enter date (month, day, year) and time prepared (24-hour clock).</td>';
		instructions += '</tr>';
		instructions += '<tr>';
   	   	instructions += '<td>5a.</td>';
   	   	instructions += '<td>Limitations and Constraints</td>';
        instructions += '<td>Enter clear, concise guidelines for response limiting factors and restrictions due to operations, weather, jurisdictions, resources and parameters agreed upon by the Unified Command.</td>';
		instructions += '</tr>';
   		instructions += '</tbody>';
   		instructions += '</table>';
   		instructions += '<p>NOTE: ICS 202-CG, Incident Objectives, serves as part of the Incident Action Plan (IAP)</p>';
   		instructions += '<p>NOTE: The 03/2013 version changes the order from Priorities, Limitations/Constraints and Key Decisions to Key Decisions/Procedures, Priorities and ';
   		instructions += 'Limitations/Constraints because that is the order they will be developed by the UC and briefed to the Incident Management Team. The new version also ';
   		instructions += 'corrected some typographical errors and explanation of preparation and use of the form.</p>';
   		instructions += '<p>NOTE: ICS 202B-CG, Critical Information Requirements, may serve as part of the Incident Action Plan (IAP)</p>';
   		
   		
   		
	return Ext.define('modules.report-opp.I202InstructionsView', {
	 	extend: 'Ext.panel.Panel',
		header: true,
	    autoScroll: true,
        referenceHolder: true,
	 	collapsible:true,
	 	html: instructions
	 	
	});
});
