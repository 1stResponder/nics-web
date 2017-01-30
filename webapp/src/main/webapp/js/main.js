/*
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
require([
    "iweb/CoreModule", "iweb/modules/MapModule",
    "iweb/modules/core-view/View", "iweb/modules/DrawMenuModule", "iweb/modules/GeocodeModule",
    "nics/modules/CollabRoomModule", "nics/modules/IncidentModule",
    "nics/modules/LoginModule", "nics/modules/WhiteboardModule", "nics/modules/ReportModule",
	"nics/modules/DatalayerModule", "nics/modules/ActiveUsersModule",
	"nics/modules/FeaturePersistence", "nics/modules/AdministrationModule",
	"nics/modules/UserProfileModule", "nics/modules/PhotosModule", "nics/modules/PrintModule" ,
	"nics/modules/AccountInfoModule", "nics/modules/MultiIncidentViewModule",
    "nics/modules/FeedbackReportModule", "nics/modules/MapSyncLocation","nics/modules/BroadcastModule",
   	"nics/modules/UserModule"
    ],

    function(Core, MapModule, View, DrawMenuModule, GeocodeModule,
        CollabRoomModule, IncidentModule,
        LoginModule, WhiteboardModule, ReportModule, DatalayerModule,
        ActiveUsersModule, FeaturePersistence, AdminModule, UserProfile,
        PhotosModule, PrintModule, AccountModule, MultiIncidentModule,
        FeedbackReportModule, MapSyncLocation, BroadcastModule, UserModule) {

        "use strict";

        Ext.onReady(function(){

	        Ext.QuickTips.init();

	        //Instantiate the View
	        var view = new View();
	        view.init();
	        Core.init(view);
	        Core.View.showDisconnect(true);

	        

	        //Show the Toolbar - Required for drawing menu
	        Core.View.showToolbar(true);

	        Core.EventManager.addListener("iweb.config.loaded", loadModules);

	        //Load each module
	        function loadModules() {
	        	
	        	//Add Title
				Core.View.addToTitleBar([{xtype: 'tbspacer', width: 5},{xtype: "label", html: "<b>" +
					((Core.Config.getProperty("main.site.label") || '') ? Core.Config.getProperty("main.site.label") :
					"Next-Generation Incident Command System" ) + "</b>"}]);
	        	
	        	Core.Mediator.getInstance().setCookies(
	        			Core.Config.getProperty("endpoint.rest"), ["openam", "iplanet"]);

	            var MapController = MapModule.load();

	            //Load Modules
				WhiteboardModule.load();
	            IncidentModule.load();
				ReportModule.load();
	            CollabRoomModule.load(CollabRoomModule.getDefaultRoomPresets());
	            DrawMenuModule.load();
	            GeocodeModule.load();
	            AccountModule.load();
	            DatalayerModule.load();

	            //Add Tools Menu after Datalayer Module
	            var button = Core.UIBuilder.buildDropdownMenu("Tools");
	            //Add View to Core
				Core.View.addButtonPanel(button);

				//Set the Tools Menu on the Core for others to add to
				Core.Ext.ToolsMenu = button.menu;

				PrintModule.load();

				//Add Export to Tools Menu
				DatalayerModule.addExport();

	            FeaturePersistence.load();
	            AdminModule.load();

	            LoginModule.load();
	            ActiveUsersModule.load();
	            PhotosModule.load();
	            MultiIncidentModule.load();

                    // Add email report to Tools Menu
                    FeedbackReportModule.load();      

                    MapSyncLocation.load();

		    BroadcastModule.load();

		    UserModule.load();
	        }

	        //Mediator
	        /** default topics
	         ** callback
	         */
	        Core.Mediator.initialize();
        });
    });
