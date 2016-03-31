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
	 
	Ext.define('Properties', {
        extend: 'Ext.data.Model',
        fields: ['label', 'name']
    });
	
	Ext.define('Task', {
        extend: 'Ext.data.Model',
        fields: ['task', 'status']
    });
	
	Ext.define('Destination', {
        extend: 'Ext.data.Model',
        fields: ['title', 'feature']
    });
	
	var statusProps = [{
			label: 'Submitted',
			name: 'Submitted'
		},{
			label: 'Approved',
			name: 'Approved'
		},{
			label: 'Open',
			name: 'Open'
		},{
			label: 'Cancelled',
			name: 'Cancelled'
		},{
			label: 'Closed',
			name: 'Closed'
		},{
			label: 'Completed',
			name: 'Completed'
		},{
			label: 'Not Accepted',
			name: 'NotAccepted'
		}];
	
	return Ext.define('modules.report-mitam.MitamFormViewModel', {
	    extend: 'Ext.app.ViewModel',
	
	    alias: 'viewmodel.mitam', // connects to viewModel
	    
	    data: {
	    	otherValue: "",
	    	Transportation: false,
	    	Medical: false,
	    	ReSupply: false,
	    	Security: false,
	    	Assessment: false,
	    	Engineering: false,
	    	Other: false
	    },
	    
	    formulas: {
	    	 report: function(get){
	    		 var report = {
	    				name: get('name'),
	    				org: get('org'),
	    				durationValue: get('durationValue'),
	    				priorityValue: get('priorityValue'),
	    				sizeOfEffortValue: get('sizeOfEffortValue'),
	    				hazardousMaterialsValue: get('hazardousMaterialsValue')
	    		};
	    		 
	    		return report;
	    	},
	    	
	    	optionalData: function(get){
	    		var report = {};
	    		if(get('otherValue')){
	    			report.optionValue = get('otherValue');
	    		}
	    		if(get('Medical')){
	    			report.Medical = true;
	    		}
	    		if(get('ReSupply')){
	    			report.ReSupply = true;
	    		}
	    		if(get('Security')){
	    			report.Security = true;
	    		}
	    		if(get('Assessment')){
	    			report.Assessment = true;
	    		}
	    		if(get('Engineering')){
	    			report.Engineering = true;
	    		}
	    		if(get('Other')){
	    			report.Other = true;
	    		}
	    		if(get('Transportation')){
	    			report.Transportation = true;
	    		}
	    		return report;
	    	},
	    	
	    	updateData: function(get){
	    		var update = {
	    				requestor: get('requestor'),
	    				performerValue: get('performerValue'),
	    				statusValue: get('statusValue')
	    		};
	    		
	    		return update;
	    	}
	    },
	
		stores: {
            duration: {
                model: 'Properties',
                data: [
                    {
                        label: 'Long-Term',
                        name: 'longTerm'
                    }, 
                    {
                        label: 'Short-Term',
                        name: 'shortTerms'
                    }
                  ]
            },
            priority: {
                model: 'Properties',
                data: [
                    {
                        label: 'High',
                        name: 'high'
                    }, 
                    {
                        label: 'Medium',
                        name: 'medium'
                    }, 
                    {
                        label: 'Low',
                        name: 'low'
                    }
                  ]
            },
            sizeOfEffort: {
                model: 'Properties',
                data: [
                    {
                        label: 'Large',
                        name: 'large'
                    }, 
                    {
                        label: 'Medium',
                        name: 'medium'
                    }, 
                    {
                        label: 'Small',
                        name: 'small'
                    }
                  ]
            },
            hazardousMaterials: {
                model: 'Properties',
                data: [
                    {
                        label: 'No',
                        name: 'no'
                    }, 
                    {
                        label: 'Yes',
                        name: 'yes'
                    }
                  ]
            },
            performer: {
            	model: 'Properties',
            	data: [{
            	       label: 'DoD',
            	       name: 'dod'
            		},{
            			label: 'DoE',
            			name: 'doe'
            		},{
            			label: 'CDC',
            			name: 'cdc'
            		},{
            			label: 'Other',
            			name: 'other'
            		}
            	]
            },
            status: {
            	model: 'Properties',
            	data: statusProps
            },
            taskStatus: {
            	model: 'Properties',
            	data: statusProps
            },
            task: {
            	model: 'Task'
            },
            destination: {
            	model: 'Destination'
            }
		}
	});
});