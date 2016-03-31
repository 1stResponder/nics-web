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
define(['ext','iweb/CoreModule'], function(Ext, Core) {
		return Ext.define('modules.report-fmag.FmagFormModel', {	 
		 extend: 'Ext.app.ViewModel',
	 	
		 alias: 'viewmodel.fmag', 
	 	
		 data: {
		    	incidentId: this.incidentId,
		    	incidentName: this.incidentName,
		    	formTypeId: this.formTypeId
				
		 },
		 formulas: {
		    	 report: function(get){
		    		 var report = {
		    				reportType: get('reportType'),
		    				agencyRequest: get('agencyRequest'),
		    				requestDate: get('requestDate'),
		    				cityCounty: get('cityCounty'),
		    				acreage: get('acreage'),
		    				cause: get('cause'),
		    				fireStartedDate: get('fireDate'),
		    				ic: get('ic'),
		    				contactName: get('contactName'),
		    				phone: get('phone'),
		    				threat: get('threat'),
		    				population: get('population'),
		    				mandatory: get('mandatory'),
		    				volunteer: get('volunteer'),
		    				sheltersOpen: get('sheltersOpen'),
		    				sheltersCount: get('sheltersCount'),
		    				sheltersLocal: get('sheltersLocal'),		    				
		    				threatStructs: get('threatStructs'),
		    				resStructs: get('resStructs'),
		    				busStructs: get('busStructs'),
		    				fireProxStructs: get('fireProxStructs'),
		    				vacaResStructs: get('vacaResStructs'),
		    				subRuralStructs: get('subRuralStructs'),
		    				natManBarriers: get('natManBarriers'),
		    				infFacEquResThreat: get('infFacEquResThreat'),
		    				percEngTypes: get('percEngTypes'),
		    				perLocal: get('perLocal'),
		    				percOpArea: get('percOpArea'),
		    				percRegOrder: get('percRegOrder'),
		    				countyEocActive: get('countyEocActive'),
		    				full: get('full'),
		    				limited: get('limited'),
		    				fuelTerType: get('fuelTerType'),
		    				percFireCont: get('percFireCont'),
		    				criticalCon: get('criticalCon'),
		    				current: get('current'),
		    				predicted: get('predicted'),
		    				tempRelHum: get('tempRelHum'),
		    				fireBehCurrent: get('fireBehCurrent'),
		    				lra: get('lra'),
		    				sra: get('sra'),
		    				fra: get('fra'),
		    				tribal: get('tribal'),
		    				current209: get('current209'),
		    				incidentMap: get('incidentMap'),
		    		 		weather: get('weather'),
		    		 		otherDocs: get('otherDocs')
		    		 
		    		};
		    		 
		    		return report;
		    }
		 }
	 });
});