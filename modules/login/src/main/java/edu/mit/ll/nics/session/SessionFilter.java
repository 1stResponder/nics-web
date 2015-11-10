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
package edu.mit.ll.nics.session;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.Filter;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

import edu.mit.ll.iweb.session.SessionHolder;

@WebFilter(urlPatterns = "*", asyncSupported= true)
public class SessionFilter implements Filter {
	
	private static String LOGIN_PAGE = "/nics/login";
	private static String REGISTER_PAGE = "/nics/register";
	private static String REINIT_PARAM = "reinit";
	private static String HOME_PAGE = "home.html";
	private static String USERNAME = "username";
	private static String SESSION_ID = "sessionId";
	
	private static Logger logger = Logger.getLogger(SessionFilter.class);
	
	@Override
	public void init(FilterConfig filterConfig) throws ServletException {}

	@Override
	public void destroy() {
		//Remove the session from the cache and the database
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		final HttpServletRequest req = (HttpServletRequest) request;
		final HttpServletResponse resp = (HttpServletResponse) response;
		
		String requestURI = req.getRequestURI();

		String atmosphereTransport = req.getParameter("X-Atmosphere-Transport");
		
		//Do not cache the home page to allow the filter to redirect if the user 
		//is not validated
		if(requestURI.endsWith(HOME_PAGE)){
			resp.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0");
	        resp.setHeader("Pragma", "no-cache");
		}
		
		//Allow everyone to Login
		if(requestURI.startsWith(LOGIN_PAGE)){
			req.getSession();
			chain.doFilter(req,resp);
		}
		//Allow everyone to register
		else if(requestURI.startsWith(REGISTER_PAGE)){
			HttpSession session = req.getSession();
			Map<String,Object> data = new HashMap<String,Object>();
			data.put(USERNAME, "register");
			
			SessionHolder.addSession(session.getId(), data);
			
			chain.doFilter(req,resp);
		}
		//Validate Request
		else if(isValidRequest(req)){
			req.getSession();
			chain.doFilter(request, response);
		}
		//Redirect to the login page
		else{
			redirect(resp);
		}
	}
	
	private boolean isValidRequest(HttpServletRequest req){
		
		if(SessionHolder.hasSession(req.getSession().getId())){
			return true;
		}else if(req.getQueryString() != null && 
				req.getQueryString().indexOf(REINIT_PARAM) > -1){
			
			String userid = req.getParameter(REINIT_PARAM);
			String sessionId = req.getParameter(SESSION_ID);
			
			if(SessionHolder.hasSession(sessionId)){
				logger.info("Adding New Session Id info...");
				SessionHolder.addSession(req.getSession().getId(), 
						SessionHolder.getSessionInfo(sessionId));
				SessionHolder.removeSession(sessionId);
			}
			return true;
		}
		return false;
	}
	
	private void redirect(HttpServletResponse resp) throws IOException, ServletException{
		logger.info("Redirect...");
		resp.sendRedirect(LOGIN_PAGE);
	}
}
