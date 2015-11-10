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
define([], function() {

	var IncidentModel = function(){};

	var NO_INCIDENT = 'noincident';
	
	var defaultIncident  = { name: NO_INCIDENT, id: -1};

	IncidentModel.prototype.automatedRooms = ["IncidentMap", "WorkingMap"];//Load with user profile
	IncidentModel.prototype.orgPrefix = "";
	IncidentModel.prototype.incidents = [];
	IncidentModel.prototype.usersessionId = -1;
	IncidentModel.prototype.userId = -1;
	IncidentModel.prototype.workspaceId = -1;
	IncidentModel.prototype.description = "";
	IncidentModel.prototype.incidentName = "";
	IncidentModel.prototype.incidentTypeIds = [];
	IncidentModel.prototype.incidentCallBack = null;
	IncidentModel.prototype.username = null;

	IncidentModel.prototype.currentIncident = { name: NO_INCIDENT, id: -1};
	IncidentModel.prototype.openIncidents = [];

	IncidentModel.prototype.setIncidents = function(incidents){
		this.incidents  = incidents;
	};

	IncidentModel.prototype.getIncidents = function(){
		return this.incidents;
	};

	IncidentModel.prototype.setCurrentIncident = function(incident){
		if(incident.name != NO_INCIDENT && !$.inArray(incident, this.openIncidents)){
			this.openIncidents.push(incident);
		}
		this.currentIncident = incident;
	};

	IncidentModel.prototype.getCurrentIncident = function(){
		return this.currentIncident;
	};
	
	IncidentModel.prototype.getCurrentIncidentId = function(){
		return this.currentIncident.id;
	};

	IncidentModel.prototype.removeCurrentIncident = function(){
		this.openIncidents.splice($.inArray(this.currentIncident, this.openIncidents), 1);
		this.setCurrentIncident(defaultIncident);
	};

	IncidentModel.prototype.hasCurrentIncident = function(){
		return !(this.currentIncident == NO_INCIDENT);
	};
	
	IncidentModel.prototype.isOpen = function(incident){
		return ($.inArray(incident, this.openIncidents) > -1);
	};

	IncidentModel.prototype.setOrgPrefix = function(prefix){
		this.orgPrefix = prefix;
	};

	IncidentModel.prototype.getOrgPrefix = function(){
		return this.orgPrefix;
	};

	IncidentModel.prototype.setCollabRooms = function(collabRooms){
		this.collabRooms = collabRooms;
	};

	IncidentModel.prototype.getCollabRooms = function(incidentName){
		return this.collabRooms[incidentName];
	};

	IncidentModel.prototype.getStates = function(){
		return [ [ 'United States','AL' ], [ 'United States', 'AK' ],
				[ 'United States', 'AZ' ], [ 'United States', 'AR' ],
				[ 'United States', 'CA' ], [ 'United States', 'CO' ],
				[ 'United States', 'CT' ], [ 'United States', 'DE' ],
				[ 'United States', 'DC' ], [ 'United States', 'FL' ],
				[ 'United States', 'GA' ], [ 'United States', 'HI' ],
				[ 'United States', 'ID' ], [ 'United States', 'IL' ],
				[ 'United States', 'IN' ], [ 'United States', 'IA' ],
				[ 'United States', 'KS' ], [ 'United States', 'KY' ],
				[ 'United States', 'LA' ], [ 'United States', 'ME' ],
				[ 'United States', 'MD' ], [ 'United States', 'MA' ],
				[ 'United States', 'MI' ], [ 'United States', 'MN' ],
				[ 'United States', 'MS' ], [ 'United States', 'MO' ],
				[ 'United States', 'MT' ], [ 'United States', 'NE' ],
				[ 'United States', 'NV' ], [ 'United States', 'NH' ],
				[ 'United States', 'NJ' ], [ 'United States', 'NM' ],
				[ 'United States', 'NY' ], [ 'United States', 'NC' ],
				[ 'United States', 'ND' ], [ 'United States', 'OH' ],
				[ 'United States', 'OK' ], [ 'United States', 'OR' ],
				[ 'United States', 'PA' ], [ 'United States', 'RI' ],
				[ 'United States', 'SC' ], [ 'United States', 'SD' ],
				[ 'United States', 'TN' ], [ 'United States', 'TX' ],
				[ 'United States', 'UT' ], [ 'United States', 'VT' ],
				[ 'United States', 'VA' ], [ 'United States', 'WA' ],
				[ 'United States', 'WV' ], [ 'United States', 'WI' ],
				[ 'United States', 'WY' ] ];
	};
	
	IncidentModel.prototype.getCountries = function() {
		return [ ["Afghanistan"], ["Albania"], ["Algeria"], ["American Samoa"],
				["Andorra"], ["Angola"], ["Anguilla"], ["Antarctica"],
				["Antigua and Barbuda"], ["Argentina"], ["Armenia"], ["Aruba"],
				["Australia"], ["Austria"], ["Azerbaijan"], ["Bahamas"], ["Bahrain"],
				["Bangladesh"], ["Barbados"], ["Belarus"], ["Belgium"], ["Belize"],
				["Benin"], ["Bermuda"], ["Bhutan"], ["Bolivia"], ["Bonaire"],
				["Bosnia and Herzegovina"], ["Botswana"], ["Bouvet Island"],
				["Brazil"], ["British Indian Ocean Territory"],
				["British Virgin Islands"], ["Brunei"], ["Bulgaria"], ["Burkina Faso"],
				["Burundi"], ["Cambodia"], ["Cameroon"], ["Canada"], ["Cape Verde"],
				["Cayman Islands"], ["Central African Republic"], ["Chad"], ["Chile"],
				["China"], ["Christmas Island"], ["Cocos Islands"], ["Colombia"],
				["Comoros"], ["Cook Islands"], ["Costa Rica"], ["Croatia"], ["Cuba"],
				["Curacao"], ["Cyprus"], ["Czech Republic"],
				["Democratic Republic of the Congo"], ["Denmark"], ["Djibouti"],
				["Dominica"], ["Dominican Republic"], ["East Timor"], ["Ecuador"],
				["Egypt"], ["El Salvador"], ["Equatorial Guinea"], ["Eritrea"],
				["Estonia"], ["Ethiopia"], ["Falkland Islands"], ["Faroe Islands"],
				["Fiji"], ["Finland"], ["France"], ["French Guiana"],
				["French Polynesia"], ["French Southern Territories"], ["Gabon"],
				["Gambia"], ["Georgia"], ["Germany"], ["Ghana"], ["Gibraltar"], ["Greece"],
				["Greenland"], ["Grenada"], ["Guadeloupe"], ["Guam"], ["Guatemala"],
				["Guernsey"], ["Guinea"], ["Guinea-Bissau"], ["Guyana"], ["Haiti"],
				["Heard Island and McDonald Islands"], ["Honduras"], ["Hong Kong"],
				["Hungary"], ["Iceland"], ["India"], ["Indonesia"], ["Iran"], ["Iraq"],
				["Ireland"], ["Isle of Man"], ["Israel"], ["Italy"], ["Ivory Coast"],
				["Jamaica"], ["Japan"], ["Jersey"], ["Jordan"], ["Kazakhstan"], ["Kenya"],
				["Kiribati"], ["Kosovo"], ["Kuwait"], ["Kyrgyzstan"], ["Laos"], ["Latvia"],
				["Lebanon"], ["Lesotho"], ["Liberia"], ["Libya"], ["Liechtenstein"],
				["Lithuania"], ["Luxembourg"], ["Macao"], ["Macedonia"], ["Madagascar"],
				["Malawi"], ["Malaysia"], ["Maldives"], ["Mali"], ["Malta"],
				["Marshall Islands"], ["Martinique"], ["Mauritania"], ["Mauritius"],
				["Mayotte"], ["Mexico"], ["Micronesia"], ["Moldova"], ["Monaco"],
				["Mongolia"], ["Montenegro"], ["Montserrat"], ["Morocco"],
				["Mozambique"], ["Myanmar"], ["Namibia"], ["Nauru"], ["Nepal"],
				["Netherlands"], ["New Caledonia"], ["New Zealand"], ["Nicaragua"],
				["Niger"], ["Nigeria"], ["Niue"], ["Norfolk Island"], ["North Korea"],
				["Northern Mariana Islands"], ["Norway"], ["Oman"], ["Pakistan"],
				["Palau"], ["Palestine"], ["Panama"], ["Papua New Guinea"], ["Paraguay"],
				["Peru"], ["Philippines"], ["Pitcairn Islands"], ["Poland"],
				["Portugal"], ["Puerto Rico"], ["Qatar"], ["Republic of the Congo"],
				["Romania"], ["Russia"], ["Rwanda"], ["Réunion"], ["Saint Barthélemy"],
				["Saint Helena"], ["Saint Kitts and Nevis"], ["Saint Lucia"],
				["Saint Martin"], ["Saint Pierre and Miquelon"],
				["Saint Vincent and the Grenadines"], ["Samoa"], ["San Marino"],
				["Saudi Arabia"], ["Senegal"], ["Serbia"], ["Seychelles"],
				["Sierra Leone"], ["Singapore"], ["Sint Maarten"], ["Slovakia"],
				["Slovenia"], ["Solomon Islands"], ["Somalia"], ["South Africa"],
				["South Georgia and the South Sandwich Islands"], ["South Korea"],
				["South Sudan"], ["Spain"], ["Sri Lanka"], ["Sudan"], ["Suriname"],
				["Svalbard and Jan Mayen"], ["Swaziland"], ["Sweden"], ["Switzerland"],
				["Syria"], ["São Tomé and Príncipe"], ["Taiwan"], ["Tajikistan"],
				["Tanzania"], ["Thailand"], ["Togo"], ["Tokelau"], ["Tonga"],
				["Trinidad and Tobago"], ["Tunisia"], ["Turkey"], ["Turkmenistan"],
				["Turks and Caicos Islands"], ["Tuvalu"],
				["U.S. Minor Outlying Islands"], ["U.S. Virgin Islands"], ["Uganda"],
				["Ukraine"], ["United Arab Emirates"], ["United Kingdom"],
				["United States"], ["Uruguay"], ["Uzbekistan"], ["Vanuatu"],
				["Vatican City"], ["Venezuela"], ["Vietnam"], ["Wallis and Futuna"],
				["Western Sahara"], ["Yemen"], ["Zambia"], ["Zimbabwe"], ["Åland"] ];
	};

	IncidentModel.prototype.setUsersessionId = function(id){
		this.usersessionId = id;
	};

	IncidentModel.prototype.getUsersessionId = function(){
		return this.usersessionId;
	};
	
	IncidentModel.prototype.setUserId = function(id){
		this.userId = id;
	};

	IncidentModel.prototype.getUserId = function(){
		return this.userId;
	};

	IncidentModel.prototype.setWorkspaceId = function(id){
		this.workspaceId = id;
	};

	IncidentModel.prototype.getWorkspaceId = function(){
		return this.workspaceId;
	};
	
	IncidentModel.prototype.setDescription = function(description){
		this.description = description;
	};

	IncidentModel.prototype.getDescription = function(){
		return this.description;
	};
	
	IncidentModel.prototype.setIncidentName = function(name){
		this.incidentName = name;
	};
	
	IncidentModel.prototype.getIncidentName = function(){
		return this.incidentName;
	};
	
	IncidentModel.prototype.setIncidentTypeIds = function(ids){
		this.incidentTypeIds = ids;
	};
	
	IncidentModel.prototype.getIncidentTypeIds = function(){
		return this.incidentTypeIds;
	}
	
	IncidentModel.prototype.setIncidentTypes = function(incidentTypes){
		this.incidentTypes = incidentTypes;
	};
	
	IncidentModel.prototype.getIncidentTypes = function(){
		return this.incidentTypes;
	}

	IncidentModel.prototype.setAutomatedRooms = function(rooms){
		this.automatedRooms = rooms;
	};

	IncidentModel.prototype.getAutomatedRooms = function(){
		return this.automatedRooms;
	};
	
	IncidentModel.prototype.setIncidentCallBack = function(fn){
		this.incidentCallBack = fn;
	};
	
	IncidentModel.prototype.getIncidentCallBack = function(){
		return this.incidentCallBack;
	};
	
	IncidentModel.prototype.setUsername = function(username){
		this.username = username;
	};
	
	IncidentModel.prototype.getUsername = function(){
		return this.username;
	};

	return IncidentModel;
});
