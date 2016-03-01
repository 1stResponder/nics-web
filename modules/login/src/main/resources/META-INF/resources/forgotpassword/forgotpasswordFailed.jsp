<%--

    (c) Copyright, 2008-2015 Massachusetts Institute of Technology.

        This material may be reproduced by or for the
        U.S. Government pursuant to the copyright license
        under the clause at DFARS 252.227-7013 (June, 1995).

--%>
<%@ page pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:set var="language" value="${not empty param.language ? param.language : not empty language ? language : pageContext.request.locale}" scope="session" />
<fmt:setLocale value="${language}" />
<fmt:setBundle basename="edu.mit.ll.nics.servlet.forgotpassword_messages" />
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Forgotten Password Error</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="forgotpassword/styles/forgotpassword.css">
</head>
<body>

<div class="wrapper">

    <div class="content">
        <div class="content-wrapper">
            <img src="forgotpassword/images/nics-logo.jpg" height="290px" width="423px"></img>
            <br>
            <h2><fmt:message key="${errorMessageKey}" /></h2>

            <c:url var="forgotpassword_url" value="/forgotpassword"/>
            <p class="message">
                <fmt:message key="${errorDescriptionKey}" />
            </p>
            <br/>
            <p>
                Click <a href="./login">here</a> to return to the login page.
            </p>
        </div>
    </div>


    <div class="footer">

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
