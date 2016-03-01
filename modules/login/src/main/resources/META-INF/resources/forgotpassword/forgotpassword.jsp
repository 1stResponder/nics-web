<%--

    (c) Copyright, 2008-2015 Massachusetts Institute of Technology.

        This material may be reproduced by or for the
        U.S. Government pursuant to the copyright license
        under the clause at DFARS 252.227-7013 (June, 1995).

--%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>NICS - Forgot Password</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="forgotpassword/styles/forgotpassword.css">
</head>
<body>

<div class="wrapper">

    <form id="forgotpassword" action="forgotpassword" method="post">

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
            <div class="content-wrapper">
                <img src="forgotpassword/images/nics-logo.jpg" height="290px" width="423px"></img>
                <br>
                <div class="field">
                    <label for="username">Email:</label>
                    <br>
                    <input type="text" id="username" name="username" tabindex="1" autofocus="autofocus"/>
                </div>
                <br>
                <button type="submit" tabindex="3">Submit</button>
            </div>
        </div>

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
