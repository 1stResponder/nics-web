/**
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
package edu.mit.ll.nics.servlet;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.jar.Manifest;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.ws.rs.ProcessingException;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Invocation.Builder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.configuration.Configuration;
import org.apache.log4j.Logger;

import edu.mit.ll.iweb.session.SessionHolder;
import edu.mit.ll.iweb.websocket.Config;
import edu.mit.ll.nics.util.CookieTokenUtil;

@WebServlet("/login")
public class LoginServlet extends HttpServlet implements Servlet {

	private static Logger logger = Logger.getLogger(LoginServlet.class);
	
	public static final String USERNAME = "username"; 
	public static final String WORKSPACE_ID = "workspaceId";

	private static final String ERROR_DESCRIPTION_KEY = "errorDescriptionKey";
	private static final String ERROR_MESSAGE_KEY = "errorMessageKey";
	private static final String LOGIN_ERROR_NOWORKSPACE_DESCRIPTION = "login.error.noworkspace.description";
	private static final String LOGIN_ERROR_APIERROR_DESCRIPTION = "login.error.apierror.description";
	private static final String LOGIN_ERROR_CONFIGURATION_MESSAGE = "login.error.configuration.message";
	private static final String LOGIN_ERROR_INVALID_MESSAGE = "login.error.invalid.message";
	private static final String LOGIN_ERROR_INVALID_DESCRIPTION = "login.error.invalid.description";
	private static final String LOGIN_ERROR_BADURL_DESCRIPTION = "login.error.badurl.description";

	private static final String LOGIN_JSP_PATH = "login/login.jsp";
	private static final String FAILED_JSP_PATH = "login/loginFailed.jsp";
	private static final String LOGGED_OUT_JSP_PATH = "/login/loggedOut.jsp";
	private static final String HOME_PATH = "home.html";
	private static final String MANIFEST_PATH = "/META-INF/MANIFEST.MF";
	private static final String IMPL_VERSION = "Implementation-Version";

	public static final String EMAIL = "email";
	public static final String PASSWORD = "password";
	public static final String WORKSPACE = "workspace";

	/** Default SerialVersionUID */
	private static final long serialVersionUID = 1L;

	private String workspaceUrl;
	private String restEndpoint;
	private String warVersion;
	private String cookieDomain;
	private String helpSite;
	private String siteLogo;
	private String siteLabel;

	public LoginServlet() {
		//jerseyClient = ClientBuilder.newClient();
	}

	@Override
	public void init() throws ServletException {
		Configuration config = Config.getInstance().getConfiguration();
		restEndpoint = config.getString("endpoint.rest");
		cookieDomain = config.getString("private.cookie.domain");
		helpSite = config.getString("help.site.url","https://public.nics.ll.mit.edu/");
		siteLogo = config.getString("main.site.logo","login/images/nics-logo.jpg");
		siteLabel = config.getString("main.site.label","Welcome to NICS 6");
		
		try {
			warVersion = getWarVersion();

			if (restEndpoint != null) {
				workspaceUrl = new java.net.URI(restEndpoint.concat("/"))
						.resolve("workspace/system/").toASCIIString();
			}
		} catch (URISyntaxException e) {
			logger.error("Failed to initialize workspace API endpoint", e);
		} catch (IOException e) {
			logger.error("Failed to retrieve WAR version", e);
		}
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		try {
			if (workspaceUrl == null) {
				req.setAttribute(ERROR_MESSAGE_KEY,
						LOGIN_ERROR_CONFIGURATION_MESSAGE);
				req.setAttribute(ERROR_DESCRIPTION_KEY,
						LOGIN_ERROR_BADURL_DESCRIPTION);
				req.getRequestDispatcher(FAILED_JSP_PATH).forward(req, resp);
				return;
			}
			String chosenWorkspace  = "1";
			//String chosenWorkspace  = req.getParameter("workspace");
			
			Object loggedOut = req.getParameter("loggedOut");
			logger.info("loggedOut: " + loggedOut);
			String s_loggedOut = (loggedOut == null) ? null : (String) loggedOut;
			boolean b_loggedOut = Boolean.parseBoolean(s_loggedOut);
			
			List<Map<String, Object>> workspaces = getWorkspaces(req.getServerName());
			System.out.println("Hereis " +  (workspaces.get(0)).get("workspaceid"));
			String defaultWorkspace = workspaces.get(0).get("workspaceid").toString();
			if (workspaces.size() > 0 && !b_loggedOut) {
				req.setAttribute("version", warVersion);
				req.setAttribute("workspaces", workspaces);
				chosenWorkspace  = req.getParameter("currentWorkspace");
				if (chosenWorkspace != null && chosenWorkspace != ""){
			    	req.setAttribute("announcements",this.getAnnouncements(chosenWorkspace));
			    	req.setAttribute("selectedWorkspace", chosenWorkspace);
			    }
			    else {
			    	req.setAttribute("announcements",this.getAnnouncements(defaultWorkspace));
			    	req.setAttribute("selectedWorkspace", defaultWorkspace);
			    }
				req.setAttribute("selectedWorkspace", workspaces);
				req.setAttribute("helpsite",helpSite);
				req.setAttribute("sitelogo",siteLogo);
				req.setAttribute("sitelabel",siteLabel);
				req.getRequestDispatcher(LOGIN_JSP_PATH).forward(req, resp);
				
				
			} else if( b_loggedOut ) {
				HttpSession session = req.getSession(false);
				if (session != null) {
					SessionHolder.removeSession(session.getId());
					session.invalidate();
				}
				req.getRequestDispatcher(LOGGED_OUT_JSP_PATH).forward(req, resp);
			} else {
				req.setAttribute(ERROR_MESSAGE_KEY,
						LOGIN_ERROR_CONFIGURATION_MESSAGE);
				req.setAttribute(ERROR_DESCRIPTION_KEY,
						LOGIN_ERROR_NOWORKSPACE_DESCRIPTION);
				req.getRequestDispatcher(FAILED_JSP_PATH).forward(req, resp);
			}
		} catch (WebApplicationException | ProcessingException
				| URISyntaxException e) {
			logger.error("Failed to retrieve available workspaces", e);
			req.setAttribute(ERROR_MESSAGE_KEY,
					LOGIN_ERROR_CONFIGURATION_MESSAGE);
			req.setAttribute(ERROR_DESCRIPTION_KEY,
					LOGIN_ERROR_APIERROR_DESCRIPTION);
			req.getRequestDispatcher(FAILED_JSP_PATH).forward(req, resp);
		}
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		String username = req.getParameter(EMAIL);
		if(username != null) {
			username = username.toLowerCase(Locale.ENGLISH);
		}
		String password = req.getParameter(PASSWORD);
		String workspaceId = req.getParameter(WORKSPACE);

		// Check NICS DB first?
		if (this.validateUser(username, workspaceId)) {

			CookieTokenUtil tokenUtil = new CookieTokenUtil();
			
			String retval = tokenUtil.getSSOUtil().login(username, password);

			if (retval == null || retval.startsWith("exception.name")) {
				this.sendErrorMessage(req, resp);
			} else {
				// TODO: Add token to database

				Map<String, Object> data = new HashMap<String, Object>();
				data.put(SessionHolder.TOKEN, retval);
				if (username != null) {
					data.put(USERNAME, username);
				}
				if (workspaceId != null && !workspaceId.isEmpty()) {
					data.put(WORKSPACE_ID,
							Integer.valueOf(workspaceId));
				}
				SessionHolder.addSession(req.getSession().getId(), data);

				setCookies(resp, retval);
				resp.sendRedirect(HOME_PATH);
			}
		} else {
			this.sendErrorMessage(req, resp);
		}
	}

	private void sendErrorMessage(HttpServletRequest req,
			HttpServletResponse resp) throws ServletException, IOException {
		req.setAttribute(ERROR_MESSAGE_KEY, LOGIN_ERROR_INVALID_MESSAGE);
		req.setAttribute(ERROR_DESCRIPTION_KEY, LOGIN_ERROR_INVALID_DESCRIPTION);
		req.getRequestDispatcher(FAILED_JSP_PATH).forward(req, resp);
	}

	private List<Map<String, Object>> getWorkspaces(String hostname) throws URISyntaxException {
		CookieTokenUtil tokenUtil = new CookieTokenUtil();
		URI uri = new URI(workspaceUrl).resolve(hostname);
		Client jerseyClient = ClientBuilder.newClient();
		WebTarget target = jerseyClient.target(uri);

		Builder builder = target.request(MediaType.APPLICATION_JSON_TYPE);
		tokenUtil.setCookies(builder);

		Response response = builder.get();
		Map<String, Object> entity = builder
				.get(new GenericType<Map<String, Object>>() {
				});
		List<Map<String, Object>> ret = (List<Map<String, Object>>) entity.get("workspaces");
		response.close();
		jerseyClient.close();

		tokenUtil.destroyToken();

		return ret;
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
	
	private void setCookies(HttpServletResponse resp, String token) {
		Cookie amCookie = new Cookie("AMAuthCookie", token);
		if (cookieDomain != null) {
			amCookie.setDomain(cookieDomain);
		}
		amCookie.setHttpOnly(true);
		amCookie.setSecure(true);
		amCookie.setPath("/");
		resp.addCookie(amCookie);
		
		Cookie iCookie = new Cookie("iPlanetDirectoryPro", token);
		if (cookieDomain != null) {
			iCookie.setDomain(cookieDomain);
		}
		iCookie.setHttpOnly(true);
		iCookie.setSecure(true);
		iCookie.setPath("/");
		resp.addCookie(iCookie);
	}

	private String getWarVersion() throws IOException {
		InputStream is = this.getServletContext().getResourceAsStream(
				MANIFEST_PATH);
		Manifest manifest = new Manifest(is);
		return manifest.getMainAttributes().getValue(IMPL_VERSION);
	}
	private List<?> getAnnouncements(String workspaceId)  {
		List<?> announcements = null;	
		if (restEndpoint != null) {
			try {
				String url = new java.net.URI(restEndpoint.concat("/"))
						.resolve(
								String.format(
										"announcement/%s/",
										workspaceId)).toASCIIString();
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
				announcements = (List<?>) entity.get("results");
				response.close();
				jerseyClient.close();

				tokenUtil.destroyToken();

				return announcements;
			}
			catch (URISyntaxException exception) {
				logger.error(String.format(
						"URISyntax error getting announcements"));
				
			}
		}
			return announcements;
	}
}
