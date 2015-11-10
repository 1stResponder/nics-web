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
define(['ext'], function(Ext) {

	return Ext.define('modules.whiteboard.ChatLog', {	 
	 	extend: 'Ext.Component',
	 	xtype: 'chatlog',

		chatMessageTemplate: new Ext.Template([
		  			         '<div id="chatmsg-{seqnum}">',
		  			            '<span class="chatmsg-label">',
		  			               '{firstname} {lastname}, {orgname} ({created:date("n/j g:i:s A")}):',
		  			            '</span>',
		  			            ' {message:htmlEncode}',
		  			         '</div>'
		  			         ]).compile(),
		  			         
		pendingTemplate : new Ext.Template([
		                    '<div id="chatmsg-{seqnum}">',
		                     	'<span class="chatmsg-label pending">',
		                     		'Sending...',
								'</span>',
								' {message:htmlEncode}',
							'</div>'
							]).compile(),
	 
	 	initComponent: function(){
			
			this.callParent();
	 	},
	 	
	 	config: {
	 		layout: 'border'
	 	},
	 	
	 	pageBuffer: 0.3,
	 	
	 	
	 	setStore: function(store) {
	 		this.toggleStoreListen(false);
	 		this.store = store;
	 		this.toggleStoreListen(true);
	 		
	 		this.clear();
	 		if (store) {
	 	 		this.prependRecords(store.getRange());
	 	 		this.pageSize = store.pageSize;
		 		this.scrollToEnd();
	 		}
	 	},
	 	
	 	toggleStoreListen: function(listen) {
	 		if (!this.store){ return; }
	 		
	 		var config = {
	 				beforeload: this.onStoreBeforeLoad,
	 				load: this.onStoreLoad,
		 			add: this.onStoreAdd,
		 			remove: this.onStoreRemove,
		 			update: this.onStoreUpdate,
		 			
		 			scope: this
		 		};
	 		
	 		if (listen) {
	 			this.store.on(config);
	 		} else {
	 			this.store.un(config);
	 		}
	 	},
	 	
	 	afterRender: function() {
	 		this.el.on('scroll', this.onScroll.bind(this));
	 		
	 		//if we are in a panel, scroll to end on first open
	 		var panel = this.up('panel');
	 		if (panel) {
	 			panel.on("expand", this.onPanelExpand, this, {single: true});
	 		}
	 	},
	 	
	 	onPanelExpand: function() {
	 		this.scrollToEnd();
	 	},
	 	
	 	onScroll: function(event, el) {
	 		if (!this.store || !this.store.morePages) {
	 			return;
	 		}
	 		
	 		var lineHeight = 15; //lookup?
	 		var pageHeight = this.pageSize * lineHeight; 
	 		var buffer = pageHeight * this.pageBuffer;
	 		
	 		//if scrolled to buffer region
	 		if(el.scrollTop < buffer){
	 			
	 			if(!this.store.loading) {
	 				this.store.nextPage();
	 				
	 				//call ourselves last on load to see if more need loaded
	 				this.store.on("load", function(){
	 					this.onScroll(event, el);
	 				}, this, {single: true, priority: -9});
	 			}
	 		}
	 	},
	 	
	 	onStoreBeforeLoad: function() {
	 		this.mask("Loading...");
	 	},
	 	
	 	onStoreLoad: function(store, records, successful, eOpts) {
	 		//if we got less results then requested, no more pages
	 		store.morePages = records.length == eOpts.config.limit;
	 		
	 		//'records' are not sorted, sort by created
	 		var sorted = records.slice().sort(function(l,r) {
	 			return r.get("created") - l.get("created");
	 		});
	 		
	 		this.prependRecords(sorted, true);
	 		
	 		//only scroll to end on the initial load
	 		if (eOpts.config.page == 1) {
	 			this.scrollToEnd();
	 		}
	 		
	 		this.unmask();
	 	},
	 	
	 	onStoreAdd: function(store, records, index, eOpts) {
	 		
	 		this.appendOrOverwriteRecords(records);
	 		this.scrollToEnd();
	 	},
	 	
	 	onStoreUpdate: function(store, record, operation, modifiedFieldNames, details, eOpts) {
	 		this.appendOrOverwriteRecords([record]);
	 	},
	 	
	 	onStoreRemove: function(store, records, index, isMove, eOpts) {
	 		
	 		records.forEach(function(record){
	 			var existingEl = this.getRecordEl(record);
		 		if (existingEl) {
		 			existingEl.destroy();
		 		}
	 		}, this);
	 		
	 	},
	 	
	 	prependRecords: function(records, maintainScroll) {
	 		var dom = this.getEl().dom;
	 		var previousOffset = null;
	 		if(maintainScroll){
		 		previousOffset = dom.scrollHeight - dom.scrollTop;
	 		}
	 		
	 		records.forEach(function(record){
	 			this.chatMessageTemplate.insertFirst(this.getEl(), record.getData());	
	 		}, this);
	 		
	 		if(previousOffset !== null){
	 			dom.scrollTop = dom.scrollHeight - previousOffset;
	 		}
	 	},
	 	
	 	appendOrOverwriteRecords: function(records) {
	 		var el = this.getEl();
	 		records.forEach(function(record){
	 			var template = this.getTemplate(record); 
	 			
	 			var existingEl = this.getRecordEl(record);
		 		if (existingEl) {
		 			template.insertAfter(existingEl, record.getData());
		 			existingEl.destroy();
		 		} else {
		 			template.append(el, record.getData());	
		 		}
	 			
	 		}, this);
	 	},
	 	
	 	getTemplate: function(record) {
	 		if (record.phantom) {
	 			return this.pendingTemplate;
	 		} else {
	 			return this.chatMessageTemplate;
	 		}
	 	},
	 	
		scrollToEnd: function() {
			var chatLogDom = this.getEl().dom;
			chatLogDom.scrollTop = chatLogDom.scrollHeight;
		},
	 	
	 	getRecordEl: function(record) {
 			var seqnum = record.get("seqnum");
	 		var results = this.getEl().query("#chatmsg-" + seqnum, false);
	 		return results.length ? results[0] : null;
	 	},
	 	
	 	clear: function() {
	 		this.getEl().setHtml("");
	 	}
	 });
});
