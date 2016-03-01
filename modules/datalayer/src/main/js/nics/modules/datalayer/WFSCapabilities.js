/*
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
define([], function(){
	
	/**
	 * This is an extremely naive WFSCapabilities parser, currently just
	 * parses any Feature Name and Title from a FeatureTypeList. Will need
	 * to be expanded.
	 */
	var WFSCapabilities = function() {};
	
	WFSCapabilities.prototype.read = function(doc) {
		var capabilities = doc.firstChild;
		if (doc.firstChild.localName == "WFS_Capabilities") {
			return this.readCapabilities(doc.firstChild) || null;
		}
	};
	
	WFSCapabilities.prototype.readCapabilities = function(caps) {
		var ftl = caps.getElementsByTagName('FeatureTypeList');
		if (ftl.length) {
			return this.readFeatureList(ftl[0]);
		}
	};
	
	WFSCapabilities.prototype.readFeatureList = function(featureTypeList) {
		var featureTypes = featureTypeList.getElementsByTagName('FeatureType');
		return Array.prototype.map.call(featureTypes, function(featureType) {
			return {
				Name: this.getSubElementValue(featureType, 'Name'),
				Title: this.getSubElementValue(featureType, 'Title')
			};
		}, this);
	};
	
	WFSCapabilities.prototype.getSubElementValue = function(node, tagName) {
		return this.getElementValue(node.getElementsByTagName(tagName)[0]);
	};
	
	WFSCapabilities.prototype.getElementValue = function(node) {
		return node.firstChild ? node.firstChild.nodeValue : null;
	};
	
	return WFSCapabilities;
});