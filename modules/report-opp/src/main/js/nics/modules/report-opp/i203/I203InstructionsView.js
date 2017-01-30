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
   var  instructions = '<p><b>ORGANIZATION ASSIGNMENT LIST (ICS 203-CG) Instructions for filling out the form</b></p>';
   		instructions += '<p><b>Purpose.</b> The Organization Assignment List provides ICS personnel with information on the units that are currently activated and the names of personnel staffing each position/unit. It is used to complete the Incident Organization Chart (ICS form 207-CG) which is posted on the Incident Command Post display. An actual organization will be event-specific. <b>Not all positions need to be filled.</b> The size of the organization is dependent on the magnitude of the incident and can be expanded or contracted as necessary.</p>';
   		instructions += '<p><b>Preparation.</b> The Resources Unit prepares and maintains this list under the direction of the Planning Section Chief.</p>';
   		instructions += '<p> <u>Note:</u> Depending on the incident, the Intelligence and Information function may be organized in several ways: 1)';
   		instructions += '  within the Command Staff as the <u>Intelligence Officer;</u> 2) As an <u>Intelligence Unit</u> in Planning Section; 3) As an <u>Intelligence Branch or Group</u> in the Operations Section; 4) as a separate General Staff <u>Intelligence Section;</u> and';
   		instructions += ' 5) as an <u>Intelligence Technical Specialist</u>. The incident will drive the need for the Intelligence and Information';
   		instructions += 'function and where it is located in the ICS organization structure. The Intelligence and information function is';
   		instructions += 'described in significant detail in NIMS and in the Coast Guard Incident Management Handbook (IMH). </p>';
   		instructions += '<p><b>Distribution.</b> The Organization Assignment List is duplicated and attached to the Incident Objectives form (ICS';
   		instructions += '202-CG) and given to all recipients of the Incident Action Plan. All completed original forms MUST be given to the';
   		instructions += 'Documentation Unit.</p>';
   		instructions += '<table width="800" border="0" cellspacing="0" cellpadding="0">';
   		instructions += '<tbody valign="top">';
   		instructions += '<tr >';
   		instructions += '<td width="50"><u>Item #</u></td>';
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
   		instructions += '<td >3.</td>';
   		instructions += '<td> Incident Commander and Staff</td>';
   		instructions += '<td>Enter the names of the Incident Commander and Staff. Use at least the first initial and last name.</td>';
   		instructions += '</tr>';
   		instructions += '<tr>';
   		instructions += '<td>4.</td>';
   		instructions += '<td>Agency Representative</td>';
   		instructions += '<td>Enter the agency names and the names of their representatives. Use at least the first initial and last name.</td>';
   		instructions += '</tr>';
   		instructions += '<tr>';
   		instructions += '<td>5.<br>';
   		instructions += 'thru<br>';
   		instructions += ' 8.</td>';
   		instructions += '<td>Section</td>';
   		instructions += '<td>Enter the name of personnel staffing each of the listed positions. Use at least the first initial and last name. For Units, indicate Unit Leader and for Divisions/Groups indicate Division/Group Supervisor. Use an additional page if more than three branches are activated. If there is a shift change during the specified operational period, list both names, separated by a slash. </td>';
   		instructions += '</tr>';
   		instructions += '<tr>';
   		instructions += '<td>9.</td>';
   		instructions += '<td>Prepared By Date/Time</td>';
   		instructions += '<td>Enter the name and position of the person completing the form Enter date (month, day, year) and time prepared (24-hour clock).</td>';
   		instructions += '</tr>';
   		instructions += '</tbody>';
   		instructions += '</table>';
   		
   		return Ext.define('modules.report-opp.I203InstructionsView', {
   		 	extend: 'Ext.panel.Panel',
   			header: true,
   		    autoScroll: true,
   	        referenceHolder: true,
   		 	collapsible:true,
   		 	html: instructions
   		 	
   		});
   	});
