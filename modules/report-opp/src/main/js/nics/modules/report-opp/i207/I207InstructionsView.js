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
   var  instructions = '<p><strong>INCIDENT ORGANIZATION (ICS 207-CG) Revision 1/07</strong></p>';
   		instructions += ' <p><strong>Purpose.</strong> The Incident Organization Chart provides ICS personnel with information on the units that are currently activated and the names of personnel staffing each position/unit. An actual organization will be event-specific. <strong>Not all positions need to be filled</strong>. The size of the organization is dependent on the magnitude of the incident and can be expanded or contracted as necessary.</p>';
   	   	instructions += '<p><strong>Preparation.</strong> The Resources Unit prepares and maintains this chart under the direction of the Planning Section Chief. The ICS-203 is used to help complete the Incident Organization Chart. <br>';
   	    instructions += 'Note: Depending on the incident, the Intelligence and Information function may be organized in several ways: ';
   	    instructions += '1) within the Command Staff as the Intelligence Officer; 2) As an Intelligence Unit in Planning Section; 3) As an Intelligence Branch or Group in the Operations Section; 4) as a separate General Staff Intelligence Section; and 5) as an Intelligence Technical Specialist. <br>';
   	    instructions += 'The incident will drive the need for the Intelligence and Information function and where it is located in the ICS organization structure. The Intelligence and information function is described in significant detail in NIMS and in the Coast Guard Incident Management Handbook (IMH).</p>';
   	    instructions += '<p><strong>Distribution</strong>. The Incident Organization Chart is is posted on the Incident Command Post display and may be posted in other places as needed (e.g. the Joint Information Center). All completed original forms MUST be given to the Documentation Unit.</p>';
		instructions += '<table width="800" border="0" cellspacing="0" cellpadding="0">';
   		instructions += '<tbody valign="top">';
   		instructions += '<tr >';
   		instructions += ' <td width="50"><u>Item #</u></td>';
   		instructions += '<td width="150"><u>Item Title</u></td>';
   		instructions += '<td width="300"><u>Instructions</u></td>';
   		instructions += '</tr>';
   		instructions += '<tr >';
   		instructions += '<td >1.</td>';
      	instructions += '<td>Incident Name</td>';
   		instructions += '<td>Enter the name assigned to the incident. Record the start and end date and time.</td>';
   		instructions += '</tr>';
   		instructions += '<tr>';
   		instructions += '<td rowspan="3" valign="top">2.</td>';
   		instructions += '<td>Operational Period</td>';
   		instructions += '<td>Enter the time interval for which the form applies.</td>';
   		instructions += '</tr>';
   		instructions += '<tr>';
   		instructions += '<td>Positions</td>';
   		instructions += '<td>Enter the name of personnel staffing each of the listed positions. Use at least the first initial and last name. For Units, indicate Unit Leader and for Divisions/ Groups indicate Division/Group Supervisor. If there is a shift change during the specified operational period, list both names, separated by a slash.</td>';
   		instructions += '</tr>';
   		instructions += '<tr>';
   		instructions += '<td>Prepared By</td>';
   		instructions += '<td>Enter the name and position of the person completing the form</td>';
   		instructions += '</tr>';
   		instructions += '<tr>';
   		instructions += '<td >3.</td>';
   		instructions += '<td> Date/Time Prepared</td>';
   		instructions += '<td>Enter date (month, day, year) and time prepared (24-hour clock).</td>';
   		instructions += '</tr>';
   		instructions += '</tbody>';
   		instructions += '</table>';
   		
   		
	return Ext.define('modules.report-opp.I207InstructionsView', {
	 	extend: 'Ext.panel.Panel',
		header: true,
	    autoScroll: true,
        referenceHolder: true,
	 	collapsible:true,
	 	html: instructions
	 	
	});
});
