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
define([], function() {

	var IncidentModel = function(){};http://www.localhost.com:8080/nics/login

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
	IncidentModel.prototype.lat = -1;
	IncidentModel.prototype.lon = -1;
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
	
	IncidentModel.prototype.setLon = function(lon){
		this.lon = lon;
	};
	
	IncidentModel.prototype.getLon = function(){
		return this.lon;
	};
	
	IncidentModel.prototype.setLat = function(lat){
		this.lat = lat;
	};
	
	IncidentModel.prototype.getLat = function(){
		return this.lat;
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
		return [ [ 'US','AL' ], [ 'US', 'AK' ],
				[ 'US', 'AZ' ], [ 'US', 'AR' ],
				[ 'US', 'CA' ], [ 'US', 'CO' ],
				[ 'US', 'CT' ], [ 'US', 'DE' ],
				[ 'US', 'DC' ], [ 'US', 'FL' ],
				[ 'US', 'GA' ], [ 'US', 'HI' ],
				[ 'US', 'ID' ], [ 'US', 'IL' ],
				[ 'US', 'IN' ], [ 'US', 'IA' ],
				[ 'US', 'KS' ], [ 'US', 'KY' ],
				[ 'US', 'LA' ], [ 'US', 'ME' ],
				[ 'US', 'MD' ], [ 'US', 'MA' ],
				[ 'US', 'MI' ], [ 'US', 'MN' ],
				[ 'US', 'MS' ], [ 'US', 'MO' ],
				[ 'US', 'MT' ], [ 'US', 'NE' ],
				[ 'US', 'NV' ], [ 'US', 'NH' ],
				[ 'US', 'NJ' ], [ 'US', 'NM' ],
				[ 'US', 'NY' ], [ 'US', 'NC' ],
				[ 'US', 'ND' ], [ 'US', 'OH' ],
				[ 'US', 'OK' ], [ 'US', 'OR' ],
				[ 'US', 'PA' ], [ 'US', 'RI' ],
				[ 'US', 'SC' ], [ 'US', 'SD' ],
				[ 'US', 'TN' ], [ 'US', 'TX' ],
				[ 'US', 'UT' ], [ 'US', 'VT' ],
				[ 'US', 'VA' ], [ 'US', 'WA' ],
				[ 'US', 'WV' ], [ 'US', 'WI' ],
				[ 'US', 'WY' ] ];
	};
	
	IncidentModel.prototype.getCountries = function() {
		return [ ["None Selected", "ZZ"],["Afghanistan", "AF"], ["Albania", "AL"], ["Algeria", "DZ"], ["American Samoa", "AS"],
				["Andorra", "AD"], ["Angola", "AO"], ["Anguilla", "AI"], ["Antarctica", "AQ"],
				["Antigua and Barbuda","AG"], ["Argentina", "AR"], ["Armenia", "AM"], ["Aruba", "AW"],
				["Australia", "AU"], ["Austria","AT"], ["Azerbaijan", "AZ"], ["Bahamas","BS"], ["Bahrain","BH"],
				["Bangladesh", "BD"], ["Barbados","BB"], ["Belarus", "BY"], ["Belgium", "BE"], ["Belize", "BZ"],
				["Benin", "BJ"], ["Bermuda", "BM"], ["Bhutan", "BT"], ["Bolivia", "BO"], ["Bonaire", "BQ"],
				["Bosnia and Herzegovina", "BA"], ["Botswana", "BW"], ["Bouvet Island", "BV"],
				["Brazil", "BR"], ["British Indian Ocean Territory","IO"],
				["British Virgin Islands","VG"], ["Brunei","BN"], ["Bulgaria","BG"], ["Burkina Faso","BF"],
				["Burundi","BI"], ["Cambodia","KH"], ["Cameroon","CM"], ["Canada","CA"], ["Cape Verde","CV"],
				["Cayman Islands","KY"], ["Central African Republic","CF"], ["Chad","TD"], ["Chile","CL"],
				["China","CN"], ["Christmas Island","CX"], ["Cocos Islands","CC"], ["Colombia","CO"],
				["Comoros","KM"], ["Cook Islands","CK"], ["Costa Rica","CR"], ["Croatia","HR"], ["Cuba","CU"],
				["Curacao","CW"], ["Cyprus","CY"], ["Czech Republic","CZ"],
				["Democratic Republic of the Congo","CD"], ["Denmark","DK"], ["Djibouti","DJ"],
				["Dominica","DM"], ["Dominican Republic","DO"], ["East Timor","TL"], ["Ecuador","EC"],
				["Egypt","EG"], ["El Salvador","SV"], ["Equatorial Guinea","GQ"], ["Eritrea","ER"],
				["Estonia","EE"], ["Ethiopia","ET"], ["Falkland Islands","FK"], ["Faroe Islands","FO"],
				["Fiji","FJ"], ["Finland","FI"], ["France","FR"], ["French Guiana","GF"],
				["French Polynesia","PF"], ["French Southern Territories","TF"], ["Gabon","GA"],
				["Gambia","GM"], ["Georgia","GE"], ["Germany","DE"], ["Ghana","GH"], ["Gibraltar","GI"], ["Greece","GR"],
				["Greenland","GL"], ["Grenada","GD"], ["Guadeloupe","GP"], ["Guam","GU"], ["Guatemala","GT"],
				["Guernsey","GG"], ["Guinea","GN"], ["Guinea-Bissau","GW"], ["Guyana","GY"], ["Haiti","HT"],
				["Heard Island and McDonald Islands","HM"], ["Honduras","HN"], ["Hong Kong","HK"],
				["Hungary","HU"], ["Iceland","IS"], ["India","IN"], ["Indonesia","ID"], ["Iran","IR"], ["Iraq","IQ"],
				["Ireland","IE"], ["Isle of Man","IM"], ["Israel","IL"], ["Italy","IT"], ["Ivory Coast","CI"],
				["Jamaica","JM"], ["Japan","JP"], ["Jersey","JE"], ["Jordan","JO"], ["Kazakhstan","KZ"], ["Kenya","KE"],
				["Kiribati","KI"], ["Kosovo","XK"], ["Kuwait","KW"], ["Kyrgyzstan","KG"], ["Laos","LA"], ["Latvia","LV"],
				["Lebanon","LB"], ["Lesotho","LS"], ["Liberia","LR"], ["Libya","LY"], ["Liechtenstein","LI"],
				["Lithuania","LT"], ["Luxembourg","LU"], ["Macao","MO"], ["Macedonia","MK"], ["Madagascar","MG"],
				["Malawi","MW"], ["Malaysia","MY"], ["Maldives","MV"], ["Mali","ML"], ["Malta","MT"],
				["Marshall Islands","MH"], ["Martinique","MQ"], ["Mauritania","MR"], ["Mauritius","MU"],
				["Mayotte","YT"], ["Mexico","MX"], ["Micronesia","FM"], ["Moldova","MD"], ["Monaco","MC"],
				["Mongolia","MN"], ["Montenegro","ME"], ["Montserrat","MS"], ["Morocco","MA"],
				["Mozambique","MZ"], ["Myanmar","MM"], ["Namibia","NA"], ["Nauru","NR"], ["Nepal","NP"],
				["Netherlands","NL"], ["New Caledonia","NC"], ["New Zealand","NZ"], ["Nicaragua","NI"],
				["Niger","NE"], ["Nigeria","NG"], ["Niue","NU"], ["Norfolk Island","NF"], ["North Korea","KP"],
				["Northern Mariana Islands","MP"], ["Norway","NO"], ["Oman","OM"], ["Pakistan","PK"],
				["Palau","PW"], ["Palestine","PS"], ["Panama","PA"], ["Papua New Guinea","PG"], ["Paraguay","PY"],
				["Peru","PE"], ["Philippines","PH"], ["Pitcairn Islands","PN"], ["Poland","PL"],
				["Portugal","PT"], ["Puerto Rico","PR"], ["Qatar","QA"], ["Republic of the Congo","CG"],
				["Réunion","RE"], ["Romania","RO"], ["Russia","RU"], ["Rwanda","RW"], ["Saint Barthélemy","BL"],
				["Saint Helena","SH"], ["Saint Kitts and Nevis","KN"], ["Saint Lucia","LC"],
				["Saint Martin","MF"], ["Saint Pierre and Miquelon","PM"],
				["Saint Vincent and the Grenadines","VC"], ["Samoa","WS"], ["San Marino","SM"],["São Tomé and Príncipe","ST"],
				["Saudi Arabia","SA"], ["Senegal","SN"], ["Serbia","RS"], ["Seychelles","SC"],
				["Sierra Leone","SL"], ["Singapore","SG"], ["Sint Maarten","SX"], ["Slovakia","SK"],
				["Slovenia","SI"], ["Solomon Islands","SB"], ["Somalia","SO"], ["South Africa","ZA"],
				["South Georgia and the South Sandwich Islands","GS"], ["South Korea","KR"],
				["South Sudan","SS"], ["Spain","ES"], ["Sri Lanka","LK"], ["Sudan","SD"], ["Suriname","SR"],
				["Svalbard and Jan Mayen","SJ"], ["Swaziland","SZ"], ["Sweden","SE"], ["Switzerland","CH"],
				["Syria","SY"], ["Taiwan","TW"], ["Tajikistan","TJ"],
				["Tanzania","TZ"], ["Thailand","TH"], ["Togo","TG"], ["Tokelau","TK"], ["Tonga","TO"],
				["Trinidad and Tobago","TT"], ["Tunisia","TN"], ["Turkey","TR"], ["Turkmenistan","TM"],
				["Turks and Caicos Islands","TC"], ["Tuvalu","TV"],
				["U.S. Minor Outlying Islands","UM"], ["U.S. Virgin Islands","VI"], ["Uganda","UG"],
				["Ukraine","UA"], ["United Arab Emirates","AE"], ["United Kingdom","GB"],
				["United States","US"], ["Uruguay","UY"], ["Uzbekistan","UZ"], ["Vanuatu","VU"],
				["Vatican City"], ["Venezuela"], ["Vietnam"], ["Wallis and Futuna"],
				["Western Sahara","EH"], ["Yemen","YE"], ["Zambia","ZM"], ["Zimbabwe","ZW"], ["Åland","AX"] ];
	};
	IncidentModel.prototype.getAllOrgPrefixes = function(){
		return this.allOrgPrefixes;
	};
	IncidentModel.prototype.setAllOrgPrefixes = function(orgs){
		var allOrgPrefixes = [];
		for(i = 0; i < orgs.length; i++){
			 allOrgPrefixes[i] = orgs[i].prefix;
			}	
		this.allOrgPrefixes = allOrgPrefixes; 
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
