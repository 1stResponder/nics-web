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

@WebServlet("/register")
public class RegisterServlet extends HttpServlet implements Servlet {

	private static Logger logger = Logger.getLogger(RegisterServlet.class);
	
	private static final String ERROR_DESCRIPTION_KEY = "errorDescriptionKey";
	private static final String ERROR_MESSAGE_KEY = "errorMessageKey";
	private static final String REGISTER_ERROR_NOWORKSPACE_DESCRIPTION = "register.error.noworkspace.description";
	private static final String REGISTER_ERROR_APIERROR_DESCRIPTION = "register.error.apierror.description";
	private static final String REGISTER_ERROR_CONFIGURATION_MESSAGE = "register.error.configuration.message";
	private static final String REGISTER_ERROR_INVALID_MESSAGE = "register.error.invalid.message";
	private static final String REGISTER_ERROR_INVALID_DESCRIPTION = "register.error.invalid.description";
	private static final String REGISTER_ERROR_BADURL_DESCRIPTION = "register.error.badurl.description";
	private static final String REGISTER_SUCCESS_MESSAGE = "register.success.message";
	
	private static final String REGISTER_JSP_PATH = "register/register.jsp";
	private static final String LOGIN_JSP_PATH = "login/login.jsp";
	private static final String FAILED_JSP_PATH = "register/registerFailed.jsp";
	private static final String SUCCESS_JSP_PATH = "register/registerSuccess.jsp";
	
	private static final String HOME_PATH = "home.html";
	private static final String MANIFEST_PATH = "/META-INF/MANIFEST.MF";
	private static final String IMPL_VERSION = "Implementation-Version";
	
	public static final String AFFILIATION = "affiliation";
	public static final String ORGANIZATION = "org";
	public static final String IMT_CDF = "imtCDF";
	public static final String IMT_FEDERAL = "imtFederal";
	public static final String IMT_USAR = "imtUsar";
	public static final String IMT_OTHER_LOCAL = "imtOtherLocal";
	public static final String NONE = "NONE";
	
	public static final String FIRST = "first";
	public static final String LAST = "last";	
	public static final String EMAIL = "email";
	public static final String PASSWORD = "password";
	public static final String CONFIRM_PASSWORD = "confirmPassword";
	
	public static final String PHONE_MOBILE = "phoneMobile";
	public static final String PHONE_OFFICE = "phoneOffice";
	public static final String PHONE_OTHER = "phoneOther";
	
	public static final String RADIO = "radio";
	public static final String OTHER_EMAIL = "emailOther";
	
	public static final String JOB_TITLE = "jobTitle";
	public static final String RANK = "rank";
	public static final String DESCRIPTION = "description";
	public static final String OTHER = "other";
	
	public static final String WORKSPACE = "workspace";

	/** Default SerialVersionUID */
	private static final long serialVersionUID = 1L;

	private static final String GOOGLE_RECAPTCHA_KEY = "private.google.recaptcha.key";
	private static final String GOOGLE_RECAPTCHA_SECRET = "private.google.recaptcha.secret";
	
	//private CookieTokenUtil tokenUtil;
	//private static SSOUtil util;
	private String workspaceUrl;
	private String allOrgsUrl;
	private String orgTypesUrl;
	private String orgOrgTypeUrl;
	private String registerUserUrl;
	private String warVersion;
	
	public RegisterServlet() {
	}
	
	@Override
	public void init() throws ServletException {
		Configuration config = Config.getInstance().getConfiguration();
		String restEndpoint = config.getString("endpoint.rest");
		
		//System.setProperty("ssoToolsPropertyPath", "/opt/data/nics/config"); //CONFIGURE THIS!!
		//System.setProperty("openamPropertiesPath", "/opt/data/nics/config"); //CONFIGURE THIS!!
		//util = new SSOUtil();
		/*try {
			tokenUtil = new CookieTokenUtil();
		} catch(Exception e) {
			logger.error("Exception initializing CookieTokenUtil: " + e.getMessage());
		}*/
		
		try {
			warVersion = getWarVersion();
			
			if (restEndpoint != null) {
				workspaceUrl = new java.net.URI(restEndpoint.concat("/"))
					.resolve("workspace/system/").toASCIIString();
				
				allOrgsUrl = new java.net.URI(restEndpoint.concat("/"))
					.resolve("orgs/1/all").toASCIIString(); // TODO: does workspace 1 really limit the query?
				
				orgTypesUrl = new java.net.URI(restEndpoint.concat("/"))
				.resolve("orgs/1/types").toASCIIString();
				
				orgOrgTypeUrl = new java.net.URI(restEndpoint.concat("/"))
						.resolve("orgs/1/typemap").toASCIIString();
				
				registerUserUrl = new java.net.URI(restEndpoint.concat("/"))
				.resolve("users/1").toASCIIString();
				
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
		// TODO: refactor so it handles multiple gets depending on request parameters
		try {
			if (workspaceUrl == null || orgTypesUrl == null || allOrgsUrl == null) {
				req.setAttribute(ERROR_MESSAGE_KEY, REGISTER_ERROR_CONFIGURATION_MESSAGE);
				req.setAttribute(ERROR_DESCRIPTION_KEY, REGISTER_ERROR_BADURL_DESCRIPTION);
				req.getRequestDispatcher(FAILED_JSP_PATH).forward(req, resp);
				return;
			}
			
			try {
				List<?> workspaces = getWorkspaces(req.getServerName());
				List<?> orgOrgTypes = getOrgOrgTypes();
				List<?> orgTypes = getOrgTypes(req.getServerName());
				List<?> orgs = getOrgs(req.getServerName());
				
				if (workspaces.size() > 0 && orgTypes.size() > 0 && orgs.size() > 0) {
					
					req.setAttribute("version", warVersion);
					req.setAttribute("workspaces", workspaces);
					req.setAttribute("orgtypes", orgTypes);
					req.setAttribute("orgorgtypes", orgOrgTypes);
					req.setAttribute("orgs", orgs);
					req.setAttribute("dataSiteKey", 
							Config.getInstance().getConfiguration().getString(GOOGLE_RECAPTCHA_KEY));
					
					req.getRequestDispatcher(REGISTER_JSP_PATH).forward(req, resp);
				} else {
					req.setAttribute(ERROR_MESSAGE_KEY, REGISTER_ERROR_CONFIGURATION_MESSAGE);
					req.setAttribute(ERROR_DESCRIPTION_KEY, REGISTER_ERROR_NOWORKSPACE_DESCRIPTION);
					req.getRequestDispatcher(FAILED_JSP_PATH).forward(req, resp);
				}
			} catch(Exception e) {
				logger.error("Failed to retrieve workspaces or organization data", e);
				throw e;
			}
			
			
		} catch (WebApplicationException | ProcessingException | URISyntaxException e) {
			//logger.error("Failed to retrieve available workspaces", e);
			req.setAttribute(ERROR_MESSAGE_KEY, REGISTER_ERROR_CONFIGURATION_MESSAGE);
			req.setAttribute(ERROR_DESCRIPTION_KEY, REGISTER_ERROR_APIERROR_DESCRIPTION);
			req.getRequestDispatcher(FAILED_JSP_PATH).forward(req, resp);
		}
	}
	
	private boolean validateCaptcha(String captcha){
		String url = String.format(
				"https://www.google.com/recaptcha/api/siteverify?secret=%s&response=%s", 
				Config.getInstance().getConfiguration().getString(GOOGLE_RECAPTCHA_SECRET), captcha);
		
		System.out.println("URL : " + url);
		
		Client jerseyClient = ClientBuilder.newClient();
    	WebTarget target = jerseyClient.target(url);
    	Builder builder = target.request("json");
    	
    	Entity<String> entity = Entity.entity("", MediaType.APPLICATION_JSON);
    	Response response = builder.post(entity);
    	String message = response.readEntity(String.class);
    	
    	System.out.println("CAPTCHA RESPONSE " + message);
    	
    	response.close();
    	
    	return true;
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		//Disabled for now
		/*String captcha = req.getParameter("g-recaptcha-response");
		if(captcha != null){
			this.validateCaptcha(captcha);
		}*/
		
		String affiliation = req.getParameter(AFFILIATION);
		String org = req.getParameter(ORGANIZATION);
		String imtCdf = req.getParameter(IMT_CDF);
		String imtFederal = req.getParameter(IMT_FEDERAL);
		String imtOtherLocal = req.getParameter(IMT_OTHER_LOCAL);
		String imtUsar = req.getParameter(IMT_USAR);
		List<String> imtTeamsList = new ArrayList<String>();
		
		if(imtCdf != null && !imtCdf.equals(NONE)) {
			imtTeamsList.add(imtCdf);
		}
		if(imtFederal != null && !imtFederal.equals(NONE)) {
			imtTeamsList.add(imtFederal);
		}
		if(imtOtherLocal != null && !imtOtherLocal.equals(NONE)) {
			imtTeamsList.add(imtOtherLocal);
		}
		if(imtUsar != null && !imtUsar.equals(NONE)) {
			imtTeamsList.add(imtUsar);
		}
		
		String first = req.getParameter(FIRST);
		String last = req.getParameter(LAST);
		
		String email = req.getParameter(EMAIL);
		String password = req.getParameter(PASSWORD);
		String confirmPassword = req.getParameter(CONFIRM_PASSWORD);
		
		String phoneMobile = req.getParameter(PHONE_MOBILE);
		String phoneOffice = req.getParameter(PHONE_OFFICE);
		String phoneOther = req.getParameter(PHONE_OTHER);
		
		// Validator assumes the phone numbers are numbers only, so need to strip any
		// parens or hyphens or white space
		if(phoneMobile != null && !phoneMobile.isEmpty()) {
			phoneMobile = phoneMobile.replaceAll("[\\(\\)\\- A-z]", "");			
		}
		
		if(phoneOffice != null && !phoneOffice.isEmpty()) {
			phoneOffice = phoneOffice.replaceAll("[\\(\\)\\- A-z]", "");
		}
		
		if(phoneOther != null && !phoneOther.isEmpty()) {
			phoneOther = phoneOther.replaceAll("[\\(\\)\\- A-z]", "");
		}
		
		
		String radio = req.getParameter(RADIO);
		String otherEmail = req.getParameter(OTHER_EMAIL);
		
		String jobTitle = req.getParameter(JOB_TITLE);
		String rank = req.getParameter(RANK);
		String description = req.getParameter(DESCRIPTION);
		
		String other = req.getParameter(OTHER);
		
		String workspaceId = req.getParameter(WORKSPACE);
		
		Map<String, Object> userMap = new HashMap<String, Object>();
		userMap.put("password", password);
	    userMap.put("confirmPassword", confirmPassword);
	    userMap.put("firstName", first);
	    userMap.put("lastName", last);
	    userMap.put("email", email);
	    userMap.put("organization", org);
	    userMap.put("rank", rank);
	    userMap.put("radioNumber", radio);
	    userMap.put("officePhone", phoneOffice);
	    userMap.put("cellPhone", phoneMobile);
	    userMap.put("otherPhone", phoneOther);
	    userMap.put("jobTitle", jobTitle);
	    userMap.put("description", description);
	    userMap.put("otherInfo", other);
	    userMap.put("otherEmail", otherEmail);
	    	    
	    if(!imtTeamsList.isEmpty()) {
	    	userMap.put("teams", imtTeamsList.toArray());
	    } else {
	    	userMap.put("teams", null);
	    }
	    CookieTokenUtil tokenUtil = new CookieTokenUtil();
	    String token = tokenUtil.getAdminToken();
		String regUserStatus = registerUser(userMap);
		tokenUtil.destroyToken();
		
		if(regUserStatus != null && !regUserStatus.isEmpty()) {
			logger.info("\nGot user registration message back: " + regUserStatus);
			if(regUserStatus.contains("Successfully registered")) { // TODO: make constant/json
								
				req.setAttribute(ERROR_MESSAGE_KEY, REGISTER_SUCCESS_MESSAGE);				
				req.getRequestDispatcher(SUCCESS_JSP_PATH).forward(req, resp);				
			} else {
				// error, forward on to error page with relevant message
				logger.info("Registration failed: " + regUserStatus);
								
				logger.info("\nAssuming user reg failed, response was null/empty");
				req.setAttribute(ERROR_MESSAGE_KEY, REGISTER_ERROR_INVALID_MESSAGE);				
				req.setAttribute(ERROR_DESCRIPTION_KEY, REGISTER_ERROR_INVALID_DESCRIPTION);
				req.setAttribute("REASON", regUserStatus);
				req.getRequestDispatcher(FAILED_JSP_PATH).forward(req, resp);
			}
		} // what if status was null?
						
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
	
	private List<?> getOrgTypes(String hostname) throws URISyntaxException {
		//logger.info(String.format("Getting orgtypes with hostname %s, and orgTypesUrl %s", hostname, orgTypesUrl));
		Client jerseyClient = ClientBuilder.newClient();
		URI uri = new URI(orgTypesUrl);
		WebTarget target = jerseyClient.target(uri);
		
		Builder builder = target.request(MediaType.APPLICATION_JSON_TYPE);
		CookieTokenUtil tokenUtil = new CookieTokenUtil();
		tokenUtil.setCookies(builder);
		Response response = builder.get();
		Map<String,Object> entity = builder.get(new GenericType<Map<String,Object>>(){});
		List<?> ret = (List<?>) entity.get("orgTypes");
		response.close();
		jerseyClient.close();
		tokenUtil.destroyToken();
		return ret;
	}
	
	private List<?> getOrgOrgTypes() throws URISyntaxException {
		
		Client jerseyClient = ClientBuilder.newClient();
		URI uri = new URI(orgOrgTypeUrl);
		WebTarget target = jerseyClient.target(uri);
		
		Builder builder = target.request(MediaType.APPLICATION_JSON_TYPE);
		CookieTokenUtil tokenUtil = new CookieTokenUtil();
		tokenUtil.setCookies(builder);
		Response response = builder.get();
		Map<String,Object> entity = builder.get(new GenericType<Map<String,Object>>(){});
		List<?> ret = (List<?>) entity.get("orgOrgTypes");
		response.close();
		jerseyClient.close();
		tokenUtil.destroyToken();
		return ret;
	}
	
	private List<?> getOrgs(String hostname) throws URISyntaxException {
		Client jerseyClient = ClientBuilder.newClient();
		URI uri = new URI(allOrgsUrl);
		WebTarget target = jerseyClient.target(uri);
		
		Builder builder = target.request(MediaType.APPLICATION_JSON_TYPE);
		CookieTokenUtil tokenUtil = new CookieTokenUtil();
		tokenUtil.setCookies(builder);
		Response response = builder.get();
		Map<String,Object> entity = builder.get(new GenericType<Map<String,Object>>(){});
		List<?> ret = (List<?>) entity.get("organizations");
		response.close();
		jerseyClient.close();
		tokenUtil.destroyToken();
		return ret;
	}
	
	private String registerUser(Map<String, Object> user) {
		String ret = null;
		try {
			Client jerseyClient = ClientBuilder.newClient();
			URI uri = new URI(registerUserUrl);
			
			WebTarget target = jerseyClient.target(uri);
			
			Builder builder = target.request(MediaType.APPLICATION_JSON_TYPE);
			CookieTokenUtil tokenUtil = new CookieTokenUtil();
			tokenUtil.setCookies(builder);
			
			Response response = builder.post(Entity.entity(user, MediaType.APPLICATION_JSON));
						
			String result = "";
			
			String message = null;
			Object messageObj = null;
			InputStream is = null;
			try {
				
				message = response.readEntity(String.class);
				
				/*messageObj = response.getEntity();
				
				if(messageObj instanceof InputStream) {
					is = (InputStream) messageObj;
					
					byte[] body = new byte[is.available()];
					is.read(body);
					message = new String(body);
										
				} else if(messageObj instanceof String) {
					message = (String) messageObj;
				}*/				
				
			} catch(Exception e) {
				System.out.println("Unhandled exception reading entity: " + e.getMessage());
				e.printStackTrace();
			} finally {
				if(is != null) {
					is.close();
				}
			}
			
			ret = ((response.getStatus() == 200) ? "Successfully registered" : "Failed(" + response.getStatus() + ") : " + 
					((message == null) ? "No reason given" : message));
			response.close();
			jerseyClient.close();
			tokenUtil.destroyToken();
			
		} catch(Exception e) {
			logger.error("Unhandled exception registering user: " + e.getMessage(), e);
		}
		
		return ret;
	}
	
	private String getWarVersion() throws IOException {
		InputStream is = this.getServletContext().getResourceAsStream(MANIFEST_PATH);
		Manifest manifest = new Manifest(is);
		return manifest.getMainAttributes().getValue(IMPL_VERSION);
	}
	
}
