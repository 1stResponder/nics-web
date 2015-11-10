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

import edu.mit.ll.nics.common.ws.client.BasicRequest;
import edu.mit.ll.iweb.session.SessionHolder;
import edu.mit.ll.iweb.websocket.Config;

@WebServlet("/proxy")
public class WFSProxyServlet extends HttpServlet implements Servlet {

	private static Logger logger = Logger.getLogger(WFSProxyServlet.class);

	public WFSProxyServlet() {
	}

	@Override
	public void init() throws ServletException {}

	@Override
	protected void doGet(final HttpServletRequest request, final HttpServletResponse response) throws ServletException, IOException {
		String url = this.updateParameters(request.getParameter("url"), request);
		
		Map<String, String> headerOptions = new HashMap<>();
		
		if(url.startsWith(Config.getInstance().getConfiguration().getString("endpoint.geoserver"))){
			String token = (String) SessionHolder.getData(request.getSession().getId(), SessionHolder.TOKEN);
			headerOptions.put("Cookie", String.format("AMAuthCookie=%1$s;iPlanetDirectoryPro=%1$s", token));
		}
		headerOptions.put("User-Agent", "");
        
        BasicRequest basicRequest = new BasicRequest();
        String result = (String) basicRequest.getRequest(url, headerOptions);
        
        try {
            ServletOutputStream out = response.getOutputStream();
            response.setContentType("text/plain");
            
            if(result != null && result != "") {
               out.write(result.getBytes());
            }else {
               out.write("".getBytes());
            }
            out.close();
        }
        catch(IOException e) {
            logger.error("Error writing out response", e);
        }
    }
	
	private String updateParameters(String url, HttpServletRequest request){
		StringBuffer urlString = new StringBuffer(url);
		
		Map<String,String[]> paramMap = request.getParameterMap();
		for(String param : paramMap.keySet()){
			if(!param.equalsIgnoreCase("url") &&
					!param.equalsIgnoreCase("callback") &&
					!param.equalsIgnoreCase("_")){
				urlString.append("&");
				urlString.append(param);
				urlString.append("=");
				urlString.append(paramMap.get(param)[0]);
			}
		}
		
		return urlString.toString();
	}
}
