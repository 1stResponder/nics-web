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
package edu.mit.ll.nics.subscription;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.client.Invocation.Builder;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.Response.Status;

import org.atmosphere.cpr.AtmosphereResource;

import edu.mit.ll.iweb.session.SessionHolder;
import edu.mit.ll.iweb.websocket.Config;
import edu.mit.ll.iweb.websocket.SubscriptionValidator;

public class CollabRoomSubscriptionListener implements SubscriptionValidator {

	private final Client jerseyClient;

	private final String COLLABROOM_TOPIC = "iweb.NICS.collabroom";
	private final String INCIDENT_TOPIC = "iweb.NICS.incident";
	private final String REQUEST_TYPE = "json";
	private final String REST_ENDPOINT_CONFIG = "endpoint.rest";
	private final String USERNAME_ATTRIB = "username";

	public CollabRoomSubscriptionListener() {
		jerseyClient = ClientBuilder.newClient();
	}

	/**
	 * @param AtmosphereResource
	 *            r - the client requesting a subscription
	 * @param String
	 *            subscription - the subscription pattern
	 * @return true if validated
	 */
	@Override
	public boolean validate(AtmosphereResource r, String subscription) {
		// Check if the subscription is a nics collaboration room
		if (subscription.startsWith(COLLABROOM_TOPIC)) {

			// Find the collab room id
			Matcher m = Pattern.compile("collabroom.([0-9]*)").matcher(
					subscription);

			Long collabRoomId = null;
			while (m.find()) {
				collabRoomId = Long.valueOf(m.group(1));
				break;
			}

			// Request permission from the API endpoint
			if (collabRoomId != null) {
				String username = (String) SessionHolder.getData(r.getRequest()
						.getSession().getId(), USERNAME_ATTRIB);
				String token = (String) SessionHolder.getData(r.getRequest()
						.getSession().getId(), SessionHolder.TOKEN);

				String url = String.format(
						"%s/collabroom/-1/subscribe/%d",
						Config.getInstance().getConfiguration()
								.getString(REST_ENDPOINT_CONFIG), collabRoomId);

				// validate
				return this.validate(token, username, url);
			}

			return false;
		} else if (subscription.startsWith(INCIDENT_TOPIC)) {
			// Allow any authenticated user to listen to Incidents as they
			// are not secured at the moment
			return true;
		} else if (subscription.indexOf("#") > -1) {
			// Otherwise - Do not allow # symbol
			return false;
		}
		return true;
	}

	/**
	 * 
	 * @param token
	 *            - client token
	 * @param username
	 *            - client username
	 * @param url
	 *            - API request
	 * @return
	 */
	private boolean validate(String token, String username, String url) {
		WebTarget target = jerseyClient.target(url);
		Builder builder = target.request(REQUEST_TYPE);
		this.setCookies(builder, token, username);

		return builder.get().getStatusInfo().getReasonPhrase()
				.equals(Status.OK.getReasonPhrase());
	}

	/**
	 * Set the iplanet and openam cookies in the header of the request
	 * 
	 * @param builder
	 * @param token
	 * @param username
	 */
	private void setCookies(Builder builder, String token, String username) {
		List<String> cookieKeys = Arrays.asList("iplanet", "openam");

		Collection<Cookie> cookies = SessionHolder.getCookieStore(cookieKeys,
				token);
		for (Cookie c : cookies) {
			builder.cookie(c);
		}
		/**
		 * If API is not secured using OpenAM - provide the username. Otherwise
		 * - openAM will overwrite the header with the username associated with
		 * the token
		 */
		if (username != null) {
			builder.header("CUSTOM-uid", username);
		}
	}

}