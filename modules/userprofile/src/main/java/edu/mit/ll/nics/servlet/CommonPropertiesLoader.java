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
import java.util.HashMap;
import java.util.Map;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

import edu.mit.ll.iweb.session.SessionHolder;

@WebServlet("/properties")
public class CommonPropertiesLoader extends HttpServlet implements Servlet {

	private static Logger logger = Logger.getLogger(CommonPropertiesLoader.class);
	private final ObjectWriter objectWriter;

	public static String USERNAME = "username"; //property that most sessions should have...
	public static String SESSION_ID = "sessionId";
	public static String WORKSPACE_ID = "workspaceId";
	
	public CommonPropertiesLoader() {
		objectWriter = new ObjectMapper().writer();
	}

	@Override
	public void init() throws ServletException {}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

    	Map<String, Object> config = new HashMap<String, Object>();
		
		String sessionId = req.getSession().getId();
		if(SessionHolder.hasSession(sessionId)){
			String username = (String) SessionHolder.getData(sessionId, USERNAME);
	    	Integer workspaceId = (Integer) SessionHolder.getData(sessionId, WORKSPACE_ID);
	    	config.put(SESSION_ID, sessionId);
			if(username != null){
				config.put(USERNAME, username);
			}
			if(workspaceId != null){
				config.put(WORKSPACE_ID, workspaceId);
			}
		}
		
		ServletOutputStream out = resp.getOutputStream();
        resp.setContentType("application/json");
        out.write(objectWriter.writeValueAsString(config).getBytes());
        out.close();
	}
}
