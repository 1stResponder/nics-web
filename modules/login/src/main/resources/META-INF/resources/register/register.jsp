<%--

    Copyright (c) 2008-2016, Massachusetts Institute of Technology (MIT)
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

    1. Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.

    2. Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

    3. Neither the name of the copyright holder nor the names of its contributors
    may be used to endorse or promote products derived from this software without
    specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
    FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
    DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
    SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
    CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
    OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
    OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

--%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>NICS - Register</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="stylesheet" href="register/styles/register.css">
		<script src="https://www.google.com/recaptcha/api.js" async defer></script>
        <script type="text/javascript">
        	
        	var fullOrgOptions = null;
        	var orgArray = null;
        	
        	function onLoad() {
        		
        		var affval = document.getElementById('affiliation').value; 
        		if(affval && affval !== "0") {
        			filterOrgs();
        			selectSelectedOrg();
        		} else {
        			populateFullOrgs();
        		}
        		
        		var imtCdf = document.getElementById('imtCDFSelected').value;
				var imtFederal = document.getElementById('imtFederalSelected').value;
				var imtOtherLocal = document.getElementById('imtOtherLocalSelected').value;
				var imtUsar = document.getElementById('imtUsarSelected').value;
				
				populateIMTs();
				
        		if(imtCdf !== "0" && imtCdf !== "") {
        			document.getElementById('imtCDF').value = imtCdf;
        		} 
        		if(imtFederal !== "0" && imtFederal !== "") {
        			document.getElementById('imtFederal').value = imtFederal;
        		}
        		if(imtOtherLocal !== "0" && imtOtherLocal !== "") {
        			document.getElementById('imtOtherLocal').value = imtOtherLocal;	
        		}
        		if(imtUsar !== "0" && imtUsar !== "") {
        			document.getElementById('imtUsar').value = imtUsar;
        		}
        	}
        	
        	
        	/**
        		function: populateIMTs 
        		Populates IMT select elements based on matching Org Type for each IMT
        	*/
        	function populateIMTs() {
        		var cdfImtOptions = [], federalImtOptions, otherLocalImtOptions, usarImtOptions = [];
        		
        		var cdfImt, cdfImtOrgs = [];
        		var federalImt, federalImtOrgs = [];
        		var otherLocalImt, otherLocalImtOrgs = [];
        		var usarImt, usarImtOrgs = [];
        		        		
        		var orgType = document.getElementById('affiliation');
        		for(var a = 0; a < orgType.length; a++) {
        			if(orgType.options[a].text.indexOf('USAR') >= 0) {
        				usarImt = orgType.options[a].value;
        			} else if(orgType.options[a].text.indexOf('Federal IMT') >= 0) {
        				federalImt = orgType.options[a].value;
        			} else if(orgType.options[a].text.indexOf('CDF IMT') >= 0) {
        				cdfImt = orgType.options[a].value;
        			} else if(orgType.options[a].text.indexOf('Other Local IMT') >= 0) {
        				otherLocalImt = orgType.options[a].value;
        			}
        		}
        		
        		var orgOrgTypes = document.getElementById('orgorgtypes');
        		for(var oot = 0; oot < orgOrgTypes.length; oot++) {
        			
        			if(orgOrgTypes.options[oot].value === usarImt) {
        				usarImtOrgs.push(orgOrgTypes.options[oot].text);
        			} else if(orgOrgTypes.options[oot].value === federalImt) {
        				federalImtOrgs.push(orgOrgTypes.options[oot].text);
        			} else if(orgOrgTypes.options[oot].value === cdfImt) {
        				cdfImtOrgs.push(orgOrgTypes.options[oot].text);
        			} else if(orgOrgTypes.options[oot].value === otherLocalImt) {
        				otherLocalImtOrgs.push(orgOrgTypes.options[oot].text);
        			}
        		}
        		
        		var imtusar = document.getElementById('imtUsar');
        		for(var usar = usarImtOrgs.length -1; usar >= 0; usar--) {
        			var opt = document.createElement('option');
        			opt.value = orgArray[usarImtOrgs[usar]];//usarImtOrgs[usar];
        			opt.text = orgArray[usarImtOrgs[usar]];
        			usarImtOptions.push(opt);
        			imtusar.add(opt);
        		}
        		
        		var imtfederal = document.getElementById('imtFederal');
        		for(var fed = federalImtOrgs.length - 1; fed >= 0; fed--) {
        			var opt = document.createElement('option');
        			opt.value = orgArray[federalImtOrgs[fed]];//federalImtOrgs[fed];
        			opt.text = orgArray[federalImtOrgs[fed]];
        			federalImtOptions.push(opt);
        			imtfederal.add(opt);
        		}
        		
        		var imtcdf = document.getElementById('imtCDF');        		
        		for(var cdf = cdfImtOrgs.length - 1; cdf >= 0; cdf--) {
        			var opt = document.createElement('option');
        			opt.value = orgArray[cdfImtOrgs[cdf]];//cdfImtOrgs[cdf];
        			opt.text = orgArray[cdfImtOrgs[cdf]];
        			cdfImtOptions.push(opt);
        			imtcdf.add(opt);
        		}
        		
        		var imtotherlocal = document.getElementById('imtOtherLocal');
        		for(var other = otherLocalImtOrgs.length - 1; other >= 0; other--) {
        			var opt = document.createElement('option');
        			opt.value = orgArray[otherLocalImtOrgs[other]];//otherLocalImtOrgs[other];
        			opt.text = orgArray[otherLocalImtOrgs[other]];
        			otherLocalImtOptions.push(opt);
        			imtotherlocal.add(opt);
        		}
        	}
        	
        	// Org and IMT setters    		
        	function setOrg(org) {
        		document.getElementById('selectedOrg').value = org.value;
        	}
        	
        	function setImtCDF(org) {
        		document.getElementById('imtCDFSelected').value = org.value;
        	}
        	
        	function setImtFederal(org) {
        		document.getElementById('imtFederalSelected').value = org.value;
        	}
        	
        	function setImtOtherLocal(org) {
        		document.getElementById('imtOtherLocalSelected').value = org.value;
        	}
        	
        	function setImtUsar(org) {
        		document.getElementById('imtUsarSelected').value = org.value;
        	}
        	
        	function selectSelectedOrg() {
        		var orgElement = document.getElementById('org');
        		var selectedOrgEl = document.getElementById('selectedOrg');
        		if(!selectedOrgEl.value || selectedOrgEl.value === "") {
        			console.log("No selected org, can't re-select");
        			return;
        		}
        		
        		orgElement.value = selectedOrgEl.value;
        	}
        	
        	/**
        		Restores all orgs to org select, iff fullOrgOptions is not undefined
        	*/
        	function restoreOrgs() {
        		if(!fullOrgOptions) {
        			return;
        		}
        		
        		var orgElement = document.getElementById('org');
        		orgElement.options.length = 0;
        		for(var i = 0; i < fullOrgOptions.length; i++) {
        			orgElement.add(fullOrgOptions[i]);
        		}
        	}
        	
        	function populateFullOrgs() {
        		var orgElement = document.getElementById('org');
        		        		
        		fullOrgOptions = [];
        		orgArray = [];
	    		for(var a = 0; a < orgElement.length; a++) {
	    			var opt = document.createElement('option');
	    			opt.text = orgElement.options[a].text;
	    			opt.value = orgElement.options[a].value;
	    			fullOrgOptions.push(opt);
	    			
	    			orgArray[orgElement.options[a].value] = orgElement.options[a].text;
	    		}
        	}
        	
		    function filterOrgs() {
		    	
		    	var orgElement = document.getElementById('org');
		    	var orgOrgTypeElement = document.getElementById('orgorgtypes');
		    	
		    	if(!fullOrgOptions) {
		    		populateFullOrgs();
		    	} else {
		    		restoreOrgs();	
		    	}
		    	
		    	var orgTypeId = document.getElementById('affiliation').value;
		    	
		    	if(!orgTypeId) {
		    		if(console) { console.log("Error getting affiliation value");}
		    		return;
		    	}
		    	// orgTypeElement.value is orgtypeid, .text is orgid
		    	// org.value = orgid, org.text= orgname
		    	
		    	var optionsArr = [];
		    	
		    	var matchingOrgs = "";
		    	for (var i=0; i < orgOrgTypeElement.length; i++){
		    				    		
		    		if(orgTypeId === orgOrgTypeElement.options[i].value) {
		    			// orgOrgTypeElement: text: orgid , value: orgtypeid
		    			// orgElement: value: orgid
		    			for( var j = 0; j < orgElement.length; j++) {
		    				if(orgOrgTypeElement.options[i].text == orgElement.options[j].value +"") {
		    					//console.log("Org Matches OrgType " + orgElement.options[j].value);
		    					matchingOrgs += orgElement.options[j].text + " ";		    					
		    					var nopt = document.createElement('option');
		    					nopt.value = orgElement.options[j].text; // value; // Back end expects the value to the be the name
		    					nopt.text = orgElement.options[j].text;
		    					optionsArr.push(nopt);
		    				}
		    			}		    			
		    		}
		    	}
		    	
		    	orgElement.options.length = 0; // Clear out current options
		    	
		    	var defaultOpt = document.createElement('option');
		    	defaultOpt.value = 0;
		    	defaultOpt.text = 'Please select an Organization';
		    	orgElement.add(defaultOpt);
		    	orgElement.value = 0;
		    	if(optionsArr.length == 0) {
		    		console.log("No orgs match this affiliation");
		    		return;
		    	}
		    	
		    	for(var x = 0; x < optionsArr.length; x++) {
		    		orgElement.add(optionsArr[x]);
		    	}
		    			
		    }
		    
		    function validateForm(response) {
		    	
		    	var valid = true;
		    	var reasons = "";
		    	// TODO: validate with esapi or something better, this is a very quick and dirty check
		    	// of choices and fields being empty
		    	
		    	var affValue = document.getElementById('affiliation').value;
		    	var orgValue = document.getElementById('org').value;
		    	var firstValue = document.getElementById('first').value;
		    	var lastValue = document.getElementById('last').value;
		    	var emailValue = document.getElementById('email').value;
		    	var passwordValue = document.getElementById('password').value;
		    	var confirmPasswordValue = document.getElementById('confirmPassword').value;
		    	var phoneMobile = document.getElementById('phoneMobile').value;
		    	var phoneOffice = document.getElementById('phoneOffice').value;
		    	var phoneOther = document.getElementById('phoneOther').value;		    	
		    	
		    	if(!affValue || affValue === "" || affValue === "0") {
		    		reasons += "- Must choose Affiliation<br/>";
		    		valid = false;
		    	}
		    	
		    	if(!orgValue || orgValue === "0" || orgValue === "") {
		    		reasons += "- Must choose Organization<br/>";
		    		valid = false;
		    	}
		    	
		    	if(!firstValue || firstValue === "") {
		    		reasons += "- Must provide First Name<br/>";
		    		valid = false;
		    	}
		    	
		    	if(!lastValue || lastValue === "") {
		    		reasons += "- Must provide Last Name<br/>";
		    		valid = false;
		    	}
		    	
		    	if(!emailValue || emailValue === "") {
		    		reasons += "- Must provide Email address<br/>";
		    		valid = false;
		    	}
		    			    	
		    	if(!passwordValue || passwordValue === ""
		    			|| !confirmPasswordValue || confirmPasswordValue === ""
		    			|| (passwordValue !== confirmPasswordValue)
		    			|| passwordValue.length < 8 || passwordValue.length > 20) {
		    		
		    		reasons += "- Must provide a password between 8 and 20 characters long, and it must match the confirm password<br/>";
		    		valid = false;
		    	}
		    	
		    	// Ensure this regex matches back-end regex on UserInformation validator
		    	var passRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%!_-]).{8,}/;
		    	if(!passRegex.test(passwordValue)) {
		    		reasons += "- Password must contain at least one lower case and one upper case letter, a number, and a symbol: @#$%!_-<br/>";
		    	}
		    	
		    	if(phoneMobile && phoneMobile !== "") {
		    		phoneMobile = phoneMobile.replace(' ', '');
		    		phoneMobile = phoneMobile.replace('(', '');
		    		phoneMobile = phoneMobile.replace(')', '');
		    		phoneMobile = phoneMobile.replace('-', '');
		    		
		    		if(phoneMobile.length !== 10) {
		    			reasons += "- Mobile Phone not valid<br/>";
		    			valid = false;
		    		}
		    	}
		    	
		    	if(phoneOffice && phoneOffice !== "") {
		    		phoneOffice = phoneOffice.replace(' ', '');
		    		phoneOffice = phoneOffice.replace('(', '');
		    		phoneOffice = phoneOffice.replace(')', '');
		    		phoneOffice = phoneOffice.replace('-', '');
		    		
		    		if(phoneOffice.length !== 10) {
		    			reasons += "- Office Phone not valid<br/>";
		    			valid = false;
		    		}
		    	}
		    	
		    	if(phoneOther && phoneOther !== "") {
		    		phoneOther = phoneOther.replace(' ', '');
		    		phoneOther = phoneOther.replace('(', '');
		    		phoneOther = phoneOther.replace(')', '');
		    		phoneOther = phoneOther.replace('-', '');
		    		
		    		if(phoneOther.length !== 10) {
		    			reasons += "- Other Phone not valid<br/>";
		    			valid = false;
		    		}
		    	}
		    	
		    	if(!valid) {
		    		document.getElementById("messages").hidden = false;
		    		document.getElementById("messages").innerHTML = "Please fill out all required fields with valid values and " +
		    			"try again.<br/><br/>" + reasons;
		    			
		    		window.scrollTo(0,0);
		    	}
		    	
		    	return valid;
		    }
    
    	</script>
    </head>
    <body onload="onLoad();">
    
        <div class="wrapper" style="background: linear-gradient(#003366, #0066FF)">        	
        
            <form id="register" action="register" method="post">
        
            <div class="header" >
                <div class="server-select">
                    <!-- Leaving this here in case we want to have people specifically register for a certain workspace, although
                    	it should be added to the form proper, not up here in a header
                    <label for="server">Server:</label>
                    <select id="server" name="workspace" tabindex="99">
                    <c:forEach items="${requestScope.workspaces}" var="workspace">
                        <option value="<c:out value="${workspace['workspaceid']}" />">
                            <c:out value="${workspace['workspacename']}" />
                        </option>
                    </c:forEach>
                    </select>
                     -->
                     
                    <!-- Populating hidden combo with org orgtype mappings -->
                    <select id="orgorgtypes" name="orgorgtypes" hidden="true">
                    <c:forEach items="${requestScope.orgorgtypes}" var="orgorgtype">
                        <option value="<c:out value="${orgorgtype['orgtypeid']}" />">
                            <c:out value="${orgorgtype['orgid']}" />
                        </option>
                    </c:forEach>
                    </select>
                </div>
            </div>
            
            
            <div class="content" style="padding: 4px;">
            	
                <div class="content-wrapper" style="background-color: white; border: 3px solid #003399; padding: 4px" >
                   
                   	<h2>Registration</h2>
                             
                    <p>Already have an account? <a href="./login">Click here to sign in</a></p>
			       	
			       	<p>
			       		Once you create an account, it will go under review 
			       		by the administrators. Until they've<br/> approved the account, 
			       		you won't be able to log on to the system.
			       	</p>
			       	
			       	<p>
			       		Fields marked with a <font style="color:red">*</font> are required
			       	</p>
			       	
			       	<div id="messages" name="messages" style="color:red;border: 2px solid red;padding: 4px" hidden="true"></div>
                    <br/>
                    <hr/>         
                                	
	            	<div class="field">
	                    <label for="affiliation">Organization Affiliation <font style="color:red">*</font></label>
	                    <select id="affiliation" name="affiliation" tabindex="1" width="300" autofocus="autofocus" 
	                    	onChange="filterOrgs(this);">
	                    <option value="0">Please select an Affiliation</option>
	                    <c:forEach items="${requestScope.orgtypes}" var="orgtype">
	                        <option value="<c:out value="${orgtype['orgTypeId']}" />">
	                            <c:out value="${orgtype['orgTypeName']}" />
	                        </option>
	                    </c:forEach>
	                    </select>
	                </div>
	                <hr/>
	                
	                <div class="field">
	                	<div style="font-size: small; vertical-align: middle">
	                    	<img src="register/images/stopsign32px.png" style="width:32px;height:32px"/>
                    	    If your organization is not available, contact 
                    		<a href="mailto:nicssupport@ll.mit.edu">NICSsupport@LL.MIT.edu</a> to request
                    		a new organization
	                    </div>
	                    <br/>
	                	<div>
		                    <label for="org">Select your Organization <font style="color:red">*</font></label>
		                    <select id="org" name="org" tabindex="2" onChange="setOrg(this);">
		                    <option value="0">Please select an Organization</option>
		                    <c:forEach items="${requestScope.orgs}" var="org">
		                        <option value="<c:out value="${org['orgId']}" />">
		                            <c:out value="${org['name']}" />
		                        </option>
		                    </c:forEach>
		                    </select>
		                    <input type="hidden" id="selectedOrg" name="selectedOrg" />
		                </div>
	                </div>
	                <br/>                
                    
                    <hr/>
                                        
                    <div class="field">
                    	<h4><center>Are you the member of an Incident Management Team?</center></h4>
                    	<div width="100%">
                    		<span>
                    			<label for="imtCDF">CDF IMT:</label>
			                    <select id="imtCDF" name="imtCDF" onchange="setImtCDF(this)" tabindex="3" style="width:300px">
			                    <option value="0">NONE</option>
			                    </select>
			                    <input type="hidden" id="imtCDFSelected" name="imtCDFSelected" />
                    		</span>
                    		
                    		<span>
                    			<label for="imtFederal">Federal IMT:</label>
			                    <select id="imtFederal" name="imtFederal" onchange="setImtFederal(this)" tabindex="4" style="width:300px">
			                    <option value="0">NONE</option>
			                    </select>
			                    <input type="hidden" id="imtFederalSelected" name="imtFederalSelected" />
                    		</span>
                    	</div>
                    	<br/><br/>
                    	<div style="width:100%">
                    		<span style="width:90%">
	                    		<span>
	                    			<label for="imtOtherLocal">Other Local IMT:</label>
				                    <select id="imtOtherLocal" name="imtOtherLocal" onchange="setImtOtherLocal(this)" tabindex="5" style="width:300px">
				                    <option value="0">NONE</option>
				                    </select>
				                    <input type="hidden" id="imtOtherLocalSelected" name="imtOtherLocalSelected" />
	                    		</span>
	                    		<span style="width:10px"></span>
	                    		<span>
	                    			<label for="imtUsar">USAR:</label>
				                    <select id="imtUsar" name="imtUsar" onchange="setImtUsar(this)" tabindex="6" style="width:300px">
				                    <option value="0">NONE</option>
				                    </select>
				                    <input type="hidden" id="imtUsarSelected" name="imtUsarSelected" />
	                    		</span>
                    		</span>
                    	</div>
                    </div>
                    <br/>
                    
                    <hr/>
                                                            
                    <div class="field">
                        <label for="first">First Name <font style="color:red">*</font></label>
                        <br>
                        <input type="text" id="first" name="first" tabindex="7" />
                    </div>
                    
                    <div class="field">
                        <label for="last">Last Name <font style="color:red">*</font></label>
                        <br>
                        <input type="text" id="last" name="last" tabindex="8" />
                    </div>
                    <hr/>
                                        
                    <div class="field">
                        <label for="email">Primary Email <font style="color:red">*</font></label>
                        <input type="text" id="email" name="email" tabindex="9"/>
                        NOTE: This will be your username
                    </div>
                    <br/>
                    <div class="field">
                    	<span>
                        	<label for="password">Password <font style="color:red">*</font></label>
                        	<input type="password" id="password" name="password" maxlength="20" tabindex="10" />
                        </span>
                        
                        <span>
                        	<label for="confirmPassword">Confirm Password <font style="color:red">*</font></label>
                        	<input type="password" id="confirmPassword" name="confirmPassword" maxlength="20" tabindex="11" />
                        </span>
                    </div>
                    <hr/>
                    
                    <div class="field">
                    	
                    	<h4><center>Phone (XXX) XXX-XXXX</center></h4>
                    	
                    	<div class="field">
                    	<label for="phoneMobile">Mobile:</label>
                        <input type="text" id="phoneMobile" name="phoneMobile" tabindex="12"/><br/>
                        </div>
                        
                        <div class="field">
                        <label for="phoneOffice">Office:</label>
                        <input type="text" id="phoneOffice" name="phoneOffice" tabindex="13"/><br/>
                        </div>
                        
                        <div class="field">
                        <label for="phoneOther">Other:</label>
                        <input type="text" id="phoneOther" name="phoneOther" tabindex="14"/><br/>
                        </div>
                   
	                    <hr/>
	                    
	                    <div class="field">
                    	<label for="radio">Radio:</label>
                        <input type="text" id="radio" name="radio" tabindex="15" maxlength="128"/><br/>
                        </div>
                        
                        <div class="field">
                        <label for="emailOther">Other Email:</label>
                        <input type="text" id="emailOther" name="emailOther" tabindex="16"/>	                    	
	                    </div>
                    </div>
                    <hr/>
                    
                    <div class="field">
	                    <label for="jobTitle">Job Title:</label>
	                    <input type="text" id="jobTitle" name="jobTitle" tabindex="17" maxlength="128"/><br/>
	                </div>
	                <div class="field">    
	                    <label for="rank">Rank:</label>
                        <input type="text" id="rank" name="rank" tabindex="18" maxlength="128"/><br/>
                    </div>
                    <br/><br/>
                    <div>
                        <label for="description">What most closely describes your job responsibilities?:</label><br/>
                        <textarea id="description" name="description" cols="100" rows="5" tabindex="19" maxlength="250"></textarea><br/>
	                </div>
	                <br/>
	                <hr/>
                    
                    <div >
                    	<label for="other">Other Info:</label><br/> <!-- style="width:500px;height:100px" -->
                    	<textarea id="other" name="other" tabindex="20" cols="100" rows="8" ></textarea>
                    </div>
                    
                    <br>
                    
                    <!--   <div class="g-recaptcha" data-sitekey="${dataSiteKey}"></div>-->
                     
                     </br>
                    <button type="submit" tabindex="21">Register</button>
                    
                </div>
            </div>
            <br/><br/>
            </form>
           
            <div class="footer">
                <span class="footer-left">
                    <span>Version: <c:out value="${requestScope.version}" /></span>
                </span>

                <span class="footer-right nav">
                    <span>
                        <a href="about.html">About</a>
                    </span>
                    <span>
                        <a href="terms.html">Terms</a>
                    </span>
                    <span>
                        <a href="settings.html">Settings</a>
                    </span>
                    <span>
                        <a href="https://public.nics.ll.mit.edu" target="_blank">Help</a>
                    </span>
                </span>
            </div>
        
        </div>
    </body>    
</html>