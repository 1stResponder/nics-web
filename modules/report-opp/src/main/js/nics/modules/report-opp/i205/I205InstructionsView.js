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
   var  instructions = '<p><b>INCIDENT RADIO COMMUNICATIONS PLAN (ICS 205-CG with supplements)</b></p>';
        instructions += '<p><b>Special Note. .</b> This form, ICS 205-CG, is used to provide, in one location, information on all radio frequency assignments down to the Division/Group level for each operational period; whereas, the Communications List, ';
    	instructions += 'ICS 205a-CG is used to list methods of contact for personnel assigned to the incident (radio frequencies, phone numbers, pager numbers, etc.). This optional form is used in conjunction with the Incident Radio '; 
    	instructions += 'Communications Plan, ICS 205-CG. Whereas the ICS 205-CG is used to provide information on all radio frequencies down to the Division/Group level, the Communications List, ICS 205a-CG, lists methods of contact '; 
    	instructions += 'for personnel assigned to the incident (radio frequencies, phone numbers, pager numbers, etc.), and functions as an incident directory.</p>';
	    instructions += ' <p><b>Purpose.</b>The Incident Radio Communications Plan is a summary of information obtained from the Radio Requirements Worksheet (ICS 216) and the Radio Frequency Assignment Worksheet (ICS 217). Information from the Radio Communications Plan on frequency assignments is normally noted on the appropriate Assignment List (ICS 204-CG). The Communications List records methods of contact for personnel on scene.</p>';
   	   	instructions += '<p><b>Preparation.</b>The Incident Radio Communications Plan is prepared by the Communications Unit Leader and given to the Planning Section Chief. The Communications List ';
   	   	instructions += ' can be filled out during check-in and is maintained and distributed by Communications Unit personnel. </p>';
   	    instructions += '<p><b>Distribution.</b>  The Incident Radio Communications Plan is included in the Incident Action Plan and duplicated and given to others requiring incident communications information including the Incident Communications  ';
   	    instructions += 'Center. All completed original forms MUST be given to the Documentation Unit. The Communications List is distributed within the ICS and posted, as necessary. All completed original forms MUST be given to the  ';
   	    instructions += 'Documentation Unit.</p>';
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
   	   	instructions += '<td> 	Basic Radio Channel Use</td>';
        instructions += '<td>Enter the following information about radio channel use:</td>';
		instructions += '</tr>';
   		instructions += '<tr>';
   	   	instructions += '<td> </td>';
   	   	instructions += '<td>Channel #</td>';
        instructions += '<td>Use at the Communications Unit Leaderâ€™s discretion. Channel Number (Ch #) may equate to the channel number for incident radios that are programmed or cloned for a specific Communications Plan, or it may be used just as a reference line number on the ICS 205 document.</td>';
		instructions += '</tr>';
   		instructions += '<tr>';
   	   	instructions += '<td></td>';
   	   	instructions += '<td> Function</td>';
        instructions += '<td> 	Function each channel is assigned (e.g., command, support, division tactical, and ground-to-air).</td>';
		instructions += '</tr>';
   		instructions += '<tr>';
   	   	instructions += '<td></td>';
   	   	instructions += '<td>Channel Name/Trunked Radio System Talkgroup</td>';
        instructions += '<td>Enter the nomenclature or commonly used name for the channel or talkgroup such as the National Interoperability Channels which follow DHS frequency Field Operations Guide (FOG)</td>';
		instructions += '</tr>';
		instructions += '<tr>';
   	   	instructions += '<td></td>';
   	   	instructions += '<td>Assignment</td>';
        instructions += '<td>Enter the name of the ICS Branch/Division/Group/Section to which this channel/talkgroup will be assigned (e.g., Branch I, Division A, Hazmat group).</td>';
		instructions += '</tr>';
		instructions += '<tr>';
   	   	instructions += '<td></td>';
   	   	instructions += '<td>Rx Freq N or W</td>';
        instructions += '<td> 	Enter the Receive Frequency (RX Freq) as the mobile or portable subscriber would be programmed using xxx.xxxx out to four decimal places, followed by either an â€œNâ€? or a â€œWâ€?, depending on whether the frequency is narrow or wide band. The name of the specific trunked radio system with which the talkgroup is associated may be entered across all fields on the ICS 205 normally used for conventional channel programming information.</td>';
		instructions += '</tr>';
		instructions += '<tr>';
		instructions += '<tr>';
   	   	instructions += '<td></td>';
   	   	instructions += '<td>Rx Tone/NAC</td>';
        instructions += '<td>Enter the Receive Continuous Tone Coded Squelch System (CTCSS) subaudible tone (RX Tone) or Network Access Code (RX NAC) for the receive frequency as the mobile or portable subscriber would be programmed.</td>';
		instructions += '</tr>';
		instructions += '<tr>';
		instructions += '<tr>';
   	   	instructions += '<td></td>';
   	   	instructions += '<td>Tx Freq N or W</td>';
        instructions += '<td>Enter Transmit Frequency (TX Freq) as the mobile or portable subscriber would be programmed using xxx.xxxx out to four decimal places, followed by either an â€œNâ€? or a â€œWâ€?, depending on whether the frequency is narrow or wide band.</td>';
		instructions += '</tr>';
		instructions += '<tr>';
		instructions += '<tr>';
   	   	instructions += '<td></td>';
   	   	instructions += '<td>Tx Tone/NAC</td>';
        instructions += '<td>Enter Transmit Continuous Tone Coded Squelch System (CTCSS) subaudible tone (RX Tone) or Network Access Code (RX NAC) for the receive frequency as the mobile or portable subscriber would be programmed.</td>';
		instructions += '</tr>';
		instructions += '<tr>';
		instructions += '<tr>';
   	   	instructions += '<td></td>';
   	   	instructions += '<td>Mode A, D or M</td>';
        instructions += '<td>Mode refers to either â€œAâ€? or â€œDâ€? indicating analog or digital (e.g. Project 25) or "M" indicating mixed mode.</td>';
		instructions += '</tr>';
		instructions += '<tr>';
		instructions += '<tr>';
   	   	instructions += '<td></td>';
   	   	instructions += '<td>Remarks</td>';
        instructions += '<td>Enter miscellaneous information concerning repeater locations, information concerning patched channels or talkgroups using links or gateways, etc. and narrative information regarding special situations.</td>';
		instructions += '</tr>';
		instructions += '<tr>';
   	   	instructions += '<td>3a</td>';
   	   	instructions += '<td>Basic Local Comms Information</td>';
        instructions += '<td>Enter the communications methods assigned and used for each assignment.</td>';
		instructions += '</tr>';
		instructions += '<tr>';
   	   	instructions += '<td></td>';
   	   	instructions += '<td>Assignment</td>';
        instructions += '<td>Enter the ICS Organizational assignment.</td>';
		instructions += '</tr>';
		instructions += '<tr>';
   	   	instructions += '<td></td>';
   	   	instructions += '<td>Name</td>';
        instructions += '<td>Enter the name of the contact person for the assignment.</td>';
		instructions += '</tr>';
		instructions += '<tr>';
   	   	instructions += '<td></td>';
   	   	instructions += '<td>Method(s) of contact</td>';
        instructions += '<td>Enter the radio frequency, telephone number(s), etc. for each assignment.</td>';
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
   		instructions += '</tbody>';
   		instructions += '</table>';
   		
   		
	return Ext.define('modules.report-opp.I205InstructionsView', {
	 	extend: 'Ext.panel.Panel',
		header: true,
	    autoScroll: true,
        referenceHolder: true,
	 	collapsible:true,
	 	html: instructions
	 	
	});
});
