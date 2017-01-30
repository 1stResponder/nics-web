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
define([  'iweb/CoreModule', 
			'nics/modules/UserProfileModule'
			],

function(Core, UserProfile) {
	
	Ext.define('modules.report-opp.AbstractFormController', {
		extend : 'Ext.app.ViewController',
		
		alias : 'controller.oppabstractformcontroller',
		
		addFieldContainer: function (form, prefix, startIndex, count) {
			
			var currentFieldset = this.view.lookupReference(prefix + form);
			if (count === "") count = "1";
			var endIndex   = startIndex + parseInt(count);
			for (i = startIndex; i < endIndex; i++){
				var bindItems = [];
				switch(prefix){
				  case "agencyRep":
					  bindItems = ['{agencyRep' + i + '}', '{contactRep' + i + '}'];
				      break;
				  case "icStaff":
					  bindItems = ['{icAgency' + i + '}', '{icPosition' + i + '}', '{icContact' + i + '}' ];
				      break;
				  case "intel":
					  bindItems = ['{intelAgency' + i + '}', '{intelPosition' + i + '}', '{intelContact' + i + '}'];
				      break;
				  case "logistics":
					  bindItems = ['{logisticsAgency' + i + '}', '{logisticsPosition' + i + '}', '{logisticsContact' + i + '}'];
				      break;
				  case "logisticsSpt":
					  bindItems = ['{logisticsSptAgency' + i + '}', '{logisticsSptPosition' + i + '}', '{logisticsSptContact' + i + '}'];
				      break;
				  case "logisticsSrv":
					  bindItems = ['{logisticsSrvAgency' + i + '}', '{logisticsSrvPosition' + i + '}', '{logisticsSrvContact' + i + '}'];
				      break;
				  case "ops":
					  bindItems = ['{opsAgency' + i + '}', '{opsPosition' + i + '}', '{opsContact' + i + '}'];
				      break;
				  case "opsBranch":
					  bindItems = ['{opsBranchAgency' + i + '}', '{opsBranchPosition' + i + '}', '{opsBranchContact' + i + '}'];
				      break;
				  case "opsBranch":
					  bindItems = ['{opsBranchAgency' + i + '}', '{opsBranchPosition' + i + '}', '{opsBranchContact' + i + '}'];
				      break;
				  case "opsBBranch":
					  bindItems = ['{opsBBranchAgency' + i + '}', '{opsBBranchPosition' + i + '}', '{opsBBranchContact' + i + '}'];
				      break;
				  case "opsCBranch":
					  bindItems = ['{opsCBranchAgency' + i + '}', '{opsCBranchPosition' + i + '}', '{opsCBranchContact' + i + '}'];
				      break;
				  case "opsAirBranch":
					  bindItems = ['{opsAirBranchAgency' + i + '}', '{opsAirBranchPosition' + i + '}', '{opsAirBranchContact' + i + '}'];
				      break;
				  case "finance":
					  bindItems = ['{financeAgency' + i + '}', '{financePosition' + i + '}', '{financeContact' + i +'}'];
				      break;
				  case "resource":
					  bindItems = ['{resourceName' + i + '}', '{resourceId' + i + '}', '{resourceDatetime' + i + '}','{resourceETA' + i + '}', '{resourceOS' + i + '}', '{resourceNotes' + i + '}'];
			      break;
					
				}
				
				
				if (bindItems.length  == 2){
					var newContainer = new Ext.form.FieldContainer({
						layout:'hbox',defaultType: 'textfield', defaults: {vtype:'simplealphanum',flex:2},
    	  	    	  	items:[ {bind:bindItems[0]},
    	  	    	  	        {bind:bindItems[1],cls:'i201Contact'}
    	  	    	    	  ]
					});
					
				}
				else if (bindItems.length  == 6 && prefix == 'resource'){
					var newContainer = new Ext.form.FieldContainer({
						layout:'hbox',defaultType: 'textfield', defaults: {vtype:'simplealphanum',flex:10},
    	  	    	  	items:[ {bind:bindItems[0]},
    	  	    	  	        {bind:bindItems[1]},
    	  	    	  	        {bind:bindItems[2]},
    	  	    	  	        {bind:bindItems[3]},
    	  	    	  	        {bind:bindItems[4],xtype:'checkbox', flex:1},
    	  	    	  	        {bind:bindItems[5]}
    	  	    	    	  ]
					});
					
				}
				
				
				else { //(bindItems.length  == 3)
					var newContainer = new Ext.form.FieldContainer({
						layout:'hbox',defaultType: 'textfield', defaults: {vtype:'simplealphanum',flex:3},
    	  	    	  	items:[ {bind:bindItems[0]},
    	  	    	  	        {bind:bindItems[1]},
    	  	    	  	        {bind:bindItems[2],cls:'i201Contact'}
    	  	    	    	  ]
					});
					
				}
			
				currentFieldset.add(newContainer);
			}
	
		return;
	}, 

		
	clearForm: function () {
		 
		 var username  = UserProfile.getFirstName() + " " + UserProfile.getLastName();	
		 this.view.getForm().getFields().each (function (field) {
			 if (field.fieldLabel != 'Incident Number*' && field.fieldLabel != 'Incident Name*'  && !(field.isHidden()) && field.xtype !='checkbox')
				 field.setValue("");
	    	});
	    },
		
	
		
    	buildDataArray: function(data){
    		//dataObject
    		var dataObject = {};
    		//build the arrays
    		var icStaffArray = [];
    		var agencyRepsArray = [];
    		var intelArray = [];
    		var logisticsArray = [];
    		var logisticsSptArray = [];
    		var logisticsSrvArray = [];
    		var opsArray = [];
    		var opsBranchArray = [];
    		var opsBBranchArray = [];
    		var opsCBranchArray = [];
    		var opsAirBranchArray = [];
    		var financeArray = [];
    		var resourceArray = [];
    		
    		var agencyRepsCount = 0;
    		var icStaffCount = 0;
    		var intelCount = 0;
    		var logisticsCount = 0;
    		var logisticsSptCount = 0;
    		var logisticsSrvCount = 0;
    		var opsCount = 0;
    		var opsBranchCount = 0;
    		var opsBBranchCount = 0;
    		var opsCBranchCount = 0;
    		var opsAirBranchCount = 0;
    		var financeCount = 0;
    		var resourceCount = 0;
    		var oldIndex
    		
    		for (item in data){
    			
    		//Figure out how many values have been added for the various contact list fields
			//if ( /contactRep[0-9]+/.test(item) && data[item] != "")++agencyRepsCount;
    			if ( /contactRep[0-9]+/.test(item) && data[item] != ""){
					++agencyRepsCount;
					oldIndex = item.match(/[0-9]+$/);
					currentAgency="agencyRep" +oldIndex;
					agencyRepsArray.push([data[currentAgency],  data[item]]);
					
				}
				if ( /icContact[0-9]+/.test(item) && data[item] != ""){
					++icStaffCount;
					oldIndex = item.match(/[0-9]+$/);
					currentAgency="icAgency" + oldIndex;
					currentPosition="icPosition" + oldIndex;
					icStaffArray.push([data[currentAgency], data[currentPosition], data[item]]);
					
				}
				if ( /intelContact[0-9]+/.test(item) && data[item] != ""){
					++intelCount;
					oldIndex = item.match(/[0-9]+$/);
					currentAgency="intelAgency" + oldIndex;
					currentPosition="intelPosition" + oldIndex;
					intelArray.push([data[currentAgency], data[currentPosition], data[item]]);
				}
					
				if ( /logisticsContact[0-9]+/.test(item) && data[item] != ""){
					++logisticsCount;
					oldIndex = item.match(/[0-9]+$/);
					currentAgency="logisticsAgency" + oldIndex;
					currentPosition="logisticsPosition" + oldIndex;
					logisticsArray.push([data[currentAgency], data[currentPosition], data[item]]);
				}
				if ( /logisticsSptContact[0-9]+/.test(item) && data[item] != ""){
					++logisticsSptCount;
					oldIndex = item.match(/[0-9]+$/);
					currentAgency="logisticsSptAgency" + oldIndex;
					currentPosition="logisticsSptPosition" + oldIndex;
					logisticsSptArray.push([data[currentAgency], data[currentPosition], data[item]]);
				}
				if ( /logisticsSrvContact[0-9]+/.test(item) && data[item] != ""){
					++logisticsSrvCount;
					oldIndex = item.match(/[0-9]+$/);
					currentAgency="logisticsSrvAgency" + oldIndex;
					currentPosition="logisticsSrvPosition" + oldIndex;
					logisticsSrvArray.push([data[currentAgency], data[currentPosition], data[item]]);
				}
				if ( /opsContact[0-9]+/.test(item) && data[item] != ""){
					++opsCount;
					oldIndex = item.match(/[0-9]+$/);
					currentAgency="opsAgency" + oldIndex;
					currentPosition="opsPosition" + oldIndex;
					opsArray.push([data[currentAgency], data[currentPosition], data[item]]);
				}
				if ( /opsBranchContact[0-9]+/.test(item) && data[item] != ""){
					++opsBranchCount;
					oldIndex = item.match(/[0-9]+$/);
					currentAgency="opsBranchAgency" + oldIndex;
					currentPosition="opsBranchPosition" + oldIndex;
					opsBranchArray.push([data[currentAgency], data[currentPosition], data[item]]);
				}
				if ( /opsBBranchContact[0-9]+/.test(item) && data[item] != ""){
					++opsBBranchCount;
					oldIndex = item.match(/[0-9]+$/);
					currentAgency="opsBBranchAgency" + oldIndex;
					currentPosition="opsBBranchPosition" + oldIndex;
					opsBBranchArray.push([data[currentAgency], data[currentPosition], data[item]]);
				}
				if ( /opsCBranchContact[0-9]+/.test(item) && data[item] != ""){
					++opsCBranchCount;
					oldIndex = item.match(/[0-9]+$/);
					currentAgency="opsCBranchAgency" + oldIndex;
					currentPosition="opsCBranchPosition" + oldIndex;
					opsCBranchArray.push([data[currentAgency], data[currentPosition], data[item]]);
				}
				if ( /opsAirBranchContact[0-9]+/.test(item) && data[item] != ""){
					++opsAirBranchCount;
					oldIndex = item.match(/[0-9]+$/);
					currentAgency="opsAirBranchAgency" + oldIndex;
					currentPosition="opsAirBranchPosition" + oldIndex;
					opsAirBranchArray.push([data[currentAgency], data[currentPosition], data[item]]);
				}
				if ( /financeContact[0-9]+/.test(item) && data[item] != ""){
					++financeCount;
					oldIndex = item.match(/[0-9]+$/);
					currentAgency="financeAgency" + oldIndex;
					currentPosition="financePosition" + oldIndex;
					financeArray.push([data[currentAgency], data[currentPosition], data[item]]);
					}
				if ( /resourceName[0-9]+/.test(item) && data[item] != ""){
					++resourceCount;
					oldIndex = item.match(/[0-9]+$/);
					currentResourceName="resourceName" + oldIndex;
					currentId="resourceId" + oldIndex;
					currentDatetime="resourceDatetime" + oldIndex;
					currentETA="resourceETA" + oldIndex;
					currentOS="resourceOS" + oldIndex;
					resourceArray.push([data[currentResourceName], data[currentId],  data[currentDatetime], data[currentETA],  data[currentOS], data[item]]);
				}
			
    		}
	    	
		    dataObject =  {
		    		icStaff:{array:icStaffArray, count:icStaffCount},
		    		agencyReps:{array:agencyRepsArray, count:agencyRepsCount},
		    		intel:{array:intelArray, count:intelCount},
		    		logistics:{array:logisticsArray, count:logisticsCount},
		    		logisticsSpt:{array:logisticsSptArray, count:logisticsSptCount},
		    		logisticsSrv:{array:logisticsSrvArray, count:logisticsSrvCount},
		    		ops:{array:opsArray, count:opsCount},
		    		opsBranch:{array:opsBranchArray, count:opsBranchCount},
		    		opsBBranch:{array:opsBBranchArray, count:opsBBranchCount},
		    		opsCBranch:{array:opsCBranchArray, count:opsCBranchCount},
		    		opsAirBranch:{array:opsAirBranchArray, count:opsAirBranchCount},
		    		finance:{array:financeArray, count:financeCount},
		    		resource:{array:resourceArray, count:resourceCount}
		    }
		    return dataObject;
		},
    	setReportData: function(array, count, prefix, report){
    		if (array.length > 0){
    		   for(var i=1; i<=array.length; i++){
                	 currentRow  = array[i-1];
                	 if (currentRow[0]) report[prefix + 'Agency' + i] = currentRow[0];
                	 if (currentRow[1]) report[prefix + 'Position' + i] = currentRow[1];
					 if (currentRow[2]) report[prefix + 'Contact' + i] = currentRow[2];
						
                }
    		   }
    		
    	},
    	printContactRows: function(row){
		     var rowText='';
			for(var i=0; i<row.length; i++){
           	rowText += '<tr><td>'
           	 if(row[i][0]) rowText += row[i][0];
           	rowText +='</td><td>'
           	if(row[i][1]) rowText += row[i][1]; 
           	rowText +='</td>';
           	if (row[i].length > 2){
           		rowText += '<td>';
           		if(row[i][2]) rowText +=row[i][2]
               	rowText += '</td>';
           	}
           	rowText += '</tr>';
           }
			return rowText;
		},
		printConstantRows: function(row, cellCount){
		     var rowText='';
			for(var i=0; i<row.length; i++){
				rowText += '<tr>'
          		for(var j=0; j<cellCount; j++){
          			rowText += '<td>'
          			if(row[i][j]) rowText += row[i][j];
          		rowText +='</td>'
				}
          	
          	rowText += '</tr>';
          }
			return rowText;
		},
		printResourceRows: function(row){
		     var rowText='';
			for(var i=0; i<row.length; i++){
           	rowText += '<tr><td>'
           	 if(row[i][0]) rowText += row[i][0];
           	rowText +='</td><td>';
           	if(row[i][1]) rowText += row[i][1]; 
           	rowText +='</td><td>';
           	if(row[i][2]) rowText += row[i][2];
           	rowText +='</td><td>';
           	if(row[i][3]) rowText += row[i][3];
           	rowText +='</td><td align="center">';
           	if(row[i][4]) rowText += 'X';
           	rowText +='</td><td>';
           	if(row[i][5]) rowText +=row[i][5];
               rowText += '</td></tr>';
           }
			return rowText;
		},
		formatTime: function(date)
    	{
    		var str =  date.getHours() + ":" + Core.Util.pad(date.getMinutes()) ;

    		return str;
    	},
    	formatDate: function(date)
    	{
    		var str = (date.getMonth() + 1) + "/"
    		+ date.getDate() + "/"
    		+ date.getFullYear();

    		return str;
    	},
       
	});
});
