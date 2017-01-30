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
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title><c:out value="${requestScope.sitelabel}"/></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script>
        function loadAnnouncements() {
          var newWorkspace = document.getElementById("server").value;
          document.getElementById("currentWorkspace").value = newWorkspace;
          if (newWorkspace != " ") {
          	document.forms["workspaceAnnouncements"].submit();
          }
		}
		 function validateWorkspace() {
          var newWorkspace = document.getElementById("server").value;
         if (newWorkspace == "") {
         	alert("Please choose a Workspace");
         }
          
		}
		function setWorkspace() {
          var currentWorkspace = getQueryVariable("currentWorkspace");
         if (currentWorkspace) {
         document.getElementById('server').value = currentWorkspace;
                 //document.getElementById("server").selectedIndex = 
         }
          else {
           document.getElementById("server").selectedIndex = 0;
         }
		}
		 function validateForm() {
    		var x = document.forms["login"]["server"].value;
    		if (x == null || x == " ") {
      		  alert("Please choose a server");
        		return false;
    }
}
		function getQueryVariable(variable)
	{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
	}
	
        </script>
        <link rel="stylesheet" href="login/styles/login.css">
    </head>
    <body  onload="setWorkspace()">
    
        <div class="wrapper">
        
            <form id="login" action="login" method="post" onsubmit="return validateForm()">
        
            <div class="header">
                <div class="server-select">
                    <label for="server">Server:</label>
                    <select id="server" name="workspace" tabindex="5" onchange="loadAnnouncements()" required>
                    <c:forEach items="${requestScope.workspaces}" var="workspace">
                        <option value="<c:out value="${workspace['workspaceid']}" />"  >
                            <c:out value="${workspace['workspacename']}" />
                        </option>
                    </c:forEach>
                    </select>
                </div>
            </div>
            
            
            <div class="content">
                <div class="content-wrapper">
                    <img src="<c:out value="${requestScope.sitelogo}"/>" height="290px" width="423px"></img>
                    <br>
                    <div class="field">
                        <label for="method">Login Method:</label>
                        <select id="method" name="method" tabindex="4">
                            <option value="">OpenAM</option>
                        </select>
                    </div>
                    <br>
                    <div class="field">
                        <label for="email">Email:</label>
                        <br>
                        <input type="text" id="email" name="email" tabindex="1" autofocus="autofocus"/>
                    </div>
                    <br>
                    <div class="field">
                        <label for="password">Password:</label>
                        <br>
                        <input type="password" id="password" name="password" tabindex="2" />
                    </div>
                    <br>
                    <button type="submit" tabindex="3" >Login</button>
                    <br/><br/>
                    <span style="font-size: small">
                    	Don't have an account? <a href="./register">Register</a>.
                    </span>
                    <br/><br/>
                    <span style="font-size: small">
                    	Forgotten Password? <a href="./forgotpassword">Click here</a>.
                    </span>
                </div>
            </div>
            <div class= "announcements" >
                <div class="content-wrapper">
                    <h2>Announcements</h2>
                    <ul>
                    
                     <c:forEach items="${requestScope.announcements}" var="announcement">
                    
                         <li> <strong>  <c:out value="${announcement['postedDate']}"  />, <c:out value="${announcement['postedby']}"  /> </strong>
                            <c:out value="${announcement['message']}" />
                        </li> 
                    </c:forEach>
                    </ul>
                </div>
            </div>
            </form>
              <form id="workspaceAnnouncements" action="login" method="get">
               <input type="hidden" id="currentWorkspace" name="currentWorkspace" />
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
                        <a href="<c:out value="${requestScope.helpsite}" />" target="_blank">Help</a>
                    </span>
                </span>
            </div>
        
        </div>
    </body>
</html>
