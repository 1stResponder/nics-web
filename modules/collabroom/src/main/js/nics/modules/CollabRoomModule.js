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
define([
    "iweb/CoreModule",
	"./collabroom/CollabRoomViewer", "./collabroom/CollabRoomController",
	"./collabroom/CollabRoomTabView"], 
	
	function(Core, CollabRoomViewer, CollabRoomController, CollabRoomTabView) {
	
		var CollabRoomModule = function(){};
		
		CollabRoomModule.prototype.load = function(roomPresets){
			
			var collabRoomViewer = new CollabRoomViewer({
				controller: new CollabRoomController({
					roomPresets: roomPresets
				})
			});
			Core.View.addToTitleBar([
			        collabRoomViewer, 
					{xtype: 'tbspacer', width: 15}
			]);
			
			var collabRoomTabView = new CollabRoomTabView();
			Core.View.addButtonPanel([
					collabRoomTabView
			]);

		};
		
		CollabRoomModule.prototype.getDefaultRoomPresets = function(){
			return {
				'Operations': [
					'OperationsSectionChief',
					'BranchDir1',
					'BranchDir2',
					'DivisionSupA',
					'DivisionSupB',
					'DivisionSupC',
					'DivisionSupD',
					'DivisionSupX',
					'DivisionSupY',
					'DivisionSupZ',
					'AirSupportGroupSup',
					'AirTacticalGroupSup',
					'StagingAreaManager',
					'AirOperationsBranchDir'
					],
				
				'Command Staff': [
					'IncidentCommander',
					'PublicInformationOfficer',
					'LiaisonOfficer',
					'SafetyOfficer'
					],
					
				'Plans': [
					'PlanningSectionChief',
					'ResourcesUnitLeader',
					'SituationUnitLeader',
					'FieldObserver',
					'GISS'
					],
				
				'Logistics': [
					'LogisticsSectionChief',
					'CommunicationsUnitLeader',
					'SupplyUnitLeader',
					'FacilitiesUnitLeader',
					'GroundSupportUnitLeader'
					],
					
				'Finance': [
					'FinanceAdminSectionChief',
					'CompensationAndClaimsUnitLeader',
					'CostUnitLeader',
					'EquipmentTimeRecorder'
					]
			};
		};
		
		return new CollabRoomModule();
	}
);
	
