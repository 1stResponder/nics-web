/**
 * Copyright (c) 2008-2015, Massachusetts Institute of Technology (MIT)
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
package edu.mit.ll.nics.servlet;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.jar.Manifest;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.ws.rs.ProcessingException;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.Invocation.Builder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.configuration.Configuration;
import org.apache.log4j.Logger;

import com.iplanet.services.cdm.DefaultClientTypesManager;
import com.sun.identity.liberty.ws.authnsvc.jaxb.StatusType;

import edu.mit.ll.iweb.message.ResponseMessage;
import edu.mit.ll.iweb.session.SessionHolder;
import edu.mit.ll.iweb.websocket.Config;
import edu.mit.ll.nics.sso.util.SSOUtil;
import edu.mit.ll.nics.util.CookieTokenUtil;


/**
 * Created by cbudny on 1/29/16.
 */

@WebServlet("/forgotpassword")
public class ForgotPassswordServlet extends HttpServlet implements Servlet
{
    private static Logger logger = Logger.getLogger(ForgotPassswordServlet.class);

    public static final String USERNAME = "username";
    public static final String WORKSPACE_ID = "workspaceId";
    public static final String EMAIL = "email";
    public static final String WORKSPACE = "workspace";

    private static final String JSP_PATH = "forgotpassword/forgotpassword.jsp";
    private static final String FAILED_JSP_PATH = "forgotpassword/forgotpasswordFailed.jsp";
    private static final String SUCCESS_JSP_PATH = "forgotpassword/forgotpasswordSuccess.jsp";

    private static final String ERROR_DESCRIPTION_KEY = "errorDescriptionKey";
    private static final String ERROR_MESSAGE_KEY = "errorMessageKey";
    private static final String FP_ERROR_INVALID_MESSAGE = "forgotpassword.error.invalid.message";
    private static final String FP_ERROR_INVALID_DESCRIPTION = "forgotpassword.error.invalid.description";
    private static final String FP_ERROR_CONFIG_MESSAGE = "forgotpassword.error.config.message";
    private static final String FP_ERROR_CONFIG_DESCRIPTION = "forgotpassword.error.config.description";


    private static final String MANIFEST_PATH = "/META-INF/MANIFEST.MF";
    private static final String IMPL_VERSION = "Implementation-Version";

    private String workspaceUrl;
    private String restEndpoint;
    private String cookieDomain;
    private String warVersion;

    public ForgotPassswordServlet()
    {
    }

    @Override
    public void init() throws ServletException {
        Configuration config = Config.getInstance().getConfiguration();
        restEndpoint = config.getString("endpoint.rest");
        cookieDomain = config.getString("private.cookie.domain");


        try {
            warVersion = getWarVersion();

            if (restEndpoint != null) {
                workspaceUrl = new java.net.URI(restEndpoint.concat("/"))
                        .resolve("workspace/system/").toASCIIString();
            }
        } catch (URISyntaxException e) {
            logger.error("Failed to initialize workspace API endpoint", e);
        } catch (IOException ioe)
        {
            logger.error("Failied to get NICS war Version", ioe);
        }
    }

    /**
     *
     * curl \
     --request POST \
     --header "Content-Type: application/json" \
     --data '{
     "username": "demo",
     "subject": "Reset your forgotten password with OpenAM",
     "message": "Follow this link to reset your password"
     }' \
     https://openam.example.com:8443/openam/json/users/?_action=forgotPassword
     {}
     *
     *
     * @param req
     * @param resp
     * @throws ServletException
     * @throws IOException
     */
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        String username = req.getParameter(USERNAME);
        String workspaceId = req.getParameter(WORKSPACE);

        // Check NICS DB first?
        if (this.validateUser(username, workspaceId)) {
            logger.info("Validated user");
            CookieTokenUtil tokenUtil = new CookieTokenUtil();
            boolean reset = tokenUtil.getSSOUtil().resetPassword(username);
            logger.info("Password reset return value: " + reset);
            if (!reset) {
                this.sendErrorMessage(req, resp);
            } else {
                resp.sendRedirect(SUCCESS_JSP_PATH);
            }
        } else {
            logger.info("Couldn't validate user");
            this.sendErrorMessage(req, resp);
        }
    }

    private List<?> getWorkspaces(String hostname) throws URISyntaxException {
        Client jerseyClient = ClientBuilder.newClient();
        URI uri = new URI(workspaceUrl).resolve(hostname);
        WebTarget target = jerseyClient.target(uri);
        CookieTokenUtil tokenUtil = new CookieTokenUtil();
        Builder builder = target.request(MediaType.APPLICATION_JSON_TYPE);
        tokenUtil.setCookies(builder);

        Response response = builder.get();
        Map<String,Object> entity = builder.get(new GenericType<Map<String,Object>>(){});
        List<?> ret = (List<?>) entity.get("workspaces");
        response.close();
        jerseyClient.close();
        tokenUtil.destroyToken();
        return ret;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        // TODO: refactor so it handles multiple gets depending on request parameters
        try {
            try {
                List<?> workspaces = getWorkspaces(req.getServerName());
                if (workspaces.size() > 0) {
                    req.setAttribute("workspaces", workspaces);
                    req.setAttribute("version", warVersion);
                    req.getRequestDispatcher(JSP_PATH).forward(req, resp);
                } else {
                    req.setAttribute(ERROR_MESSAGE_KEY, FP_ERROR_CONFIG_MESSAGE);
                    req.setAttribute(ERROR_DESCRIPTION_KEY, FP_ERROR_CONFIG_DESCRIPTION);
                    req.getRequestDispatcher(FAILED_JSP_PATH).forward(req, resp);
                }
            } catch(Exception e) {
                logger.error("Failed to retrieve workspaces or organization data", e);
                throw e;
            }
        } catch (WebApplicationException | ProcessingException | URISyntaxException e) {
            //logger.error("Failed to retrieve available workspaces", e);
            req.setAttribute(ERROR_MESSAGE_KEY, FP_ERROR_CONFIG_MESSAGE);
            req.setAttribute(ERROR_DESCRIPTION_KEY, FP_ERROR_CONFIG_DESCRIPTION);
            req.getRequestDispatcher(FAILED_JSP_PATH).forward(req, resp);
        }
    }

    private void sendErrorMessage(HttpServletRequest req,
                                  HttpServletResponse resp) throws ServletException, IOException {
        req.setAttribute(ERROR_MESSAGE_KEY, FP_ERROR_INVALID_MESSAGE);
        req.setAttribute(ERROR_DESCRIPTION_KEY, FP_ERROR_INVALID_DESCRIPTION);
        req.getRequestDispatcher(FAILED_JSP_PATH).forward(req, resp);
    }

    private boolean validateUser(String username, String workspaceId) {
        if (restEndpoint != null) {
            try {
                String url = new java.net.URI(restEndpoint.concat("/"))
                        .resolve(
                                String.format(
                                        "users/%s/systemStatus?userName=%s",
                                        workspaceId, username)).toASCIIString();

                CookieTokenUtil tokenUtil = new CookieTokenUtil();
                Client jerseyClient = ClientBuilder.newClient();
                WebTarget target = jerseyClient.target(url.toString());

                Builder builder = target
                        .request(MediaType.APPLICATION_JSON_TYPE);
                tokenUtil.setCookies(builder);

                Response response = builder.get();
                Map<String, Object> entity = builder
                        .get(new GenericType<Map<String, Object>>() {
                        });
                int count = (Integer) entity.get("count");
                response.close();
                jerseyClient.close();
                tokenUtil.destroyToken();

                return count == 1; // Returned one valid user
            } catch (URISyntaxException exception) {
                logger.error(String.format(
                        "URISyntax error validatin the user: %s", username));
            }
        } else {
            logger.error("Failed to initialize workspace API endpoint");
        }
        return false;
    }

    private String getWarVersion() throws IOException {
        InputStream is = this.getServletContext().getResourceAsStream(MANIFEST_PATH);
        Manifest manifest = new Manifest(is);
        return manifest.getMainAttributes().getValue(IMPL_VERSION);
    }

}

