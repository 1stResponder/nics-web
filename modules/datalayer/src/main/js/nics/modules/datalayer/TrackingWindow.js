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
/**
 * This module is
 */
define(["iweb/CoreModule", './Window', './TrackingWindowController', 'nics/modules/UserProfileModule'],
    function(Core, Window, TrackingWindowController, UserProfile) {
        return Ext.define('modules.datalayer.TrackingWindow', {
            extend: 'modules.datalayer.Window',

            controller: 'datalayer.trackingwindowcontroller',

            config: {
                closeAction: 'hide',
                resizable: true,
                closable: true,
                shadow: false,
                layout: 'fit',
                autoScroll: true,
                button: null,
                minButtonWidth: 0,
                buttonAlign: 'center',
                width: 275,
                height: 475,
                bodyCls: 'data-tree-body'
            },

            buttons: [{
                text: 'Locate PLI',
                id: 'locatePliButton',
                handler: 'onLocatePliClick'
            }
            //    ,{
            //    text: 'PLI Labels',
            //    id: 'pliLabelsButton',
            //    handler: 'onPliLabelsClick'
            //}
            ]
        });
    });
