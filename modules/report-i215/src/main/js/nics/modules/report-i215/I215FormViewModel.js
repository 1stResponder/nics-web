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
		return Ext.define('modules.report-i215.I215FormModel', {	 
		 extend: 'Ext.app.ViewModel',
	 	
		 alias: 'viewmodel.i215', // connects to viewModel
	 	
		 data: {
		    	incidentId: this.incidentId,
		    	incidentName: this.incidentName,
		    	formTypeId: this.formTypeId
		    	
		    },
		 formulas: {
		    	 report: function(get){
		    		 var report = {
		    				reportType: get('reportType'),
		    				incidentName: get('incidentName'),
		    				preptime: get('preptime'),
		    				startdate: get('startdate'),
		    				starttime: get('starttime'),
		    				shiftLength12: get('shiftLength12'),
		    				shiftLength16: get('shiftLength16'),
		    				shiftLength24: get('shiftLength24'),
		    				shiftLengthMixed: get('shiftLengthMixed'),
		    				role: get('role'),
		    				requestArrival: get('requestArrival}'),
			    			reportingLocation: get('reportingLocation'),
			    			workAssignments: get('workAssignments'),
			    			specialInstructions: get('specialInstructions'),
			    			opbd: get('opbd'),
			    			divs: get('divs'),
			    			tfld: get('tfld'),
			    			stam: get('stam'),
			    			dozb: get('dozb'),
			    			hqts: get('hqts'),
			    			sof2: get('sof2'),
			    			sof3: get('sof3'),
			    			femt: get('femt'),
			    			femp: get('femp'),
			    			fela: get('fela'),
			    			felb: get('felb'),
			    			felb: get('felc'),
			    			personnelPickup: get('personnelPickup'),
			    			personnelInfo: get('personnelInfo'),
			    			engineT1Single: get('engineT1Single'),
			    			engineT1ST: get('engineT1ST'),
			    			engineT2Single: get('engineT2Single'),
			    			engineT2ST: get('engineT2ST'),
			    			engineT3Single: get('engineT3Single'),
			    			engineT3ST: get('engineT3ST'),
			    			engineT3FedSingle: get('engineT3FedSingle'),
			    			engineT3FedST: get('engineT3FedST'),
			    			engine34x4: get('engine34x4'),
			    			engineT4Single: get('engineT4Single'),
			    			engineT4ST: get('engineT4ST'),
			    			engineT4FedSingle: get('engineT4FedSingle'),
			    			engineT4FedST: get('engineT4FedST'),
			    			engine44x4: get('engine44x4'),
			    			engineT5Single: get('engineT5Single'),
			    			engineT5ST: get('engineT5ST'),
			    			engineT5FedSingle: get('engineT5FedSingle'),
			    			engineT5FedST: get('engineT5FedST'),
			    			engine54x4: get('engine54x4'),
			    			engineT6Single: get('engineT6Single'),
			    			engineT6ST: get('engineT6ST'),
			    			engineT6FedSingle: get('engineT6FedSingle'),
			    			engineT6FedST: get('engineT6FedST'),
			    			engine64x4: get('engine64x4'),
			    			engineT7Single: get('engineT7Single'),
			    			engineT7ST: get('engineT7ST'),
			    			engineT7FedSingle: get('engineT7FedSingle'),
			    			engineT7FedST: get('engineT7FedST'),
			    			engine74x4: get('engine74x4'),
			    			handCrewT1Single: get('handCrewT1Single'),
			    			handCrewT1ST: get('handCrewT1ST'),
			    			handCrewT1FedSingle: get('handCrewT1FedSingle'),
			    			handCrewT1FedST: get('handCrewT1FedST'),
			    			handCrewT2IASingle: get('handCrewT2IASingle'),
			    			handCrewT2IAST: get('handCrewT2IAST'),
			    			handCrewT2IAFedSingle: get('handCrewT2IAFedSingle'),
			    			handCrewT2IAFedST: get('handCrewT2IAFedST'),
			    			handCrewT2Single: get('handCrewT2Single'),
			    			handCrewT2ST: get('handCrewT2ST'),
			    			handCrewT2FedSingle: get('handCrewT2FedSingle'),
			    			handCrewT2FedST: get('handCrewT2FedST'),
			    			handCrewPickup: get('handCrewPickup'),
			    			handCrewInfo: get('handCrewInfo'),
			    			dozerT1Single:get('dozerT1Single'),
  	    	    	        dozerT1ST:get('dozerT1ST'),
  	    	    	        dozerT16Way:get('dozerT16Way'),
  	    	    	        dozerT1Rippers:get('dozerT1Rippers'),
  	    	    	        dozerT112:get('dozerT112'),
  	    	    	        dozerT124:get('dozerT124'),
  	    	    	        dozerT2Single:get('dozerT2Single'),
	    	    	        dozerT2ST:get('dozerT2ST'),
	    	    	        dozerT26Way:get('dozerT26Way'),
	    	    	        dozerT2Rippers:get('dozerT2Rippers'),
	    	    	        dozerT212:get('dozerT212'),
	    	    	        dozerT2124:get('dozerT224'),
	    	    	        dozerT3Single:get('dozerT3Single'),
	    	    	        dozerT3ST:get('dozerT3ST'),
	    	    	        dozerT36Way:get('dozerT36Way'),
	    	    	        dozerT3Rippers:get('dozerT3Rippers'),
	    	    	        dozerT312:get('dozerT312'),
	    	    	        dozerT324:get('dozerT324'),
	    	    	        dozerPickup: get('dozerPickup'),
			    			dozerInfo: get('dozerInfo'),
			    			tacticalT1: get(' tacticalT1'),
			    			tacticalT14x4: get('tacticalT14x4'),
			    			tacticalT1CAFS: get('tacticalT1CAFS'),
			    			tacticalT1SprayBars: get('tacticalT1SprayBars'),
			    			tacticalT1Short: get('tacticalT1Short'),
			    			tacticalT112: get('tacticalT112'),
			    			tacticalT124: get('tacticalT124'),
			    			tacticalT2: get(' tacticalT2'),
			    			tacticalT24x4: get('tacticalT24x4'),
			    			tacticalT2CAFS: get('tacticalT2CAFS'),
			    			tacticalT2SprayBars: get('tacticalT2SprayBars'),
			    			tacticalT2Short: get('tacticalT2Short'),
			    			tacticalT212: get('tacticalT212'),
			    			tacticalT224: get('tacticalT224'),
			    			supportT1: get('supportT1'),
	    	        	    supportT14x4: get('supportT14x4'),
	    	        	    supportT1CAFS: get('supportT1CAFS'),
	    	        	    supportT1SprayBars: get('supportT1SprayBars'),
	    	        	    supportT1Short: get('supportT1Short'),
	    	        	    supportT112: get('supportT112'),
	    	        	    supportT124: get('supportT124'),       	 
	    	        	    supportT2: get('supportT2'),
	    	        	    supportT24x4: get('supportT24x4'),
	    	        	    supportT2CAFS: get('supportT2CAFS'),
	    	        	    supportT2SprayBars: get('supportT2SprayBars'),
	    	        	    supportT2Short: get('supportT2Short'),
	    	        	    supportT212: get('supportT212'),
	    	        	    supportT224: get('supportT224'),
	    	        	    supportT3: get('supportT3'),
	    	        	    supportT34x4: get('supportT34x4'),
	    	        	    supportT3CAFS: get('supportT3CAFS'),
	    	        	    supportT3SprayBars: get('supportT3SprayBars'),
	    	        	    supportT3Short: get('supportT3Short'),
	    	        	    supportT312: get('supportT312'),
	    	        	    supportT324: get('supportT324'),       	 
	    	        	    miscEquip: get('miscEquip'),
  	    	        	    miscPickup: get('miscPickup'),
  	    	        	    miscInfo: get('miscInfo'),
  	    	        	    requiredSupplies: get('requiredSupplies'),
  	    	        	    deliverLocation: get('deliverLocation'),
  	    	        	    submittedBy: get('submittedBy'),
  	    	        	    opbdReviewer: get('opbdReviewer'),
  	    	        	    oscReviewer: get('oscReviewer'),
  	    	        	    rocks: get('rocks'),
   	        	            mineShafts: get('mineShafts'),
  	        	            snakes: get('snakes'),
  	        	            steep: get('steep'),
  	        	            dozersCB: get('dozersCB'),
  	        	            bees: get('bees'),
  	        	            trees: get('trees'),
  	        	            heavyEquip: get('heavyEquip'),
  	        	            bears: get('bears'),
  	        	            stumps: get('stumps'),
  	        	            dustyRoads: get('dustyRoads'),
  	        	            animals: get('animals'),
  	        	            safetyConcerns: get('safetyConcerns'),
  	        	            mitigationActions: get('mitigationActions'),
  	        	            riskSubmittedBy: get('riskSubmittedBy'),
  	        	            oscRiskReviewer: get('oscRiskReviewer'),
  	        	            riskSubmittedBy2: get('riskSubmittedBy2'),
  	        	            opbdReviewer2: get('opbdReviewer2'),
  	        	            oscReviewer2: get('oscReviewer2'),
  	        	            otherSubmittedBy: get('otherSubmittedBy')
  	    	                	  	      
		    		};
		    		 
		    		return report;
		    	}
		 }
	 });
});