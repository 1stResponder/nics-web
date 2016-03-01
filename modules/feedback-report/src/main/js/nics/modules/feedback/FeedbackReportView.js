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
define(["iweb/CoreModule", './FeedbackReportController'], function(Core) {
    Ext.define('modules.feedback.FeedbackReportView', {

        extend: 'Ext.Window',

        controller: 'feedbackcontroller',

        referenceHolder: true,

        requires: [ 'Ext.Panel', 'Ext.Button', 'Ext.form.field.TextArea',
            'Ext.form.Label', 'Ext.Container', 'Ext.tree.Panel'],

        initComponent: function(){
            this.callParent();
            var label =  Ext.create('Ext.form.Label',{
                id:'feedback-label',
                html: 'Please enter any details pertaining to the error.'
            });

            this.feedbackInput = Ext.create('Ext.form.field.TextArea',
                {
                    id: 'feedbackInputTextarea',
                    name: 'feedbackInput',
                    stripCharsRe: /[^a-zA-Z0-9,_\-\.\s]/,
                    maxLength: 500,
                    enforceMaxLength: true
                }
            );

            var panel = Ext.create("Ext.Panel", {
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                autoHeight: true,
                autoWidth: true,
                header: false,
                items: [
                    label,
                    this.feedbackInput
                ]
            });

            this.add(panel);
        },

        getFeedbackMessage: function(){
            return this.feedbackInput.getValue();
        },

        resetFeedbackMessage: function()
        {
            this.feedbackInput.setValue('');
        },

        config: {
            title: 'Email Feedback Report',
            closable: true,
            width: 350,
            autoHeight: true,
            minButtonWidth: 0,
            closeAction: 'hide',
            buttons: [
                {
                    text: 'OK',
                    listeners: {
                        click: 'publishFeedbackReport'
                    },
                    scale: 'medium'
                }
            ],
            buttonAlign: 'center'
        }
    });
});


