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
		return Ext.define('modules.report-roc.RocFormModel', {	 
		 extend: 'Ext.app.ViewModel',
	 	
		 alias: 'viewmodel.roc', // connects to viewModel
	 	
		 data: {
		    	incidentId: this.incidentId,
		    	incidentName: this.incidentName,
		    	formTypeId: this.formTypeId
				
				
		    	
		    	
		    },
		 formulas: {
		    	 report: function(get){
		    		 var report = {
		    				reportType: get('reportType'),
		    				rocDisplayName: get('rocDisplayName'),
		    				county: get('county'),
		    				date: get('date'),
		    				starttime: get('starttime'),
		    				location: get('location'),
		    				jurisdiction: get('jurisdiction'),
		    				incidentType: get('incidentType'),
		    				incidentCause: get('incidentCause'),
		    				scope: get('scope'),
		    				spreadRate: get('spreadRate'),
		    				fuelType: get('fuelType'),
		    				potential: get('potential'),
		    				percentContained: get('percentContained'),
		    				estimatedContainment: get('estimatedContainment'),
		    				estimatedControl: get('estimatedControl'),		    				
		    				temperature: get('temperature'),
		    				relHumidity: get('relHumidity'),
		    				windSpeed: get('windSpeed'),
		    				windDirection: get('windDirection'),
		    				predictedWeather: get('predictedWeather'),
		    				evacuations: get('evacuations'),
		    				structuresThreat: get('structuresThreat'),
		    				infrastructuresThreat: get('infrastructuresThreat'),
		    				icpLocation: get('icpLocation'),
		    				airAttack: get('airAttack'),
		    				airTankers: get('airTankers'),
		    				helicopters: get('helicopters'),
		    				overhead: get('overhead'),
		    				typeIEngine: get('typeIEngine'),
		    				typeIIEngine: get('typeIIEngine'),
		    				typeIIIEngine: get('typeIIIEngine'),
		    				waterTender: get('waterTender'),
		    				dozers: get('dozers'),
		    				handcrews: get('handcrews'),
		    				comUnit: get('comUnit'),
		    				email: get('email'),
		    				simplifiedEmail: get('simplifiedEmail'),
		    				comments: get('comments'),
		    				reportBy: get('reportBy')
		    		 
			    	
		    		};
		    		 
		    		return report;
		    	}
		 }
	 });
});