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
   var  instructions = '<p><b>ASSIGNMENT LIST (ICS 204-CG)</b></p>';
   		instructions += ' <p><b>Purpose.</b>The Assignment List(s) informs Division and Group supervisors of incident assignments. Once the Unified Command and General Staff agree to the assignments, the assignment information is given to the appropriate Divisions and Groups.</p>';
   	   	instructions += '<p><b>Preparation.</b> The Assignment List is normally prepared by the Resources Unit, using guidance from the Incident Objectives (ICS 202-CG), Operational Planning Worksheet (ICS 215-CG), and the Operations Section Chief. The Assignment List must be ';
   	   	instructions += 'approved by the Planning Section Chief and Operations Section Chief. When approved, it is included as part of the Incident Action Plan (IAP). Specific instructions for specific resources may be entered on an ICS 204a-CG for dissemination to the field. A'; 
   	   	instructions += 'separate sheet is used for each Division or Group. The identification letter of the Division is entered in the form title. Also enter the number (roman numeral) assigned to the Branch. </p>';
   	    instructions += '<p><b>Special Note. .</b>The Assignment List, ICS 204-CG submits assignments at the level of Divisions and Groups. The Assignment List Attachment, ICS 204a-CG shows more specific assignment information, if needed. The need for an ICS 204a-CG is determined by the ';
   	    instructions += 'Planning and Operations Section Chiefs during the Operational Planning Worksheet (ICS 215-CG) development.</p>';
   	    instructions += '<p><b>Distribution.</b>  The Assignment List is duplicated and attached to the Incident Objectives and given to all recipients of the Incident Action Plan. In some cases, assignments may be communicated via radio/telephone/fax. All completed original forms MUST be given to the Documentation Unit.</p>';
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
   	   	instructions += '<td>Branch</td>';
        instructions += '<td>Enter the Branch designator.</td>';
		instructions += '</tr>';
		instructions += '<tr>';
   	   	instructions += '<td>4.</td>';
   	   	instructions += '<td>Division/Group/Staging</td>';
        instructions += '<td>Enter the Division/Group/Staging designator.</td>';
		instructions += '</tr>';
		instructions += '<tr>';
   	   	instructions += '<td>5.</td>';
   	   	instructions += '<td>Operations Personnel</td>';
        instructions += '<td>Enter the name of the Operations Chief, applicable Branch Director, and Division Supervisor.</td>';
		instructions += '</tr>';
		instructions += '<tr>';
   	   	instructions += '<td>6.</td>';
   	   	instructions += '<td>Resources Assigned</td>';
        instructions += '<td>Each line in this field may have a separate Assignment List Attachment (ICS 204a-CG). Enter the following information about the resources assigned to Division or Group for this period:</td>';
		instructions += '</tr>';
		instructions += '<tr>';
		instructions += '<tr>';
   	   	instructions += '<td></td>';
   	   	instructions += '<td>Identifier</td>';
        instructions += '<td>List identifier</td>';
		instructions += '</tr>';
		instructions += '<tr>';
   	   	instructions += '<td></td>';
   	   	instructions += '<td>Leader</td>';
        instructions += '<td>Leader name</td>';
		instructions += '</tr>';
		instructions += '<tr>';
   	   	instructions += '<td></td>';
   	   	instructions += '<td>Contact Information</td>';
        instructions += '<td>Primary means of contacting this person (e.g., radio, phone, pager, etc.). Be sure to include area code when listing a phone number.</td>';
		instructions += '</tr>';
		instructions += '<tr>';
   	   	instructions += '<td></td>';
   	   	instructions += '<td># Of Persons</td>';
        instructions += '<td>Total number of personnel for the strike team, task force, or single resource assigned.</td>';
		instructions += '</tr>';
		instructions += '<tr>';
   	   	instructions += '<td></td>';
   	   	instructions += '<td>Reporting Info/Notes/Remarks</td>';
        instructions += '<td>Special notes or directions, specific to this strike team, task force, or singleresource. Enter an "X" check if an Assignment List Attachment (ICS 204a-CG) will be prepared and attached. The Planning and Operations Section Chiefs determine the need for an ICS 204a-CG during the Operational Planning Worksheet (ICS 215-CG) development.</td>';
		instructions += '</tr>';
   	   	instructions += '<td>7.</td>';
   	   	instructions += '<td>Work Assignment</td>';
        instructions += '<td>Provide a statement of the tactical objectives to be achieved within the operational period by personnel assigned to this Division or Group.</td>';
		instructions += '</tr>';
		instructions += '<tr>';
   	   	instructions += '<td>8.</td>';
   	   	instructions += '<td>Special Instructions</td>';
        instructions += '<td>Enter a statement noting any safety problems, specific precautions to be exercised, or other important information.</td>';
		instructions += '</tr>';
		instructions += '<tr>';
   	   	instructions += '<td>9.</td>';
   	   	instructions += '<td>Communications</td>';
        instructions += '<td>Enter specific communications information (including emergency numbers) for this division /group. If radios are being used, enter function (command, tactical, support, etc.), frequency, system, and channel from the Incident Radio Communications Plan (ICS 205-CG). Note: Phone numbers should include area code.</td>';
		instructions += '</tr>';
   		instructions += '<tr>';
   		instructions += '<td rowspan="2" valign="top">10.</td>';
   		instructions += '<td>Prepared By</td>';
   		instructions += '<td>Enter the name and position of the person completing the form.</td>';
   		instructions += '</tr>';
   		instructions += '<tr>';
   		instructions += '<td>Date/Time</td>';
   		instructions += '<td>Enter date (month, day, year) and time prepared (24-hour clock).</td>';
   		instructions += '</tr>';
  		instructions += '<tr>';
   		instructions += '<td rowspan="2" valign="top">11.</td>';
   		instructions += '<td>Reviewed By (PSC)</td>';
   		instructions += '<td>Enter the name and position of the person completing the form.</td>';
   		instructions += '</tr>';
   		instructions += '<tr>';
   		instructions += '<td>Date/Time</td>';
   		instructions += '<td>Enter date (month, day, year) and time prepared (24-hour clock).</td>';
   		instructions += '</tr>';
  		instructions += '<tr>';
   		instructions += '<td rowspan="2" valign="top">12.</td>';
   		instructions += '<td>Reviewd By (OSC)</td>';
   		instructions += '<td>Enter the name and position of the person completing the form.</td>';
   		instructions += '</tr>';
   		instructions += '<tr>';
   		instructions += '<td>Date/Time</td>';
   		instructions += '<td>Enter date (month, day, year) and time prepared (24-hour clock).</td>';
   		instructions += '</tr>';
   		instructions += '</tbody>';
   		instructions += '</table>';
   		
   		
	return Ext.define('modules.report-opp.I204InstructionsView', {
	 	extend: 'Ext.panel.Panel',
		header: true,
	    autoScroll: true,
        referenceHolder: true,
	 	collapsible:true,
	 	html: instructions
	 	
	});
});
