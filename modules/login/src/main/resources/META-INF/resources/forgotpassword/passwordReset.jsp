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
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>NICS - Reset Password</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="forgotpassword/styles/forgotpassword.css">
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
    <script type="text/javascript">
    function validateForm(response) {
                
                var valid = true;
                var reasons = "";

                var passwordValue = document.getElementById('password').value;
                var confirmPasswordValue = document.getElementById('confirmPassword').value;

                if(!passwordValue || passwordValue === ""
                        || !confirmPasswordValue || confirmPasswordValue === ""
                        || (passwordValue !== confirmPasswordValue) ) {
                        //|| passwordValue.length < 8 || passwordValue.length > 20) {
                    
                    reasons += "- Must provide a valid password, and it must match the confirm password<br/>";
                    valid = false;
                }

                var passRegex = /${requestScope.passwordPattern}/;
                if(!passRegex.test(passwordValue)) {
                    reasons += "- Password must meet stated requirements<br/>";
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
<body>

<div class="wrapper">

    <form id="passwordReset" action="resetPassword" method="post" onsubmit="return validateForm();">

        <div class="header">
            <div class="server-select">
                <label for="server">Server:</label>
                <select id="server" name="workspace" tabindex="5">
                    <c:forEach items="${requestScope.workspaces}" var="workspace">
                        <option value="<c:out value="${workspace['workspaceid']}" />">
                            <c:out value="${workspace['workspacename']}" />
                        </option>
                    </c:forEach>
                </select>
            </div>
        </div>


        <div class="content">
                 <div class="field">
                        <center>
                        <div style="width:65%">
                            <b>Password Requirements</b><br/> <c:out value="${requestScope.passwordRequirements}"/>
                            <input type="hidden" id="passwordPattern" value="${requestScope.passwordPattern}"/>
                        </div>
                        <br/>
                        
                        <span>
                            <label for="password">Password <font style="color:red">*</font></label>
                            <input type="password" id="password" name="password" maxlength="20" tabindex="10" />
                        </span>
                        
                        <span>
                            <label for="confirmPassword">Confirm Password <font style="color:red">*</font></label>
                            <input type="password" id="confirmPassword" name="confirmPassword" maxlength="20" tabindex="11" />
                        </span>
                        </center>
                    </div>
                <br>
                <button type="submit" tabindex="3">Submit</button>
        </div>
    </form>

    <div id="messages" name="messages" style="color:red;border: 2px solid red;padding: 4px" hidden="true"></div>       

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
