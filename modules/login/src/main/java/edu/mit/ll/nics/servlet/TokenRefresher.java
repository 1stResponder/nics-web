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

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.client.Invocation.Builder;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.configuration.Configuration;

import edu.mit.ll.iweb.session.SessionHolder;
import edu.mit.ll.iweb.websocket.Config;
import edu.mit.ll.nics.sso.util.SSOUtil;
import edu.mit.ll.nics.util.CookieTokenUtil;
import org.apache.log4j.Logger;
import com.iplanet.sso.SSOException;
import com.iplanet.sso.SSOToken;
import com.iplanet.sso.SSOTokenManager;

@WebServlet("/refresh")
public class TokenRefresher extends HttpServlet implements Servlet {
	private static Logger logger = Logger.getLogger(TokenRefresher.class);
	private static String CURRENT_USER_SESSION_ID = "currentUserSessionId";
	private static String restEndpoint;
	public static String WORKSPACE_ID = "workspaceId";
	protected SSOTokenManager manager = null;

	public TokenRefresher(){}
	
	@Override
	public void init() throws ServletException {
		Configuration config = Config.getInstance().getConfiguration();
		restEndpoint = config.getString("endpoint.rest");
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		boolean ret = this.refreshToken(req.getSession().getId(),
				req.getParameter(CURRENT_USER_SESSION_ID));
		
		ServletOutputStream out = resp.getOutputStream();
        resp.setContentType("application/json");
        
        if(ret){
        	out.write("{ \"success\": true }".getBytes());
        }else{
        	out.write("{ \"success\": false }".getBytes());
        }
        out.close();
	}

	public boolean refreshToken(String sessionId, String currentUserSessionId){
		logger.info("Trying to refresh token");
		String token = (String) SessionHolder.getData(sessionId, SessionHolder.TOKEN);
		Boolean openAmIdentity = Config.getInstance().getConfiguration().getBoolean("openAm.Identity", false);

		if(openAmIdentity)
		{
			SSOUtil ssoUtil = new SSOUtil();
			if(!ssoUtil.refreshSessionToken(token)){
				logger.info("removing token from database");
				//remove from database
				CookieTokenUtil tokenUtil = new CookieTokenUtil();
				Client jerseyClient = ClientBuilder.newClient();
				WebTarget target = jerseyClient.target(
						restEndpoint
						+ "/users/" 
						+ SessionHolder.getSessionInfo(sessionId).get(WORKSPACE_ID)
						+ "/removesession?currentUserSessionId=" 
						+ currentUserSessionId);

				Builder builder = target.request(MediaType.APPLICATION_JSON_TYPE);
				tokenUtil.setCookies(builder);

				Entity<String> entity = Entity.entity("{}", MediaType.APPLICATION_JSON);
		    	Response response = builder.post(entity);
				response.close();
				jerseyClient.close();

				tokenUtil.destroyToken();
				
				return false;
			}

		} else
		{
			//return refreshToken(token);
		}

		return true;
	}

	protected boolean refreshToken(String tokenID)
	{
		try{

			if (manager == null)
			{
				manager = SSOTokenManager.getInstance();
			}

			SSOToken token = manager.createSSOToken(tokenID);

			if (manager.isValidToken(token, true)) // if it's valid, the token's idle time gets refreshed.
			{
				debug("Created valid token fromk TOKENID: " + tokenID);
				info("SSOToken hostname: " + token.getHostName());
				info("SSOToken Principal name: " + token.getPrincipal().getName());
				info("SSOToken Auth type user: " + token.getAuthType());
				info("IP addr of host: " + token.getIPAddress().getHostAddress());
				info("Max Idle Time: " + token.getMaxIdleTime());
				info("Max Session Time: " + token.getMaxSessionTime());
				info("New Idle Time: " + token.getIdleTime());
				manager.refreshSession(token);
				return true;
			}
		}catch (Exception ae)
		{
			ae.printStackTrace();
			error("Exception when refreshing token: " + ae);
		}
		return false;
	}

	public void info(String msg)
	{
		logger.info(msg);
	}

	public void debug(String msg)
	{
		logger.debug(msg);
	}

	public void error(String msg)
	{
		logger.error(msg);
	}
}