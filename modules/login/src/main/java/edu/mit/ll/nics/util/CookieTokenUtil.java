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
package edu.mit.ll.nics.util;

import java.util.Arrays;
import java.util.Collection;

import javax.ws.rs.client.Invocation.Builder;
import javax.ws.rs.core.Cookie;

import edu.mit.ll.iweb.session.SessionHolder;
import edu.mit.ll.nics.sso.util.SSOUtil;

/**
 * Utility class for performing admin logins with SSOUtil, and setting cookies on Builders
 * 
 */
public class CookieTokenUtil {
	
	/** The SSOUtil instance */
	private SSOUtil ssoUtil;
	
	
	/**
	 * CookieTokenUtil constructor
	 * <p>
	 * 	If properly configured, the SSOUtil class is initialized
	 * </p>
	 * 
	 */
	public CookieTokenUtil() {
		System.setProperty("ssoToolsPropertyPath", "/opt/data/nics/config"); //CONFIGURE THIS!!
		System.setProperty("openamPropertiesPath", "/opt/data/nics/config"); //CONFIGURE THIS!!
		ssoUtil = new SSOUtil();
	}
		
	/**
	 * Uses existing token if it's available, so it may not necessarily be the admin token if you logged in
	 * as someone else previously.
	 * 
	 * @return
	 */
	public String getAdminToken() {		
		String token = ssoUtil.getTokenIfExists();
		if(token == null) {
			ssoUtil.loginAsAdmin();
			token = ssoUtil.getTokenIfExists();
		}
				
		return token;
	}
	
	/**
	 * Adds the current token to cookies on the builder. If there's not a token, the admin 
	 * token is retrieved
	 * 
	 * @param builder
	 */
	public void setCookies(Builder builder) {
		String token = ssoUtil.getTokenIfExists();
		if(token == null) {
			token = getAdminToken();
		}
		
		Collection<Cookie> cookies = 
				SessionHolder.getCookieStore(Arrays.asList("iplanet", "openam"), getAdminToken());
    	
		for(Cookie c : cookies){
    		builder.cookie(c);
    	}
    }		
	
	/**
	 * Destroys current token, if it exists
	 * 
	 * @return
	 */
	public boolean destroyToken() {
		String token = ssoUtil.getTokenIfExists();
		if(token != null) {
			return destroyToken(token);
		}
		
		return false;
	}
	
	private boolean destroyToken(String token) {
		return ssoUtil.destroyToken(token);
	}
	
	/**
	 * Gets the instance of SSOUtil, which depending on previous calls, may be signed in as Admin already
	 * @return
	 */
	public SSOUtil getSSOUtil() {
		return this.ssoUtil;
	}
}
