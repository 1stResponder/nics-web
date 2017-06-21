/**
 * Copyright (c) 2016, Ardent Management Consulting, All Rights Reserved
 */
package com.ardentmc.dhs.nics;

import edu.mit.ll.iweb.session.SessionHolder;
import edu.mit.ll.iweb.websocket.Config;
import edu.mit.ll.nics.util.CookieTokenUtil;

import java.io.IOException;
import java.io.StringWriter;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.*;

import javax.servlet.FilterChain;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.ProcessingException;
import javax.ws.rs.WebApplicationException;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Invocation.Builder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ProcessingException;
import javax.ws.rs.WebApplicationException;

import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.apache.commons.configuration.Configuration;

import org.apache.cxf.fediz.core.Claim;
import org.apache.cxf.fediz.core.ClaimCollection;
import org.apache.cxf.fediz.core.processor.FedizResponse;
import org.apache.cxf.fediz.core.SecurityTokenThreadLocal;
import org.apache.cxf.fediz.spring.authentication.FederationAuthenticationToken;
import org.apache.cxf.fediz.spring.FederationUser;
import org.apache.log4j.Logger;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

import org.w3c.dom.Element;

public class NICSSecurityFilter extends GenericFilterBean {

	private static Logger logger = Logger.getLogger(NICSSecurityFilter.class);
	
	public static final String USERNAME = "username"; 	
	public static final String WORKSPACE_ID = "workspaceId";
	private static String HOME_PAGE = "home.html";
	private static String DEFAULT_REQUEST_URI = "/nics/";
	
	private static String REINIT_PARAM = "reinit";
	private static String SESSION_ID = "sessionId";
	
	private static final String MANIFEST_PATH = "/META-INF/MANIFEST.MF";
	private static final String IMPL_VERSION = "Implementation-Version";
	
	private static final String ERROR_MESSAGE_KEY = "errorMessageKey";	
	private static final String FAILED_JSP_PATH = "login/loginFailed.jsp";
	private static final String ERROR_DESCRIPTION_KEY = "errorDescriptionKey";
	private static final String LOGIN_ERROR_NOWORKSPACE_DESCRIPTION = "login.error.noworkspace.description";
	private static final String LOGIN_ERROR_APIERROR_DESCRIPTION = "login.error.apierror.description";
	private static final String LOGIN_ERROR_CONFIGURATION_MESSAGE = "login.error.configuration.message";
	private static final String OPENAM_AS_IDP = "openAm.Identity";

	
	private String workspaceUrl;
	private String restEndpoint;
	private String cookieDomain;
	private Boolean openAmIdentity;
	
	@Override
	protected void initFilterBean() throws ServletException {
		Configuration config = Config.getInstance().getConfiguration();
		restEndpoint = config.getString("endpoint.rest");
		cookieDomain = config.getString("private.cookie.domain");
		openAmIdentity = config.getBoolean(OPENAM_AS_IDP,false);

		try {

			if (restEndpoint != null) {
				workspaceUrl = new java.net.URI(restEndpoint.concat("/"))
						.resolve("workspace/system/").toASCIIString();
			}
		} catch (URISyntaxException e) {
			logger.error("Failed to initialize workspace API endpoint", e);
		}
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		
		final HttpServletRequest req = (HttpServletRequest) request;
		final HttpServletResponse resp = (HttpServletResponse) response;
		
		String requestURI = req.getRequestURI();
		logger.info("requestURI: "+requestURI);
		try
		{
			//Do not cache the home page to allow the filter to redirect if the user
			//is not validated
			if(requestURI.equalsIgnoreCase(DEFAULT_REQUEST_URI) || requestURI.endsWith(HOME_PAGE)){
				resp.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0");
		        resp.setHeader("Pragma", "no-cache");
		        resp.setDateHeader("Expires", 0);
			}

	        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	        if (auth instanceof FederationAuthenticationToken) 
	        {
	        	Date tokenExpires = ((FederationAuthenticationToken)auth).getResponse().getTokenExpires();

	        	Date now = new Date();
	        	logger.info("Token Expires A: " + tokenExpires + " Now: " + now);

	        	if(!(tokenExpires.before(now)))
	        	{
 		        		        	
	            FederationAuthenticationToken fedAuthToken = (FederationAuthenticationToken)auth;

	            if (fedAuthToken.getUserDetails() instanceof FederationUser)
            	{
	
						// Check to see if this user is already logged in, if not log them into NICS with their claims
			        	if(false == isUserLoggedIn(req, fedAuthToken))
			        	{
							logUserIn(req, resp, fedAuthToken);

			        	} else
			        	{
			        		HttpSession session = req.getSession(false);
							if(session==null || !req.isRequestedSessionIdValid())
							{
							    resp.sendRedirect("/login?loggedOut=true&reason=invalidSession");
							}

						}

		        	} else
		        	{
	            	logger.info("FederationAuthenticationToken found but not FederationUser");
	           	 	}
			} else
			{
				logger.info("Token Expired! " + tokenExpires);

				FederationAuthenticationToken fedAuthToken = (FederationAuthenticationToken)auth;
				logUserIn(req, resp, fedAuthToken);
			}
	            
	        } else {
	            logger.info("No FederationAuthenticationToken found in Spring Security Context.");
	        }
		} catch(Exception ex)
		{
			logger.error("Redirecting to the error page due to an uncaught exception.", ex);
			redirectToErrorGeneric(req, resp);
		}
		chain.doFilter(request, response);
	}

	private void logUserIn(final HttpServletRequest req, final HttpServletResponse resp,
			FederationAuthenticationToken fedAuthToken) throws JSONException {
		ClaimCollection claims = ((FederationUser)fedAuthToken.getUserDetails()).getClaims();
		Map<String, Object> claimValuesByTypeMap = new HashMap<String, Object>();
		logger.info("FedAuth Claims found: "+claims.size());
		for (Claim c: claims) {
			String claimType = c.getClaimType().toString();
			Object claimValue = c.getValue();

			claimValuesByTypeMap.put(claimType, claimValue);
		}

		String username = fedAuthToken.getUserDetails().getUsername();

			if(username != null && !username.isEmpty())
    		{
				logger.info("Looking up NICS user based on username claim: " + username);
				loginWithEmailAddress(req, resp, fedAuthToken, username);
			} else
			{
				throw new RuntimeException("Could not find username claim");
			}
	}

	private void loginWithEmailAddress(final HttpServletRequest req, final HttpServletResponse resp, FederationAuthenticationToken fedAuthToken, String emailAddress) {
		FedizResponse fResp = fedAuthToken.getResponse();
		String uniqueTokenId = fResp.getUniqueTokenId();
		Map<String, Object> data = new HashMap<String, Object>();
		data.put(SessionHolder.TOKEN, uniqueTokenId);
		data.put(USERNAME, emailAddress);

		List<?> workspaces = getWorkspaces(req, resp);
	
		if(workspaces != null && !workspaces.isEmpty()) {
			Map<String, Object> firstWorkspace = (Map<String, Object>)workspaces.get(0);
			Integer workspaceId = (Integer)firstWorkspace.get("workspaceid");

			// see if this user is registered with NICS
			if(isUser(emailAddress, String.valueOf(workspaceId))) {

				// see if the user is valid
				if(nicsUser(emailAddress, String.valueOf(workspaceId))) {
					data.put(WORKSPACE_ID, Integer.valueOf(workspaceId));

					SessionHolder.addSession(req.getSession().getId(), data);

					setCookies(resp, uniqueTokenId);
				} else {
					// user is not registered with NICS
					logger.info("User is not enabled or active with NICS, redirect to error page...");
					redirectToErrorNotValid(req, resp);
				}
			} else {
				// user is not registered with NICS
				logger.info("User is not registered with NICS, redirect...");
				redirectToUserNotFound(req, resp);
			}
			
		} else {
			logger.error("Redirecting to error page - No Workspaces found.");
			redirectToErrorNoWorkspaces(req, resp);
		}
	}

	private void redirectToUserNotFound(final HttpServletRequest req, final HttpServletResponse resp) {
		req.setAttribute(ERROR_MESSAGE_KEY, "login.error.notregistered.message");
		req.setAttribute(ERROR_DESCRIPTION_KEY, "login.error.notregistered.description");
		try {
			req.getRequestDispatcher(FAILED_JSP_PATH).forward(req, resp);
		} catch (ServletException | IOException e) {
			logger.error("Could not redirect to the login error page due to the following error.", e);
		}
	}

	private void redirectToErrorNotValid(final HttpServletRequest req, final HttpServletResponse resp) {
		req.setAttribute(ERROR_MESSAGE_KEY, "login.error.inactive.message");
		req.setAttribute(ERROR_DESCRIPTION_KEY, "login.error.inactive.description");
		try {
			req.getRequestDispatcher(FAILED_JSP_PATH).forward(req, resp);
		} catch (ServletException | IOException e) {
			logger.error("Could not redirect to the login error page due to the following error.", e);
		}
	}

	private void redirectToErrorNoWorkspaces(final HttpServletRequest req, final HttpServletResponse resp) {
		req.setAttribute(ERROR_MESSAGE_KEY, LOGIN_ERROR_CONFIGURATION_MESSAGE);
		req.setAttribute(ERROR_DESCRIPTION_KEY, LOGIN_ERROR_NOWORKSPACE_DESCRIPTION);
		try {
			req.getRequestDispatcher(FAILED_JSP_PATH).forward(req, resp);
		} catch (ServletException | IOException e) {
			logger.error("Could not redirect to the login error page due to the following error.", e);
		}
	}
	
	private void redirectToErrorGeneric(final HttpServletRequest req, final HttpServletResponse resp) {
		req.setAttribute(ERROR_MESSAGE_KEY, LOGIN_ERROR_CONFIGURATION_MESSAGE);
		req.setAttribute(ERROR_DESCRIPTION_KEY, LOGIN_ERROR_APIERROR_DESCRIPTION);
		try {
			req.getRequestDispatcher(FAILED_JSP_PATH).forward(req, resp);
		} catch (ServletException | IOException e) {
			logger.error("Could not redirect to the login error page due to the following error.", e);
		}
	}	
	
	private List<?> getWorkspaces(final HttpServletRequest req, final HttpServletResponse resp) {
		
		//CookieTokenUtil tokenUtil = new CookieTokenUtil();
		Client jerseyClient = ClientBuilder.newClient();
		Response response = null;
		
		List<?> workspaces = null;
		try {
			String hostname = req.getServerName();
			URI uri = new URI(workspaceUrl).resolve(hostname);
			WebTarget target = jerseyClient.target(uri);
	
			Builder builder = target.request(MediaType.APPLICATION_JSON_TYPE);
	//		tokenUtil.setCookies(builder);
	
			response = builder.get();
			Map<String, Object> entity = builder
					.get(new GenericType<Map<String, Object>>() {
					});
			
			workspaces = (List<?>) entity.get("workspaces");
						
		} catch (WebApplicationException | ProcessingException | URISyntaxException e) {
			logger.error("Unable to retrieve workspaces due to the following error.", e);
		} finally {
			if(response != null) {
				response.close();
			}
			
			jerseyClient.close();
			
			//tokenUtil.destroyToken();	
		}
		return workspaces;
	}
	private String getToken() {
		String token = null;
        Element el = SecurityTokenThreadLocal.getToken();
        if (el != null) {
            try {
                TransformerFactory transFactory = TransformerFactory.newInstance();
                Transformer transformer = transFactory.newTransformer();
                StringWriter buffer = new StringWriter();
                transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
                transformer.transform(new DOMSource(el),
                                      new StreamResult(buffer));
                token = buffer.toString();
                
            } catch (Exception ex) {
        		logger.error("Failed to transform cached element to string: " + ex.toString(), ex);
            }
        }
        return token;
	}
	
	private void setCookies(HttpServletResponse resp, String token) {

		if(openAmIdentity)
		{
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
	}

	private boolean isUser(String username, String workspaceId)
	{
		if (restEndpoint != null) {

			try {
				String url = new java.net.URI(restEndpoint.concat("/"))
						.resolve(
								String.format(
										"users/%s/isUser?userName=%s",
										workspaceId, username)).toASCIIString();
				
				//CookieTokenUtil tokenUtil = new CookieTokenUtil();
				Client jerseyClient = ClientBuilder.newClient();
				WebTarget target = jerseyClient.target(url.toString());

				Builder builder = target
						.request(MediaType.APPLICATION_JSON_TYPE);
				//tokenUtil.setCookies(builder);

				Response response = builder.get();
				Map<String, Object> entity = builder
						.get(new GenericType<Map<String, Object>>() {
						});
				int count = (Integer) entity.get("count");
				response.close();
				jerseyClient.close();

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
	
	private boolean nicsUser(String username, String workspaceId) {
		if (restEndpoint != null) {

			try {
				String url = new java.net.URI(restEndpoint.concat("/"))
						.resolve(
								String.format(
										"users/%s/systemStatus?userName=%s",
										workspaceId, username)).toASCIIString();
				
				//CookieTokenUtil tokenUtil = new CookieTokenUtil();
				Client jerseyClient = ClientBuilder.newClient();
				WebTarget target = jerseyClient.target(url.toString());

				Builder builder = target
						.request(MediaType.APPLICATION_JSON_TYPE);
				//tokenUtil.setCookies(builder);

				Response response = builder.get();
				Map<String, Object> entity = builder
						.get(new GenericType<Map<String, Object>>() {
						});
				int count = (Integer) entity.get("count");
				response.close();
				jerseyClient.close();
			//	tokenUtil.destroyToken();

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

	private boolean isUserLoggedIn(HttpServletRequest req, FederationAuthenticationToken fedAuthToken){
		FedizResponse fResp = fedAuthToken.getResponse();
		String uniqueTokenId = fResp.getUniqueTokenId();

		if(req.getSession(false) != null)
		{
			String exisTokenId = (String) SessionHolder.getData(req.getSession(false).getId(), SessionHolder.TOKEN);

			if(uniqueTokenId.equalsIgnoreCase(exisTokenId)){
				// should be checking here if the token/session is valid
				return true;
			}
		}

		if(req.getQueryString() != null &&
				req.getQueryString().indexOf(REINIT_PARAM) > -1)
		{
			String userid = req.getParameter(REINIT_PARAM);
			String sessionId = req.getParameter(SESSION_ID);
			
			// should be checking here if the token/session is valid
			logger.info("Adding New Session Id info...");
			SessionHolder.addSession(req.getSession().getId(),
			SessionHolder.getSessionInfo(sessionId));
			SessionHolder.removeSession(sessionId);

			return true;
			
		}

		return false;
	}
}
